-- Migration 026: Chat-Etherpad für Themengebiete
-- Neue Tabelle topic_entries ersetzt die 3-Abschnitte-Notizen durch ein Chat-artiges Pad.
-- Alte table_notes-Daten bleiben in der DB erhalten.

CREATE TABLE IF NOT EXISTS topic_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id uuid NOT NULL REFERENCES workshop_tables(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES profiles(id),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indizes
CREATE INDEX idx_topic_entries_table_id ON topic_entries(table_id);
CREATE INDEX idx_topic_entries_created_at ON topic_entries(created_at);

-- RLS aktivieren
ALTER TABLE topic_entries ENABLE ROW LEVEL SECURITY;

-- SELECT: Alle authentifizierten Nutzer dürfen lesen
CREATE POLICY "topic_entries_select" ON topic_entries
  FOR SELECT TO authenticated
  USING (true);

-- INSERT: Authentifizierte Nutzer dürfen eigene Einträge erstellen
CREATE POLICY "topic_entries_insert" ON topic_entries
  FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid());

-- DELETE: Eigene Einträge + orga/admin dürfen alle löschen
CREATE POLICY "topic_entries_delete" ON topic_entries
  FOR DELETE TO authenticated
  USING (
    author_id = auth.uid()
    OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('orga', 'admin')
  );

-- Realtime aktivieren
ALTER PUBLICATION supabase_realtime ADD TABLE topic_entries;
