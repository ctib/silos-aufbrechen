-- ============================================================
-- Migration 029: Antwortadressen für die IfB-Fest-Mails
-- ============================================================
-- Absender bleibt noreply@zukunftbauen.org (dort hängen SPF/DKIM der
-- verifizierten Domain). Ergänzt wird jeweils ein reply_to:
--
--   Bestätigung an Gäste -> christoph.goebel@haw-kiel.de
--     Der Text bat darum, "einfach auf diese E-Mail zu antworten" –
--     das lief bisher gegen noreply@ ins Leere.
--
--   Orga-Benachrichtigung -> Adresse der angemeldeten Person
--     So kann die Orga direkt aus der Mail heraus antworten.
--
-- Ersetzt nur die beiden Funktionen aus 027; die Trigger bleiben,
-- wie sie sind (CREATE OR REPLACE genügt).
-- ============================================================

create or replace function public.notify_ifb_fest_registration()
returns trigger as $fn$
declare
  email_body text;
  resend_key text;
  items text;
begin
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
      'to', 'christoph.goebel@haw-kiel.de',
      -- Antwort geht direkt an die angemeldete Person
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


create or replace function public.confirm_ifb_fest_registration()
returns trigger as $fn$
declare
  resend_key text;
begin
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
      -- Damit "antworten Sie auf diese E-Mail" auch wirklich ankommt
      'reply_to', 'christoph.goebel@haw-kiel.de',
      'subject', 'Ihre Anmeldung: 10 Jahre Institut für Bauwesen',
      'html',
        '<p>Hallo ' || escape_html(NEW.full_name) || ',</p>'
        || '<p>vielen Dank für Ihre Anmeldung zum Fest <strong>10 Jahre Institut für Bauwesen</strong> '
        || 'am 21. und 22. Oktober 2027. Wir haben Ihre Anmeldung erhalten.</p>'
        || '<p>Alle Details zum Programm finden Sie unter '
        || '<a href="https://zukunftbauen.org/veranstaltungen/10-jahre-ifb">zukunftbauen.org</a>. '
        || 'Das finale Programm geben wir einen Monat vor der Veranstaltung bekannt.</p>'
        || case when NEW.is_internal
             then '<p>Als Angehörige:r der HAW Kiel haben Sie zusätzlich Zugang zum internen '
                  || 'Fest-Bereich: <a href="https://zukunftbauen.org/intern/10-jahre-ifb">'
                  || 'zukunftbauen.org/intern/10-jahre-ifb</a>. Dort sammeln wir Gäste, '
                  || 'Vortragsthemen und Vorschläge für die Ehrung der besten Abschlussarbeiten.</p>'
             else '' end
        || '<p>Wenn Sie Ihre Anmeldung ändern oder zurückziehen möchten, antworten Sie einfach '
        || 'auf diese E-Mail.</p>'
        || '<p>Herzliche Grüße<br>Institut für Bauwesen, HAW Kiel</p>'
    )
  );

  return NEW;

exception when others then
  raise warning '[confirm_ifb_fest] Fehler: % für ID=%', SQLERRM, NEW.id;
  return NEW;
end;
$fn$ language plpgsql security definer;
