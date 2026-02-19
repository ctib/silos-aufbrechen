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
| **Frontend**   | Astro + Svelte 5 | Statische Seiten (schnell, SEO), Svelte fuer interaktive Teile (Etherpad, Formulare) |
| **Backend/DB** | Supabase | Auth (Magic Links), PostgreSQL, Realtime, Row Level Security |
| **Hosting**    | GitHub Pages | `https://ctib.github.io/silos-aufbrechen/`, spaeter eigene Domain |
| **Styling**    | Tailwind CSS v4 | Mit HAW-Design-Tokens aus dem CD Manual |
| **Deployment** | GitHub Actions | Auto-Deploy bei Push auf master |

### Supabase

- **Projekt-ID:** `cbybfmnbojklqbkmuwto`
- **URL:** `https://cbybfmnbojklqbkmuwto.supabase.co`
- **API Key:** Publishable Key (neues Format, nicht legacy anon key) -- in `.env` und GitHub Variables gespeichert
- **Auth-Methode:** Magic Links per E-Mail (kein Passwort noetig)
- **Account:** Ueber GitHub-Account von Christoph Goebel (ctib) erstellt

### GitHub

- **Repository:** `https://github.com/ctib/silos-aufbrechen`
- **GitHub-Account:** `ctib`
- **Pages URL:** `https://ctib.github.io/silos-aufbrechen/`
- **Branch:** `master` (nicht main!)
- **GitHub Variables:** `PUBLIC_SUPABASE_URL` und `PUBLIC_SUPABASE_ANON_KEY` als Repository-Variablen gesetzt
- **Environment:** `github-pages` mit `master` als erlaubtem Branch

### Hosting / Domain

Zunaechst wird die GitHub-Pages-URL `https://ctib.github.io/silos-aufbrechen/` verwendet.
Eine HAW-Institutsseite (`haw-kiel.de/index.php?id=31260`) wurde abgelehnt.
Christoph moechte eine eigene Domain, hat aber noch keine Erfahrung damit.
Die Webseite ist so gebaut, dass die Domain jederzeit per CNAME-Eintrag und
GitHub-Pages-Custom-Domain-Setting umgestellt werden kann. Beim Domainwechsel
muss nur `site` und `base` in `web/astro.config.mjs` angepasst werden.

### Base Path

Da die Seite unter `/silos-aufbrechen/` laeuft, muessen alle internen Links den Base-Pfad
beruecksichtigen. Dafuer gibt es den Helper `web/src/lib/paths.ts` mit der Funktion
`basePath('/pfad')`, die in allen Svelte-Komponenten verwendet wird. In Astro-Templates
wird `import.meta.env.BASE_URL` direkt genutzt.

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

| Schrift      | Verwendung |
|-------------|------------|
| **Verdana** | Fliesstext, Zwischenueberschriften, allgemeiner Text |
| **Georgia** | Ueberschriften (serif) |

**Entscheidung (2026-02-17):** ITC Officina Fonts werden nicht geliefert. Verdana und Georgia
sind die endgueltigen Schriften. Officina-Referenzen wurden aus `global.css` entfernt.

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

### Phase 0: Projekt-Setup -- ERLEDIGT
- [x] README.md mit Gesamtplan erstellen
- [x] Git-Repository initialisieren + GitHub Repo (`ctib/silos-aufbrechen`)
- [x] Astro-Projekt aufsetzen mit Svelte 5 + Tailwind CSS v4
- [x] Tailwind-Config mit HAW-Design-Tokens (Farben, Schriften) in `web/src/styles/global.css`
- [x] Supabase-Client einbinden (`web/src/lib/supabase.ts`, mit Placeholder-Fallback fuer SSG Build)
- [x] Basis-Layout mit HAW-Header (Logo oben rechts) und Footer (`web/src/layouts/BaseLayout.astro`)
- [x] Ordnerstruktur fuer Fonts vorbereiten (`@font-face` auskommentiert in global.css)
- [x] HAW Kiel Favicon heruntergeladen und eingebunden
- [x] GitHub Pages Deployment-Workflow (`.github/workflows/deploy.yml`)

