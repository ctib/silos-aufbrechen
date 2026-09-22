// ============================================================
// 10 Jahre Institut für Bauwesen – zentrale Konfiguration
// ============================================================
// Alle Fakten zum Fest stehen NUR hier. Event-Seite, Anmeldeformular,
// Phasen-Zeitstrahl, Kalendereintrag und der interne Bereich lesen
// aus dieser Datei.
//
// Do 21.10.2027  Konferenztag – Vorträge der Professor:innen des IfB
// Fr 22.10.2027  vormittags Vorträge, ab dem frühen Nachmittag Festakt
// ============================================================

/** Donnerstag, 21. Oktober 2027 – Beginn Konferenztag */
export const FEST_START = '2027-10-21T09:30:00+02:00';
/** Freitag, 22. Oktober 2027 – Ausklang nach dem Festakt */
export const FEST_END = '2027-10-22T22:00:00+02:00';

/** PLATZHALTER – Veranstaltungsort noch bestätigen */
export const FEST_LOCATION = 'HAW Kiel, Sokratesplatz 1, 24149 Kiel';
export const FEST_LOCATION_URL =
  'https://www.openstreetmap.org/#map=19/54.333591/10.181461';

export const FEST_MAX_COMPANIONS = 3;
export const FEST_CONTACT_EMAIL = 'christoph.goebel@haw-kiel.de';

/**
 * In Phase 1 dürfen sich nur Hochschulangehörige mit dieser Mail-Domain
 * anmelden. Sie erhalten einen Zugangslink und Moderator:innen-Status
 * für den internen Fest-Bereich.
 */
export const INTERNAL_EMAIL_DOMAIN = 'haw-kiel.de';

export function isInternalEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(`@${INTERNAL_EMAIL_DOMAIN}`);
}

// ------------------------------------------------------------
// Phasen – Zeitstrahl auf der Fest-Seite
// ------------------------------------------------------------
// Eine Phase läuft bis zum Start der nächsten; die letzte bis FEST_END.

export interface FestPhase {
  id: 'intern' | 'extern' | 'programm' | 'durchfuehrung';
  label: string;
  /** Kurzform für schmale Bildschirme */
  short: string;
  start: string;
  description: string;
}

export const FEST_PHASES: FestPhase[] = [
  {
    id: 'intern',
    label: 'Anmeldung intern',
    short: 'Intern',
    start: '2026-09-17T00:00:00+02:00',
    description:
      'Hochschulangehörige melden sich an, bringen Gäste, Vortragsthemen und Vorschläge für die Ehrung ein.',
  },
  {
    id: 'extern',
    label: 'Anmeldung extern',
    short: 'Extern',
    start: '2027-03-01T00:00:00+01:00',
    description:
      'Die Anmeldung öffnet für alle: Ehemalige, Partner aus der Praxis, Politik und Stadtgesellschaft.',
  },
  {
    id: 'programm',
    label: 'Anmeldeschluss & Programm',
    short: 'Programm',
    start: '2027-09-21T00:00:00+02:00',
    description:
      'Die Anmeldung schließt, das finale Programm mit allen Vorträgen und Ehrungen wird bekannt gegeben.',
  },
  {
    id: 'durchfuehrung',
    label: 'Veranstaltung',
    short: 'Fest',
    start: FEST_START,
    description: 'Zwei Tage Institut für Bauwesen – Konferenz, Festakt und Feier.',
  },
];

export type FestPhaseId = FestPhase['id'];

/** Ende einer Phase = Start der nächsten (letzte Phase endet mit dem Fest). */
export function phaseEnd(phaseId: FestPhaseId): Date {
  const i = FEST_PHASES.findIndex((p) => p.id === phaseId);
  const next = FEST_PHASES[i + 1];
  return next ? new Date(next.start) : new Date(FEST_END);
}

export function currentPhase(now: Date = new Date()): FestPhase {
  // Rückwärts suchen: die letzte Phase, die bereits begonnen hat.
  for (let i = FEST_PHASES.length - 1; i >= 0; i--) {
    if (now >= new Date(FEST_PHASES[i].start)) return FEST_PHASES[i];
  }
  return FEST_PHASES[0];
}

/** Anmeldeschluss = Start von Phase 3 */
export const regDeadlineDate = () => new Date(FEST_PHASES[2].start);

export function registrationOpen(now: Date = new Date()): boolean {
  const phase = currentPhase(now).id;
  return phase === 'intern' || phase === 'extern';
}

export function festIsOver(now: Date = new Date()): boolean {
  return now > new Date(FEST_END);
}

// ------------------------------------------------------------
// Programm
// ------------------------------------------------------------
// ENTWURF – Zeiten und Reihenfolge sind ein erster Vorschlag.
// Punkte mit `tbd: true` sind inhaltlich noch offen.

