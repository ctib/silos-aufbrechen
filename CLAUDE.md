# Silos aufbrechen – Zukunft bauen

Interdisziplinäre Plattform der HAW Kiel. Statische Website mit Veranstaltungskalender, Archiv und internem Bereich.

## Tech-Stack

- **Framework:** Astro 5 + Svelte 5 (Runes)
- **Styling:** Tailwind CSS 4
- **Sprache:** TypeScript
- **i18n:** Eigener Store (`web/src/lib/i18n.ts`) mit DE/EN
- **Hosting:** Statischer Build (Astro SSG)
- **Backend:** Supabase (Nachmeldungen, interner Bereich)

## Konventionen

- Svelte-5-Runes (`$state`, `$derived`) für neue Komponenten, Svelte-4-Syntax (`$:`) in bestehenden
- Farben: `haw-blau` als Primärfarbe (in Tailwind-Config definiert)
- Serifenlose + Serifen-Schrift (`font-serif` für Überschriften)
- Alle öffentlichen Texte DE + EN
- Interner Bereich bleibt Deutsch

## CalendarEvent-Datenstruktur

```typescript
interface CalendarEvent {
  id: string;              // URL-safe slug
  title: string;           // Deutsch
  title_en?: string;       // Englisch (optional)
  description: string;     // Deutsch
  description_en?: string;
  organizer?: string;      // z.B. 'HAW Kiel', 'Verein für Baukultur'
  organizer_en?: string;   // Nur wenn abweichend vom Deutschen
  start: string;           // ISO 8601 mit Zeitzone
  end: string;
  location?: string;
  url?: string;
  category: 'intern' | 'extern';
  audience: 'alle' | 'haw';
  archivePath?: string;    // Pfad zur Archivseite
}
```

## Workflow: Veranstaltungen updaten

Wenn der User „Veranstaltungen updaten" o.ä. sagt, folge diesem Ablauf:

### 1. Ordner scannen + abgleichen

```bash
ls Veranstaltungen/
```

Dann `web/src/data/events.ts` lesen und prüfen, welche Dateien im Ordner noch keinem Event zugeordnet sind. Dem User die Zuordnung als Tabelle zeigen:

```
Datei                                          → Event in events.ts
──────────────────────────────────────────────────────────────────────
Extern-IfB_Infokurs_Holz_trägt_Baukultur...    → holz-traegt-baukultur-molfsee-2026 ✓
IfB_Infokurs_Get_Together...                   → get-together-ende-vorlesungszeit-2026 ✓
CONBAU_Nord_2026...                            → ✗ NEU – muss angelegt werden
```

### 2. Prefix-Konventionen

| Prefix | Bedeutung |
|--------|-----------|
| `Extern-` | Externe Veranstaltung → `category: 'extern'` |
| `Intern-` | Interne Veranstaltung → `category: 'intern'` |
| `IfB_Infokurs_` | **Nur E-Mail-Quelle!** Kein Titel-/Veranstalter-Bestandteil. Kategorie aus Kontext ableiten. |
| Kein Prefix | Kategorie aus Kontext ableiten oder nachfragen. |

### 3. Informationen sammeln

Für jede neue Veranstaltung Infos aus drei Quellen versuchen:

1. **Dateiname:** Enthält oft Datum, Ort, Titel (Underscores/Punkte als Trennzeichen).
2. **PDF-Dateien im Ordner:** Können direkt gelesen werden → `Read`-Tool verwenden.
3. **Web-Suche:** Bei externen Events (CONBAU, Awards etc.) Veranstalter-Website suchen.

`.msg`-Dateien (Outlook-E-Mails) können **nicht** gelesen werden. Falls nötig, den User bitten, die E-Mail als PDF in `Veranstaltungen/` abzulegen oder die Details per `AskUserQuestion` anzugeben.

**Fehlende Pflichtfelder per `AskUserQuestion` beim User erfragen:**
- Datum und Uhrzeit (Start/Ende, ISO 8601 mit Zeitzone `+02:00` Sommer / `+01:00` Winter)
- Ort
- Veranstalter
- Kategorie (`intern`/`extern`) – falls nicht aus Prefix ableitbar
- Zielgruppe (`alle`/`haw`)

**Optional, falls nicht offensichtlich:**
- URL
- EN-Übersetzungen (Titel, Beschreibung, Veranstalter falls abweichend)

### 4. In events.ts eintragen

Events **chronologisch sortiert** (nach `start`) in `web/src/data/events.ts` einfügen. Alle Felder gemäß CalendarEvent-Interface oben ausfüllen.

### 5. Build + Commit + Push

```bash
cd web && npm run build   # Prüfen, ob alles kompiliert
```

Dann die geänderten Dateien committen und pushen. Commit-Nachricht im Stil:
`Veranstaltung(en) ergänzt: <Titel1>, <Titel2>`
