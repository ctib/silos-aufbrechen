<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../lib/supabase';
  import { basePath } from '../lib/paths';
  import { FORMS_URL, REG_DEADLINE } from '../lib/config';
  import { callTypeLabel } from '../lib/callTypes';
  import type { UserRole, Profile, Registration, WorkshopTable, ResearchCall } from '../lib/types';

  let loading = $state(true);
  let authenticated = $state(false);
  let profile = $state<Profile | null>(null);
  let registration = $state<Registration | null>(null);
  let participants = $state<Pick<Profile, 'full_name' | 'background'>[]>([]);
  let researchCalls = $state<ResearchCall[]>([]);
  let tables = $state<WorkshopTable[]>([]);
  let userRole = $state<UserRole>('gast');
  let tablePreferences = $state<string[]>([]);

  // Login flow states
  let loginEmail = $state('');
  let loginSending = $state(false);
  let loginMessage = $state('');
  let loginError = $state('');
  let loginErrorType = $state<'generic' | 'not_registered_forms' | 'not_registered_nachmeldung' | ''>('');

  let loadError = $state('');
  let saveError = $state('');

  // Edit mode
  let editing = $state(false);
  let editBackground = $state('');
  let editLecture = $state(true);
  let editWorkshop = $state(true);
  let editDinner = $state(false);
  let editTablePrefs = $state<string[]>([]);
  let editCompanions = $state(0);
  let editCompanionUnder16 = $state(false);
  let editCompanionUnder12 = $state(false);
  let editShowName = $state(false);
  let editGdpr = $state(false);
  let saving = $state(false);

  onMount(async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      loading = false;
      return;
    }

    authenticated = true;

    try {
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Profil laden fehlgeschlagen:', profileError);
        loadError = 'Profil konnte nicht geladen werden.';
        loading = false;
        return;
      }

      if (profileData) {
        profile = profileData;
        userRole = profileData.role;
      }

      // Load own registration
      const { data: regData } = await supabase
        .from('registrations')
        .select('*, workshop_tables(title, number)')
        .eq('profile_id', session.user.id)
        .single();

      if (regData) {
        registration = regData;

        // Load table preferences
        const { data: prefs } = await supabase
          .from('registration_table_preferences')
          .select('table_id')
          .eq('registration_id', regData.id);

        tablePreferences = prefs?.map(p => p.table_id) ?? [];
      }

      // Load public participants
      const { data: pubParticipants } = await supabase
        .from('profiles')
        .select('full_name, background')
        .eq('show_name_public', true);

      if (pubParticipants) participants = pubParticipants;

      // Load workshop tables
      const { data: tablesData } = await supabase
        .from('workshop_tables')
        .select('*')
        .eq('is_active', true)
        .order('number');

      if (tablesData) tables = tablesData;

      // Load research calls
      const { data: callsData } = await supabase
        .from('research_calls')
        .select('*, call_table_tags(table_id)')
        .order('deadline', { ascending: true });

      if (callsData) researchCalls = callsData;
    } catch (err) {
      console.error('Daten laden fehlgeschlagen:', err);
      loadError = 'Daten konnten nicht geladen werden. Bitte Seite neu laden.';
    }

    loading = false;
  });

  async function handleLoginRequest(e: Event) {
    e.preventDefault();
    if (!loginEmail.trim()) return;

    loginSending = true;
    loginError = '';
    loginErrorType = '';
    loginMessage = '';

    const email = loginEmail.trim().toLowerCase();

    // Check if email exists in profiles (via RPC, bypasses RLS)
    const { data: isRegistered } = await supabase
      .rpc('check_email_registered', { check_email: email });

    if (isRegistered) {
      // Email is registered – send magic link
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + basePath('/auth/callback'),
        },
      });

      if (error) {
        if (error.message?.includes('rate') || error.message?.includes('limit') || error.status === 429) {
          loginError = 'Bitte warten Sie eine Minute, bevor Sie einen neuen Zugangslink anfordern.';
        } else {
          loginError = 'Fehler beim Senden: ' + (error.message || 'Bitte versuchen Sie es später erneut.');
        }
        loginErrorType = 'generic';
        console.error('[Magic Link]', error.message, error);
      } else {
        loginMessage = `Ein neuer Zugangslink wurde an ${email} gesendet. Bitte prüfen Sie Ihr Postfach.`;
      }
    } else {
      // Email not registered
      const now = new Date();
      if (now < REG_DEADLINE) {
        loginError = 'Diese E-Mail-Adresse ist noch nicht registriert. Bitte melden Sie sich zunächst über das Anmeldeformular an.';
        loginErrorType = 'not_registered_forms';
      } else {
        loginError = 'Diese E-Mail-Adresse ist nicht registriert. Die Anmeldephase ist abgeschlossen.';
        loginErrorType = 'not_registered_nachmeldung';
      }
    }

    loginSending = false;
  }

  function startEditing() {
    editBackground = profile?.background ?? '';
    editLecture = registration?.attends_lecture ?? true;
    editWorkshop = registration?.attends_workshop ?? true;
    editDinner = registration?.attends_dinner ?? false;
    editTablePrefs = [...tablePreferences];
    editCompanions = registration?.companion_count ?? 0;
    editCompanionUnder16 = registration?.companion_under_16 ?? false;
    editCompanionUnder12 = registration?.companion_under_12 ?? false;
    editShowName = profile?.show_name_public ?? false;
    editGdpr = profile?.gdpr_consent ?? false;
    editing = true;
  }

  function toggleTablePref(tableId: string) {
    if (editTablePrefs.includes(tableId)) {
      editTablePrefs = editTablePrefs.filter(t => t !== tableId);
    } else {
      editTablePrefs = [...editTablePrefs, tableId];
    }
  }

  async function saveRegistration() {
    if (!registration || !profile) return;
    saving = true;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { saving = false; return; }

    saveError = '';

    try {
      // Update profile
      const { error: profileErr } = await supabase.from('profiles').update({
        background: editBackground.trim() || null,
        show_name_public: editShowName,
        gdpr_consent: editGdpr,
        gdpr_consent_date: editGdpr ? new Date().toISOString() : null,
      }).eq('id', session.user.id);

      if (profileErr) throw profileErr;

      // Update registration
      const { error: regErr } = await supabase.from('registrations').update({
        attends_lecture: editLecture,
        attends_workshop: editWorkshop,
        attends_dinner: editDinner,
        companion_count: editCompanions,
        companion_under_16: editCompanionUnder16,
        companion_under_12: editCompanionUnder12,
      }).eq('id', registration.id);

      if (regErr) throw regErr;

      // Update table preferences
      await supabase.from('registration_table_preferences')
        .delete()
        .eq('registration_id', registration.id);

      if (editTablePrefs.length > 0) {
        await supabase.from('registration_table_preferences').insert(
          editTablePrefs.map(tableId => ({
            registration_id: registration.id,
            table_id: tableId,
          }))
        );
      }

      // Reload data
      profile = { ...profile, background: editBackground.trim() || null, show_name_public: editShowName, gdpr_consent: editGdpr };
      registration = { ...registration, attends_lecture: editLecture, attends_workshop: editWorkshop, attends_dinner: editDinner, companion_count: editCompanions, companion_under_16: editCompanionUnder16, companion_under_12: editCompanionUnder12 };
      tablePreferences = [...editTablePrefs];

      // Reload participants list
      const { data: pubParticipants } = await supabase
        .from('profiles')
        .select('full_name, background')
        .eq('show_name_public', true);
      if (pubParticipants) participants = pubParticipants;

      editing = false;
    } catch (err) {
      console.error('Speichern fehlgeschlagen:', err);
      saveError = 'Änderungen konnten nicht gespeichert werden. Bitte versuchen Sie es erneut.';
    }

    saving = false;
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = basePath('/');
  }

