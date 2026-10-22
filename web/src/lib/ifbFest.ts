// ============================================================
// 10 Jahre Institut für Bauwesen – zentrale Konfiguration
// ============================================================
// Alle Fakten zum Fest stehen NUR hier. Event-Seite, Anmeldeformular,
// Phasen-Zeitstrahl, Kalendereintrag und der interne Bereich lesen
// aus dieser Datei.
//
// „Parade des Bauwesen“ – in der 1. Woche der 37. Interdisziplinären
// Wochen (IDW) der HAW Kiel:
//
// Do 28.10.2027  Rundgang durch die IDW-Ergebnisse, Podiumsdiskussion
// Fr 29.10.2027  Seefischmarkt, Dampferfahrt, Festakt im Rathaus, Fête
// ============================================================

/** Donnerstag, 28. Oktober 2027 */
export const FEST_START = '2027-10-28T14:00:00+02:00';
/** Freitag, 29. Oktober 2027 – Ausklang nach der Fête */
export const FEST_END = '2027-10-29T23:59:00+02:00';

/**
 * Das Fest wandert über mehrere Orte. FEST_LOCATION ist die Kurzform für
 * Banner, Kalendereintrag und Übersicht; die Stationen stehen in
 * FEST_VENUES und erscheinen im Programm an den einzelnen Blöcken.
 */
export const FEST_LOCATION = 'Seefischmarkt, MS Stadt Kiel und Kieler Rathaus';
export const FEST_LOCATION_URL =
  'https://www.openstreetmap.org/#map=14/54.3340/10.1600';

export interface FestVenue {
  name: string;
  address: string;
  url?: string;
}