export interface FestProgramItem {
  time: string;
  title: string;
  description?: string;
  highlight?: boolean;
  /** Detail steht noch nicht fest – wird auf der Seite markiert */
  tbd?: boolean;
  /**
   * Unterpunkte. Ein Eintrag mit `items` wird als zusammenhängender Block
   * dargestellt: eigener Rahmen, Kopfzeile, eingerückte Unterpunkte.
   */
  items?: FestProgramItem[];
}

export interface FestDay {
  id: string;
  date: string;
  label: string;
  subtitle: string;
  items: FestProgramItem[];
}

export const FEST_DAYS: FestDay[] = [
  {
    id: 'tag1',
    date: '2027-10-21',
    label: 'Donnerstag, 21. Oktober 2027',
    subtitle: 'Konferenztag – Forschung und Lehre am Institut für Bauwesen',
    items: [
      { time: '09:30', title: 'Empfang und Registrierung' },
      { time: '10:00', title: 'Eröffnung des Konferenztages' },
      {
        time: '10:30 – 12:30',
        title: 'Vortragsblock I',
        highlight: true,
        items: [
          { time: '10:30 – 11:15', title: 'Keynote', tbd: true },
          { time: '11:15 – 12:30', title: 'Vorträge' },
        ],
      },
      { time: '12:30', title: 'Mittagspause' },
      { time: '14:00', title: 'Vortragsblock II', highlight: true },
      { time: '17:00', title: 'Ausklang des Konferenztages', tbd: true },
    ],
  },
  {
    id: 'tag2',
    date: '2027-10-22',
    label: 'Freitag, 22. Oktober 2027',
    subtitle: 'Vorträge am Vormittag, Festakt am Nachmittag',
    items: [
      { time: '09:00', title: 'Vortragsblock III', highlight: true },
      {
        time: '12:00',
        title: 'Gemeinsames Mittagessen',
        description: 'Ort steht noch nicht fest',
        tbd: true,
      },
      {
        time: '14:00 – 17:30',
        title: 'Festakt – 10 Jahre Institut für Bauwesen',
        highlight: true,
        items: [
          {
            time: '14:00 – 14:45',
            title: 'Grußworte aus Politik, Wirtschaft und Gesellschaft',
            description: 'Gäste aus Kiel, Schleswig-Holstein und dem Bund',
          },
          { time: '14:45 – 15:30', title: 'Keynote', tbd: true },
          { time: '15:30 – 16:00', title: 'Pause' },
          {
            time: '16:00 – 16:30',
            title: 'Ehrung der besten Abschlussarbeiten des Jahrzehnts',
            description: 'Ausgezeichnete Arbeiten aus zehn Jahren IfB',
          },
          {
            time: '16:30 – 17:30',
            title: 'Zertifikatsverleihung an die Absolvent:innen',
            description:
              'Der Jahrgang 2027 – erstmals mit Bachelorabsolvent:innen der Architektur',
          },
        ],
      },
      {
        time: '18:00',
        title: 'Empfang und Feier',
        description: 'Mit Studierenden, Ehemaligen und Gästen',
      },
    ],
  },
];

// ------------------------------------------------------------
// Anmeldung: buchbare Programmteile
// ------------------------------------------------------------
// Die `id` landet in der Datenbank und darf sich nach der ersten
// Anmeldung nicht mehr ändern. Labels sind frei änderbar.

export interface BookableOption {
  id: string;
  label: string;
  hint?: string;
}

export const BOOKABLE_OPTIONS: BookableOption[] = [
  { id: 'tag1', label: 'Do., 21.10. – Konferenztag', hint: 'ganztägig' },
  { id: 'tag2-vormittag', label: 'Fr., 22.10. – Vorträge am Vormittag' },
  { id: 'tag2-mittag', label: 'Fr., 22.10. – Gemeinsames Mittagessen', hint: 'Ort offen' },
  { id: 'festakt', label: 'Fr., 22.10. – Festakt', hint: 'ab 14:00' },
  { id: 'empfang', label: 'Fr., 22.10. – Empfang und Feier', hint: 'ab 18:00' },
];

export function bookableLabel(id: string): string {
  return BOOKABLE_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

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
// Formatierung
// ------------------------------------------------------------

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', ...opts });

const DATE_FMT = fmt({ day: '2-digit', month: 'long', year: 'numeric' });
const TIME_FMT = fmt({ hour: '2-digit', minute: '2-digit' });

export const festDateLabel = () => '21. und 22. Oktober 2027';
export const festDateShort = () => '21.–22.10.2027';
export const festTimeLabel = () =>
  `${TIME_FMT.format(new Date(FEST_START))} Uhr bis ${TIME_FMT.format(new Date(FEST_END))} Uhr`;
export const regDeadlineLabel = () => DATE_FMT.format(regDeadlineDate());
export const formatDate = (iso: string) => DATE_FMT.format(new Date(iso));