</script>

{#if loading}
  <div class="text-center py-12">
    <p class="text-haw-blau-70">Laden...</p>
  </div>
{:else if !authenticated}
  <!-- Login Flow -->
  <div class="max-w-lg mx-auto py-12">
    <h1 class="font-serif text-3xl font-bold text-haw-blau mb-4 text-center">Veranstaltungsbereich</h1>

    <div class="bg-haw-blau-10 rounded-lg p-6 mb-8">
      <p class="text-haw-blau-70 text-sm">
        Bitte klicken Sie auf den Zugangslink in der Ihnen zugesendeten E-Mail, um in den Veranstaltungsbereich zu gelangen.
      </p>
    </div>

    <div class="bg-white border border-haw-blau-10 rounded-lg p-6">
      <p class="font-bold text-haw-blau mb-1">Keine E-Mail erhalten?</p>
      <p class="text-sm text-haw-blau-70 mb-4">
        Geben Sie Ihre E-Mail-Adresse ein, um einen neuen Zugangslink anzufordern.
      </p>

      <form onsubmit={handleLoginRequest} class="space-y-3">
        <input
          type="email"
          bind:value={loginEmail}
          required
          placeholder="ihre.email@beispiel.de"
          class="w-full border border-haw-blau-30 rounded px-4 py-2.5 text-sm focus:border-haw-blau focus:outline-none"
        />

        <button
          type="submit"
          disabled={loginSending || !loginEmail.trim()}
          class="w-full bg-haw-blau text-white font-bold py-3 px-8 rounded hover:bg-haw-blau-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loginSending ? 'Wird geprüft...' : 'Zugangslink anfordern'}
        </button>
      </form>

      {#if loginMessage}
        <div class="mt-4 bg-haw-hellblau/20 text-haw-blau rounded p-3 text-sm">
          {loginMessage}
        </div>
      {/if}

      {#if loginError}
        <div class="mt-4 bg-red-50 text-red-700 rounded p-3 text-sm">
          {loginError}
          {#if loginErrorType === 'not_registered_forms'}
            <a href={FORMS_URL} target="_blank" rel="noopener noreferrer" class="underline ml-1">Zum Anmeldeformular</a>
          {:else if loginErrorType === 'not_registered_nachmeldung'}
            <a href={basePath('/nachmeldung')} class="underline ml-1">Nachmeldung anfragen</a>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{:else}
  <!-- Authenticated: Internal Area -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
    <div>
      <h1 class="font-serif text-3xl font-bold text-haw-blau">Veranstaltungsbereich</h1>
      <p class="text-haw-blau-70">
        Willkommen, {profile?.full_name}
        {#if userRole !== 'teilnehmer'}
          <span class="text-xs bg-haw-hellblau text-haw-blau px-2 py-0.5 rounded-full ml-2 font-bold uppercase">
            {userRole}
          </span>
        {/if}
      </p>
    </div>
    <div class="flex gap-3">
      {#if userRole === 'admin' || userRole === 'orga'}
        <a href={basePath('/admin')} class="text-sm bg-haw-blau-10 text-haw-blau px-4 py-2 rounded hover:bg-haw-blau-30 transition-colors">
          Forschungsmöglichkeiten
        </a>
      {/if}
      {#if userRole === 'orga'}
        <a href={basePath('/orga')} class="text-sm bg-haw-blau-10 text-haw-blau px-4 py-2 rounded hover:bg-haw-blau-30 transition-colors">
          Orga
        </a>
      {/if}
      <button
        onclick={handleLogout}
        class="text-sm text-haw-blau-50 hover:text-haw-blau transition-colors cursor-pointer"
      >
        Abmelden
      </button>
    </div>
  </div>

  <div class="haw-gradient-line w-16 mb-8"></div>

  {#if loadError}
    <div class="bg-red-50 text-red-700 rounded-lg p-3 text-sm mb-6">{loadError}</div>
  {/if}

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Left column: Own registration + Participants -->
    <div class="lg:col-span-2 space-y-8">

      <!-- Own Registration -->
      {#if registration}
        <div class="bg-white border border-haw-blau-10 rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-bold text-haw-blau text-lg">Ihre Anmeldung</h2>
            {#if !editing}
              <button
                onclick={startEditing}
                class="text-sm text-haw-blau-50 hover:text-haw-blau cursor-pointer"
              >Bearbeiten</button>
            {/if}
          </div>

          {#if editing}
            <!-- Edit Form -->
            <div class="space-y-5">
              <div>
                <label class="block text-sm font-bold text-haw-blau mb-1">Fachlicher Hintergrund</label>
                <input
                  type="text"
                  bind:value={editBackground}
                  placeholder="z.B. Bausektor, Wirtschaft, Landwirtschaft, Informatik, ..."
                  class="w-full border border-haw-blau-30 rounded px-3 py-2 text-sm focus:border-haw-blau focus:outline-none"
                />
              </div>

              <fieldset class="space-y-2">
                <legend class="text-sm font-bold text-haw-blau">Teilnahme an</legend>
                <label class="flex items-center gap-3 cursor-pointer text-sm">
                  <input type="checkbox" bind:checked={editLecture} class="w-4 h-4 accent-haw-blau" />
                  <span>Vorträge & Antrittsvorlesung (15:00 – 16:45)</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer text-sm">
                  <input type="checkbox" bind:checked={editWorkshop} class="w-4 h-4 accent-haw-blau" />
                  <span>Workshop (17:15 – 18:30)</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer text-sm">
                  <input type="checkbox" bind:checked={editDinner} class="w-4 h-4 accent-haw-blau" />
                  <span>Abendprogramm mit musikalischer Begleitung (ab 19:00)</span>
                </label>
              </fieldset>

              {#if editWorkshop}
                <fieldset>
                  <legend class="text-sm font-bold text-haw-blau mb-2">Wunsch-Workshoptische (Mehrfachauswahl)</legend>
                  <div class="flex flex-wrap gap-2">
                    {#each tables as table}
                      <button
                        type="button"
                        onclick={() => toggleTablePref(table.id)}
                        class="text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors
                          {editTablePrefs.includes(table.id)
                            ? 'bg-haw-blau text-white'
                            : 'bg-haw-blau-10 text-haw-blau-50 hover:bg-haw-blau-30 hover:text-haw-blau'}"
                      >T{table.number}: {table.title}</button>
                    {/each}
                  </div>
                </fieldset>
              {/if}

              <fieldset class="space-y-2">
                <legend class="text-sm font-bold text-haw-blau">Begleitung</legend>
                <div class="flex items-center gap-3">
                  <label class="text-sm">Anzahl Begleitpersonen:</label>
                  <input type="number" min="0" max="5" bind:value={editCompanions}
                    class="w-20 border border-haw-blau-30 rounded px-2 py-1 text-sm focus:border-haw-blau focus:outline-none" />
                </div>
                {#if editCompanions > 0}
                  <label class="flex items-center gap-3 cursor-pointer text-sm">
                    <input type="checkbox" bind:checked={editCompanionUnder16} class="w-4 h-4 accent-haw-blau" />
                    <span>Begleitung unter 16 Jahren dabei</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer text-sm">
                    <input type="checkbox" bind:checked={editCompanionUnder12} class="w-4 h-4 accent-haw-blau" />
                    <span>Begleitung unter 12 Jahren dabei</span>
                  </label>
                {/if}
              </fieldset>

              <fieldset class="space-y-2">
                <legend class="text-sm font-bold text-haw-blau">Datenschutz</legend>
                <label class="flex items-start gap-3 cursor-pointer text-sm">
                  <input type="checkbox" bind:checked={editGdpr} class="w-4 h-4 mt-0.5 accent-haw-blau" />
                  <span>Ich stimme der Verarbeitung meiner Daten zum Zweck der Veranstaltungsorganisation zu.</span>
                </label>
                <label class="flex items-start gap-3 cursor-pointer text-sm">
                  <input type="checkbox" bind:checked={editShowName} class="w-4 h-4 mt-0.5 accent-haw-blau" />
                  <span>Mein Name darf im Veranstaltungsbereich für andere Teilnehmende sichtbar sein.</span>
                </label>
              </fieldset>

              {#if saveError}
                <div class="bg-red-50 text-red-700 rounded p-3 text-sm">{saveError}</div>
              {/if}

              <div class="flex gap-3 pt-2">
                <button
                  onclick={saveRegistration}
                  disabled={saving}
                  class="bg-haw-blau text-white px-6 py-2 rounded text-sm font-bold cursor-pointer hover:bg-haw-blau-90 disabled:opacity-50"
                >{saving ? 'Speichern...' : 'Speichern'}</button>
                <button
                  onclick={() => editing = false}
                  class="text-sm text-haw-blau-50 px-4 py-2 cursor-pointer hover:text-haw-blau"
                >Abbrechen</button>
              </div>
            </div>
          {:else}
            <!-- Read-only view -->
            <div class="grid grid-cols-2 gap-3 text-sm">
              {#if profile?.background}
                <div class="col-span-2">
                  <p class="text-haw-blau-50">Fachlicher Hintergrund</p>
                  <p class="font-bold">{profile.background}</p>
                </div>
              {/if}
              <div>
                <p class="text-haw-blau-50">Vorträge</p>
                <p class="font-bold">{registration.attends_lecture ? 'Ja' : 'Nein'}</p>
              </div>
              <div>
                <p class="text-haw-blau-50">Workshop</p>
                <p class="font-bold">{registration.attends_workshop ? 'Ja' : 'Nein'}</p>
              </div>
              <div>
                <p class="text-haw-blau-50">Abendprogramm</p>
                <p class="font-bold">{registration.attends_dinner ? 'Ja' : 'Nein'}</p>
              </div>
              <div>
                <p class="text-haw-blau-50">Workshoptische</p>
                <p class="font-bold">
                  {#if tablePreferences.length > 0}
                    {tablePreferences.map(tp => {
                      const t = tables.find(t => t.id === tp);
                      return t ? `T${t.number}` : '';
                    }).filter(Boolean).join(', ')}
                  {:else}
                    Nicht gewählt
                  {/if}
                </p>
              </div>
              <div>
                <p class="text-haw-blau-50">Begleitung</p>
                <p class="font-bold">{registration.companion_count} Person(en)</p>
              </div>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Participants list -->
      <div class="bg-white border border-haw-blau-10 rounded-lg p-6">
        <h2 class="font-bold text-haw-blau text-lg mb-4">
          Teilnehmende ({participants.length})
        </h2>
        {#if participants.length === 0}
          <p class="text-sm text-haw-blau-50">Noch keine öffentlichen Teilnehmenden.</p>
        {:else}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {#each participants as p}
              <div class="flex items-center gap-2 py-1">
                <span class="w-2 h-2 rounded-full bg-haw-hellblau shrink-0"></span>
                <span class="font-bold">{p.full_name}</span>
                {#if p.background}
                  <span class="text-haw-blau-50">({p.background})</span>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Right column: Research Calls -->
    <div>
      <div class="bg-white border border-haw-blau-10 rounded-lg p-6">
        <h2 class="font-bold text-haw-blau text-lg mb-4">Forschungscalls & Konferenzen</h2>
        {#if researchCalls.length === 0}
          <p class="text-sm text-haw-blau-50">Noch keine Einträge vorhanden.</p>
        {:else}
          <div class="space-y-4">
            {#each researchCalls as call}
              <div class="border-b border-haw-blau-10 pb-3 last:border-0">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-bold text-sm text-haw-blau">{call.title}</h3>
                  <span class="text-[10px] bg-haw-blau-10 text-haw-blau px-2 py-0.5 rounded shrink-0">
                    {callTypeLabel(call.call_type)}
                  </span>
                </div>
                {#if call.description}
                  <p class="text-xs text-haw-blau-70 mt-1">{call.description}</p>
                {/if}
                <div class="flex items-center gap-3 mt-2 text-xs text-haw-blau-50">
                  {#if call.deadline}
                    <span>Deadline: {new Date(call.deadline).toLocaleDateString('de-DE')}</span>
                  {/if}
                  {#if call.url}
                    <a href={call.url} target="_blank" rel="noopener noreferrer" class="text-haw-hellblau hover:underline">
                      Link
                    </a>
                  {/if}
                </div>
                {#if call.call_table_tags?.length > 0}
                  <div class="flex gap-1 mt-2">
                    {#each call.call_table_tags as tag}
                      {@const table = tables.find(t => t.id === tag.table_id)}
                      {#if table}
                        <span class="text-[10px] bg-haw-hellblau-20 text-haw-blau px-1.5 py-0.5 rounded">
                          Tisch {table.number}
                        </span>
                      {/if}
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Workshop Tables links (for Studis) -->
      {#if userRole === 'studi' || userRole === 'orga'}
        <div class="bg-white border border-haw-blau-10 rounded-lg p-6 mt-6">
          <h2 class="font-bold text-haw-blau text-lg mb-4">Workshoptische</h2>
          <div class="space-y-2">
            {#each tables as table}
              <a
                href={basePath(`/tisch/${table.number}`)}
                class="block p-3 rounded border border-haw-blau-10 hover:bg-haw-blau-10 transition-colors"
              >
                <p class="font-bold text-sm text-haw-blau">Tisch {table.number}: {table.title}</p>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}