### Phase 1: Landingpage -- ERLEDIGT
- [x] Startseite mit vollstaendigem Programm (`web/src/pages/index.astro`)
- [x] Prominenter Banner: "Jetzt anmelden!" -> MS Forms Link (vor 24.04.)
- [x] Countdown: Anmeldetage (im Banner) + Veranstaltungs-Countdown (Tage:Std:Min:Sek, unterhalb)
- [x] Vorstellung der drei Professores mit Links zu HAW-Personalseiten
- [x] Workshop-Themen mit Beschreibungen (5 Tische)
- [x] Kalender-Export (iCal Download + Google Calendar Link)
- [x] Responsive Design (mobil + Desktop)
- [x] CountdownBanner schaltet nach 24.04. automatisch auf "Verbindlich anmelden" -> /anmeldung um
- [x] FB-Labels: Meike -> "FB Wirtschaft", Christoph -> "FB Medien/Bauwesen", Tammo -> "FB Agrarwirtschaft"
- [x] Phasen-Zeitleiste ueber dem Countdown-Banner (Anmeldephase / Vorbereitungsphase / Durchfuehrungsphase)
- [x] Phase-Override: Per Klick umschaltbar (spaeter nur fuer Orga), mit "Vorschau"-Hinweis und Reset-Button
- [x] Phasenabhaengiges UI: Banner-Buttons und Countdown passen sich der aktiven Phase an
- [x] Schriften finalisiert: Verdana + Georgia (ITC Officina entfaellt)
- [x] Header-Navigation: "Start" + "Interner Bereich" Links oben links, Logo oben rechts
- [x] Vorbereitungsphase: Info-Banner ("Vorbereitung laeuft, Teilnehmer werden informiert")
- [x] Vorbereitungsphase: "Nachmeldung anfragen" Button statt Anmeldung
- [x] Nachmeldungs-Seite (`/nachmeldung`, `NachmeldungForm.svelte`): Nur Name + Email, Magic Link
- [x] Programm-Hinweis: "Vorlaeufiges Programm, Stand: 24.04.2026"
- [x] Base-Path-Bug gefixt: Fehlender Slash bei Logo/Favicon-Pfaden in BaseLayout

### Phase 2: Datenbank & Auth -- IN ARBEIT
- [x] SQL-Schema erstellt (`web/supabase/001_initial_schema.sql`) mit Enums, Tabellen, RLS, Triggers, Seed-Daten
- [x] Anmeldeformular (`web/src/components/RegistrationForm.svelte`) mit Magic Link per `signInWithOtp()`
- [x] Auth-Callback-Seite (`web/src/pages/auth/callback.astro`) fuer Profil-Update + Registration-Upsert
- [x] Interner Bereich (`web/src/components/InternalArea.svelte`) mit Teilnehmerliste, Forschungscalls, rollenbasierter UI
- [x] Supabase Publishable Key in `.env` und als GitHub Repository Variable gesetzt
- [x] GitHub Pages Environment: `master` Branch als Deployment-Quelle erlaubt
- [x] Base-Path-Helper (`web/src/lib/paths.ts`) fuer korrekte URLs unter `/silos-aufbrechen/`
- [ ] **SQL-Schema auf Supabase ausfuehren** (siehe Abschnitt "Naechste Schritte")
- [ ] **Magic Links in Supabase konfigurieren** (Redirect URLs setzen)
- [ ] **Erstes Deployment verifizieren** (GitHub Actions Workflow wurde getriggert)
- [ ] **E-Mail-Versand an Teilnehmer aus Anmeldung.xlsx** (in Arbeit)
- [ ] MS-Forms-Daten importieren (nach Anmeldeschluss 24.04.)
- [ ] Orga-Rollen setzen (Meike, Tammo, Christoph -> 'orga' in profiles)

