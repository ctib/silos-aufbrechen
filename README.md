# Silos aufbrechen - Zukunft bauen

Event-Webseite fuer die gemeinsame Antrittsvorlesung und den interdisziplinaeren Workshop
am **7. Mai 2026, 14:30-20:00 Uhr** an der HAW Kiel.

---

## Ueberblick

### Die Veranstaltung

Drei neuberufene Professores der HAW Kiel laden zu einem interdisziplinaeren Workshop
unter dem Titel **"Silos aufbrechen - Zukunft bauen"** ein:

- **Prof. Dr.-Ing. Christoph Goebel** (Gebaeudetechnologie, Institut fuer Bauwesen) -- Antrittsvorlesung
- **Prof. Dr. Meike Wocken** (Wirtschaftsinformatik) -- Impulsvortrag
- **Prof. Dr. Tammo Peters** (Gruenlandwirtschaft, FB Agrarwirtschaft) -- Impulsvortrag

Thema: **Smart Green Cities & Buildings** -- Wissenschaft, regionale Wirtschaft und Kieler
Stadtgesellschaft an einem Tisch.

### Programm

| Zeit          | Programmpunkt |
|---------------|---------------|
| 14:30         | Empfang |
| 15:00         | Willkommensgruss, Vorstellung und Einfuehrung |
| 15:15         | Impulsvortrag "Citizen Science und Open Data" -- Prof. Dr. Meike Wocken |
| 15:30         | Antrittsvorlesung "Nachhaltige Energieversorgung -- Es ist doch alles da! Oder?" -- Prof. Dr.-Ing. Christoph Goebel |
| 16:30         | Impulsvortrag "Es gruent so gruen -- die Rolle von Grasland" -- Prof. Dr. Tammo Peters |
| 16:45         | Kaffeepause |
| 17:15         | Workshop (moderierte Arbeitstische) |
| 18:30         | Vorstellung der Ergebnisse und Abschlussworte |
| Ab 19:00      | Gemeinsamer Ausklang mit musikalischer Begleitung |

### Workshop-Tische (5 Stueck, Themen ggf. nach 24.04. noch variabel)

1. Nahrungsmittelproduktion in der Stadt: DIY-Kit
2. Umweltbildung: praktisches Wissen fuer Schuelerinnen und Schueler (Jugendbildung)
3. Sensorik plus Datenauswertung: Mehrwert der smarten City (Citizen Science)
4. Gerechten Staedtebau foerdern: nachhaltige Stadtentwicklung als Grundlage
5. Gebaeudetechnik aufwerten: Ueberfuehrung des "Stand der Technik" in den Gebaeudebestand

### IDW (Interdisziplinaere Wochen)

Die Veranstaltung ist als IDW-Veranstaltung an der HAW Kiel angemeldet. Bis zu 15 Studierende
koennen sich ueber die IDW anmelden und erhalten spezielle Aufgaben:
- Werden auf die Workshoptische verteilt
- Protokollieren waehrend des Workshops
- Erstellen Zusammenfassungen und Action Items
- Vernetzen alle Tischteilnehmer im Nachgang
- Umreissen und stossen geplante Projekte an

---

## Technische Architektur

### Tech-Stack

| Komponente     | Technologie | Grund |
|---------------|-------------|-------|
| **Frontend**   | Astro + Svelte | Statische Seiten (schnell, SEO), Svelte fuer interaktive Teile (Etherpad, Formulare) |
| **Backend/DB** | Supabase | Auth (Magic Links), PostgreSQL, Realtime, Row Level Security |
| **Hosting**    | GitHub Pages | Zunaechst GitHub-Pages-URL, spaeter Custom Domain (Pfad oder Subdomain, wird mit HAW-IT geklaert) |
| **Styling**    | Tailwind CSS | Mit HAW-Design-Tokens aus dem CD Manual |
| **Deployment** | GitHub Actions | Auto-Deploy bei Push auf main |

### Supabase

- **Projekt-ID:** `cbybfmnbojklqbkmuwto`
- **Auth-Methode:** Magic Links per E-Mail (kein Passwort noetig)
- **Account:** Ueber GitHub-Account von Christoph Goebel erstellt

