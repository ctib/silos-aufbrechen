-- ============================================================
-- 013: "Offene Notizen" Etherpad-Section
-- ============================================================
-- Neue Section "offene_notizen" mit Schreibrecht fuer ALLE
-- authentifizierten Nutzer (nicht nur Studi/Orga).
-- Bestehende Sections (ideensammlung, protokoll) bleiben
-- nur fuer Studi/Orga editierbar.
--
-- WICHTIG: Im Supabase SQL-Editor in ZWEI Schritten ausfuehren!
--   Schritt 1: Nur den ALTER TYPE ausfuehren (013a)
--   Schritt 2: Den Rest ausfuehren (013b)
-- PostgreSQL erfordert einen COMMIT zwischen ALTER TYPE ADD VALUE
-- und der ersten Verwendung des neuen Enum-Werts.
-- ============================================================


-- ========================
-- SCHRITT 1 (013a): Zuerst alleine ausfuehren
-- ========================

ALTER TYPE note_section ADD VALUE IF NOT EXISTS 'offene_notizen';


-- ========================
-- SCHRITT 2 (013b): Danach separat ausfuehren
-- ========================

-- Fuer jeden Tisch eine offene_notizen-Zeile anlegen
INSERT INTO table_notes (table_id, section)
SELECT t.id, 'offene_notizen'::note_section
FROM workshop_tables t
ON CONFLICT (table_id, section) DO NOTHING;

-- SELECT-Policy erweitern: alle authentifizierten Nutzer
-- koennen Notizen lesen (nicht nur zugewiesene / Studi+)
DROP POLICY IF EXISTS "Users at same table can view notes" ON table_notes;

CREATE POLICY "Authenticated users can view notes"
  ON table_notes FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- UPDATE-Policy: offene_notizen fuer alle, Rest nur Studi+
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
