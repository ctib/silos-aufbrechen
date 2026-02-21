-- Migration: Tisch 6 "Freies Thema" hinzufügen
-- Auf laufender Supabase-Instanz ausführen

INSERT INTO workshop_tables (number, title, description)
VALUES (6, 'Freies Thema', 'Sie haben keinen passenden Tisch gefunden? Bringen Sie Ihr eigenes Thema mit und diskutieren Sie es mit anderen.')
ON CONFLICT (number) DO NOTHING;

-- Note-Sections für Tisch 6 anlegen
INSERT INTO table_notes (table_id, section)
SELECT t.id, s.section
FROM workshop_tables t
CROSS JOIN (
  VALUES
    ('ideensammlung'::note_section),
    ('voting'::note_section),
    ('ausformulierung'::note_section),
    ('action_items'::note_section),
    ('protokoll'::note_section)
) AS s(section)
WHERE t.number = 6
ON CONFLICT (table_id, section) DO NOTHING;
