-- ============================================================
-- Silos aufbrechen – Zukunft bauen
-- Supabase Database Schema (Projekt-ID: cbybfmnbojklqbkmuwto)
-- ============================================================

-- --------------------------------------------------------
-- ENUM Types
-- --------------------------------------------------------

create type user_role as enum ('gast', 'teilnehmer', 'studi', 'admin', 'orga');
create type call_type as enum ('call_for_papers', 'funding', 'conference', 'journal', 'other');
create type note_section as enum ('ideensammlung', 'voting', 'ausformulierung', 'action_items', 'protokoll');

-- --------------------------------------------------------
-- Profiles (extends Supabase auth.users)
-- --------------------------------------------------------

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role user_role not null default 'teilnehmer',
  background text,
  show_name_public boolean not null default false,
  gdpr_consent boolean not null default false,
  gdpr_consent_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --------------------------------------------------------
-- Workshop Tables
-- --------------------------------------------------------

create table workshop_tables (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique,
  title text not null,
  description text,
  capacity integer not null default 15,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Seed the 5 workshop tables
insert into workshop_tables (number, title, description) values
  (1, 'Nahrungsmittelproduktion in der Stadt', 'DIY-Kit für urbane Lebensmittelproduktion'),
  (2, 'Umweltbildung', 'Praktisches Wissen für Schülerinnen und Schüler vermittelt (Jugendbildung)'),
  (3, 'Sensorik & Datenauswertung', 'Mehrwert der smarten City – Citizen Science möglich'),
  (4, 'Gerechten Städtebau fördern', 'Nachhaltige Stadtentwicklung als Grundlage'),
  (5, 'Gebäudetechnik aufwerten', 'Überführung des „Stand der Technik" in den Gebäudebestand'),
  (6, 'Freies Thema', 'Sie haben keinen passenden Tisch gefunden? Bringen Sie Ihr eigenes Thema mit und diskutieren Sie es mit anderen.');

-- --------------------------------------------------------
-- Registrations
-- --------------------------------------------------------

create table registrations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  attends_lecture boolean not null default true,
  attends_workshop boolean not null default true,
  attends_dinner boolean not null default false,
  table_preference uuid references workshop_tables(id),
  companion_count integer not null default 0,
  companion_under_16 boolean not null default false,
  companion_under_12 boolean not null default false,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(profile_id)
);

-- --------------------------------------------------------
-- Table Assignments (who sits at which table)
-- --------------------------------------------------------

