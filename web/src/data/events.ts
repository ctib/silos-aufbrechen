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
    id: 'wildeboer-webinar-din-18017-3-2026',
    title: 'Webinar: Brandschutz in Anlagen nach DIN 18017-3',
    title_en: 'Webinar: Fire Protection in Systems to DIN 18017-3',
    description:
      'Kostenloses Online-Seminar mit Rainer Willms zum TS18 TopSchott: Welche Vorgaben macht die MLüAR, bei welchen Bauvorhaben lässt sich die Brandschutzabsperrung einsetzen, welche Abstände zu anderen Gewerken gelten und was ist zur Kaltrauchsicherheit zu beachten? Für Fachplanende, Ingenieurbüros, Sachverständige und ausführende Betriebe. Anmeldung über das Webinarprogramm auf wildeboer.de.',
    description_en:
      'Free online seminar with Rainer Willms on the TS18 TopSchott fire barrier: requirements of the MLüAR, suitable building projects, clearances to other trades and cold smoke tightness. Aimed at planners, engineering offices, experts and contractors. Registration via the webinar programme at wildeboer.de.',
    organizer: 'Wildeboer Bauteile GmbH',
    start: '2026-10-28T11:00:00+01:00',
    end: '2026-10-28T11:45:00+01:00',
    location: 'Online',
    category: 'extern',
    audience: 'alle',
  },
  {
    id: 'ehrenamtsmesse-kiel-2026',
    title: '11. Ehrenamtsmesse Kiel',
    title_en: '11th Kiel Volunteering Fair',
    description:
      'Unter dem Motto „Demokratie braucht Engagement“ stellen sich mehr als 80 Organisationen aus allen Bereichen des ehrenamtlichen Engagements vor. Vereine und Initiativen zeigen ihre Arbeit und suchen Unterstützung, Besucher:innen bekommen einen Überblick über die Engagementmöglichkeiten in Kiel und können direkt mit den Organisationen ins Gespräch kommen. Die Schirmherrschaft hat der Kieler Oberbürgermeister.',
    description_en:
      'Under the motto “Democracy requires engagement”, more than 80 organisations from all areas of voluntary work present themselves. Associations and initiatives show their work and look for supporters, while visitors get an overview of the opportunities for civic engagement in Kiel and can talk to the organisations directly. Under the patronage of the Mayor of Kiel.',
    organizer: 'nettekieler Ehrenamtsbüro',
    start: '2026-11-01T11:00:00+01:00',
    end: '2026-11-01T17:00:00+01:00',
    location: 'Altes Rathaus, Kiel',
    url: 'https://www.nette-kieler.de/veranstaltungen/11-ehrenamtsmesse-2026',
    category: 'extern',
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
    id: 'detail-architekturtag-2026',
    title: 'DETAIL Architekturtag 2026: Kostengünstig bauen – aber wie?',
    title_en: 'DETAIL Architecture Day 2026: Building Affordably – But How?',
    description:
      'Online-Veranstaltung zum Spannungsfeld aus steigenden technischen Anforderungen, Wohnungsmangel und wachsenden Baukosten. Mit Beiträgen von Tilman Jarmer (TUMorrow Factory), Kilian Jonak (Strategien für kostengünstiges Bauen) und Chris Neuburger (nahezu unbeheiztes Haus in Ingolstadt), Moderation Eva Herrmann. Teilnahme kostenlos; als Fortbildung mit 4 Punkten von mehreren Architektenkammern anerkannt.',
    description_en:
      'Online event on the tension between rising technical requirements, housing shortage and growing construction costs. With contributions by Tilman Jarmer (TUMorrow Factory), Kilian Jonak (strategies for affordable construction) and Chris Neuburger (an almost unheated house in Ingolstadt), moderated by Eva Herrmann. Free of charge; recognised as continuing education with 4 credits by several chambers of architects.',
    organizer: 'DETAIL mit A|U|F, Bundesverband Flachglas, ift Rosenheim, Rewindo und VFF',
    organizer_en: 'DETAIL with A|U|F, Bundesverband Flachglas, ift Rosenheim, Rewindo and VFF',
    start: '2026-11-03T16:00:00+01:00',
    end: '2026-11-03T18:30:00+01:00',
    location: 'Online',
    url: 'https://www.detail.de/architekturtag-2026',
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
    id: 'talent-transfair-2026',
    title: 'talent transfair 2026',
    title_en: 'talent transfair 2026',
    description:
      'Firmenkontaktmesse der HAW Kiel und größte Veranstaltung der Hochschule: über 90 ausstellende Unternehmen und Organisationen auf dem Campus. Studierende knüpfen Kontakte zu potenziellen Arbeitgeberinnen und Arbeitgebern – Lehrende sind gebeten, Lehrveranstaltungen an diesem Tag zu reduzieren oder den Messebesuch gemeinsam mit den Studierenden einzuplanen. Fragen an Andreas Borchardt.',
    description_en:
      'Career fair at HAW Kiel and the university’s largest event: more than 90 exhibiting companies and organisations on campus. Students make contact with potential employers – lecturers are asked to shorten classes that day or to visit the fair together with their students. Questions to Andreas Borchardt.',
    organizer: 'HAW Kiel',
    start: '2026-11-11T09:30:00+01:00',
    end: '2026-11-11T16:00:00+01:00',
    location: 'HAW Kiel, Sokratesplatz 1, 24149 Kiel',
    url: 'https://www.talent-transfair.de/',
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
    id: 'architekturclub-85-kundoo-2026',
    title: '85. ArchitekturClub mit Prof.in Anupama Kundoo',
    title_en: '85th ArchitekturClub with Prof. Anupama Kundoo',
    description:
      'Die gebürtige Inderin Anupama Kundoo hat sich direkt nach ihrem Studium in Mumbai im Süden Indiens selbstständig gemacht und über 100 Projekte realisiert – alle ressourceneffizient und ökologisch. Für eine Studie dazu erhielt sie ein Stipendium der Vastu-Shilpa Foundation des Pritzker-Preisträgers Balkrishna Doshi. Nach Lehrtätigkeiten in London, New York, Madrid, Potsdam und Karlsruhe lehrt sie heute als Professorin an der TU Berlin, wo sie auch promoviert hat. Einlass ab 18:30 Uhr, Vortragsbeginn 19:30 Uhr. Anmeldung bis 16. November ausschließlich über die BDA-Website.',
    description_en:
      'Born in India, Anupama Kundoo set up her own practice in southern India immediately after her studies in Mumbai and has realised more than 100 projects – all resource-efficient and ecological. A study on this work earned her a fellowship from the Vastu Shilpa Foundation of Pritzker laureate Balkrishna Doshi. After teaching in London, New York, Madrid, Potsdam and Karlsruhe, she is now a professor at TU Berlin, where she also earned her doctorate. Doors open 6:30 pm, lecture starts 7:30 pm. Registration until 16 November via the BDA website only.',
    organizer: 'BDA Schleswig-Holstein',
    start: '2026-11-17T18:30:00+01:00',
    end: '2026-11-17T21:30:00+01:00',
    location: 'Forum für Baukultur, Waisenhofstraße 3, 24103 Kiel',
    url: 'https://www.bda-schleswigholstein.de/veranstaltungseinladungen/310806/',
    category: 'extern',
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
    id: 'mitte-von-kiel-vorlesungsnacht-2026',
    title: 'Wo ist die Mitte von Kiel? Eine Suche auf dem Weg in die Zukunft',
    title_en: 'Where Is the Centre of Kiel? A Search on the Way into the Future',
    description:
      'Beitrag von Prof. Nikolaus Knebel und Dr. Felix Greiner-Petter (Institut für Bauwesen, HAW Kiel) zur Night of the Profs an der CAU. Stadt geht jeden an, die Zukunft auch – Ideen dazu, wie und was Kiel werden könnte, entstehen am besten im Dialog. Die Suche nach der Mitte der Stadt versteht diese als Ort, der alles verbindet, und als Konzept, aus dem alles abgeleitet wird: als Wissenschaftler schaffen die beiden durch eine kritische Analyse von Stadtstruktur und Stadtraum erste Gesprächsgrundlagen, als Entwerfer öffnen sie mit spekulativen Hypothesen neue Denkräume – untermalt von anschaulichen Zeichnungen und teils utopischen Skizzen. Teil von „Science Comes to Town“. Hörsaal A im Audimax.',
    description_en:
      'Contribution by Prof. Nikolaus Knebel and Dr. Felix Greiner-Petter (Institute of Civil Engineering, HAW Kiel) to the Night of the Profs at Kiel University. The city concerns everyone, and so does the future – ideas about how and what Kiel could become emerge best through dialogue. The search for the centre of the city treats it both as the place that connects everything and as the concept from which everything is derived: as researchers the two offer a critical analysis of urban structure and space as common ground, as designers they open new spaces of thought through speculative hypotheses – illustrated with drawings and partly utopian sketches. Part of "Science Comes to Town". Lecture hall A in the Audimax.',
    organizer: 'Christian-Albrechts-Universität zu Kiel mit Science Comes to Town',
    organizer_en: 'Kiel University with Science Comes to Town',
    start: '2026-11-20T22:00:00+01:00',
    end: '2026-11-20T23:00:00+01:00',
    location: 'CAU zu Kiel, Audimax, Hörsaal A, Christian-Albrechts-Platz 2, 24118 Kiel',
    url: 'https://www.wissenschafftzukunft-kiel.de/de/science_comes_to_town/night.php',
    category: 'extern',
    audience: 'alle',
  },
  {
    id: 'dialogreihe-innenstadt-mv-waren-2026',
    title: '15. Dialogreihe Innenstadt MV: Sichere, attraktive und lebendige Innenstädte gestalten',
    title_en: '15th Inner City Dialogue MV: Shaping Safe, Attractive and Lively City Centres',
    description:
      'Aus der Praxis für die Praxis: Die Dialogreihe „City managen – Know-how für Stadtgestalter in MV“ ist eine Plattform für den Erfahrungsaustausch von Citymanager:innen, Stadtgestalter:innen, Wirtschaftsförder:innen und weiteren Innenstadtakteuren. Am Vormittag geht es um Sicherheits- und Kriminalprävention – mit Ergebnissen aus dem HDE-Standortmonitor und der Deutschlandstudie Innenstadt 2026/2027 –, am Nachmittag um kommunale Gestaltungsspielräume: Gestaltungs-, Sondernutzungs- und Vorkaufssatzungen, Grenzen des Denkmalschutzes und Praxisbeispiele aus Potsdam, Wismar und Hanau. Ankommen ab 9:30 Uhr, Mittagsimbiss inklusive. Teilnehmerzahl begrenzt, Bestätigung in der Reihenfolge der Anmeldungen.',
    description_en:
      'From practice for practice: the series "Managing the city – know-how for urban designers in MV" is a platform for exchange among city managers, urban designers, economic development officers and other inner-city stakeholders. The morning addresses safety and crime prevention – with findings from the HDE location monitor and the 2026/2027 German inner-city study – while the afternoon covers municipal scope for action: design, special-use and pre-emption by-laws, the limits set by heritage protection, and case studies from Potsdam, Wismar and Hanau. Doors open 9:30 am, lunch included. Places limited, confirmations in order of registration.',
    organizer: 'Landesregierung Mecklenburg-Vorpommern und Dialogforum Einzelhandel MV',
    organizer_en: 'State Government of Mecklenburg-Vorpommern and Dialogforum Einzelhandel MV',
    start: '2026-11-24T10:00:00+01:00',
    end: '2026-11-24T15:00:00+01:00',
    location: 'Haus des Gastes, Waren (Müritz)',
    url: 'https://events.rostock.ihk.de/b?p=DialogreiheInnenstadt2026',
    category: 'extern',
    audience: 'alle',
  },
  {
    id: 'weiterbauen-architektur-im-bestand-2026',
    title: 'Weiterbauen. Architektur im Bestand',
    title_en: 'Building On. Architecture in the Existing Stock',
    description:
      'Nachverdichtung, Umbau und Sanierung als Zukunftsaufgabe: Der wichtigste Baustoff der Zukunft steht längst – der Gebäudebestand ist eine der wertvollsten Ressourcen für das Bauen von morgen. Ein Nachmittag über Haltung, Konzepte und konkrete Projekte, mit Beiträgen von Kim Le Roux (LXSY Architektur, „Never waste a good resource“), Kerstin Müller (Zirkular Basel, „Das Neue im Vorhandenen“), Philipp Bilke (Studio Baukunst, „Sample the City“) und Tabea Huth („DENSITIM – Baugruppensystematik in Holz“), Paneldiskussion und Ausklang. Moderation: Jakob Schoof (DETAIL) und Christian Krüger (VELUX). Teilnahme vor Ort in Stuttgart oder per Livestream; von der Architektenkammer Baden-Württemberg mit 3 Unterrichtsstunden als Fortbildung anerkannt.',
    description_en:
      'Densification, conversion and refurbishment as a task for the future: the most important building material of tomorrow is already standing – the existing building stock is one of the most valuable resources for future construction. An afternoon on attitude, concepts and built projects, with contributions by Kim Le Roux (LXSY Architektur, "Never waste a good resource"), Kerstin Müller (Zirkular Basel, "The new within the existing"), Philipp Bilke (Studio Baukunst, "Sample the City") and Tabea Huth ("DENSITIM – timber building-group systematics"), followed by a panel discussion and reception. Moderated by Jakob Schoof (DETAIL) and Christian Krüger (VELUX). On site in Stuttgart or via livestream; recognised by the Chamber of Architects of Baden-Württemberg as continuing education worth 3 teaching units.',
    organizer: 'VELUX mit DETAIL',
    start: '2026-11-24T14:30:00+01:00',
    end: '2026-11-24T18:30:00+01:00',
    location: 'Architektenkammer Baden-Württemberg, Danneckerstraße 54, 70182 Stuttgart (oder Livestream)',
    url: 'https://hs.velux.de/de-de/weiterbauen-anmeldung',
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
    id: 'drehbuchpreis-sh-2026',
    title: 'Drehbuchpreis Schleswig-Holstein 2026',
    title_en: 'Schleswig-Holstein Screenplay Award 2026',
    description:
      'Die neunte und letzte Ausgabe des Drehbuchpreises Schleswig-Holstein, den Christian Mertens (Fachbereich Medien, HAW Kiel) 2018 ehrenamtlich ins Leben gerufen hat. Der Abend ist mehr als eine Preisverleihung: Die drei nominierten Kurzfilm-Drehbücher werden vor Ort szenisch gelesen, unter anderem von Björn Beton; zudem werden die Jurypreise und das Kurt-Denzer-Dokumentarfilm-Stipendium vergeben. Moderation: Horst Hoof (NDR Welle Nord) und Zara Zerbe. Über die Jahre waren Studierende der HAW Kiel regelmäßig nominiert und gewannen zweimal den Hauptpreis. Tickets 10 €, ermäßigt 7,50 €, direkt im Kino.',
    description_en:
      'The ninth and final edition of the Schleswig-Holstein Screenplay Award, founded in 2018 as a voluntary project by Christian Mertens (Department of Media, HAW Kiel). The evening is more than an award ceremony: the three nominated short-film screenplays are performed as staged readings, among others by Björn Beton, and the jury prizes and the Kurt Denzer documentary film scholarship are presented. Hosted by Horst Hoof (NDR Welle Nord) and Zara Zerbe. Over the years HAW Kiel students were regularly nominated and twice won the main prize. Tickets €10, reduced €7.50, available at the cinema.',
    organizer: 'Drehbuchpreis Schleswig-Holstein',
    start: '2026-11-28T16:00:00+01:00',
    end: '2026-11-28T19:00:00+01:00',
    location: 'STUDIO Filmtheater am Dreiecksplatz, Kiel',
    url: 'https://www.studio-filmtheater.de/movie/drehbuchpreis-sh-2026',
    category: 'extern',
    audience: 'alle',
  },
  {
    id: 'gard-austauschforum-green-by-design-2026',
    title: 'Green by design. Fair by default? GARD-Austauschforum zu Geschlecht und Nachhaltigkeit',
    title_en: 'Green by Design. Fair by Default? GARD Forum on Gender and Sustainability',
    description:
      'Unsere Zukunft soll nachhaltig werden – doch was bedeutet das für die verschiedenen Menschen und Lebensbedingungen, und welche Rolle spielt Geschlecht dabei? Diesen Fragen widmet sich das Projekt GARD (Gender in Applied Research & Development) mit einer interaktiven Forschungsausstellung. An verschiedenen Stationen lassen sich Forschungsprojekte und Perspektiven rund um Nachhaltigkeit entdecken – von Mikroplastik über Klimaresilienz und Planetary Health bis zu nachhaltigem Tourismus und Klimawandel. Eingeladen sind alle Interessierten, ob selbst forschend oder forschungsinteressiert. Kommen und Gehen jederzeit möglich, Snacks und Getränke sind gestellt, eine Anmeldung ist nicht erforderlich.',
    description_en:
      'Our future is meant to be sustainable – but what does that mean for different people and living conditions, and what role does gender play? The GARD project (Gender in Applied Research & Development) explores these questions with an interactive research exhibition. At various stations, visitors can discover research projects and perspectives on sustainability – from microplastics to climate resilience and planetary health, sustainable tourism and climate change. Everyone is welcome, whether doing research or simply interested in it. Come and go at any time, snacks and drinks provided, no registration required.',
    organizer: 'GARD – Institut für interdisziplinäre Genderforschung und Diversity, HAW Kiel',
    organizer_en: 'GARD – Institute for Interdisciplinary Gender Research and Diversity, HAW Kiel',
    start: '2026-12-08T10:00:00+01:00',
    end: '2026-12-08T13:00:00+01:00',
    location: 'HAW Kiel, Foyer des Großen Hörsaalgebäudes (C2), Sokratesplatz 6, 24149 Kiel',
    url: 'https://www.haw-kiel.de/wir/organisation/zentrale-einrichtungen/institut-fuer-interdisziplinaere-genderforschung-und-diversity/gard-gender-in-applied-research-development/veranstaltungen/',
    category: 'intern',
    audience: 'alle',
  },
  {
    id: 'forschung-fuer-die-sicherheit-2026',
    title: 'Forschung für die Sicherheit – Sicherheit in der Forschung',
    title_en: 'Research for Security – Security in Research',
    description:
      'Online-Vortrag von Prof. Dr. Wolfgang Dorner, Vizepräsident für Forschung und Transfer der TH Deggendorf, mit anschließendem Austausch. Er zeigt, wie die TH Deggendorf Verteidigungsforschung als Teil einer angewandten, transferorientierten Forschungsstrategie versteht, und warum der Begriff „Dual Use“ den Transfer zwischen ziviler und militärischer Forschung nur unscharf beschreibt. Im Mittelpunkt steht die Sicherheit in der Forschung: Wie lässt sich wirksamer Geheimschutz mit akademischer Freiheit verbinden, welche Strukturen und Qualifizierungen braucht eine Hochschule für den Umgang mit Verschlusssachen? Die TH Deggendorf kooperiert im Bereich Sicherheit und Verteidigung eng mit der HAW Kiel. Anmeldung bis 11. Dezember 2026, Zugangslink per Mail.',
    description_en:
      'Online lecture by Prof. Dr. Wolfgang Dorner, Vice President for Research and Transfer at Deggendorf Institute of Technology, followed by discussion. He shows how his university treats defence research as part of an applied, transfer-oriented research strategy, and why the term "dual use" only vaguely describes the transfer between civil and military research. The focus is on security in research: how can effective protection of classified information be reconciled with academic freedom, and what structures and qualifications does a university need to handle classified material? Deggendorf cooperates closely with HAW Kiel in the field of security and defence. Registration until 11 December 2026, access link by email.',
    organizer: 'Wissenschaftszentrum Kiel GmbH',
    start: '2026-12-15T16:00:00+01:00',
    end: '2026-12-15T17:30:00+01:00',
    location: 'Online (Microsoft Teams)',
    url: 'https://events.teams.microsoft.com/event/e970b763-4483-4995-b087-66a4df0fb96e@8d86d25f-3dc4-46db-8ac0-04be3c890209',
    category: 'extern',
    audience: 'alle',
  },
  {
    id: 'dmk-award-nachhaltiges-bauen-2027',
    title: 'Bewerbungsschluss: DMK Award für nachhaltiges Bauen 2027',
    title_en: 'Application Deadline: DMK Award for Sustainable Building 2027',
    description:
      'Die Dagmar + Matthias Krieger Stiftung lobt seit 2010 den DMK Award für nachhaltiges Bauen aus. Mit dem Nachwuchspreis für nachhaltige Studienprojekte bekommen Studierende eine eigene Bühne: Gesucht werden Studienprojekte, Entwürfe und Konzepte, die neue Wege aufzeigen, Gewohntes hinterfragen oder eine eigene Antwort darauf geben, wie nachhaltiges Bauen künftig aussehen kann. Das Projekt muss nicht realisiert oder perfekt sein – entscheidend ist die Idee. Weitere Kategorien: Wohnungsbau, gewerbliche und öffentliche Gebäude sowie der DMK Ehrenpreis. Bewerbungsfrist: 28. Februar 2027.',
    description_en:
      'The Dagmar + Matthias Krieger Foundation has been awarding the DMK Award for sustainable building since 2010. The emerging talent prize for sustainable student projects gives students a stage of their own: the foundation is looking for student projects, designs and concepts that open up new paths, question established practice, or offer their own answer to what sustainable building could look like. The project need not be built or perfect – the idea is what counts. Further categories: residential construction, commercial and public buildings, and the DMK honorary prize. Application deadline: 28 February 2027.',
    organizer: 'Dagmar + Matthias Krieger Stiftung',
    start: '2027-02-28T23:59:00+01:00',
    end: '2027-02-28T23:59:00+01:00',
    location: 'Online (Einreichung)',
    url: 'https://www.dmk-award.de/',
    category: 'extern',
    audience: 'alle',
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
