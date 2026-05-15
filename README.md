# Zukunft bauen

Interdisziplinaere Plattform fuer Wissenschaft, Wirtschaft und Stadtgesellschaft -- von und fuer Kiel.

Hervorgegangen aus der Veranstaltung "Silos aufbrechen -- Zukunft bauen" am 7. Mai 2026 an der HAW Kiel.

**Live:** [zukunftbauen.org](https://zukunftbauen.org)

---

## Team

- **Prof. Dr.-Ing. Christoph Goebel** (FB Medien/Bauwesen)
- **Prof. Dr. Meike Wocken** (FB Wirtschaft)
- **Prof. Dr. Tammo Peters** (FB Agrarwirtschaft)

---

## Tech-Stack

| Komponente | Technologie |
|------------|-------------|
| Frontend | Astro + Svelte 5 + Tailwind CSS v4 |
| Backend | Supabase (Auth, PostgreSQL, Realtime) |
| Hosting | GitHub Pages + Custom Domain (zukunftbauen.org) |
| DNS | Cloudflare |
| Email | Resend (via pg_net) |
| Deployment | GitHub Actions (auto-deploy auf `master`) |

## Seitenstruktur

| Route | Zugang | Inhalt |
|-------|--------|--------|
| `/` | Oeffentlich | Landingpage: Hero, Kiel-Motiv, Rueckblick, Team, Ausblick (DE/EN) |
| `/veranstaltungen` | Oeffentlich | Veranstaltungsuebersicht (DE/EN) |
| `/veranstaltungen/silos-aufbrechen-2026` | Oeffentlich | Archiv: Programm, Vortraege, Workshop-Tische |
| `/intern` | Teilnehmer | Interner Bereich: Anmeldung, Teilnehmerliste, Themengebiete, Forschungscalls |
| `/tisch/:nr` | Teilnehmer | Chat-Etherpad pro Themengebiet (Realtime) |
| `/admin` | Admin | Forschungsmoeglichkeiten: Calls CRUD + Themengebiet-Tags |
| `/orga` | Orga | Teilnehmerverwaltung, Export, Nachmeldungen |
| `/nachmeldung` | Oeffentlich | Nachmeldung nach Anmeldeschluss |

## Features

- **Zweisprachigkeit (DE/EN):** Landingpage, Navigation, Veranstaltungsuebersicht. Sprachumschalter im Header, Praeferenz in localStorage.
- **Event-Archiv:** Vergangene Veranstaltungen als statische Archivseiten, erweiterbar.
- **Chat-Etherpad:** Pro Themengebiet ein Chat-artiges Pad mit Eintraegen (Name + Zeitstempel). Realtime via Supabase.
- **Temporaere CTAs:** Konfigurierbar in `config.ts` mit Ablaufdatum -- verschwinden automatisch.

---

## Dokumentation

| Dokument | Inhalt |
|----------|--------|
| [Docs/architecture.md](Docs/architecture.md) | Technische Architektur, DB-Schema, Ordnerstruktur, Rollenmodell |
| [Docs/design-system.md](Docs/design-system.md) | HAW-Farben, Schriften, Gestaltungsprinzipien |
| [Docs/domain-setup.md](Docs/domain-setup.md) | Domain-Setup: Cloudflare, GitHub Pages, Supabase, Resend |

---

## Quickstart (Entwicklung)

```bash
cd web
cp .env.example .env   # Supabase-Credentials eintragen
npm install
npm run dev
```

## Deployment

Push auf `master` triggert GitHub Actions → Build → GitHub Pages.

```bash
git push origin master
```

---

## Offene Punkte

- [ ] PDF-Export der Themengebiet-Protokolle
- [ ] Migration 026 (topic_entries) im Supabase-Dashboard ausfuehren

---

## Wichtige Hinweise

- **Branch:** `master` (nicht main!)
- **Supabase Projekt-ID:** `cbybfmnbojklqbkmuwto`
- **CD Manual:** `Archiv/cd_manual_haw_screen.pdf`
- **Personenbezogene Daten:** Migrationen/Scripts mit TN-Daten liegen nur lokal (gitignored). Nie committen!
