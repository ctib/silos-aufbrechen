#!/usr/bin/env node
/**
 * update-auth-templates.mjs – setzt die Supabase-Auth-Mailvorlagen aus dem Repo.
 *
 * Ersetzt das Copy-Paste im Dashboard unter Authentication > Emails und hält
 * die beiden Vorlagen synchron. Beide gehören zusammen:
 *   Confirm signup -> Erstanmeldung (Person ist in Supabase noch unbekannt)
 *   Magic Link     -> bestehende Accounts
 *
 * Verwendung (PowerShell):
 *   $env:SUPABASE_ACCESS_TOKEN = "sbp_..."
 *   node web/scripts/update-auth-templates.mjs --dry-run
 *   node web/scripts/update-auth-templates.mjs
 *
 * Das Token ist ein *Personal Access Token* aus
 * https://supabase.com/dashboard/account/tokens – NICHT der Service-Role-Key
 * und nicht der Anon-Key. Es wird nur aus der Umgebung gelesen und niemals
 * in eine Datei geschrieben.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'cbybfmnbojklqbkmuwto';
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const DRY_RUN = process.argv.includes('--dry-run');

const SUBJECT = 'Ihr Zugang: 10 Jahre Institut für Bauwesen';

const here = path.dirname(fileURLToPath(import.meta.url));
const templateDir = path.join(here, '..', 'supabase', 'email-templates');

/** Vorlagen -> Feldnamen der Management-API */
const TEMPLATES = [
  {
    label: 'Confirm signup (Erstanmeldung)',
    file: 'confirm-signup.html',
    contentField: 'mailer_templates_confirmation_content',
    subjectField: 'mailer_subjects_confirmation',
  },
  {
    label: 'Magic Link (bestehende Accounts)',
    file: 'magic-link.html',
    contentField: 'mailer_templates_magic_link_content',
    subjectField: 'mailer_subjects_magic_link',
  },
];

/** Führende HTML-Kommentare sind interne Notizen und gehören nicht in die Mail. */
function stripLeadingComments(html) {
  return html.replace(/^\s*(?:<!--[\s\S]*?-->\s*)+/, '').trim();
}

async function api(method, body) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`,
    {
      method,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    }
  );

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${method} ${res.status} ${res.statusText}\n${text.slice(0, 600)}`);
  }
  return text ? JSON.parse(text) : {};
}

function preview(value) {
  if (!value) return '(leer)';
  const oneLine = String(value).replace(/\s+/g, ' ').trim();
  return oneLine.length > 90 ? oneLine.slice(0, 90) + ' …' : oneLine;
}

async function main() {
  if (!TOKEN) {
    console.error(
      'Fehler: SUPABASE_ACCESS_TOKEN ist nicht gesetzt.\n' +
        'Token anlegen unter https://supabase.com/dashboard/account/tokens, dann:\n' +
        '  $env:SUPABASE_ACCESS_TOKEN = "sbp_..."'
    );
    process.exit(1);
  }

  const payload = {};
  const planned = [];

  for (const tpl of TEMPLATES) {
    const full = path.join(templateDir, tpl.file);
    if (!fs.existsSync(full)) throw new Error(`Vorlage fehlt: ${full}`);

    const html = stripLeadingComments(fs.readFileSync(full, 'utf8'));
    if (!html.includes('{{ .ConfirmationURL }}')) {
      throw new Error(
        `${tpl.file}: Platzhalter {{ .ConfirmationURL }} fehlt – ohne ihn enthält die Mail keinen Link.`
      );
    }

    payload[tpl.contentField] = html;
    payload[tpl.subjectField] = SUBJECT;
    planned.push({ tpl, bytes: Buffer.byteLength(html, 'utf8') });
  }

  console.log(`Projekt: ${PROJECT_REF}\n`);
  console.log('Aktueller Stand in Supabase:');
  const before = await api('GET');

  for (const { tpl } of planned) {
    if (!(tpl.contentField in before)) {
      throw new Error(
        `Feld ${tpl.contentField} nicht in der API-Antwort – Feldname hat sich geändert, bitte prüfen.`
      );
    }
    console.log(`\n  ${tpl.label}`);
    console.log(`    Betreff: ${preview(before[tpl.subjectField])}`);
    console.log(`    Inhalt : ${preview(before[tpl.contentField])}`);
  }

  console.log('\nWird gesetzt auf:');
  for (const { tpl, bytes } of planned) {
    console.log(`\n  ${tpl.label}`);
    console.log(`    Betreff: ${SUBJECT}`);
    console.log(`    Inhalt : ${tpl.file} (${bytes} Bytes)`);
  }

  if (DRY_RUN) {
    console.log('\n--dry-run: nichts geändert.');
    return;
  }

  console.log('\nSchreibe …');
  await api('PATCH', payload);

  const after = await api('GET');
  let ok = true;
  for (const { tpl } of planned) {
    const matches =
      after[tpl.contentField] === payload[tpl.contentField] &&
      after[tpl.subjectField] === SUBJECT;
    console.log(`  ${matches ? 'OK  ' : 'FEHL'} ${tpl.label}`);
    if (!matches) ok = false;
  }

  if (!ok) {
    console.error('\nMindestens eine Vorlage stimmt nach dem Schreiben nicht überein.');
    process.exit(1);
  }
  console.log('\nBeide Vorlagen aktualisiert.');
}

main().catch((err) => {
  console.error(`\nFehlgeschlagen: ${err.message}`);
  process.exit(1);
});
