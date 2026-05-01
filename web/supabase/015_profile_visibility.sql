-- Migration 015: Allow studi/admin/orga to view all profiles and table assignments
-- This enables the table assignment dropdown in TableView for non-orga elevated roles.
-- MUST be executed on Supabase!

-- Profiles: studi and above can see all profiles (supplements existing orga-only policy)
CREATE POLICY "Studi and above can view all profiles"
  ON profiles FOR SELECT USING (is_studi_or_above());

-- Table assignments: studi and above can see all assignments (supplements existing orga-only policy)
CREATE POLICY "Studi and above can view all assignments"
  ON table_assignments FOR SELECT USING (is_studi_or_above());
