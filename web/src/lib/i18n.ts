// Zweisprachigkeit (DE/EN) – Scope: Landingpage, Navigation, Veranstaltungsübersicht
// Interner Bereich bleibt Deutsch.

import { writable, derived } from 'svelte/store';

export type Locale = 'de' | 'en';

const translations: Record<string, Record<Locale, string>> = {
  // Navigation
  'nav.start': { de: 'Start', en: 'Home' },
  'nav.events': { de: 'Veranstaltungen', en: 'Events' },
  'nav.intern': { de: 'Intern', en: 'Internal' },

  // Hero
  'hero.title': { de: 'Silos aufbrechen –\nZukunft bauen', en: 'Breaking Silos –\nBuilding the Future' },
  'hero.subtitle': { de: 'Interdisziplinär denken. Gemeinsam handeln. Von und für Kiel.', en: 'Think across disciplines. Act together. By and for Kiel.' },

  // Kiel-Motiv
  'kiel.quote': {
    de: 'Bei einem Schiff verbindet der Kiel Bug und Heck – das Rückgrat, das alles zusammenhält. Ist Kiel damit das Rückgrat der Republik?',
    en: 'On a ship, the keel connects bow and stern – the backbone that holds everything together. Does that make Kiel the backbone of the republic?',
  },
  'kiel.text': {
    de: 'Wie der Kiel die Teile eines Schiffes verbindet, verbinden wir die Disziplinen. Wissenschaft, Wirtschaft und Stadtgesellschaft zusammenbringen – nicht als Schlagwort, sondern als Werkzeug für echte Lösungen.',
    en: 'Just as the keel connects parts of a ship, we connect disciplines. Bringing together science, industry, and civil society – not as a buzzword, but as a tool for real solutions.',
  },

  // Rückblick
  'review.title': { de: 'Rückblick', en: 'Looking Back' },
  'review.text1': {
    de: 'Am 7. Mai 2026 haben wir Silos aufgebrochen – an der HAW Kiel, mit Wissenschaft, Wirtschaft und Stadtgesellschaft an einem Tisch.',
    en: 'On May 7, 2026, we broke down silos – at HAW Kiel, with science, industry, and civil society at one table.',
  },
  'review.text2': {
    de: 'Datenpunkt für Datenpunkt. Stein für Stein. Halm für Halm.',
    en: 'Data point by data point. Stone by stone. Blade by blade.',
  },
  'review.link': { de: 'Zur Veranstaltungsübersicht', en: 'View All Events' },

  // Team
  'team.title': { de: 'Team', en: 'Team' },
  'team.wocken.focus': {
    de: 'Citizen Science, Open Data und datengetriebene Bürgerprojekte – wie Umweltdaten sichtbar und nutzbar werden.',
    en: 'Citizen science, open data, and data-driven civic projects – making environmental data visible and usable.',
  },
  'team.goebel.focus': {
    de: 'Nachhaltige Energieversorgung und Gebäudetechnik – wie vorhandene Ressourcen intelligent genutzt werden können.',
    en: 'Sustainable energy supply and building technology – how to use existing resources intelligently.',
  },
  'team.peters.focus': {
    de: 'Grasland und Umwelt – welche Rolle Grünflächen bei der Lösung urbaner und ökologischer Herausforderungen spielen.',
    en: 'Grassland and environment – the role of green spaces in solving urban and ecological challenges.',
  },

  // Ausblick
  'outlook.title': { de: 'Ausblick', en: 'Outlook' },
  'outlook.text1': {
    de: 'Einige haben schon nach einer Folgeveranstaltung gefragt. Wir sind dran!',
    en: 'Some have already asked about a follow-up event. We are on it!',
  },
  'outlook.text2': {
    de: 'Ob als wiederkehrendes Format, als Basis für geförderte Verbundprojekte oder als Plattform für gemeinsame Publikationen – die Zusammenarbeit geht weiter.',
    en: 'Whether as a recurring format, a basis for funded collaborative projects, or a platform for joint publications – the collaboration continues.',
  },

  // Veranstaltungsübersicht
  'events.title': { de: 'Veranstaltungen', en: 'Events' },
  'events.subtitle': { de: 'Unsere bisherigen und kommenden Veranstaltungen im Überblick.', en: 'An overview of our past and upcoming events.' },
  'events.status.done': { de: 'Durchgeführt', en: 'Completed' },
  'events.status.planned': { de: 'Geplant', en: 'Planned' },

  // Footer
  'footer.contact': { de: 'Kontakt', en: 'Contact' },
  'footer.platform': { de: 'Plattform', en: 'Platform' },
  'footer.platform.desc': { de: 'Interdisziplinäre Zusammenarbeit', en: 'Interdisciplinary Collaboration' },
  'footer.links': { de: 'Links', en: 'Links' },
  'footer.privacy': { de: 'Datenschutz', en: 'Privacy' },
  'footer.imprint': { de: 'Impressum', en: 'Imprint' },
};

// Persistent locale store – reads from localStorage
function createLocaleStore() {
  const initial: Locale = (typeof window !== 'undefined' && localStorage.getItem('locale') as Locale) || 'de';
  const { subscribe, set, update } = writable<Locale>(initial);

  return {
    subscribe,
    set(value: Locale) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('locale', value);
      }
      set(value);
    },
    toggle() {
      update(current => {
        const next: Locale = current === 'de' ? 'en' : 'de';
        if (typeof window !== 'undefined') {
          localStorage.setItem('locale', next);
        }
        return next;
      });
    },
  };
}

export const locale = createLocaleStore();

// Derived translation helper as a store
export const t = derived(locale, ($locale) => {
  return (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[$locale] ?? entry['de'] ?? key;
  };
});
