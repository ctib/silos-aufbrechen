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
    id: 'baustelle-zukunft-weiblich-2026',
    title: 'Baustelle Zukunft – Die Zukunft ist weiblich. Die Baustelle auch.',
    title_en: 'Baustelle Zukunft – The Future is Female. So is the Construction Site.',
    description:
      'Online-Seminar von Dipl.-Ing. Wiebke Jipp. Von der Architekten- und Ingenieurkammer Schleswig-Holstein als Fortbildung anerkannt; ermäßigter Preis für Studierende und Berufseinsteigerinnen.',
    description_en:
      'Online seminar by Dipl.-Ing. Wiebke Jipp. Recognised as continuing education by the Chamber of Architects and Engineers of Schleswig-Holstein; reduced rate for students and early-career professionals.',
    organizer: 'Wiebke Jipp',
    start: '2026-10-06T18:30:00+02:00',
    end: '2026-10-06T20:00:00+02:00',
    location: 'Online',
    url: 'https://wiebkejipp.com/akademie#baustelle-zukunft',
    category: 'extern',
    audience: 'alle',
  },
  {
    id: 'sternbruecke-forever-2026',
    title: 'Sternbrücke forever – Dokumentarfilm',
    title_en: 'Sternbrücke forever – Documentary',
    description:
      'Der BDA Kiel zeigt den Dokumentarfilm von Christian Hornung (D 2026, 98 Min.) über den Abriss der Hamburger Sternbrücke: ein Viertel aus Clubs, Kiosken und Werkstätten im Wandel. Eintritt 7 €, ermäßigt 6 €.',
    description_en:
      'BDA Kiel screens the documentary by Christian Hornung (Germany 2026, 98 min) about the demolition of Hamburg’s Sternbrücke and a neighbourhood of clubs, kiosks and workshops in transition. Admission €7, reduced €6.',
    organizer: 'BDA Kiel',
    start: '2026-10-08T18:00:00+02:00',
    end: '2026-10-08T20:00:00+02:00',
    location: 'Kino in der Pumpe, Haßstraße 22, 24103 Kiel',
    url: 'https://www.diepumpe.de/veranstaltungen/mit-dem-bda-sternbruecke-forever/',
    category: 'extern',
    audience: 'alle',
  },
  {
    id: 'ki-insights-kommunikationspraxis-oktober-2026',
    title: 'KI-Insights: Vom Briefing zur Medienmitteilung',
    title_en: 'AI Insights: From Briefing to Press Release',
    description:
      'Online-Vortrag von Tristan Cech (Convensis GmbH) in der Reihe „KI-Insights aus der Kommunikationspraxis“: Wie KI die PR- und Kommunikationsarbeit verändert. Kostenlos. Der Zoom-Zugang wird über den Fachbereich Medien verteilt.',
    description_en:
      'Online lecture by Tristan Cech (Convensis GmbH) in the series "AI Insights from Communication Practice": how AI is changing PR and communications work. Free of charge. Zoom access is distributed via the Department of Media.',
    organizer: 'HAW Kiel, Fachbereich Medien mit dem PR-Beirat',
    organizer_en: 'HAW Kiel, Department of Media with the PR Advisory Board',
    start: '2026-10-16T10:15:00+02:00',
    end: '2026-10-16T11:45:00+02:00',
    location: 'Online (Zoom)',
    category: 'intern',
    audience: 'haw',
  },
  {
    id: 'stegreif-kirchenumbau-2026',
    title: 'Stegreif: Kirchenumbau – vom Sakral- zum Stadtraum',
    title_en: 'Design Charrette: Church Conversion – From Sacred to Urban Space',
    description:
      'Ausgabe des Stegreifentwurfs für Architekturstudierende. Thema: Transformation vom Sakral- zum Stadtraum. Anmeldung bis 20.10.2026 per E-Mail an Sabina Hauers, Abgabe am 05.11.2026.',
    description_en:
      'Briefing for the short design project for architecture students. Topic: transformation from sacred to urban space. Registration until 20 October 2026 by email to Sabina Hauers, submission on 5 November 2026.',
    organizer: 'IfB, HAW Kiel',
    start: '2026-10-19T09:00:00+02:00',
    end: '2026-10-19T10:00:00+02:00',
    location: 'HAW Kiel, Studio I',
    category: 'intern',
    audience: 'haw',
  },
  {
    id: 'ringvorlesung-lehmbau-down-to-earth-2026',
    title: 'Ringvorlesung Lehmbau „Down to Earth“',
    title_en: 'Lecture Series on Earthen Building "Down to Earth"',
    description:
      'Bundesweite Online-Ringvorlesung des Dachverbands Lehm zum Baustoff Lehm und zum nachhaltigen, ressourcenschonenden und zirkulären Bauen – getragen von 14 Hochschulen und über 30 Referierenden. 16 Termine, immer donnerstags 16:00–17:30 Uhr, vom 22.10.2026 bis 25.02.2027. Teilnahme kostenlos und ohne Anmeldung; die Teilnahme wird erfasst und kann bestätigt werden.',
    description_en:
      'Nationwide online lecture series by the German Association for Building with Earth on earth as a building material and on sustainable, resource-efficient and circular construction – supported by 14 universities and more than 30 speakers. 16 sessions, Thursdays 4:00–5:30 pm, from 22 October 2026 to 25 February 2027. Free, no registration required; attendance is recorded and can be certified.',
    organizer: 'Dachverband Lehm e. V.',
    organizer_en: 'Dachverband Lehm e. V. (German Association for Building with Earth)',
    start: '2026-10-22T16:00:00+02:00',
    end: '2026-10-22T17:30:00+02:00',
    location: 'Online (Zoom)',
    url: 'https://www.dachverband-lehm.de/bildung/ringvorlesung',
    category: 'extern',
    audience: 'alle',
  },
  {
    id: 'blaupause-statt-brache-2026',
    title: 'Blaupause statt Brache – wie entstehen Orte, wo wir Demokratie mitgestalten?',
    title_en: 'Blueprint Instead of Wasteland – How Do Places for Shaping Democracy Emerge?',
    description:
      'Podiumsabend zum Workshop „Gehen wir zu mir oder zu dir?“ – ein Abend zum Mitreden, von fehlenden Steckdosen bis zur Stadtentwicklung. „Dritte Orte“ sind Räume jenseits von Arbeit und Wohnung: Nachbarschaftstreff, Marktplatz, Pop-up-Store. Studierende haben während der Interdisziplinären Wochen an der HAW Kiel solche Orte besucht; das Konzept der gemeinsamen Erkundung wird nun auf die Stadtgesellschaft übertragen. Teil von „Science Comes to Town“. Der genaue Veranstaltungsort wird tagesaktuell veröffentlicht.',
    description_en:
      'Panel evening accompanying the workshop "Your place or mine?" – an evening for discussion, from missing power sockets to urban development. "Third places" are spaces beyond work and home: neighbourhood meeting points, marketplaces, pop-up stores. Students visited such places during the Interdisciplinary Weeks at HAW Kiel; the concept of joint exploration is now being extended to the wider city. Part of "Science Comes to Town". The exact venue is announced on the day.',
    organizer: 'Science Comes to Town, HAW Kiel',
    organizer_en: 'Science Comes to Town, HAW Kiel',
    start: '2026-10-27T18:15:00+01:00',
    end: '2026-10-27T20:45:00+01:00',
    location: 'HAW Kiel, Sokratesplatz 1, 24149 Kiel',
    url: 'https://kiel.de/de/_info/veranstaltungskalender.php#/de/kiel/default/detail/Event/e_101369952/blaupause-statt-brache-wie-entstehen-orte-wo-wir-demokratie-mitgestalten',
    category: 'intern',
    audience: 'alle',
  },
  {
    id: 'net-zero-valley-konferenz-sh-2026',
    title: '2. Net Zero Valley Konferenz Schleswig-Holstein',
    title_en: '2nd Net Zero Valley Conference Schleswig-Holstein',
    description:
      'Vom Konzept zur Umsetzung: Wie gestalten wir das Net Zero Valley Schleswig-Holstein? Mit der offiziellen Übergabe der Bewerbung durch Umweltminister Tobias Goldschmidt, einem Beitrag von CustomCells zur Batteriezelltechnologie, der Vorstellung der nächsten Umsetzungsschritte sowie einem Panel mit Vertreter:innen aus EU, Bund und Land. Ab 17:30 Uhr Ausklang und Ausstellung.',
    description_en:
      'From concept to implementation: how do we shape the Net Zero Valley Schleswig-Holstein? With the official handover of the application by Environment Minister Tobias Goldschmidt, a contribution by CustomCells on battery cell technology, a presentation of the next implementation steps, and a panel with representatives from the EU, the federal government and the state. From 5:30 pm, networking and exhibition.',
    organizer: 'Net Zero Valley Initiative Schleswig-Holstein und Wirtschaftsagentur Neumünster',
    organizer_en: 'Net Zero Valley Initiative Schleswig-Holstein and Wirtschaftsagentur Neumünster',
    start: '2026-11-03T15:00:00+01:00',
    end: '2026-11-03T18:30:00+01:00',
    location: 'Holstenhallen Neumünster',
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
    id: 'promotionsstipendien-professorinnenprogramm-2026',
    title: 'Bewerbungsschluss: Promotionsstipendien Professorinnenprogramm 2030',
    title_en: 'Application Deadline: Doctoral Scholarships, Professorinnenprogramm 2030',
    description:
      'Ausschreibung von Grund- und Abschlussstipendien für Wissenschaftlerinnen in frühen Karrierephasen im Rahmen des Professorinnenprogramms 2030. Bewerbungsfrist: 8. November 2026.',
    description_en:
      'Call for basic and completion scholarships for female researchers in early career stages within the Professorinnenprogramm 2030. Application deadline: 8 November 2026.',
    organizer: 'HAW Kiel',
    start: '2026-11-08T23:59:00+01:00',
    end: '2026-11-08T23:59:00+01:00',
    url: 'https://stelle.pro/jobposting/0489a2daab5ca7478c290e9f64aae8583ecbf9a80',
    category: 'intern',
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
    id: 'fehmarnbelt-querung-grossprojekte-2026',
    title: 'Hygge und trotzdem schneller? Feste Fehmarnbelt-Querung',
    title_en: 'Hygge and Still Faster? The Fehmarnbelt Fixed Link',
    description:
      'Vortrag von Prof. Dr. Thilo Rohlfs (Professur für Umwelt-, Bau- und Planungsrecht, HAW Kiel): Was können wir von den Dänen bei Großprojekten lernen? Als ehemaliger schleswig-holsteinischer Verkehrsstaatssekretär war er intensiv in das Genehmigungsverfahren eingebunden. Um Anmeldung unter geschaeftsstelle@shjg.de wird gebeten.',
    description_en:
      'Lecture by Prof. Dr. Thilo Rohlfs (Professorship of Environmental, Construction and Planning Law, HAW Kiel): what can Germany learn from Denmark about major infrastructure projects? As former State Secretary for Transport of Schleswig-Holstein he was closely involved in the approval process. Registration requested at geschaeftsstelle@shjg.de.',
    organizer: 'Schleswig-Holsteinische Juristische Gesellschaft e. V.',
    organizer_en: 'Schleswig-Holstein Law Society',
    start: '2026-11-18T18:30:00+01:00',
    end: '2026-11-18T20:00:00+01:00',
    location: 'Klaus-Murmann-Hörsaal, CAU zu Kiel, Leibnizstraße 1, 24118 Kiel',
    category: 'extern',
    audience: 'alle',
  },
  {
    id: 'get-nord-2026',
    title: 'GET NORD 2026 – Fachmesse Elektro, Sanitär, Heizung, Klima',
    title_en: 'GET NORD 2026 – Trade Fair for Electrical, Plumbing, Heating and Air Conditioning',
    description:
      'Fachmesse für Gebäudetechnik in Hamburg: Elektro, Sanitär, Heizung und Klima unter einem Dach, mit Fachprogramm und Ausstellung. Über Aktionscodes einzelner Aussteller sind kostenfreie Messetickets erhältlich.',
    description_en:
      'Trade fair for building services engineering in Hamburg: electrical, plumbing, heating and air conditioning under one roof, with a technical programme and exhibition. Free tickets are available via promotional codes from individual exhibitors.',
    organizer: 'Hamburg Messe und Congress',
    start: '2026-11-19T09:00:00+01:00',
    end: '2026-11-21T18:00:00+01:00',
    location: 'Hamburg Messe, Messeplatz 1, 20357 Hamburg',
    url: 'https://www.get-nord.de/',
    category: 'extern',
    audience: 'alle',
  },
  {
    id: 'neues-europaeisches-bauhaus-kiel-2026',
    title: 'Neues Europäisches Bauhaus in Kiel und Schleswig-Holstein',
    title_en: 'New European Bauhaus in Kiel and Schleswig-Holstein',
    description:
      'Workshop im Rahmen des Projekts Baltic’s Past & Future: Wie lassen sich zukunftsfähige, nachhaltige und inklusive Lebensräume in Kiel gestalten? Mit einer Einführung von Pia Runge (Umweltbundesamt), NEB-Strategien aus Vilnius, Danzig und Aarhus, Beiträgen von Bastian Lipinski (Stadt Kiel), Sven Schuch (Muthesius Kunsthochschule) und der Künstlerin Ute Diez zu den drei NEB-Säulen, einem Rundgang durch den Anscharpark und abschließender Plenumsdiskussion. Persönliche Einladung, Plätze begrenzt. Anmeldung bis 12. November 2026.',
    description_en:
      'Workshop within the Baltic’s Past & Future project: how can liveable, sustainable and inclusive spaces be shaped in Kiel? With an introduction by Pia Runge (German Environment Agency), NEB strategies from Vilnius, Gdańsk and Aarhus, contributions by Bastian Lipinski (City of Kiel), Sven Schuch (Muthesius Academy of Fine Arts) and artist Ute Diez on the three NEB pillars, a tour of the Anscharpark and a closing plenary discussion. By personal invitation, places limited. Registration until 12 November 2026.',
    organizer: 'Heinrich-Böll-Stiftung Schleswig-Holstein und Kunstverein Haus 8',
    organizer_en: 'Heinrich Böll Foundation Schleswig-Holstein and Kunstverein Haus 8',
    start: '2026-11-19T16:00:00+01:00',
    end: '2026-11-19T20:00:00+01:00',
    location: 'Atelierhaus im Anscharpark, Heiligendammer Str. 15, 24106 Kiel',
    category: 'extern',
    audience: 'alle',
  },
  {
    id: 'ki-insights-kommunikationspraxis-november-2026',
    title: 'KI-Insights: Der KI-Gendefekt',
    title_en: 'AI Insights: The AI Gene Defect',
    description:
      'Online-Vortrag von Prof. Dr. Stefan Hencke (Convensis GmbH) in der Reihe „KI-Insights aus der Kommunikationspraxis“: Was haben Mäuse und Wildbienen mit KI zu tun? Kostenlos. Der Zoom-Zugang wird über den Fachbereich Medien verteilt.',
    description_en:
      'Online lecture by Prof. Dr. Stefan Hencke (Convensis GmbH) in the series "AI Insights from Communication Practice": what do mice and wild bees have to do with AI? Free of charge. Zoom access is distributed via the Department of Media.',
    organizer: 'HAW Kiel, Fachbereich Medien mit dem PR-Beirat',
    organizer_en: 'HAW Kiel, Department of Media with the PR Advisory Board',
    start: '2026-11-27T10:15:00+01:00',
    end: '2026-11-27T11:45:00+01:00',
    location: 'Online (Zoom)',
    category: 'intern',
    audience: 'haw',
  },
  {
    id: '10-jahre-ifb',
    title: '10 Jahre Institut für Bauwesen',
    title_en: '10 Years Institute of Civil Engineering',
    description:
      'Zwei Tage zum zehnjährigen Bestehen des Instituts für Bauwesen der HAW Kiel, eingebettet in die 37. Interdisziplinären Wochen: Donnerstag mit den IDW-Ergebnissen und einer Podiumsdiskussion zur Stadtentwicklung am Seefischmarkt, Freitag mit Open Labs am Seefischmarkt, Dampferfahrt über die Förde, Festakt im Ratssaal des Kieler Rathauses und anschließender Fête. Teilnahme kostenfrei, Anmeldung erforderlich.',
    description_en:
      'Two days marking ten years of the Institute of Civil Engineering at HAW Kiel, embedded in the 37th Interdisciplinary Weeks: Thursday with the IDW results and a panel discussion on urban development at the Seefischmarkt, Friday with open labs at the Seefischmarkt, a steamer trip across the fjord, the ceremony in Kiel City Hall and a party afterwards. Free admission, registration required.',
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
