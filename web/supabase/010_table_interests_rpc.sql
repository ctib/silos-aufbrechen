-- ============================================================
-- 010: RPC-Funktion für öffentliche Tisch-Interessenten
-- ============================================================
-- WICHTIG: Auf Supabase SQL-Editor ausführen!
-- Gibt für einen Tisch alle Interessenten zurück, die
-- show_name_public = true haben, inkl. Anzahl gewählter Tische.
-- ============================================================

create or replace function public.get_table_interests(p_table_number int)
returns table (
  full_name text,
  role user_role,
  total_tables int
)
language sql
security definer
stable
as $$
  select
    p.full_name,
    p.role,
    (select count(*)::int from registration_table_preferences rtp2
     where rtp2.registration_id = r.id) as total_tables
  from registration_table_preferences rtp
  join workshop_tables wt on wt.id = rtp.table_id
  join registrations r on r.id = rtp.registration_id
  join profiles p on p.id = r.profile_id
  where wt.number = p_table_number
    and p.show_name_public = true
  order by p.full_name;
$$;