### Hosting / Domain

Zunaechst wird die Standard-GitHub-Pages-URL verwendet. Ob spaeter ein Pfad
(`haw-kiel.de/silos-aufbrechen`) oder eine Subdomain (`silos.haw-kiel.de`) eingerichtet wird,
wird mit der HAW-IT geklaert. Die Webseite ist so gebaut, dass die Domain jederzeit per
CNAME-Eintrag und GitHub-Pages-Custom-Domain-Setting umgestellt werden kann.

---

## Design-System (aus CD Manual, Stand 02.12.2025)

### Farben

| Name           | RGB         | Hex       | Verwendung |
|----------------|-------------|-----------|-----------|
| HAW-Blau       | 0/48/93     | `#00305D` | Hauptfarbe: Headlines, Fliesstext, grafische Elemente |
| HAW-Hellblau   | 133/195/223 | `#85C3DF` | Dezente Akzentuierung |
| HAW-Orange     | 214/123/25  | `#D67B19` | Markierung, sparsamer Einsatz |
| HAW-Gelb       | 234/184/20  | `#EAB814` | Infografiken, wenn weitere Farben noetig |
| Schwarz        | 0/0/0       | `#000000` | Buerokommunikation |
| Weiss          | 255/255/255 | `#FFFFFF` | Hintergrund |

- **Farbverlauf:** HAW-Hellblau -> HAW-Blau, nur als Linie, max. 5% der Gesamtgestaltung.
- Prozentualen Abstufungen der Farben sind fuer Infografiken erlaubt.

### Schriften

| Schrift              | Verwendung | Web-Verfuegbarkeit |
|---------------------|------------|-------------------|
| ITC Officina Sans Book | Mengentexte (Fliesstext) | Wird ueber Stabsstelle beschafft -> `Fonts/` Ordner |
| ITC Officina Sans Bold | Zwischenueberschriften, Auszeichnungen | Wird ueber Stabsstelle beschafft |
| ITC Officina Serif Book | Ueberschriften | Wird ueber Stabsstelle beschafft |
| ITC Officina Serif Bold | Auszeichnungen in Ueberschriften | Wird ueber Stabsstelle beschafft |
| **Verdana** (Ersatz) | Fuer alle Zwecke, wo Officina nicht verfuegbar | System-Font, sofort nutzbar |

**Strategie:** Webseite wird zunaechst mit Verdana entwickelt. Sobald die Officina-Webfonts
(WOFF/WOFF2) im Ordner `Fonts/` liegen, werden sie als primaere `@font-face` eingebunden
mit Verdana als Fallback.

### Gestaltungsprinzipien

- **Logo:** Oben rechts, Mindesthoehe 9mm, Schutzzone 0.7x Logohoehe rundum
- **Partnerlogo:** Oben links, vertikal mittig zum HAW-Logo ausgerichtet
- **Ueberschriften:** Grosser Groessenunterschied zwischen H1 und Fliesstext (gewolltes Gestaltungsmittel)
- **Linien:** Strukturierungslinien in 2 Staerken (leicht + stark, Verhaeltnis 1:4). Abschlusslinien nie formatfuellend.
- **Aufzaehlungszeichen:** Bullet (•) fuer Lesegroessen, Middle Dot (·) fuer grosse Schriftgrade
- **Tonalitaet:** Offen, nuechtern, robust, regional, pragmatisch, authentisch
- **Bildwelt:** Menschen und Umgebung (Campus, Kiel, Region)

---

## Rollenmodell & Berechtigungen

