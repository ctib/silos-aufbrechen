-- Migration 024: Fehlende UPDATE-Policy fuer table_assignments
-- Problem: upsert (INSERT ... ON CONFLICT DO UPDATE) erfordert sowohl
-- INSERT- als auch UPDATE-Rechte. UPDATE-Policy fehlte, daher schlug
-- die Tischzuweisung still fehl.

CREATE POLICY "Studi and orga can update assignments"
  ON table_assignments FOR UPDATE
  USING (is_studi_or_above())
  WITH CHECK (is_studi_or_above());
