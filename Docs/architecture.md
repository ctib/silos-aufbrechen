# Technische Architektur

## Tech-Stack

| Komponente     | Technologie | Grund |
|---------------|-------------|-------|
| **Frontend**   | Astro + Svelte 5 | Statische Seiten (schnell, SEO), Svelte fuer interaktive Teile |
| **Backend/DB** | Supabase | Auth (Magic Links), PostgreSQL, Realtime, Row Level Security |
| **Hosting**    | GitHub Pages | `https://zukunftbauen.org` (Custom Domain) |
| **Styling**    | Tailwind CSS v4 | Mit HAW-Design-Tokens aus dem CD Manual |
| **Deployment** | GitHub Actions | Auto-Deploy bei Push auf `master` |
| **DNS**        | Cloudflare | DNS-Verwaltung fuer zukunftbauen.org |
| **Email**      | Resend | Nachmeldung-Benachrichtigungen via pg_net |

## Supabase

- **Projekt-ID:** `cbybfmnbojklqbkmuwto`
- **URL:** `https://cbybfmnbojklqbkmuwto.supabase.co`
- **API Key:** Publishable Key (in `.env` und GitHub Variables)
- **Auth:** Magic Links per E-Mail (kein Passwort)
- **Account:** GitHub-Account `ctib`

## GitHub

- **Repository:** `https://github.com/ctib/silos-aufbrechen` (privat)
- **Branch:** `master` (nicht main!)
- **GitHub Variables:** `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`

## Ordnerstruktur

```
SilosAufbrechen/
  README.md
  ToDos.txt                        <-- Erledigte Todo-Liste
  Docs/                            <-- Dokumentation
  Archiv/                          <-- CD Manual, Einladung (gitignored)
  Anmeldungen/                     <-- Anmeldedaten + Import-Script (gitignored)
  .github/workflows/deploy.yml     <-- GitHub Actions Deployment
  web/                             <-- Astro-Projekt
    astro.config.mjs               <-- site: zukunftbauen.org
    .env                           <-- Supabase Credentials (gitignored)
    supabase/                      <-- SQL-Migrationen
      001_initial_schema.sql       <-- Komplettes DB-Schema
      002_nachmeldung_notify.sql   <-- Email-Trigger (pg_net + Resend)
      003_add_tisch6.sql           <-- Tisch 6 "Freies Thema"
      004_check_email_rpc.sql      <-- RPC fuer Email-Check
      005_security_fixes.sql       <-- Security + Performance
      006_domain_switch.sql        <-- Domain-Wechsel Trigger-Update
    src/
      components/
        AdminPanel.svelte          <-- Forschungscalls CRUD + Tisch-Tagging
        CountdownBanner.svelte     <-- Phasen-Zeitleiste, Countdown, Kalender
        InternalArea.svelte        <-- Veranstaltungsbereich (Login, Anmeldung)
        OrgaPanel.svelte           <-- Teilnehmer, Tische, Export
        NachmeldungForm.svelte     <-- Nachmeldung nach Anmeldeschluss
        TableView.svelte           <-- Etherpad pro Tisch (Realtime)
      layouts/
        BaseLayout.astro           <-- HAW-Header + Footer
      lib/
        supabase.ts                <-- Supabase-Client (mit SSG-Fallback)
        paths.ts                   <-- basePath() Helper
        config.ts                  <-- Shared Konfiguration
        types.ts                   <-- TypeScript-Typen
        callTypes.ts               <-- Forschungscall-Typen
      pages/
        index.astro                <-- Startseite
        intern.astro               <-- Veranstaltungsbereich
        admin.astro                <-- Forschungsmoeglichkeiten
        orga.astro                 <-- Orga-Panel
        nachmeldung.astro          <-- Nachmeldung
        tisch/[nr].astro           <-- Etherpad pro Tisch (1-6)
        auth/callback.astro        <-- Magic Link Callback
    public/
      CNAME                        <-- Custom Domain: zukunftbauen.org
      favicon.ico
      images/haw_kiel_logo.svg
```

## Datenbank-Schema

9 Tabellen mit Row Level Security:

| Tabelle | Zweck |
|---------|-------|
| `profiles` | Benutzerprofile (erweitert auth.users) |
| `registrations` | Anmeldungen (Teilnahme, Begleitung) |
| `workshop_tables` | 6 Workshop-Tische |
| `table_assignments` | Tisch-Zuweisungen (n:m) |
| `registration_table_preferences` | Tischwahl der Teilnehmer (n:m) |
| `research_calls` | Forschungscalls (Admin-gepflegt) |
| `call_table_tags` | Zuordnung Calls <-> Tische (n:m) |
| `table_notes` | Etherpad-Notizen pro Tisch (Realtime) |
| `nachmeldung_requests` | Nachmeldungen nach Anmeldeschluss |

Vollstaendiges Schema: `web/supabase/001_initial_schema.sql`

## Rollenmodell

| Rolle | Personen | Berechtigungen |
|-------|----------|----------------|
| **Orga** | Christoph, Meike, Tammo | Voller Zugang |
| **Admin** | Andreas Borchardt | Forschungscalls CRUD |
| **IDW-Studi** | Bis zu 15 Studierende | Etherpad, Protokoll |
| **Teilnehmer** | Alle Angemeldeten | Veranstaltungsbereich, eigene Daten |
| **Gast** | Oeffentlich | Startseite, Programm |

## Technische Besonderheiten

- **SSG Build:** Supabase-Client hat Fallback-Werte, damit statischer Build ohne Env-Vars nicht abstuerzt
- **Base Path:** `basePath()` Helper und `import.meta.env.BASE_URL` -- passt sich automatisch an `astro.config.mjs` an
- **Magic Link Flow:** Formular → `signInWithOtp()` → E-Mail → `/auth/callback` → Profil-Update → `/intern`
- **Kein Python:** Nur Node.js v25.6.1 verfuegbar
