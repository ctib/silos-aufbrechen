-- Migration 025: Rekursive SELECT-Policy auf table_assignments entfernen
-- Problem: "Users can view assignments at their table" fragt table_assignments
-- innerhalb einer Policy auf table_assignments ab → infinite recursion.
-- Die Policy ist redundant: Teilnehmer sehen eigene Zuweisung (policy "Users can
-- view own table assignment"), Studi/Orga/Admin sehen alle (policy aus 015).

DROP POLICY IF EXISTS "Users can view assignments at their table" ON table_assignments;
