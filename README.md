# Silos aufbrechen - Zukunft bauen

Event-Webseite fuer die gemeinsame Antrittsvorlesung und den interdisziplinaeren Workshop
am **7. Mai 2026, 14:30-20:00 Uhr** an der HAW Kiel.

**Live:** [zukunftbauen.org](https://zukunftbauen.org)

---

## Die Veranstaltung

Drei neuberufene Professores der HAW Kiel laden zu einem interdisziplinaeren Workshop ein:

- **Prof. Dr.-Ing. Christoph Goebel** (FB Medien/Bauwesen) -- Antrittsvorlesung
- **Prof. Dr. Meike Wocken** (FB Wirtschaft) -- Impulsvortrag
- **Prof. Dr. Tammo Peters** (FB Agrarwirtschaft) -- Impulsvortrag

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

### Workshop-Tische

1. Nahrungsmittelproduktion in der Stadt: DIY-Kit
2. Umweltbildung: praktisches Wissen fuer Schuelerinnen und Schueler
3. Sensorik plus Datenauswertung: Mehrwert der smarten City
4. Gerechten Staedtebau foerdern: nachhaltige Stadtentwicklung
5. Gebaeudetechnik aufwerten: Stand der Technik im Gebaeudebestand
6. Freies Thema: Eigenes Thema mitbringen

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
| `/` | Oeffentlich | Startseite, Programm, Workshop-Themen, Countdown |
| `/intern` | Teilnehmer | Veranstaltungsbereich: Anmeldung, Teilnehmerliste, Workshoptische, Forschungscalls (Akkordeon) |
| `/tisch/:nr` | Teilnehmer | Etherpad pro Tisch (Realtime, 5 Abschnitte) |
| `/admin` | Admin | Forschungsmoeglichkeiten: Calls CRUD + Tisch-Tags |
| `/orga` | Orga | Teilnehmerverwaltung, Export, Nachmeldungen |
| `/nachmeldung` | Oeffentlich | Nachmeldung nach Anmeldeschluss |

---

## Dokumentation

| Dokument | Inhalt |
|----------|--------|
| [Docs/architecture.md](Docs/architecture.md) | Technische Architektur, DB-Schema, Ordnerstruktur, Rollenmodell |
| [Docs/design-system.md](Docs/design-system.md) | HAW-Farben, Schriften, Gestaltungsprinzipien |
| [Docs/domain-setup.md](Docs/domain-setup.md) | Domain-Setup: Cloudflare, GitHub Pages, Supabase, Resend |
| [ToDos.txt](ToDos.txt) | Erledigte und offene Aufgaben |

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

- [ ] PDF-Export der Tisch-Protokolle (erst kurz vor/nach Veranstaltung)
- [ ] Magic Link Emails an HAW-Adressen: HAW IT bitten, zukunftbauen.org zu whitelisten

---

## Wichtige Hinweise

- **Branch:** `master` (nicht main!)
- **ToDos.txt pflegen:** Nach jeder erledigten Aufgabe mit `[x]` abhaken
- **Supabase Projekt-ID:** `cbybfmnbojklqbkmuwto`
- **CD Manual:** `Archiv/cd_manual_haw_screen.pdf`
- **Personenbezogene Daten:** Migrationen/Scripts mit TN-Daten liegen nur lokal (gitignored). Nie committen!
- **DMARC Reports:** Lokal in `web/DMARC/` ablegen (gitignored), gelegentlich pruefen
