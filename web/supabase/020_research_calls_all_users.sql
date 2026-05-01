-- ============================================================
-- 020: Forschungscalls für alle Teilnehmenden freigeben
-- ============================================================
-- WICHTIG: Auf Supabase SQL-Editor ausführen!
--
-- Erlaubt allen angemeldeten Nutzern (nicht nur Admin/Orga),
-- eigene Forschungscalls anzulegen und zu verwalten.
-- ============================================================

-- research_calls: Alle können eintragen, eigene bearbeiten/löschen
CREATE POLICY "Authenticated users can insert calls"
  ON research_calls FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own calls"
  ON research_calls FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete own calls"
  ON research_calls FOR DELETE
  USING (created_by = auth.uid());

-- call_table_tags: Alle können Tags für eigene Calls verwalten
CREATE POLICY "Authenticated users can insert tags"
  ON call_table_tags FOR INSERT
  WITH CHECK (
    call_id IN (SELECT id FROM research_calls WHERE created_by = auth.uid())
    OR is_admin_or_orga()
  );

CREATE POLICY "Users can delete own call tags"
  ON call_table_tags FOR DELETE
  USING (
    call_id IN (SELECT id FROM research_calls WHERE created_by = auth.uid())
    OR is_admin_or_orga()
  );
