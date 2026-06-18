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

## Workflow: Veranstaltungen ergänzen

### 1. Ordner scannen

Prüfe `Veranstaltungen/` auf neue `.msg`- oder `.pdf`-Dateien.

### 2. Dateinamen mit events.ts abgleichen

Vergleiche die Dateien mit den bestehenden Events in `web/src/data/events.ts`.

### 3. Prefix-Konventionen beachten

| Prefix | Bedeutung |
|--------|-----------|
| `Extern-` | Externe Veranstaltung → `category: 'extern'` |
| `Intern-` | Interne Veranstaltung → `category: 'intern'` |
| `IfB_Infokurs_` | **Nur E-Mail-Quelle!** Kein Titel-/Veranstalter-Bestandteil. |
| Kein Prefix | Kategorie aus Kontext ableiten oder nachfragen |

### 4. Fehlende Informationen abfragen

Per `AskUserQuestion` beim User erfragen:
- Datum und Uhrzeit (Start/Ende)
- Ort
- URL (falls vorhanden)
- Veranstalter
- Kategorie (`intern`/`extern`)
- Zielgruppe (`alle`/`haw`)
- EN-Übersetzungen (Titel, Beschreibung, Veranstalter falls abweichend)

### 5. In events.ts eintragen

Events **chronologisch sortiert** in `web/src/data/events.ts` einfügen.

### 6. Build, Commit, Push

```bash
cd web && npm run build   # Prüfen, ob alles kompiliert
git add web/src/data/events.ts
git commit -m "Veranstaltung(en) ergänzt: <Titel>"
git push
```