### Phase 3: Admin & Orga Panels -- CODE FERTIG
- [x] Admin-Panel (`/admin`, `AdminPanel.svelte`): Forschungscalls CRUD (Titel, Beschreibung, URL, Deadline, Typ) + Tisch-Tagging per Toggle-Buttons
- [x] Orga-Panel (`/orga`, `OrgaPanel.svelte`): Statistik-Dashboard, Teilnehmertabelle mit Rollen-Dropdown, Tisch-Bearbeitung, Studi-Zuweisung, CSV-Export (UTF-8 BOM, Semikolon-getrennt fuer Excel)
- [x] Auth-Checks: Admin sieht nur `/admin`, Orga sieht `/admin` + `/orga`
- [x] Navigation zwischen Intern/Admin/Orga in allen geschuetzten Bereichen
- [ ] MS-Forms-Import-Script (Bestandsdaten aus `Anmeldungen/Anmeldungen.xlsx` uebernehmen)

### Phase 4: Workshop-Tools -- CODE FERTIG
- [x] Etherpad-Funktion pro Tisch (`/tisch/1` bis `/tisch/5`, `TableView.svelte`) mit Supabase Realtime
- [x] 5 strukturierte Abschnitte pro Tisch: Ideensammlung, Voting, Ausformulierung, Action Items, Protokoll
- [x] Auto-Save (1.5s Debounce) + manuelles Speichern
- [x] Realtime-Subscription: Aenderungen von anderen werden live angezeigt
- [x] Teilnehmer am Tisch anzeigen (mit Studi-Badge)
- [x] Forschungscalls pro Tisch (gefiltert ueber call_table_tags)
- [x] Quick-Links zu anderen Tischen
- [x] Nur Studis und Orga koennen Notizen bearbeiten, Teilnehmer nur lesen
- [ ] PDF-Export der Protokolle

### Phase 5: Post-Event
- [ ] Ergebnisse/Protokolle sichern und exportieren
- [ ] Teilnehmer-Vernetzung (Kontaktdaten-Austausch bei Opt-in)
- [ ] Archivierung der Webseite

---

## Ordnerstruktur (aktuell)

```
SilosAufbrechen/
  README.md                        <-- Diese Datei
  .gitignore
  ToDos.txt                        <-- Erledigte Todo-Liste
  Archiv/                          <-- Einladung, CD Manual, Skizzen (gitignored)
    cd_manual_haw_screen.pdf
    SilosAufbrechen_ZukunftBauen.pdf
    forms-office.txt               <-- MS Forms Link
  Anmeldungen/                     <-- MS-Forms-Export (gitignored)
    Anmeldungen.xlsx               <-- 12 aktuelle Anmeldungen
  Fonts/                           <-- (entfaellt, Officina kommt nicht)
  .github/
    workflows/
      deploy.yml                   <-- GitHub Actions: Build + Deploy auf GitHub Pages
  web/                             <-- Astro-Projekt
    .env                           <-- Supabase Credentials (gitignored)
    .env.example                   <-- Template fuer .env
    astro.config.mjs               <-- site: ctib.github.io, base: /silos-aufbrechen
    package.json
    supabase/
      001_initial_schema.sql       <-- Komplettes DB-Schema (noch nicht auf Supabase ausgefuehrt!)
    src/
      components/
        AdminPanel.svelte          <-- Admin: Forschungscalls CRUD + Tisch-Tagging
        CountdownBanner.svelte     <-- Banner mit Phasen-Zeitleiste, Countdown, Kalender-Export
        InternalArea.svelte        <-- Geschuetzter Bereich (Teilnehmerliste, Calls)
        OrgaPanel.svelte           <-- Orga: Teilnehmer, Tische, Studi-Zuweisung, Export
        NachmeldungForm.svelte     <-- Nachmeldung (nur Name+Email, nach Anmeldeschluss)
        RegistrationForm.svelte    <-- Anmeldeformular mit Magic Link
        TableView.svelte           <-- Etherpad pro Tisch (Realtime, 5 Abschnitte)
      layouts/
        BaseLayout.astro           <-- HAW-Header (Logo rechts) + Footer
      lib/
        supabase.ts                <-- Supabase-Client (mit SSG-Fallback)
        paths.ts                   <-- basePath() Helper fuer GitHub Pages Subpfad
      pages/
        index.astro                <-- Startseite / Landingpage
        anmeldung.astro            <-- Anmeldeformular-Seite
        intern.astro               <-- Interner Bereich
        admin.astro                <-- Admin-Panel (Forschungscalls)
        nachmeldung.astro          <-- Nachmeldungs-Seite (nach Anmeldeschluss)
        orga.astro                 <-- Orga-Panel (Teilnehmerverwaltung)
        tisch/
          [nr].astro               <-- Dynamische Route: /tisch/1 bis /tisch/5
        auth/
          callback.astro           <-- Magic Link Callback (Profil + Registration)
      styles/
        global.css                 <-- Tailwind v4 @theme mit HAW-Design-Tokens
    public/
      favicon.ico                  <-- HAW Kiel Favicon
      images/
        haw_kiel_logo.svg          <-- HAW Kiel Logo (86KB SVG)
```