| Rolle          | Personen | Berechtigungen |
|----------------|----------|----------------|
| **Orga**       | Christoph Goebel, Meike Wocken, Tammo Peters | Voller Zugang: alle Daten, Tischverwaltung, Studi-Zuweisung, Teilnehmer-Export, Einstellungen |
| **Admin**      | Andreas Borchardt (Leiter Forschungsabteilung) | Forschungscalls erstellen/bearbeiten/loeschen, Links hinterlegen, Workshop-Tische taggen |
| **IDW-Studi**  | Bis zu 15 Studierende | Etherpad pro Tisch, Notizen schreiben, Teilnehmer am Tisch verwalten, Protokoll/Action Items erstellen, getaggte Forschungscalls einsehen |
| **Teilnehmer** | Alle Angemeldeten (~70-100 erwartet) | Interner Bereich, Teilnehmerliste (nur opt-in Namen), Forschungscalls lesen, eigene Daten bearbeiten |
| **Gast**       | Jeder (oeffentlich) | Startseite, Programm, Anmeldeformular |

### Authentifizierung

- **Magic Links:** Teilnehmer erhalten nach Anmeldung einen personalisierten Link per E-Mail
- **Rollenzuweisung:** Orga/Admin/Studi-Rollen werden manuell in Supabase gesetzt
- **Row Level Security (RLS):** Jede Rolle sieht nur die fuer sie freigegebenen Daten

---

## Seitenstruktur

### Oeffentliche Seiten

| Route | Inhalt |
|-------|--------|
| `/` | **Startseite:** Programm, Ort, Einfuehrungstext, Professores-Vorstellung, Workshop-Themen. Vor 24.04.: prominenter Banner mit MS-Forms-Link. Danach: Anmelde-Button. |
| `/anmeldung` | **Anmeldeformular** (ab 25.04.): Name, E-Mail, Teilnahme (Vorlesung/Workshop/Abend separat waehlbar), Tischwahl (5 Tische mit Kapazitaetslimit), Begleitung (ja/nein, Alter <12 / <16), DSGVO-Einwilligung, Opt-in Namensanzeige im internen Bereich |

### Geschuetzte Seiten (nach Login via Magic Link)

| Route | Rolle | Inhalt |
|-------|-------|--------|
| `/intern` | Teilnehmer+ | Teilnehmerliste (nur opt-in), eigene Anmeldedaten, Forschungscalls/Konferenzen (getaggt nach Tisch), Download-Bereich |
| `/tisch/:id` | Studi + Teilnehmer | **Etherpad-Bereich pro Tisch:** Live-Notizen (Supabase Realtime), Teilnehmer am Tisch, zugehoerige Forschungscalls, Protokoll-Template (Zusammenfassung, Action Items, Kontaktdaten) |
| `/admin` | Admin (Borchert) | CRUD fuer Forschungscalls: Titel, Beschreibung, Link, Deadline, Typ (Call for Papers, Foerderung, Konferenz, Journal...), Tags (zugehoerige Workshop-Tische) |
| `/orga` | Orga (Christoph, Meike, Tammo) | Alle Admin-Funktionen + Teilnehmerverwaltung, Tisch-Konfiguration, Studi-Zuweisung, Daten-Export (CSV/Excel), MS-Forms-Import, Einstellungen |

---

## Datenbank-Schema (Supabase PostgreSQL)

### Tabellen

