-- ============================================================
-- 012: Robuster Umlaut-Fix (encoding-sicher)
-- ============================================================
-- Behebt kaputte UTF-8 Kodierung in Profil-Namen und
-- Workshop-Tisch-Beschreibungen.
--
-- WICHTIG: Diese Migration verwendet chr()-Funktionen statt
-- direkte UTF-8-Zeichen, damit beim Copy-Paste in den
-- Supabase SQL-Editor keine Kodierungsprobleme entstehen.
--
-- chr(196)=Ä  chr(214)=Ö  chr(220)=Ü
-- chr(228)=ä  chr(246)=ö  chr(252)=ü  chr(223)=ß
-- chr(8222)=„  chr(8220)="  chr(8211)=–
-- ============================================================

-- 1. Workshop-Tische korrigieren
UPDATE workshop_tables SET
  title = 'Nahrungsmittelproduktion in der Stadt',
  description = 'DIY-Kit f' || chr(252) || 'r urbane Lebensmittelproduktion'
WHERE number = 1;

UPDATE workshop_tables SET
  title = 'Umweltbildung',
  description = 'Praktisches Wissen f' || chr(252) || 'r Sch' || chr(252) || 'lerinnen und Sch' || chr(252) || 'ler vermittelt (Jugendbildung)'
WHERE number = 2;

UPDATE workshop_tables SET
  title = 'Sensorik & Datenauswertung',
  description = 'Mehrwert der smarten City ' || chr(8211) || ' Citizen Science m' || chr(246) || 'glich'
WHERE number = 3;

UPDATE workshop_tables SET
  title = 'Gerechten St' || chr(228) || 'dtebau f' || chr(246) || 'rdern',
  description = 'Nachhaltige Stadtentwicklung als Grundlage'
WHERE number = 4;

UPDATE workshop_tables SET
  title = 'Geb' || chr(228) || 'udetechnik aufwerten',
  description = chr(220) || 'berf' || chr(252) || 'hrung des ' || chr(8222) || 'Stand der Technik' || chr(8220) || ' in den Geb' || chr(228) || 'udebestand'
WHERE number = 5;

UPDATE workshop_tables SET
  title = 'Freies Thema',
  description = 'Sie haben keinen passenden Tisch gefunden? Bringen Sie Ihr eigenes Thema mit und diskutieren Sie es mit anderen.'
WHERE number = 6;

-- 2. Profil-Namen korrigieren (nach Email, da Emails immer ASCII)
-- Christoph Goebel Accounts
UPDATE profiles SET full_name = 'Christoph G' || chr(246) || 'bel'
WHERE lower(email) IN ('christoph.goebel@haw-kiel.de', 'goebelchristoph@icloud.com');

-- Chris Goebel (Admin)
UPDATE profiles SET full_name = 'Chris G' || chr(246) || 'bel'
WHERE lower(email) = 'cgoebel@haw-kiel.de';

-- Lou Goebel
UPDATE profiles SET full_name = 'Lou G' || chr(246) || 'bel'
WHERE lower(email) = 'lougoebel@icloud.com';

-- Cathrin Goebel
UPDATE profiles SET full_name = 'Cathrin G' || chr(246) || 'bel'
WHERE lower(email) = 'cathrin.goebel@gmx.de';

-- 3. Generischer Fix: Alle verbleibenden kaputten Umlaute ersetzen
-- (fängt gängige Mojibake-Muster ab, z.B. Ã¶ → ö)
UPDATE profiles SET full_name = replace(full_name, 'Ã¶', chr(246)) WHERE full_name LIKE '%Ã¶%';
UPDATE profiles SET full_name = replace(full_name, 'Ã¤', chr(228)) WHERE full_name LIKE '%Ã¤%';
UPDATE profiles SET full_name = replace(full_name, 'Ã¼', chr(252)) WHERE full_name LIKE '%Ã¼%';
UPDATE profiles SET full_name = replace(full_name, 'Ã', chr(214)) WHERE full_name LIKE '%Ã%';
UPDATE profiles SET full_name = replace(full_name, 'Ã', chr(220)) WHERE full_name LIKE '%Ã%';
UPDATE profiles SET full_name = replace(full_name, 'Ã', chr(196)) WHERE full_name LIKE '%Ã%';
UPDATE profiles SET full_name = replace(full_name, 'Ã', chr(223)) WHERE full_name LIKE '%Ã%';

-- Gleiche Fixes für Workshop-Beschreibungen
UPDATE workshop_tables SET description = replace(description, 'Ã¶', chr(246)) WHERE description LIKE '%Ã¶%';
UPDATE workshop_tables SET description = replace(description, 'Ã¤', chr(228)) WHERE description LIKE '%Ã¤%';
UPDATE workshop_tables SET description = replace(description, 'Ã¼', chr(252)) WHERE description LIKE '%Ã¼%';
UPDATE workshop_tables SET title = replace(title, 'Ã¶', chr(246)) WHERE title LIKE '%Ã¶%';
UPDATE workshop_tables SET title = replace(title, 'Ã¤', chr(228)) WHERE title LIKE '%Ã¤%';
UPDATE workshop_tables SET title = replace(title, 'Ã¼', chr(252)) WHERE title LIKE '%Ã¼%';
