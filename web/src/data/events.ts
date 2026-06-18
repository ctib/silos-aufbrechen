export type EventCategory = 'intern' | 'extern';
export type EventAudience = 'alle' | 'haw';

export interface CalendarEvent {
  id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  organizer?: string;
  organizer_en?: string;
  start: string; // ISO 8601
  end: string;
  location?: string;
  url?: string;
  category: EventCategory;
  audience: EventAudience;
  archivePath?: string;
}

export const events: CalendarEvent[] = [
  {
    id: 'silos-aufbrechen-2026',
    title: 'Silos aufbrechen – Zukunft bauen',
    title_en: 'Breaking Down Silos – Building the Future',
    description:
      'Interdisziplinärer Workshop mit Impulsen von Prof. Dr. Meike Wocken und Prof. Dr. Tammo Peters sowie Antrittsvorlesung von Prof. Dr.-Ing. Christoph Göbel.',
    description_en:
      'Interdisciplinary workshop with talks by Prof. Dr. Meike Wocken and Prof. Dr. Tammo Peters, and inaugural lecture by Prof. Dr.-Ing. Christoph Göbel.',
    organizer: 'HAW Kiel',
    start: '2026-05-07T09:00:00+02:00',
    end: '2026-05-07T17:00:00+02:00',
    location: 'HAW Kiel, Sokratesplatz 1',
    category: 'intern',
    audience: 'alle',
    archivePath: '/veranstaltungen/silos-aufbrechen-2026',
  },
  {
    id: 'gastvortrag-exkursion-ifb-2026',
    title: 'Gastvortrag und Exkursion IfB',
    title_en: 'Guest Lecture and Excursion IfB',
    description:
      'Gastvortrag und Exkursion am Institut für Baubetrieb (IfB) im Rahmen des SoSe 2026.',
    description_en:
      'Guest lecture and excursion at the Institute for Construction Management (IfB) during summer semester 2026.',
    organizer: 'IfB, HAW Kiel',
    start: '2026-06-04T09:00:00+02:00',
    end: '2026-06-04T17:00:00+02:00',
    location: 'HAW Kiel',
    category: 'intern',
    audience: 'haw',
  },
  {
    id: 'holz-traegt-baukultur-molfsee-2026',
    title: 'Holz trägt Baukultur',
    title_en: 'Wood Carries Building Culture',
    description:
      'Veranstaltung des Vereins für Baukultur: „Holz trägt Baukultur" in Molfsee.',
    description_en:
      'Event by the Association for Building Culture: "Wood Carries Building Culture" in Molfsee.',
    organizer: 'Verein für Baukultur',
    organizer_en: 'Association for Building Culture',
    start: '2026-06-10T09:00:00+02:00',
    end: '2026-06-10T17:00:00+02:00',
    location: 'Molfsee',
    category: 'extern',
    audience: 'alle',
  },
  {
    id: 'get-together-ende-vorlesungszeit-2026',
    title: 'Get Together – Ende der Vorlesungszeit',
    title_en: 'Get Together – End of Lecture Period',
    description:
      'Gemeinsames Get Together zum Ende der Vorlesungszeit im SoSe 2026.',
    description_en:
      'Joint get-together at the end of the lecture period in summer semester 2026.',
    organizer: 'IfB, HAW Kiel',
    start: '2026-06-19T13:00:00+02:00',
    end: '2026-06-19T17:00:00+02:00',
    location: 'HAW Kiel',
    category: 'intern',
    audience: 'haw',
  },
  {
    id: 'sommerfest-kitz2-eroeffnung-2026',
    title: 'Sommerfest und KITZ²-Eröffnung',
    title_en: 'Summer Festival and KITZ² Opening',
    description:
      'Sommerfest auf dem Kieler Seefischmarkt mit Eröffnung des KITZ².',
    description_en:
      'Summer festival at the Kiel fish market with the opening of KITZ².',
    organizer: 'HAW Kiel',
    start: '2026-07-01T15:00:00+02:00',
    end: '2026-07-01T22:00:00+02:00',
    location: 'Kieler Seefischmarkt',
    category: 'intern',
    audience: 'alle',
  },
  {
    id: 'architects-collective-award-2026',
    title: 'Architects Collective Student Award for Healthcare Architecture',
    description:
      'Studentenwettbewerb für Gesundheitsarchitektur. Einreichfrist: 14. August 2026. Preisverleihung am 12. November 2026 in Wien.',
    description_en:
      'Student competition for healthcare architecture. Submission deadline: August 14, 2026. Award ceremony on November 12, 2026 in Vienna.',
    organizer: 'Architects Collective',
    start: '2026-08-14T23:59:00+02:00',
    end: '2026-08-14T23:59:00+02:00',
    location: 'Online (Einreichung) / Wien (Preisverleihung)',
    url: 'https://award26.ac.co.at/',
    category: 'extern',
    audience: 'alle',
  },
  {
    id: 'conbau-nord-2026',
    title: 'CONBAU Nord 2026',
    description:
      'Baukongress für den Wohnungsbau im Wandel: Wärmewende, Demografie und Normen. 13 Fachsessions, World Cafés und Networking.',
    description_en:
      'Construction congress on housing transformation: heat transition, demographics, and standards. 13 sessions, World Cafés, and networking.',
    organizer: 'CONBAU Nord',
    start: '2026-09-09T09:00:00+02:00',
    end: '2026-09-10T17:00:00+02:00',
    location: 'Holstenhallen Congress Center, Neumünster',
    url: 'https://conbau-nord.de/de/',
    category: 'extern',
    audience: 'alle',
  },
  {
    id: 'waermepumpen-fachforum-lollar-2026',
    title: 'Wärmepumpen-Fachforum Lollar',
    title_en: 'Heat Pump Expert Forum Lollar',
    description:
      'Buderus Wärmepumpen-Fachforum für Lehrkräfte und Wissensvermittler an Berufsbildungsstätten.',
    description_en:
      'Buderus heat pump expert forum for instructors and educators at vocational training centres.',
    organizer: 'Buderus Deutschland',
    start: '2026-11-12T09:00:00+01:00',
    end: '2026-11-13T17:00:00+01:00',
    location: 'Buderus Akademie, Lollar',
    category: 'extern',
    audience: 'alle',
  },
  {
    id: 'waermepumpen-fachforum-hamburg-2026',
    title: 'Wärmepumpen-Fachforum Hamburg',
    title_en: 'Heat Pump Expert Forum Hamburg',
    description:
      'Buderus Wärmepumpen-Fachforum für Lehrkräfte und Wissensvermittler an Berufsbildungsstätten.',
    description_en:
      'Buderus heat pump expert forum for instructors and educators at vocational training centres.',
    organizer: 'Buderus Deutschland',
    start: '2026-11-16T09:00:00+01:00',
    end: '2026-11-17T17:00:00+01:00',
    location: 'Regionales Trainingscenter, Hamburg',
    category: 'extern',
    audience: 'alle',
  },
];
