-- ============================================================
-- Migration 028: Interner Bereich "10 Jahre Institut für Bauwesen"
-- ============================================================
-- Phase 1 der Veranstaltung: Hochschulangehörige (@haw-kiel.de) melden
-- sich an, erhalten Moderator:innen-Status und tragen im internen
-- Bereich drei Arten von Beiträgen zusammen:
--   1. Gäste (mit VIP- und Redner:innen-Vermerk)
--   2. Themenvorschläge für eigene Vorträge
--   3. Vorschläge für herausragende Abschlussarbeiten des Jahrzehnts
-- ============================================================

-- --------------------------------------------------------
-- 1. Anmeldung: interner Status
-- --------------------------------------------------------

alter table ifb_fest_registrations
  add column if not exists is_internal boolean not null default false;

alter table ifb_fest_registrations
  add column if not exists is_moderator boolean not null default false;

comment on column ifb_fest_registrations.is_internal is
  'Hochschulangehörige:r (@haw-kiel.de). Wird serverseitig aus der E-Mail-Domain gesetzt, nie vom Client.';

-- Der INSERT-Policy erlaubt jede:r die Anmeldung. Die Flags dürfen daher
-- NICHT aus dem Request übernommen werden, sondern werden hier erzwungen.
create or replace function public.set_ifb_fest_internal_flag()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
begin
  NEW.is_internal := lower(NEW.email) like '%@haw-kiel.de';
  NEW.is_moderator := NEW.is_internal;
  return NEW;
end;
$fn$;

drop trigger if exists on_ifb_fest_set_internal on ifb_fest_registrations;
create trigger on_ifb_fest_set_internal
  before insert on ifb_fest_registrations
  for each row execute function set_ifb_fest_internal_flag();

-- Bestandsdaten nachziehen (z. B. Testanmeldungen vor dieser Migration)
update ifb_fest_registrations
   set is_internal = (lower(email) like '%@haw-kiel.de'),
       is_moderator = (lower(email) like '%@haw-kiel.de')
 where is_internal is distinct from (lower(email) like '%@haw-kiel.de');

-- --------------------------------------------------------
-- 2. Zugriffshelfer
-- --------------------------------------------------------
-- Wer intern angemeldet ist, darf den Fest-Bereich sehen. Orga/Admin
-- dürfen ohnehin alles.

create or replace function public.is_ifb_fest_internal()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    exists (
      select 1
        from ifb_fest_registrations r
       where r.is_internal
         and r.status <> 'cancelled'
         and lower(r.email) = lower(nullif(auth.jwt() ->> 'email', ''))
    ),
    false
  ) or is_admin_or_orga();
$$;

-- Angemeldete sollen ihre eigene Anmeldung sehen können (bisher nur Orga).
-- Der interne Bereich prüft darüber, ob Moderator:innen-Rechte bestehen.
drop policy if exists "Own IfB fest registration visible" on ifb_fest_registrations;
create policy "Own IfB fest registration visible"
  on ifb_fest_registrations for select
  using (lower(email) = lower(nullif(auth.jwt() ->> 'email', '')));

-- --------------------------------------------------------
-- 3. Gäste-Vorschläge
-- --------------------------------------------------------

create table if not exists ifb_fest_guests (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references profiles(id) on delete cascade,

  name text not null check (length(trim(name)) between 2 and 200),
  organization text check (length(organization) <= 200),
  role_title text check (length(role_title) <= 200),
  email text check (length(email) <= 200),

  -- Ehrengast
  is_vip boolean not null default false,
  -- Kommt für Vortrag / Rede / Laudatio / Keynote infrage
  may_speak boolean not null default false,

  note text check (length(note) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------
-- 4. Themenvorschläge für eigene Vorträge
-- --------------------------------------------------------

create table if not exists ifb_fest_talks (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references profiles(id) on delete cascade,

  title text not null check (length(trim(title)) between 3 and 300),
  abstract text check (length(abstract) <= 4000),
  /* Wunschtag: 'tag1', 'tag2' oder null = egal */
  preferred_day text check (preferred_day in ('tag1', 'tag2')),
  duration_minutes integer check (duration_minutes between 5 and 180),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------
-- 5. Vorschläge: herausragende Studis / Abschlussarbeiten
-- --------------------------------------------------------

create table if not exists ifb_fest_alumni (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references profiles(id) on delete cascade,

  student_name text not null check (length(trim(student_name)) between 2 and 200),
  graduation_year integer check (graduation_year between 2015 and 2030),
  thesis_title text check (length(thesis_title) <= 500),
  degree text check (degree in ('bachelor', 'master', 'sonstige')),
  reason text check (length(reason) <= 4000),
  contact text check (length(contact) <= 200),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_ifb_fest_guests_created on ifb_fest_guests (created_at desc);
create index if not exists idx_ifb_fest_talks_created on ifb_fest_talks (created_at desc);
create index if not exists idx_ifb_fest_alumni_created on ifb_fest_alumni (created_at desc);

-- --------------------------------------------------------
-- 6. Row Level Security
-- --------------------------------------------------------
-- Gleiches Muster für alle drei Tabellen:
--   SELECT  – alle intern Angemeldeten (die Sammlung ist kollaborativ)
--   INSERT  – nur für sich selbst (created_by = auth.uid())
--   UPDATE  – eigene Einträge, Orga/Admin alle
--   DELETE  – eigene Einträge, Orga/Admin alle

do $$
declare
  tbl text;
begin
  foreach tbl in array array['ifb_fest_guests', 'ifb_fest_talks', 'ifb_fest_alumni']
  loop
    execute format('alter table %I enable row level security', tbl);

    execute format('drop policy if exists "Fest-intern can view %1$s" on %1$I', tbl);
    execute format(
      'create policy "Fest-intern can view %1$s" on %1$I for select using (is_ifb_fest_internal())',
      tbl
    );

    execute format('drop policy if exists "Fest-intern can insert %1$s" on %1$I', tbl);
    execute format(
      'create policy "Fest-intern can insert %1$s" on %1$I for insert
         with check (is_ifb_fest_internal() and created_by = auth.uid())',
      tbl
    );

    execute format('drop policy if exists "Own or orga can update %1$s" on %1$I', tbl);
    execute format(
      'create policy "Own or orga can update %1$s" on %1$I for update
         using (created_by = auth.uid() or is_admin_or_orga())',
      tbl
    );

    execute format('drop policy if exists "Own or orga can delete %1$s" on %1$I', tbl);
    execute format(
      'create policy "Own or orga can delete %1$s" on %1$I for delete
         using (created_by = auth.uid() or is_admin_or_orga())',
      tbl
    );
  end loop;
end;
$$;

-- --------------------------------------------------------
-- 7. Prüfen, ob eine Adresse intern angemeldet ist
-- --------------------------------------------------------
-- Wird beim Login im Fest-Bereich gebraucht, bevor eine Session besteht.
-- Gibt nur einen Boolean zurück, keine personenbezogenen Daten.

create or replace function public.ifb_fest_is_registered(check_email text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from ifb_fest_registrations r
     where lower(r.email) = lower(trim(check_email))
       and r.status <> 'cancelled'
  );
$$;

grant execute on function public.ifb_fest_is_registered(text) to anon, authenticated;
