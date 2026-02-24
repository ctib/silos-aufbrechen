-- ============================================================
-- 007: Umlaut-Fix in Datenbank-Daten
-- ============================================================
-- Behebt kaputte UTF-8 Kodierung (z.B. G�bel -> Göbel)
-- bei Profil-Namen und Workshop-Tisch-Titeln/Beschreibungen.
--
-- WICHTIG: Auf Supabase SQL-Editor ausführen!
-- ============================================================

-- Workshop-Tische: Titel und Beschreibungen korrigieren
UPDATE workshop_tables SET
  title = 'Nahrungsmittelproduktion in der Stadt',
  description = 'DIY-Kit für urbane Lebensmittelproduktion'
WHERE number = 1;

UPDATE workshop_tables SET
  title = 'Umweltbildung',
  description = 'Praktisches Wissen für Schülerinnen und Schüler vermittelt (Jugendbildung)'
WHERE number = 2;

UPDATE workshop_tables SET
  title = 'Sensorik & Datenauswertung',
  description = 'Mehrwert der smarten City – Citizen Science möglich'
WHERE number = 3;

UPDATE workshop_tables SET
  title = 'Gerechten Städtebau fördern',
  description = 'Nachhaltige Stadtentwicklung als Grundlage'
WHERE number = 4;

UPDATE workshop_tables SET
  title = 'Gebäudetechnik aufwerten',
  description = 'Überführung des „Stand der Technik" in den Gebäudebestand'
WHERE number = 5;

UPDATE workshop_tables SET
  title = 'Freies Thema',
  description = 'Sie haben keinen passenden Tisch gefunden? Bringen Sie Ihr eigenes Thema mit und diskutieren Sie es mit anderen.'
WHERE number = 6;

-- Profil-Name korrigieren: Göbel
UPDATE profiles SET
  full_name = 'Christoph Göbel'
WHERE lower(email) IN ('christoph.goebel@haw-kiel.de', 'goebelchristoph@icloud.com')
  AND full_name != 'Christoph Göbel';
