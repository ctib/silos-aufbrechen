-- ============================================================
-- Migration 027: Anmeldungen für "10 Jahre Institut für Bauwesen"
-- ============================================================
-- Öffentliche Anmeldung ohne Login (wie nachmeldung_requests):
--   - jede*r darf INSERT
--   - nur Orga/Admin darf SELECT/UPDATE/DELETE
-- Programmteile und Verpflegung liegen als JSONB/text im Datensatz,
-- damit das Programm in web/src/lib/ifbFest.ts frei änderbar bleibt.
-- ============================================================

create table if not exists ifb_fest_registrations (
  id uuid primary key default gen_random_uuid(),

  -- Basisdaten
  full_name text not null check (length(trim(full_name)) between 2 and 200),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  organization text check (length(organization) <= 200),

  -- Programmteile: Array der ids aus FEST_PROGRAM, z.B. ["festakt","abendempfang"]
  program_items jsonb not null default '[]'::jsonb,

  -- Verpflegung
  meal_preference text not null default 'egal'
    check (meal_preference in ('egal', 'vegetarisch', 'vegan')),
  allergies text check (length(allergies) <= 1000),

  -- Begleitpersonen
  companion_count integer not null default 0 check (companion_count between 0 and 10),
  companion_names text check (length(companion_names) <= 1000),

  -- Sonstiges
  comment text check (length(comment) <= 2000),
  gdpr_consent boolean not null default false,

  -- Orga-Verwaltung
  status text not null default 'confirmed'
    check (status in ('confirmed', 'waitlist', 'cancelled')),
  orga_note text,

  created_at timestamptz not null default now()
);

-- Doppelanmeldungen derselben Adresse verhindern (case-insensitive)
create unique index if not exists idx_ifb_fest_email_unique
  on ifb_fest_registrations (lower(email));

create index if not exists idx_ifb_fest_created
  on ifb_fest_registrations (created_at desc);

create index if not exists idx_ifb_fest_status
  on ifb_fest_registrations (status);

-- --------------------------------------------------------
-- Row Level Security
-- --------------------------------------------------------

alter table ifb_fest_registrations enable row level security;

drop policy if exists "Anyone can register for IfB fest" on ifb_fest_registrations;
create policy "Anyone can register for IfB fest"
  on ifb_fest_registrations for insert with check (true);

drop policy if exists "Orga can view IfB fest registrations" on ifb_fest_registrations;
create policy "Orga can view IfB fest registrations"
  on ifb_fest_registrations for select using (is_orga());

drop policy if exists "Orga can update IfB fest registrations" on ifb_fest_registrations;
create policy "Orga can update IfB fest registrations"
  on ifb_fest_registrations for update using (is_orga());

drop policy if exists "Orga can delete IfB fest registrations" on ifb_fest_registrations;
create policy "Orga can delete IfB fest registrations"
  on ifb_fest_registrations for delete using (is_orga());

-- --------------------------------------------------------
-- Benachrichtigung an die Orga (analog notify_nachmeldung)
-- --------------------------------------------------------

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

drop trigger if exists on_ifb_fest_registration_insert on ifb_fest_registrations;
create trigger on_ifb_fest_registration_insert
  after insert on ifb_fest_registrations
  for each row execute function notify_ifb_fest_registration();

-- --------------------------------------------------------
-- Bestätigungsmail an die angemeldete Person
-- --------------------------------------------------------

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
      'subject', 'Ihre Anmeldung: 10 Jahre Institut für Bauwesen',
      'html',
        '<p>Hallo ' || escape_html(NEW.full_name) || ',</p>'
        || '<p>vielen Dank für Ihre Anmeldung zum Fest <strong>10 Jahre Institut für Bauwesen</strong>. '
        || 'Wir haben Ihre Anmeldung erhalten.</p>'
        || '<p>Alle Details zum Programm finden Sie unter '
        || '<a href="https://zukunftbauen.org/veranstaltungen/10-jahre-ifb">zukunftbauen.org</a>.</p>'
        || '<p>Wenn Sie Ihre Anmeldung ändern oder zurückziehen möchten, antworten Sie einfach auf diese E-Mail.</p>'
        || '<p>Herzliche Grüße<br>Institut für Bauwesen, HAW Kiel</p>'
    )
  );

  return NEW;

exception when others then
  raise warning '[confirm_ifb_fest] Fehler: % für ID=%', SQLERRM, NEW.id;
  return NEW;
end;
$fn$ language plpgsql security definer;

drop trigger if exists on_ifb_fest_registration_confirm on ifb_fest_registrations;
create trigger on_ifb_fest_registration_confirm
  after insert on ifb_fest_registrations
  for each row execute function confirm_ifb_fest_registration();
