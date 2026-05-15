// Zentrale Konfiguration – alle Event-Konstanten an einem Ort

export const FORMS_URL =
  'https://forms.office.com/pages/responsepage.aspx?id=SlFZYNubNECdLWtc9Zdpa95yTsFJlbBDntdDxMV4KBtUNjdTUzM4NVpXSkc5Tk9OM1JEUlJNNFNPMi4u&route=shorturl';

export const REG_DEADLINE = new Date('2026-04-24T23:59:59');
export const EVENT_DATE = new Date('2026-05-07T14:30:00');
export const EVENT_END = new Date('2026-05-07T20:00:00');

export const CONTACT_EMAIL = 'christoph.goebel@haw-kiel.de';

// Temporäre CTA-Links auf der Landingpage (verschwinden nach Ablaufdatum)
export const TEMP_CTAS = [
  {
    i18nKey: 'cta.survey',
    url: 'https://forms.office.com/pages/responsepage.aspx?id=SlFZYNubNECdLWtc9Zdpa95yTsFJlbBDntdDxMV4KBtUNjdTUzM4NVpXSkc5Tk9OM1JEUlJNNFNPMi4u&route=shorturl',
    expires: new Date('2026-08-31T23:59:59'),
  },
  {
    i18nKey: 'cta.researchark',
    url: 'https://researchark.zukunftbauen.org',
    expires: new Date('2026-08-31T23:59:59'),
  },
];
