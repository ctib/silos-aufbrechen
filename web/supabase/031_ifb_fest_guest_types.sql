-- ============================================================
-- Migration 031: Gästetypen und Referent:innen-Vorschläge
-- ============================================================
-- Im internen Fest-Bereich werden jetzt drei Dinge gesammelt:
--   1. Gäste          – mit Typ VIP / Alumni / normal
--   2. Referent:innen – vorgeschlagene Rednerinnen und Redner
--   3. Abschlussarbeiten – herausragende Arbeiten des Jahrzehnts
--
-- Bisher trug die Gäste-Tabelle nur ein is_vip-Flag, und die
-- Vortragstabelle nur eigene Themen ohne Personenbezug.
-- ============================================================

-- --------------------------------------------------------
-- 1. Gäste: Typ statt bloßem VIP-Flag
-- --------------------------------------------------------

alter table ifb_fest_guests
  add column if not exists guest_type text not null default 'normal'
    check (guest_type in ('vip', 'alumni', 'normal'));

comment on column ifb_fest_guests.guest_type is
  'vip = Ehrengast, alumni = Ehemalige:r des IfB, normal = regulärer Gast';

-- Bestandsdaten übernehmen: bisherige VIP-Markierungen behalten
update ifb_fest_guests
   set guest_type = 'vip'
 where is_vip
   and guest_type = 'normal';

comment on column ifb_fest_guests.is_vip is
  'Veraltet – ersetzt durch guest_type. Bleibt für Bestandsdaten erhalten.';

comment on column ifb_fest_guests.may_speak is
  'Veraltet – Referent:innen stehen jetzt in ifb_fest_talks.';

-- --------------------------------------------------------
-- 2. Referent:innen statt reiner Themenvorschläge
-- --------------------------------------------------------
-- Die Tabelle heißt weiter ifb_fest_talks (Daten und RLS bleiben),
-- deckt aber jetzt auch Personenvorschläge ab: Man kann eine Person
-- ohne Thema vorschlagen oder ein Thema ohne benannte Person.

alter table ifb_fest_talks
  add column if not exists speaker_name text check (length(speaker_name) <= 200);

alter table ifb_fest_talks
  add column if not exists speaker_affiliation text check (length(speaker_affiliation) <= 200);

-- Titel darf jetzt fehlen, wenn eine Person benannt ist
alter table ifb_fest_talks
  alter column title drop not null;

-- Aber leer darf ein Eintrag nicht sein
alter table ifb_fest_talks
  drop constraint if exists ifb_fest_talks_min_content;

alter table ifb_fest_talks
  add constraint ifb_fest_talks_min_content
  check (
    coalesce(nullif(trim(speaker_name), ''), nullif(trim(title), '')) is not null
  );