```sql
-- Benutzer-Profile (erweitert Supabase auth.users)
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'teilnehmer',  -- 'gast','teilnehmer','studi','admin','orga'
  background TEXT,                  -- fachlicher Hintergrund
  show_name_public BOOLEAN DEFAULT FALSE,  -- Opt-in Namensanzeige
  gdpr_consent BOOLEAN DEFAULT FALSE,
  gdpr_consent_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Anmeldungen
registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  attends_lecture BOOLEAN DEFAULT TRUE,
  attends_workshop BOOLEAN DEFAULT TRUE,
  attends_dinner BOOLEAN DEFAULT FALSE,
  table_preference UUID REFERENCES workshop_tables(id),
  companion_count INTEGER DEFAULT 0,
  companion_under_16 BOOLEAN DEFAULT FALSE,
  companion_under_12 BOOLEAN DEFAULT FALSE,
  source TEXT DEFAULT 'website',  -- 'website' oder 'msforms_import'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)

-- Workshop-Tische
workshop_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  capacity INTEGER DEFAULT 15,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Tisch-Zuweisungen (wer sitzt an welchem Tisch)
table_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID REFERENCES workshop_tables(id),
  profile_id UUID REFERENCES profiles(id),
  assigned_by UUID REFERENCES profiles(id),  -- Studi oder Orga
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(table_id, profile_id)
)

-- Forschungscalls (gepflegt von Admin/Borchert)
research_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  deadline DATE,
  call_type TEXT,  -- 'call_for_papers','funding','conference','journal','other'
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)

-- Zuordnung Forschungscalls <-> Workshop-Tische (n:m)
call_table_tags (
  call_id UUID REFERENCES research_calls(id) ON DELETE CASCADE,
  table_id UUID REFERENCES workshop_tables(id) ON DELETE CASCADE,
  PRIMARY KEY (call_id, table_id)
)

-- Etherpad-Notizen (Realtime, pro Tisch)
table_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID REFERENCES workshop_tables(id),
  section TEXT NOT NULL,  -- 'ideensammlung','voting','ausformulierung','action_items','protokoll'
  content TEXT DEFAULT '',
  last_edited_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Row Level Security (RLS) Policies

- **profiles:** Jeder kann sein eigenes Profil lesen/bearbeiten. Teilnehmer sehen Namen nur bei `show_name_public = true`. Orga sieht alles.
- **registrations:** Jeder sieht/bearbeitet nur seine eigene Anmeldung. Orga sieht alles.
- **workshop_tables:** Alle koennen lesen. Nur Orga kann erstellen/bearbeiten.
- **table_assignments:** Studi + Orga koennen zuweisen. Alle Teilnehmer am selben Tisch koennen lesen.
- **research_calls:** Admin + Orga koennen CRUD. Alle eingeloggten Benutzer koennen lesen.
- **call_table_tags:** Admin + Orga koennen CRUD. Alle koennen lesen.
- **table_notes:** Studi + Orga koennen schreiben. Alle am Tisch zugewiesenen koennen lesen.

---

## Phasen & Timeline

### Phase 0: Projekt-Setup (jetzt)
- [x] README.md mit Gesamtplan erstellen
- [ ] Git-Repository initialisieren
- [ ] Astro-Projekt aufsetzen mit Svelte + Tailwind
- [ ] Tailwind-Config mit HAW-Design-Tokens (Farben, Schriften)
- [ ] Supabase-Client einbinden (Projekt-ID: `cbybfmnbojklqbkmuwto`)
- [ ] Basis-Layout mit HAW-Header (Logo oben rechts) und Footer
- [ ] Ordnerstruktur fuer Fonts vorbereiten (Fallback auf Verdana)

### Phase 1: Landingpage -- Bewerbungsphase (bis 24. April 2026)
- [ ] Startseite mit vollstaendigem Programm
- [ ] Prominenter Banner: "Jetzt anmelden!" -> MS Forms Link
- [ ] Countdown bis Anmeldeschluss 24.04.2026
- [ ] Vorstellung der drei Professores (Fotos aus Einladungs-PDF oder eigene)
- [ ] Workshop-Themen mit Beschreibungen
- [ ] Responsive Design (mobil + Desktop)
- [ ] Deployment auf GitHub Pages

### Phase 2: Datenbank & Auth (vor 25. April)
- [ ] Supabase-Schema erstellen (alle Tabellen, RLS Policies)
- [ ] Magic-Link-Auth konfigurieren
- [ ] Rollen-System implementieren (Orga, Admin, Studi, Teilnehmer)
- [ ] MS-Forms-Daten importieren (CSV/Excel -> Supabase)
- [ ] Initiale Workshop-Tische anlegen

### Phase 3: Anmeldung & Interner Bereich (25. April - 7. Mai)
- [ ] Anmeldeformular mit allen Feldern
- [ ] E-Mail-Versand mit Magic Link nach Anmeldung
- [ ] Interner Bereich: Teilnehmerliste, Forschungscalls
- [ ] Admin-Panel fuer Andreas Borchardt (Forschungscalls CRUD + Tisch-Tagging)
- [ ] Orga-Panel (Teilnehmerverwaltung, Tisch-Konfiguration, Export)
- [ ] Banner-Umstellung: MS Forms -> direkte Anmeldung

### Phase 4: Workshop-Tools (vor 7. Mai)
- [ ] Etherpad-Funktion pro Tisch (Supabase Realtime)
- [ ] Strukturierte Abschnitte: Ideensammlung, Voting, Ausformulierung, Action Items
- [ ] Teilnehmer-am-Tisch-Verwaltung (Dropdown-Liste fuer Studis)
- [ ] Forschungscalls-Ansicht pro Tisch (getaggt)
- [ ] PDF-Export der Protokolle

### Phase 5: Post-Event
- [ ] Ergebnisse/Protokolle sichern und exportieren
- [ ] Teilnehmer-Vernetzung (Kontaktdaten-Austausch bei Opt-in)
- [ ] Archivierung der Webseite

---

## Ordnerstruktur (Ziel)

```
SilosAufbrechen/
  README.md                    <-- Diese Datei
  Archiv/                      <-- Einladung, CD Manual, Skizzen, Hoersaal-Fotos
    cd_manual_haw_screen.pdf
    SilosAufbrechen_ZukunftBauen.pdf
    ...
  Anmeldungen/                 <-- MS-Forms-Export
    Anmeldungen.xlsx
  Fonts/                       <-- ITC Officina Webfonts (sobald verfuegbar)
  web/                         <-- Astro-Projekt (wird erzeugt)
    src/
      components/              <-- Svelte-Komponenten
      layouts/                 <-- Astro-Layouts (HAW-Header/Footer)
      pages/                   <-- Routen (/, /anmeldung, /intern, /tisch, /admin, /orga)
      styles/                  <-- Globale Styles, Font-Face-Deklarationen
      lib/                     <-- Supabase-Client, Auth-Helpers, Typen
    public/
      fonts/                   <-- Kopie/Symlink der Officina-Fonts
      images/                  <-- Logo, Professores-Fotos, etc.
    astro.config.mjs
    tailwind.config.mjs
    package.json