---

## Naechste Schritte (beim Fortsetzen der Session)

Die folgenden Schritte muessen als naechstes erledigt werden:

### 1. SQL-Schema auf Supabase ausfuehren
Die Datei `web/supabase/001_initial_schema.sql` muss in der Supabase-Datenbank ausgefuehrt werden.
**Anleitung:**
1. Supabase Dashboard oeffnen: `https://supabase.com/dashboard/project/cbybfmnbojklqbkmuwto`
2. Im linken Menue auf **SQL Editor** klicken
3. Den gesamten Inhalt von `web/supabase/001_initial_schema.sql` einfuegen
4. **Run** klicken
5. Pruefen, dass alle Tabellen unter **Table Editor** sichtbar sind und die 5 Workshop-Tische
   sowie 25 table_notes (5 Tische x 5 Sections) geseeded wurden

### 2. Magic Links in Supabase konfigurieren
1. Supabase Dashboard -> **Authentication** -> **URL Configuration**
2. **Site URL** setzen auf: `https://ctib.github.io/silos-aufbrechen/`
3. **Redirect URLs** hinzufuegen:
   - `https://ctib.github.io/silos-aufbrechen/auth/callback`
   - `http://localhost:4321/silos-aufbrechen/auth/callback` (fuer lokale Entwicklung)
4. Optional unter **Email Templates**: Bestaetigunsmail-Text auf Deutsch anpassen

### 3. Erstes Deployment verifizieren
Der GitHub Actions Workflow wurde bereits getriggert (`workflow_dispatch` auf master).
- Pruefen unter: `https://github.com/ctib/silos-aufbrechen/actions`
- Die Seite sollte dann live sein unter: `https://ctib.github.io/silos-aufbrechen/`
- Falls Deployment fehlschlaegt: Logs pruefen. Das `master`-Branch-Environment-Problem wurde
  bereits behoben (master als erlaubter Branch in github-pages Environment hinzugefuegt).

### 4. E-Mail-Versand an Anmeldungen.xlsx-Teilnehmer
In Phase 2 sollen alle bereits angemeldeten Personen aus `Anmeldungen/Anmeldungen.xlsx`
per E-Mail ueber die Webseite informiert werden. Details werden noch erarbeitet.

### 5. Danach: Noch fehlende Seiten und Features
- [x] `/admin` Seite erstellt (Forschungscalls CRUD fuer Andreas Borchardt)
- [x] `/orga` Seite erstellt (Teilnehmerverwaltung, Tisch-Config, Studi-Zuweisung, Export)
- [x] `/tisch/1`-`/tisch/5` erstellt (Etherpad mit Supabase Realtime, 5 Abschnitte, Auto-Save)
- [ ] Orga-Rollen in profiles-Tabelle setzen (Christoph, Meike, Tammo -> 'orga')
- [ ] Admin-Rolle setzen (Andreas Borchardt -> 'admin')
- [ ] Phasen-Zeitleiste: Phase-Override spaeter nur fuer Orga-Rolle freischalten (aktuell fuer alle klickbar)
- [ ] Domain registrieren und konfigurieren (Christoph hat noch keine Erfahrung damit)

---

## Wichtige Hinweise fuer nachfolgende Agents