create table table_assignments (
  id uuid primary key default gen_random_uuid(),
  table_id uuid not null references workshop_tables(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  assigned_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  unique(table_id, profile_id)
);

-- --------------------------------------------------------
-- Research Calls (managed by Admin/Borchardt)
-- --------------------------------------------------------

create table research_calls (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  url text,
  deadline date,
  call_type call_type not null default 'other',
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------
-- Call <-> Table Tags (n:m)
-- --------------------------------------------------------

create table call_table_tags (
  call_id uuid not null references research_calls(id) on delete cascade,
  table_id uuid not null references workshop_tables(id) on delete cascade,
  primary key (call_id, table_id)
);

-- --------------------------------------------------------
-- Table Notes (Etherpad, per table)
-- --------------------------------------------------------

create table table_notes (
  id uuid primary key default gen_random_uuid(),
  table_id uuid not null references workshop_tables(id) on delete cascade,
  section note_section not null,
  content text not null default '',
  last_edited_by uuid references profiles(id),
  updated_at timestamptz not null default now(),
  unique(table_id, section)
);

-- Seed note sections for each table
insert into table_notes (table_id, section)
select t.id, s.section
from workshop_tables t
cross join (
  values
    ('ideensammlung'::note_section),
    ('voting'::note_section),
    ('ausformulierung'::note_section),
    ('action_items'::note_section),
    ('protokoll'::note_section)
) as s(section);

-- --------------------------------------------------------
-- Row Level Security (RLS)
-- --------------------------------------------------------

alter table profiles enable row level security;
alter table registrations enable row level security;
alter table workshop_tables enable row level security;
alter table table_assignments enable row level security;
alter table research_calls enable row level security;
alter table call_table_tags enable row level security;
alter table table_notes enable row level security;

-- Helper: get current user's role
create or replace function public.current_user_role()
returns user_role as $$
  select role from public.profiles where id = auth.uid();
$$ language sql security definer stable;

-- Helper: check if user has elevated role
create or replace function public.is_orga()
returns boolean as $$
  select current_user_role() = 'orga';
$$ language sql security definer stable;

create or replace function public.is_admin_or_orga()
returns boolean as $$
  select current_user_role() in ('admin', 'orga');
$$ language sql security definer stable;

create or replace function public.is_studi_or_above()
returns boolean as $$
  select current_user_role() in ('studi', 'admin', 'orga');
$$ language sql security definer stable;

-- == profiles ==

create policy "Users can view own profile"
  on profiles for select using (id = auth.uid());

create policy "Users can view public names"
  on profiles for select using (show_name_public = true);

create policy "Orga can view all profiles"
  on profiles for select using (is_orga());

create policy "Users can update own profile"
  on profiles for update using (id = auth.uid());

create policy "Orga can update any profile"
  on profiles for update using (is_orga());

-- == registrations ==

create policy "Users can view own registration"
  on registrations for select using (profile_id = auth.uid());

create policy "Orga can view all registrations"
  on registrations for select using (is_orga());

create policy "Users can insert own registration"
  on registrations for insert with check (profile_id = auth.uid());

create policy "Users can update own registration"
  on registrations for update using (profile_id = auth.uid());

create policy "Orga can update any registration"
  on registrations for update using (is_orga());

-- == workshop_tables ==

create policy "Anyone can view active tables"
  on workshop_tables for select using (true);

create policy "Orga can manage tables"
  on workshop_tables for all using (is_orga());

-- == table_assignments ==

create policy "Users can view own table assignment"
  on table_assignments for select using (profile_id = auth.uid());

create policy "Users can view assignments at their table"
  on table_assignments for select using (
    table_id in (select table_id from table_assignments where profile_id = auth.uid())
  );

create policy "Orga can view all assignments"
  on table_assignments for select using (is_orga());

create policy "Studi and orga can assign"
  on table_assignments for insert with check (is_studi_or_above());

create policy "Studi and orga can remove assignments"
  on table_assignments for delete using (is_studi_or_above());

-- == research_calls ==

create policy "Authenticated users can view calls"
  on research_calls for select using (auth.uid() is not null);

create policy "Admin and orga can manage calls"
  on research_calls for all using (is_admin_or_orga());

-- == call_table_tags ==

create policy "Authenticated users can view tags"
  on call_table_tags for select using (auth.uid() is not null);

create policy "Admin and orga can manage tags"
  on call_table_tags for all using (is_admin_or_orga());

-- == table_notes ==

create policy "Users at same table can view notes"
  on table_notes for select using (
    table_id in (select table_id from table_assignments where profile_id = auth.uid())
    or is_studi_or_above()
  );

create policy "Studi and orga can edit notes"
  on table_notes for update using (is_studi_or_above());

-- --------------------------------------------------------
-- Nachmeldung Requests (approval workflow)
-- --------------------------------------------------------

create table nachmeldung_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  comment text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table nachmeldung_requests enable row level security;

create policy "Anyone can submit nachmeldung"
  on nachmeldung_requests for insert with check (true);

create policy "Orga can view nachmeldungen"
  on nachmeldung_requests for select using (is_orga());

create policy "Orga can update nachmeldungen"
  on nachmeldung_requests for update using (is_orga());

-- --------------------------------------------------------
-- Registration Table Preferences (n:m, multiple table wishes)
-- --------------------------------------------------------

create table registration_table_preferences (
  registration_id uuid not null references registrations(id) on delete cascade,
  table_id uuid not null references workshop_tables(id) on delete cascade,
  primary key (registration_id, table_id)
);

alter table registration_table_preferences enable row level security;

create policy "Users can view own table preferences"
  on registration_table_preferences for select using (
    registration_id in (select id from registrations where profile_id = auth.uid())
  );

create policy "Users can manage own table preferences"
  on registration_table_preferences for insert with check (
    registration_id in (select id from registrations where profile_id = auth.uid())
  );

create policy "Users can delete own table preferences"
  on registration_table_preferences for delete using (
    registration_id in (select id from registrations where profile_id = auth.uid())
  );

create policy "Orga can view all table preferences"
  on registration_table_preferences for select using (is_orga());

create policy "Orga can manage all table preferences"
  on registration_table_preferences for all using (is_orga());

-- --------------------------------------------------------
-- Realtime (enable for table_notes for live collaboration)
-- --------------------------------------------------------

alter publication supabase_realtime add table table_notes;

-- --------------------------------------------------------
-- Updated_at trigger
-- --------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on profiles for each row execute function set_updated_at();

create trigger set_registrations_updated_at
  before update on registrations for each row execute function set_updated_at();

create trigger set_research_calls_updated_at
  before update on research_calls for each row execute function set_updated_at();

create trigger set_table_notes_updated_at
  before update on table_notes for each row execute function set_updated_at();
