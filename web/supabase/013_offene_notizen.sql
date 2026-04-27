-- ============================================================
-- 013: "Offene Notizen" Etherpad-Section
-- ============================================================
-- Neue Section "offene_notizen" mit Schreibrecht fuer ALLE
-- authentifizierten Nutzer (nicht nur Studi/Orga).
-- Bestehende Sections (ideensammlung, protokoll) bleiben
-- nur fuer Studi/Orga editierbar.
--
-- WICHTIG: Im Supabase SQL-Editor ausfuehren!
-- ============================================================

-- 1. Neuen Enum-Wert hinzufuegen
ALTER TYPE note_section ADD VALUE IF NOT EXISTS 'offene_notizen';

-- 2. Fuer jeden Tisch eine offene_notizen-Zeile anlegen
INSERT INTO table_notes (table_id, section)
SELECT t.id, 'offene_notizen'::note_section
FROM workshop_tables t
ON CONFLICT (table_id, section) DO NOTHING;

-- 3. SELECT-Policy erweitern: alle authentifizierten Nutzer
--    koennen Notizen lesen (nicht nur zugewiesene / Studi+)
DROP POLICY IF EXISTS "Users at same table can view notes" ON table_notes;

CREATE POLICY "Authenticated users can view notes"
  ON table_notes FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- 4. UPDATE-Policy: offene_notizen fuer alle, Rest nur Studi+
DROP POLICY IF EXISTS "Studi and orga can edit notes" ON table_notes;

CREATE POLICY "Users can edit allowed notes"
  ON table_notes FOR UPDATE
  USING (
    is_studi_or_above()
    OR (auth.uid() IS NOT NULL AND section = 'offene_notizen')
  )
  WITH CHECK (
    is_studi_or_above()
    OR (auth.uid() IS NOT NULL AND section = 'offene_notizen')
  );
