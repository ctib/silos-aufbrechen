/**
 * Manuelle Nachmeldung: User anlegen, registrieren, Magic Link generieren.
 * Nutzt die Admin API (Service Role Key), umgeht Rate Limits.
 *
 * Aufruf:
 *   SUPABASE_SERVICE_ROLE_KEY=... node scripts/approve-nachmeldung.mjs "bastian.lipinski@kiel.de" "Bastian Lipinski"
 *
 * Gibt den Magic Link aus, den du direkt per Email/Chat teilen kannst.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cbybfmnbojklqbkmuwto.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceRoleKey) {
  console.error('Bitte SUPABASE_SERVICE_ROLE_KEY als Umgebungsvariable setzen.');
  process.exit(1);
}

const email = process.argv[2];
const name = process.argv[3] || '';
if (!email) {
  console.error('Aufruf: SUPABASE_SERVICE_ROLE_KEY=... node scripts/approve-nachmeldung.mjs "email@example.de" "Vorname Nachname"');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const redirectTo = 'https://zukunftbauen.org/auth/callback';

// 1. User anlegen (oder bestehenden finden)
let userId = null;

const { data: createData, error: createErr } = await supabase.auth.admin.createUser({
  email,
  email_confirm: true,
  user_metadata: { full_name: name },
});

if (createErr) {
  if (createErr.message.includes('already') || createErr.status === 422) {
    console.log(`User existiert bereits, suche ID...`);
    const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const match = listData?.users?.find(u => u.email === email.toLowerCase());
    if (match) {
      userId = match.id;
      console.log(`Gefunden: ${userId}`);
    } else {
      console.error('User existiert laut Supabase, aber ID nicht gefunden.');
      process.exit(1);
    }
  } else {
    console.error(`Fehler beim Anlegen: ${createErr.message}`);
    process.exit(1);
  }
} else {
  userId = createData.user.id;
  console.log(`User neu angelegt: ${userId}`);
}

// 2. Profil pruefen (handle_new_user Trigger sollte es angelegt haben)
const { data: profile } = await supabase.from('profiles').select('id, role').eq('id', userId).single();
if (!profile) {
  console.log('Profil nicht vorhanden, lege es an...');
  await supabase.from('profiles').insert({
    id: userId,
    full_name: name,
    email: email.toLowerCase(),
    role: 'teilnehmer',
    gdpr_consent: true,
    gdpr_consent_date: new Date().toISOString(),
  });
} else {
  console.log(`Profil vorhanden (Rolle: ${profile.role})`);
}

// 3. Registration anlegen (falls nicht vorhanden)
const { data: reg } = await supabase.from('registrations').select('id').eq('profile_id', userId).single();
if (!reg) {
  const { error: regErr } = await supabase.from('registrations').insert({
    profile_id: userId,
    attends_lecture: true,
    attends_workshop: true,
    attends_dinner: false,
    source: 'nachmeldung',
  });
  if (regErr) {
    console.error(`Registration-Fehler: ${regErr.message}`);
  } else {
    console.log('Registration angelegt.');
  }
} else {
  console.log('Registration existiert bereits.');
}

// 4. Magic Link generieren
const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
  type: 'magiclink',
  email,
  options: { redirectTo },
});

if (linkErr) {
  console.error(`Magic Link Fehler: ${linkErr.message}`);
  process.exit(1);
}

const magicLink = linkData?.properties?.action_link;
console.log(`\n--- Magic Link fuer ${name || email} ---`);
console.log(magicLink);
console.log('\nDiesen Link direkt an die Person senden (per Email, Chat etc.).');
console.log('Der Link ist einmalig gueltig und fuehrt direkt zum Veranstaltungsbereich.');
