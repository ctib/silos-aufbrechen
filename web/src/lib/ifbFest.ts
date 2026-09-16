// ============================================================
// 10 Jahre Institut für Bauwesen – zentrale Konfiguration
// ============================================================
// Alle Fakten zum Fest stehen NUR hier. Seite, Formular, Kalender-
// eintrag und Orga-Ansicht lesen aus dieser Datei.
//
// >>> TODO: Die mit PLATZHALTER markierten Werte müssen noch
// >>> durch die echten Daten ersetzt werden.
// ============================================================

/** PLATZHALTER – echtes Datum/Uhrzeit eintragen (ISO 8601 mit Zeitzone) */
export const FEST_START = '2027-05-07T15:00:00+02:00';
/** PLATZHALTER – echtes Ende eintragen */
export const FEST_END = '2027-05-07T22:00:00+02:00';

/** Anmeldeschluss – danach zeigt das Formular einen Hinweis statt der Felder */
export const FEST_REG_DEADLINE = '2027-04-23T23:59:59+02:00';

/** PLATZHALTER – Veranstaltungsort */
export const FEST_LOCATION = 'HAW Kiel, Sokratesplatz 1, 24149 Kiel';
export const FEST_LOCATION_URL =
  'https://www.openstreetmap.org/#map=19/54.333591/10.181461';

/** Maximale Gästezahl. `null` = keine Begrenzung / Kontingent wird nicht angezeigt. */
export const FEST_CAPACITY: number | null = null;

/** Maximale Anzahl Begleitpersonen pro Anmeldung */
export const FEST_MAX_COMPANIONS = 3;

export const FEST_CONTACT_EMAIL = 'christoph.goebel@haw-kiel.de';

// ------------------------------------------------------------
// Programmteile – erscheinen als Checkboxen im Anmeldeformular
// UND als Programmübersicht auf der Seite.
// `id` wandert in die Datenbank und darf sich später nicht mehr
// ändern; `time`/`title` sind frei editierbar.
// ------------------------------------------------------------

export interface FestProgramItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  location?: string;
  /** true = im Anmeldeformular auswählbar (Orga braucht die Zahl) */
  bookable: boolean;
  /** true = optisch hervorgehoben im Programm */
  highlight?: boolean;
}

/** PLATZHALTER – Programm mit den echten Punkten und Zeiten ersetzen */
export const FEST_PROGRAM: FestProgramItem[] = [
  {
    id: 'empfang',
    time: '15:00',
    title: 'Empfang',
    description: 'Ankommen bei Kaffee und Kuchen',
    bookable: true,
  },
  {
    id: 'festakt',
    time: '16:00',
    title: 'Festakt – 10 Jahre Institut für Bauwesen',
    description: 'Grußworte, Rückblick und Ausblick',
    bookable: true,
    highlight: true,
  },
  {
    id: 'fuehrung',
    time: '18:00',
    title: 'Führung durch die Labore',
    description: 'Rundgang durch die Labore des Instituts',
    bookable: true,
  },
  {
    id: 'abendempfang',
    time: '19:00',
    title: 'Abendempfang',
    description: 'Buffet, Musik und Gespräche',
    bookable: true,
    highlight: true,
  },
];

export const BOOKABLE_PROGRAM = FEST_PROGRAM.filter((p) => p.bookable);

// ------------------------------------------------------------
// Verpflegung
// ------------------------------------------------------------

export const MEAL_OPTIONS = [
  { id: 'egal', label: 'Keine Einschränkung' },
  { id: 'vegetarisch', label: 'Vegetarisch' },
  { id: 'vegan', label: 'Vegan' },
] as const;

export type MealPreference = (typeof MEAL_OPTIONS)[number]['id'];

// ------------------------------------------------------------
// Abgeleitete Helfer
// ------------------------------------------------------------

export const festStartDate = () => new Date(FEST_START);
export const festEndDate = () => new Date(FEST_END);
export const regDeadlineDate = () => new Date(FEST_REG_DEADLINE);

export function registrationOpen(now: Date = new Date()): boolean {
  return now <= regDeadlineDate();
}

export function festIsOver(now: Date = new Date()): boolean {
  return now > festEndDate();
}

const DATE_FMT = new Intl.DateTimeFormat('de-DE', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Berlin',
});

const TIME_FMT = new Intl.DateTimeFormat('de-DE', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Berlin',
});

export const festDateLabel = () => DATE_FMT.format(festStartDate());
export const festTimeLabel = () =>
  `${TIME_FMT.format(festStartDate())} – ${TIME_FMT.format(festEndDate())} Uhr`;
export const regDeadlineLabel = () =>
  new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Berlin',
  }).format(regDeadlineDate());
