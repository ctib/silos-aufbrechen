-- ============================================================
-- Migration 030: Genau eine Mail pro Anmeldung
-- ============================================================
-- Vorher konnte eine einzige Anmeldung drei Mails auslösen:
--   1. Orga-Benachrichtigung  (noreply@ -> Orga-Adresse)
--   2. Bestätigung            (noreply@ -> angemeldete Person)
--   3. Magic Link             (Supabase -> nur @haw-kiel.de)
--
-- Wer sich mit der Orga-Adresse selbst anmeldet, bekam alle drei.
--
-- Neue Regel – jede angemeldete Person erhält genau eine Mail:
--   Hochschulangehörige  -> nur den Magic Link (enthält den Zugang)
--   Externe              -> nur die Bestätigung
--   Orga-Benachrichtigung entfällt, wenn sich die Orga-Adresse
--   selbst anmeldet (sonst doppelt im eigenen Postfach)
--
-- Der Magic Link selbst kommt von Supabase Auth und wird nicht hier,
-- sondern im Dashboard konfiguriert:
--   Authentication > Emails > Magic Link
-- Vorlage dafür: web/supabase/email-templates/magic-link.html
-- ============================================================

-- Zentrale Orga-Adresse, damit sie nicht in zwei Funktionen driftet
create or replace function public.ifb_fest_orga_email()
returns text
language sql
immutable
as $$ select 'christoph.goebel@haw-kiel.de'::text $$;


-- --------------------------------------------------------
-- Orga-Benachrichtigung: nicht an die eigene Anmeldung
-- --------------------------------------------------------

create or replace function public.notify_ifb_fest_registration()
returns trigger as $fn$
declare
  email_body text;
  resend_key text;
  items text;
  orga_email text := ifb_fest_orga_email();
begin
  -- Selbstanmeldung der Orga: die Person sieht die Anmeldung ohnehin,
  -- eine Benachrichtigung an sich selbst wäre nur Rauschen.
  if lower(NEW.email) = lower(orga_email) then
    return NEW;
  end if;

  select decrypted_secret into resend_key
    from vault.decrypted_secrets where name = 'resend_api_key';

  if resend_key is null or resend_key = '' then
    raise warning '[notify_ifb_fest] Resend API Key nicht im Vault. Keine Email für ID=%', NEW.id;
    return NEW;
  end if;

  select coalesce(string_agg(escape_html(value), ', '), '–')
    into items
    from jsonb_array_elements_text(NEW.program_items) as value;

  email_body := '<h2>Neue Anmeldung: 10 Jahre Institut für Bauwesen</h2>'
    || '<p><strong>Name:</strong> ' || escape_html(NEW.full_name) || '</p>'
    || '<p><strong>E-Mail:</strong> ' || escape_html(NEW.email) || '</p>'
    || case when NEW.is_internal
         then '<p><strong>Hochschulangehörige:r</strong> – mit Moderator:innen-Status</p>'
         else '' end
    || case when NEW.organization is not null and NEW.organization <> ''
         then '<p><strong>Organisation:</strong> ' || escape_html(NEW.organization) || '</p>'
         else '' end
    || '<p><strong>Programmteile:</strong> ' || items || '</p>'
    || '<p><strong>Verpflegung:</strong> ' || escape_html(NEW.meal_preference) || '</p>'
    || case when NEW.allergies is not null and NEW.allergies <> ''
         then '<p><strong>Allergien:</strong> ' || escape_html(NEW.allergies) || '</p>'
         else '' end
    || '<p><strong>Begleitpersonen:</strong> ' || NEW.companion_count
    || case when NEW.companion_names is not null and NEW.companion_names <> ''
         then ' (' || escape_html(NEW.companion_names) || ')'
         else '' end
    || '</p>'
    || case when NEW.comment is not null and NEW.comment <> ''
         then '<p><strong>Kommentar:</strong> ' || escape_html(NEW.comment) || '</p>'
         else '' end
    || '<p><strong>Zeitpunkt:</strong> ' || to_char(NEW.created_at, 'DD.MM.YYYY HH24:MI') || '</p>'
    || '<hr><p>Gästeliste im <a href="https://zukunftbauen.org/orga/ifb-fest">Orga-Bereich</a>.</p>';

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'Zukunft bauen <noreply@zukunftbauen.org>',
      'to', orga_email,
      'reply_to', NEW.email,
      'subject', 'IfB-Fest – neue Anmeldung: ' || escape_html(NEW.full_name),
      'html', email_body
    )
  );

  return NEW;

exception when others then
  raise warning '[notify_ifb_fest] Fehler: % (SQLSTATE: %) für ID=%', SQLERRM, SQLSTATE, NEW.id;
  return NEW;
end;
$fn$ language plpgsql security definer;


-- --------------------------------------------------------
-- Bestätigung: nur an Externe
-- --------------------------------------------------------
-- Hochschulangehörige bekommen stattdessen den Magic Link. Der trägt
-- denselben Inhalt plus den Zugang – zwei Mails wären Dopplung.

create or replace function public.confirm_ifb_fest_registration()
returns trigger as $fn$
declare
  resend_key text;
begin
  if NEW.is_internal then
    return NEW;
  end if;

  select decrypted_secret into resend_key
    from vault.decrypted_secrets where name = 'resend_api_key';

  if resend_key is null or resend_key = '' then
    return NEW;
  end if;

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'Zukunft bauen <noreply@zukunftbauen.org>',
      'to', NEW.email,
      'reply_to', ifb_fest_orga_email(),
      'subject', 'Ihre Anmeldung: 10 Jahre Institut für Bauwesen',
      'html',
        '<p>Hallo ' || escape_html(NEW.full_name) || ',</p>'
        || '<p>vielen Dank für Ihre Anmeldung zum Fest <strong>10 Jahre Institut für Bauwesen</strong> '
        || 'am 21. und 22. Oktober 2027. Wir haben Ihre Anmeldung erhalten.</p>'
        || '<p>Alle Details zum Programm finden Sie unter '
        || '<a href="https://zukunftbauen.org/veranstaltungen/10-jahre-ifb">zukunftbauen.org</a>. '
        || 'Das finale Programm geben wir einen Monat vor der Veranstaltung bekannt.</p>'
        || '<p>Wenn Sie Ihre Anmeldung ändern oder zurückziehen möchten, antworten Sie einfach '
        || 'auf diese E-Mail.</p>'
        || '<p>Wir freuen uns auf Sie!</p>'
    )
  );

  return NEW;

exception when others then
  raise warning '[confirm_ifb_fest] Fehler: % für ID=%', SQLERRM, NEW.id;
  return NEW;
end;
$fn$ language plpgsql security definer;
