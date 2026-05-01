/**
 * Sendet Magic-Link-Einladungen an alle Teilnehmenden in der Datenbank.
 * Liest die Userliste direkt aus Supabase (kein Hardcoding).
 *
 * Aufruf: SUPABASE_SERVICE_ROLE_KEY=... node scripts/send-magic-links.mjs
 *
 * Optional: Nur bestimmte Emails senden:
 *   SUPABASE_SERVICE_ROLE_KEY=... node scripts/send-magic-links.mjs user1@test.de user2@test.de
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cbybfmnbojklqbkmuwto.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceRoleKey || serviceRoleKey === 'HIER_SERVICE_ROLE_KEY_EINSETZEN') {
  console.error('Bitte SUPABASE_SERVICE_ROLE_KEY setzen.');
  process.exit(1);
}
const redirectTo = 'https://zukunftbauen.org/auth/callback';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Alle User aus Supabase laden
const { data: listData, error: listErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
if (listErr) { console.error('Fehler beim Laden:', listErr.message); process.exit(1); }

let users = listData.users;

// Optional: Filter auf CLI-Argumente
const filterEmails = process.argv.slice(2).map(e => e.toLowerCase());
if (filterEmails.length > 0) {
  users = users.filter(u => filterEmails.includes(u.email));
  console.log(`Filter aktiv: ${users.length} von ${listData.users.length} Usern.\n`);
} else {
  console.log(`${users.length} User in der Datenbank.\n`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ok = 0, fail = 0;

for (const user of users) {
  const name = user.user_metadata?.full_name || '';

  const { error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: user.email,
    options: { redirectTo, data: { full_name: name } },
  });

  if (error) {
    console.error(`FEHLER ${user.email}: ${error.message}`);
    fail++;
  } else {
    console.log(`OK     ${user.email} (${name})`);
    ok++;
  }

  await sleep(2000);
}

console.log(`\nFertig: ${ok} gesendet, ${fail} fehlgeschlagen.`);
