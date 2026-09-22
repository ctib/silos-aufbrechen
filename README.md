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
| `/veranstaltungen` | Oeffentlich | Veranstaltungskalender mit Filter, ICS-Download (DE/EN) |
| `/calendar.ics` | Oeffentlich | ICS-Feed: alle Veranstaltungen als Kalender-Abo |
| `/veranstaltungen/silos-aufbrechen-2026` | Oeffentlich | Archiv: Programm, Vortraege, Workshop-Tische |
| `/veranstaltungen/10-jahre-ifb` | Oeffentlich | Fest "10 Jahre IfB": Phasen, Countdown, Programm, Anmeldung |
| `/intern/10-jahre-ifb` | HAW-intern | Gaeste (VIP/Alumni/normal), Referent:innen und Abschlussarbeiten sammeln |
| `/orga/ifb-fest` | Orga | Gaesteliste IfB-Fest: Kennzahlen, Status, CSV-Export |
| `/intern` | Oeffentlich | Uebersicht: aktuelle Veranstaltung + vergangene Veranstaltungen |
| `/intern/silos-aufbrechen-2026` | Teilnehmer | Archiv: Teilnehmerliste, Themengebiete, Forschungscalls |
| `/tisch/:nr` | Teilnehmer | Chat-Etherpad pro Themengebiet (Realtime) |
| `/admin` | Admin | Forschungsmoeglichkeiten: Calls CRUD + Themengebiet-Tags |
| `/orga` | Orga | Teilnehmerverwaltung, Export, Nachmeldungen |
| `/nachmeldung` | Oeffentlich | Nachmeldung nach Anmeldeschluss |

## Features

- **Zweisprachigkeit (DE/EN):** Landingpage, Navigation, Veranstaltungsuebersicht. Sprachumschalter im Header, Praeferenz in localStorage.
- **Veranstaltungskalender:** Filter nach Kategorie (intern/extern) und Zielgruppe (alle/HAW). Automatische Aufteilung in kommende und vergangene Events. ICS-Download pro Event, Kalender-Abo unter `/calendar.ics`. Eventdaten zentral in `web/src/data/events.ts`.
- **Event-Archiv:** Vergangene Veranstaltungen als statische Archivseiten, erweiterbar.
- **Chat-Etherpad:** Pro Themengebiet ein Chat-artiges Pad mit Eintraegen (Name + Zeitstempel). Realtime via Supabase.
- **Temporaere CTAs:** Konfigurierbar in `config.ts` mit Ablaufdatum -- verschwinden automatisch.
- **IfB-Fest-Portal:** Event-Seite fuer "10 Jahre Institut fuer Bauwesen" (21./22. Oktober 2027) mit Phasen-Zeitstrahl, Countdown bis zur Veranstaltung und bis zum Ende der laufenden Phase. Die Anmeldung ist phasenabhaengig: erst nur `@haw-kiel.de` (mit Magic Link und Moderator:innen-Status), ab 1. Maerz 2027 fuer alle. Alle Fakten zentral in `web/src/lib/ifbFest.ts`.
- **E-Mail-Import:** `node web/scripts/read-msg.mjs <datei.msg>` liest Outlook-Mails (inkl. Anhaenge) ohne Outlook -- Basis fuer den Workflow "Veranstaltungen updaten".

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
- [ ] Migration 030 (eine Mail pro Anmeldung) im Supabase-Dashboard ausfuehren
- [ ] Migration 031 (Gaestetypen, Referent:innen) im Supabase-Dashboard ausfuehren
- [ ] BEIDE Auth-Vorlagen in Supabase unter Authentication > Emails einfuegen:
      `email-templates/confirm-signup.html` -> "Confirm signup" (Erstanmeldung!)
      `email-templates/magic-link.html`     -> "Magic Link" (bestehende Accounts)
- [ ] IfB-Fest: Veranstaltungsort bestaetigen (aktuell Sokratesplatz 1 angenommen)
- [ ] IfB-Fest: Programmzeiten sind ein Entwurf -- mit dem Institut abstimmen

---

## Wichtige Hinweise

- **Branch:** `master` (nicht main!)
- **Supabase Projekt-ID:** `cbybfmnbojklqbkmuwto`
- **CD Manual:** `Archiv/cd_manual_haw_screen.pdf`
- **Personenbezogene Daten:** Migrationen/Scripts mit TN-Daten liegen nur lokal (gitignored). Nie committen!
