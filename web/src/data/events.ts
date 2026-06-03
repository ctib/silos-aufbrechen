export type EventCategory = 'intern' | 'extern';
export type EventAudience = 'alle' | 'haw';

export interface CalendarEvent {
  id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
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
      'Infokurs des Vereins für Baukultur: „Holz trägt Baukultur" in Molfsee.',
    description_en:
      'Information course by the Association for Building Culture: "Wood Carries Building Culture" in Molfsee.',
    start: '2026-06-10T09:00:00+02:00',
    end: '2026-06-10T17:00:00+02:00',
    location: 'Molfsee',
    category: 'extern',
    audience: 'alle',
  },
];
