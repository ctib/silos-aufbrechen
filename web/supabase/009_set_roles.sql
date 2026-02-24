-- ============================================================
-- 009: Rollen für importierte Teilnehmer setzen
-- ============================================================
-- WICHTIG: Auf Supabase SQL-Editor ausführen!
-- Setzt die Rolle aus der Anmeldungen.xlsx für alle
-- bereits importierten Nutzer.
-- ============================================================

UPDATE profiles SET role = 'studi'
WHERE id IN (SELECT id FROM auth.users WHERE email IN (
  'goebelchristoph@icloud.com',
  'c.t.i.banhardt@gmail.com',
  'chriiiiistoph.goobel@haw-kiel.de'
));

UPDATE profiles SET role = 'teilnehmer'
WHERE id IN (SELECT id FROM auth.users WHERE email IN (
  'lougoebel@icloud.com',
  'cbanhardt@icloud.com',
  'ctib@gmx.de',
  'christoph.goebel@fh-kiel.de',
  'cathrin.goebel@gmx.de',
  'christoph.goooobel@haw-kiel.de'
));

UPDATE profiles SET role = 'orga'
WHERE id IN (SELECT id FROM auth.users WHERE email IN (
  'christoph.goebel@haw-kiel.de',
  'meike.wocken@haw-kiel.de',
  'tammo.peters@haw-kiel.de'
));

UPDATE profiles SET role = 'admin'
WHERE id IN (SELECT id FROM auth.users WHERE email IN (
  'cgoebel@haw-kiel.de',
  'goebelch@htw-berlin.de'
));