```

---

## Wichtige Hinweise fuer nachfolgende Agents

### Kontext
- Dieses Projekt ist eine Event-Webseite fuer eine Antrittsvorlesung an der HAW Kiel
- Der Auftraggeber ist Prof. Dr. Christoph Goebel (cgoebel)
- Alle Design-Entscheidungen muessen dem CD Manual der HAW Kiel folgen (siehe `Archiv/cd_manual_haw_screen.pdf`)
- Die Einladung mit allen Veranstaltungsdetails liegt in `Archiv/SilosAufbrechen_ZukunftBauen.pdf`
- Aktuelle Anmeldungen (12 Stueck) liegen in `Anmeldungen/Anmeldungen.xlsx`

### Entscheidungen (bereits getroffen)
- **Architektur:** Leichtgewichtig (statische Seite + Supabase Backend-as-a-Service)
- **Auth:** Magic Links per E-Mail (kein Passwort)
- **Tische:** 5 Stueck, Teilnehmer waehlen selbst (Anzahl/Themen nach 24.04. ggf. variabel)
- **Schriften:** Verdana als Fallback, ITC Officina als primaere Schrift sobald verfuegbar
- **Supabase Projekt-ID:** `cbybfmnbojklqbkmuwto`
- **Erwartete Teilnehmer:** 70-100 Personen + bis zu 15 IDW-Studis

### Andreas Borchardt
Leiter der Forschungsabteilung, E-Mail: andreas.borchardt@haw-kiel.de.
Schreibweise: **Borchardt** (mit dt) ist korrekt.

### MS-Forms-Link
https://forms.office.com/pages/responsepage.aspx?id=SlFZYNubNECdLWtc9Zdpa95yTsFJlbBDntdDxMV4KBtUNjdTUzM4NVpXSkc5Tk9OM1JEUlJNNFNPMi4u&route=shorturl

### Officina-Fonts
Werden von der Stabsstelle Strategische Kommunikation der HAW Kiel bereitgestellt.
Sobald verfuegbar als WOFF/WOFF2 im Ordner `Fonts/` abgelegt.
Die `@font-face`-Deklarationen und Tailwind-Config muessen dann aktualisiert werden.