export const FEST_VENUES: FestVenue[] = [
  {
    name: 'Seefischmarkt',
    address: 'Wischhofstraße 1–3, 24148 Kiel',
    url: 'https://www.openstreetmap.org/#map=17/54.3303/10.1707',
  },
  {
    name: 'MS Stadt Kiel',
    address: 'Überfahrt vom Seefischmarkt zum Anleger Seegarten',
    url: 'https://www.openstreetmap.org/#map=16/54.3220/10.1430',
  },
  {
    name: 'Ratssaal im Kieler Rathaus',
    address: 'Fleethörn 9, 24103 Kiel',
    url: 'https://www.openstreetmap.org/#map=18/54.3217/10.1348',
  },
  {
    name: 'Die Pumpe',
    address: 'Haßstraße 22, 24103 Kiel',
    url: 'https://www.openstreetmap.org/#map=18/54.3263/10.1366',
  },
];

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
    // Ein Monat vor der Veranstaltung
    start: '2027-09-28T00:00:00+02:00',
    description:
      'Die Anmeldung schließt, das finale Programm mit allen Beiträgen und Ehrungen wird bekannt gegeben.',
  },
  {
    id: 'durchfuehrung',
    label: 'Veranstaltung',
    short: 'Fest',
    start: FEST_START,
    description:
      'Zwei Tage Institut für Bauwesen – vom Seefischmarkt über die Förde bis ins Rathaus.',
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
    date: '2027-10-28',
    label: 'Donnerstag, 28. Oktober 2027',
    subtitle: 'Die Ergebnisse der Interdisziplinären Wochen am Seefischmarkt',
    items: [
      {
        time: 'vormittags',
        title: 'Vernissagen und Finissagen',
        description: 'Ausstellungen rund um den Seefischmarkt',
        tbd: true,
      },
      {
        time: 'nachmittags',
        title: '„Rundgang“ – Vorstellung der IDW-Ergebnisse',
        description:
          'Stegreife, Projekt- und Abschlussarbeiten mit umsetzbaren Interventionen, Ideen und Konzepten',
        highlight: true,
        tbd: true,
      },
      {
        time: 'abends',
        title: 'Podiumsdiskussion: Stadtentwicklung Seefischmarkt',
        highlight: true,
        tbd: true,
      },
    ],
  },
  {
    id: 'tag2',
    date: '2027-10-29',
    label: 'Freitag, 29. Oktober 2027',
    subtitle: 'Vom Seefischmarkt über die Förde ins Rathaus',
    items: [
      {
        time: '08:00 – 10:00',
        title: 'Gemeinsames „Jeder-bringt-was-mit-Buffet“',
        description: 'Institutsintern, am Seefischmarkt',
      },
      {
        time: '10:00 – 13:00',
        title: 'Open Seefischmarkt',
        highlight: true,
        items: [
          { time: 'ab 10:00', title: 'Empfang der Gäste' },
          { time: 'ab 10:30', title: 'Thematische Rundgänge' },
          { time: 'durchgehend', title: 'Open Labs und Workshops' },
          { time: 'durchgehend', title: 'Projekt- und Stegreifpräsentationen' },
          { time: 'durchgehend', title: 'Ausstellungen und IDW-Ergebnisse' },
        ],
      },
      {
        time: '13:00 – 15:00',
        title: 'Dampferfahrt mit der MS Stadt Kiel',
        description:
          'Vom Seefischmarkt zum Anleger Seegarten, mit Buffet und Mittagssnack für IfB und Gäste',
        highlight: true,
      },
      {
        time: '16:00 – 18:00',
        title: 'Offizielle Feierlichkeiten – 10 Jahre Institut für Bauwesen',
        description: 'Ratssaal im Kieler Rathaus',
        highlight: true,
        items: [
          { time: '16:00', title: 'Feierliche Eröffnung und Reden' },
          { time: '16:45', title: 'Keynote', description: 'Gast von außerhalb', tbd: true },
          {
            time: '17:00',
            title: 'Best Bachelor Awards',
            description: 'Ehrung der besten Abschlussarbeiten',
          },
          {
            time: '17:30',
            title: 'Graduation – Zertifikatsverleihung an alle',
            description:
              'Der Jahrgang 2027 – erstmals mit Bachelorabsolvent:innen der Architektur',
          },
        ],
      },
      {
        time: '18:00 – 20:00',
        title: 'Posterpräsentationen der Bachelorarbeiten',
        description: 'Mit Häppchen und Getränken im Ratssaal und davor',
      },
      {
        time: 'ab 21:00',
        title: 'IfB-Fête der Fachschaft',
        description: 'In der Pumpe, Haßstraße 22',
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
  { id: 'do-rundgang', label: 'Do., 28.10. – Rundgang durch die IDW-Ergebnisse' },
  { id: 'do-podium', label: 'Do., 28.10. – Podiumsdiskussion Stadtentwicklung SFM' },
  { id: 'fr-seefischmarkt', label: 'Fr., 29.10. – Open Seefischmarkt', hint: '10:00 – 13:00' },
  { id: 'fr-dampfer', label: 'Fr., 29.10. – Dampferfahrt MS Stadt Kiel', hint: '13:00 – 15:00' },
  { id: 'fr-festakt', label: 'Fr., 29.10. – Offizielle Feierlichkeiten im Rathaus', hint: '16:00 – 18:00' },
  { id: 'fr-poster', label: 'Fr., 29.10. – Posterpräsentationen', hint: '18:00 – 20:00' },
  { id: 'fr-fete', label: 'Fr., 29.10. – IfB-Fête in der Pumpe', hint: 'ab 21:00' },
];

/**
 * Programmteile aus früheren Planungsständen. Sie stehen noch in
 * Anmeldungen, die vor der Programmänderung eingegangen sind – damit die
 * Orga-Liste und der CSV-Export sie lesbar anzeigen statt der rohen id.
 * Nicht mehr buchbar, deshalb getrennt von BOOKABLE_OPTIONS.
 */
const RETIRED_BOOKABLE_LABELS: Record<string, string> = {
  tag1: 'Do., 21.10. – Konferenztag (alte Planung)',
  'tag2-vormittag': 'Fr., 22.10. – Vorträge am Vormittag (alte Planung)',
  'tag2-mittag': 'Fr., 22.10. – Gemeinsames Mittagessen (alte Planung)',
  festakt: 'Fr., 22.10. – Festakt (alte Planung)',
  empfang: 'Fr., 22.10. – Empfang und Feier (alte Planung)',
};

export function bookableLabel(id: string): string {
  return (
    BOOKABLE_OPTIONS.find((o) => o.id === id)?.label ?? RETIRED_BOOKABLE_LABELS[id] ?? id
  );
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

export const festDateLabel = () => '28. und 29. Oktober 2027';
export const festDateShort = () => '28.–29.10.2027';
export const festTimeLabel = () =>
  `${TIME_FMT.format(new Date(FEST_START))} Uhr bis ${TIME_FMT.format(new Date(FEST_END))} Uhr`;
export const regDeadlineLabel = () => DATE_FMT.format(regDeadlineDate());
export const formatDate = (iso: string) => DATE_FMT.format(new Date(iso));