### Kontext
- Dieses Projekt ist eine Event-Webseite fuer eine Antrittsvorlesung an der HAW Kiel
- Der Auftraggeber ist Prof. Dr. Christoph Goebel (GitHub: `ctib`, Windows-User: `cgoebel`)
- Alle Design-Entscheidungen muessen dem CD Manual der HAW Kiel folgen (siehe `Archiv/cd_manual_haw_screen.pdf`)
- Die Einladung mit allen Veranstaltungsdetails liegt in `Archiv/SilosAufbrechen_ZukunftBauen.pdf`
- Aktuelle Anmeldungen (12 Stueck) liegen in `Anmeldungen/Anmeldungen.xlsx`

### Entscheidungen (bereits getroffen)
- **Architektur:** Leichtgewichtig (statische Seite + Supabase Backend-as-a-Service)
- **Auth:** Magic Links per E-Mail (kein Passwort), Supabase `signInWithOtp()`
- **API Key:** Publishable Key (neues Supabase-Format, nicht legacy anon key)
- **Tische:** 5 Stueck, Teilnehmer waehlen selbst (Anzahl/Themen nach 24.04. ggf. variabel)
- **Schriften:** Verdana (sans) + Georgia (serif), ITC Officina entfaellt
- **Supabase Projekt-ID:** `cbybfmnbojklqbkmuwto`
- **Erwartete Teilnehmer:** 70-100 Personen + bis zu 15 IDW-Studis
- **Branch:** `master` (nicht `main`!)
- **Base Path:** `/silos-aufbrechen/` (alle internen Links muessen `basePath()` oder `import.meta.env.BASE_URL` nutzen)
- **FB-Labels:** Meike -> "FB Wirtschaft", Christoph -> "FB Medien/Bauwesen", Tammo -> "FB Agrarwirtschaft"
- **HAW-Institutsseite** (`haw-kiel.de/index.php?id=31260`) wurde abgelehnt, eigene Domain bevorzugt

### Andreas Borchardt
Leiter der Forschungsabteilung, E-Mail: andreas.borchardt@haw-kiel.de.
Schreibweise: **Borchardt** (mit dt) ist korrekt.
Bekommt Admin-Rolle: darf Forschungscalls erstellen/bearbeiten und Workshop-Tische taggen.

### MS-Forms-Link
`https://forms.office.com/pages/responsepage.aspx?id=SlFZYNubNECdLWtc9Zdpa95yTsFJlbBDntdDxMV4KBtUNjdTUzM4NVpXSkc5Tk9OM1JEUlJNNFNPMi4u&route=shorturl`
Wird auf der Startseite bis 24.04.2026 als primaerer Anmeldelink angezeigt.
Danach wird auf das eigene Anmeldeformular (`/anmeldung`) umgeschaltet.

### Schriften (finalisiert)
ITC Officina wird nicht geliefert. Verdana (sans-serif) und Georgia (serif) sind final.
Die Officina-Referenzen und auskommentierten `@font-face`-Deklarationen wurden aus
`web/src/styles/global.css` entfernt.

### Technische Besonderheiten
- **SSG Build:** Der Supabase-Client in `web/src/lib/supabase.ts` hat Fallback-Werte fuer URL und Key,
  damit der statische Build (ohne Env-Vars) nicht abstuerzt. Im Browser werden die echten Werte verwendet.
- **Base Path:** Wegen GitHub Pages unter `/silos-aufbrechen/` muessen alle internen Links den Helper
  `basePath()` aus `web/src/lib/paths.ts` nutzen (Svelte) bzw. `import.meta.env.BASE_URL` (Astro).
  Bei Domain-Wechsel: nur `site` und `base` in `astro.config.mjs` aendern.
- **GitHub CLI:** Installiert unter `/c/Program Files/GitHub CLI/gh`. Muss ggf. zum PATH hinzugefuegt werden:
  `export PATH="$PATH:/c/Program Files/GitHub CLI"`
- **Kein Python:** Auf dem System ist kein Python installiert (Windows Store Alias). Fuer Scripting Node.js v25.6.1 verwenden.
- **Magic Link Flow:** Formular -> `signInWithOtp()` mit Metadaten -> E-Mail mit Link -> Redirect zu
  `/auth/callback` -> Profil-Update + Registration-Upsert -> Weiterleitung zu `/intern`
