import { FEST_START, FEST_END, FEST_LOCATION } from '../lib/ifbFest';

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
    id: 'kieler-perspektiven-platz-da-2026',
    title: 'PLATZ DA – Pavillons weiterdenken!',
    title_en: 'MAKE ROOM – Rethinking the Pavilions',
    description:
      'Kieler Perspektiven 2026: Fünf Architekturbüros präsentieren ihre Nutzungskonzepte für die sechs Pavillons am Alten Markt. Moderation: Reiner Nagel, Vorstandsvorsitzender der Bundesstiftung Baukultur. Eintritt frei, Anmeldung erbeten.',
    description_en:
      'Kieler Perspektiven 2026: Five architecture practices present their concepts for the six pavilions at Alter Markt. Moderated by Reiner Nagel, chairman of the German Federal Foundation of Baukultur. Free admission, registration requested.',
    organizer: 'Landeshauptstadt Kiel',
    organizer_en: 'City of Kiel',
    start: '2026-09-22T19:00:00+02:00',
    end: '2026-09-22T21:00:00+02:00',
    location: 'Rathaus Kiel, Ratssaal, Fleethörn 9, 24103 Kiel',
    url: 'https://www.kiel.de/kielerperspektiven',
    category: 'extern',
    audience: 'alle',
  },
  {
    id: 'vlr-kiel-nachhaltige-stadt-2026',
    title: 'Kiel auf dem Weg zur nachhaltigen Stadt',
    title_en: 'Kiel on the Path to a Sustainable City',
    description:
      'Vorstellung des 3. Kieler Voluntary Local Review zur Umsetzung der UN-Nachhaltigkeitsziele. Keynote von Prof. Dr. Christian Berg: „Städte als Treiber der sozial-ökologischen Transformation", anschließend Podiumsdiskussion. Einlass ab 17:30 Uhr, ab 20 Uhr Empfang.',
    description_en:
      'Presentation of Kiel’s 3rd Voluntary Local Review on implementing the UN Sustainable Development Goals. Keynote by Prof. Dr. Christian Berg: "Cities as Drivers of Socio-Ecological Transformation", followed by a panel discussion. Doors open 5:30 pm, reception from 8 pm.',
    organizer: 'Landeshauptstadt Kiel, Büro der Stadtpräsidentin',
    organizer_en: 'City of Kiel, Office of the City Council President',
    start: '2026-09-24T18:00:00+02:00',
    end: '2026-09-24T21:00:00+02:00',
    location: 'Rathaus Kiel, Ratssaal, Fleethörn 9, 24103 Kiel',
    url: 'https://eveeno.com/148482015',
    category: 'extern',
    audience: 'alle',
  },
  {
    id: 'innovationstag-bauen-der-zukunft-hamburg-2026',
    title: 'Innovationstag „Bauen der Zukunft"',
    title_en: 'Innovation Day "Building the Future"',
    description:
      'Planung, Bauunternehmen, Bauaufsicht, Feuerwehr, Industrie und Wissenschaft an einem Tisch: Vorträge zu Gebäudetyp E, Brandschutz und Heißbemessung, CO₂-reduziertem Beton, Bauen mit Holz und Erde, KlimaEngineering, PV und Speicher sowie Healing Architecture. Experten- und Positionsgespräch am Nachmittag, moderiert von Markus Lanz. Für Angehörige der HAW Kiel steht ein begrenztes Kontingent an Freikarten zur Verfügung – Gutscheincode über das Institut für Bauwesen. Die Teilnahme ist privat und keine Veranstaltung der Hochschule.',
    description_en:
      'Planners, contractors, building authorities, fire services, industry and academia at one table: talks on building type E, fire safety, low-carbon concrete, timber and earth construction, climate engineering, PV and storage, and healing architecture. Afternoon panel moderated by Markus Lanz. A limited number of free tickets is available for HAW Kiel members via the Institute of Civil Engineering. Attendance is private and not a university event.',
    organizer: 'Bauen der Zukunft',
    start: '2026-09-25T08:00:00+02:00',
    end: '2026-09-25T18:00:00+02:00',
    location: 'Gleishalle Oberhafen, Hamburg',
    url: 'https://www.bauenderzukunft.com/events-2026-bauen-der-zukunft-konferenzen/?event_id=5459700a65b14b819b05a8563d784aac',
    category: 'extern',
    audience: 'alle',
  },
  {
    id: 'hackathon-lebenstraum-niederung-2026',
    title: 'Hackathon „Lebens(t)raum Niederung"',
    title_en: 'Hackathon "Lebens(t)raum Niederung"',
    description:
      'Drei Tage entwickeln Studierende aus ganz Deutschland in interdisziplinären Teams Zukunftsideen für die Eider-Treene-Sorge-Region. Drei Challenges zu Nutztierhaltung, Dorfentwicklung und Smart Region, begleitet von Exkursionen und Fachleuten aus Verwaltung und Praxis. Richtet sich besonders an Bauingenieurwesen, Vermessung, Informatik, Agrarwissenschaft und Geographie. Teilnahme, Unterkunft und Verpflegung kostenfrei; Anmeldung bis 9. Oktober 2026, Plätze begrenzt.',
    description_en:
      'Over three days, students from across Germany develop ideas for the future of the Eider-Treene-Sorge region in interdisciplinary teams. Three challenges on livestock farming, village development and smart regions, accompanied by field trips and experts from public administration and practice. Aimed at civil engineering, surveying, computer science, agricultural science and geography. Participation, accommodation and meals are free; registration until 9 October 2026, places limited.',
    organizer: 'Landesamt für Landwirtschaft und nachhaltige Landentwicklung Schleswig-Holstein',
    organizer_en: 'State Office for Agriculture and Sustainable Rural Development Schleswig-Holstein',
    start: '2026-11-06T09:00:00+01:00',
    end: '2026-11-08T17:00:00+01:00',
    location: 'Stapel, Eider-Treene-Sorge-Region',
    url: 'https://www.leonie-sh.de/u6i7',
    category: 'extern',
    audience: 'alle',
  },
  {
    id: 'gender-ki-inclusive-language-2026',
    title: 'Gender und KI: Intersections of Gender-Inclusive Language and AI',
    title_en: 'Gender and AI: Intersections of Gender-Inclusive Language and AI',
    description:
      'Online-Vortrag von Dr. Marion Bartl in der Reihe „Gender und Künstliche Intelligenz": Fortschritte und Forschungslücken an der Schnittstelle von geschlechtergerechter Sprache und KI. Moderation: Merle Heyrock.',
    description_en:
      'Online lecture by Dr. Marion Bartl in the series "Gender and Artificial Intelligence": progress and research gaps at the intersection of gender-inclusive language and AI. Moderated by Merle Heyrock.',
    organizer: 'GARD – Institut für interdisziplinäre Genderforschung und Diversity, HAW Kiel',
    organizer_en: 'GARD – Institute for Interdisciplinary Gender Research and Diversity, HAW Kiel',
    start: '2026-11-11T16:15:00+01:00',
    end: '2026-11-11T17:15:00+01:00',
    location: 'Online',
    url: 'https://www.haw-kiel.de/wir/organisation/zentrale-einrichtungen/institut-fuer-interdisziplinaere-genderforschung-und-diversity/gard-gender-in-applied-research-development/veranstaltungen/',
    category: 'intern',
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
  {
    id: 'gender-ki-deepfakes-2026',
    title: 'Gender und KI: Sexualisierende Deepfakes',
    title_en: 'Gender and AI: Sexualised Deepfakes',
    description:
      'Online-Vortrag von Maria Pawelec (IZEW, Universität Tübingen) in der Reihe „Gender und Künstliche Intelligenz": Täter:innen, Verbreitungswege, Risiken und Handlungsspielräume. Moderation: Lara Bökamp.',
    description_en:
      'Online lecture by Maria Pawelec (IZEW, University of Tübingen) in the series "Gender and Artificial Intelligence": perpetrators, distribution channels, risks and room for action. Moderated by Lara Bökamp.',
    organizer: 'GARD – Institut für interdisziplinäre Genderforschung und Diversity, HAW Kiel',
    organizer_en: 'GARD – Institute for Interdisciplinary Gender Research and Diversity, HAW Kiel',
    start: '2026-11-17T15:00:00+01:00',
    end: '2026-11-17T16:30:00+01:00',
    location: 'Online',
    url: 'https://www.haw-kiel.de/wir/organisation/zentrale-einrichtungen/institut-fuer-interdisziplinaere-genderforschung-und-diversity/gard-gender-in-applied-research-development/veranstaltungen/',
    category: 'intern',
    audience: 'alle',
  },
  {
    id: '10-jahre-ifb',
    title: '10 Jahre Institut für Bauwesen',
    title_en: '10 Years Institute of Civil Engineering',
    description:
      'Festakt zum zehnjährigen Bestehen des Instituts für Bauwesen der HAW Kiel – mit Rückblick, Laborführung und Abendempfang. Teilnahme kostenfrei, Anmeldung erforderlich.',
    description_en:
      'Ceremony marking ten years of the Institute of Civil Engineering at HAW Kiel – with a retrospective, lab tour, and evening reception. Free admission, registration required.',
    organizer: 'Institut für Bauwesen, HAW Kiel',
    organizer_en: 'Institute of Civil Engineering, HAW Kiel',
    start: FEST_START,
    end: FEST_END,
    location: FEST_LOCATION,
    category: 'intern',
    audience: 'alle',
    archivePath: '/veranstaltungen/10-jahre-ifb',
  },
];
