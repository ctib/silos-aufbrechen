<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../lib/supabase';
  import { basePath } from '../lib/paths';
  import {
    INTERNAL_EMAIL_DOMAIN,
    FEST_CONTACT_EMAIL,
    FEST_PHASES,
    currentPhase,
    festDateLabel,
  } from '../lib/ifbFest';

  interface Author {
    full_name: string | null;
  }
  type GuestType = 'vip' | 'alumni' | 'normal';

  interface Guest {
    id: string;
    created_by: string;
    name: string;
    organization: string | null;
    role_title: string | null;
    email: string | null;
    guest_type: GuestType;
    note: string | null;
    created_at: string;
    profiles?: Author;
  }
  interface Talk {
    id: string;
    created_by: string;
    title: string | null;
    speaker_name: string | null;
    speaker_affiliation: string | null;
    abstract: string | null;
    preferred_day: string | null;
    duration_minutes: number | null;
    created_at: string;
    profiles?: Author;
  }
  interface Alumnus {
    id: string;
    created_by: string;
    student_name: string;
    graduation_year: number | null;
    thesis_title: string | null;
    degree: string | null;
    reason: string | null;
    contact: string | null;
    created_at: string;
    profiles?: Author;
  }

  type Tab = 'gaeste' | 'vortraege' | 'arbeiten';

  let loading = $state(true);
  let userId = $state<string | null>(null);
  let userEmail = $state<string | null>(null);
  let isInternal = $state(false);
  let isModerator = $state(false);
  let activeTab = $state<Tab>('gaeste');
  let loadError = $state('');
  let saveError = $state('');

  let guests = $state<Guest[]>([]);
  let talks = $state<Talk[]>([]);
  let alumni = $state<Alumnus[]>([]);

  // Login
  let loginEmail = $state('');
  let loginSending = $state(false);
  let loginMessage = $state('');
  let loginError = $state('');

  const phase = currentPhase();
  const phaseNumber = FEST_PHASES.findIndex((p) => p.id === phase.id) + 1;

  onMount(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      loading = false;
      return;
    }

    userId = session.user.id;
    userEmail = session.user.email ?? null;

    // Eigene Fest-Anmeldung lesen – daraus ergibt sich der Zugang
    const { data: reg } = await supabase
      .from('ifb_fest_registrations')
      .select('is_internal, is_moderator, status')
      .ilike('email', session.user.email ?? '')
      .maybeSingle();

    isInternal = Boolean(reg?.is_internal) && reg?.status !== 'cancelled';
    isModerator = Boolean(reg?.is_moderator);

    if (isInternal) await loadAll();
    loading = false;
  });

  async function loadAll() {
    const [g, t, a] = await Promise.all([
      supabase
        .from('ifb_fest_guests')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false }),
      supabase
        .from('ifb_fest_talks')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false }),
      supabase
        .from('ifb_fest_alumni')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false }),
    ]);

    if (g.error || t.error || a.error) {
      console.error('Fest-Beiträge laden fehlgeschlagen:', g.error || t.error || a.error);
      loadError = 'Die Beiträge konnten nicht geladen werden. Bitte Seite neu laden.';
      return;
    }

    guests = (g.data ?? []) as Guest[];
    talks = (t.data ?? []) as Talk[];
    alumni = (a.data ?? []) as Alumnus[];
    loadError = '';
  }

  async function sendLoginLink(e: Event) {
    e.preventDefault();
    const address = loginEmail.trim().toLowerCase();
    if (!address) return;

    loginSending = true;
    loginError = '';
    loginMessage = '';

    const { data: registered } = await supabase.rpc('ifb_fest_is_registered', {
      check_email: address,
    });

    if (!registered) {
      loginError =
        'Zu dieser Adresse liegt noch keine Anmeldung vor. Bitte melden Sie sich zuerst auf der Fest-Seite an.';
      loginSending = false;
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: address,
      // Zurück in den Fest-Bereich; /auth/callback gehört zur alten Veranstaltung
      options: {
        emailRedirectTo: window.location.origin + basePath('/intern/10-jahre-ifb'),
      },
    });

    if (error) {
      loginError =
        error.status === 429
          ? 'Bitte warten Sie eine Minute, bevor Sie einen neuen Zugangslink anfordern.'
          : `Der Zugangslink konnte nicht gesendet werden: ${error.message}`;
    } else {
      loginMessage = `Zugangslink an ${address} gesendet. Bitte prüfen Sie Ihr Postfach.`;
    }
    loginSending = false;
  }

  // ---------- Formulare ----------

  let guestForm = $state({
    name: '',
    organization: '',
    role_title: '',
    email: '',
    guest_type: 'normal' as GuestType,
    note: '',
  });

  let talkForm = $state({
    speaker_name: '',
    speaker_affiliation: '',
    title: '',
    abstract: '',
    preferred_day: '',
    duration_minutes: 20,
  });

  let alumniForm = $state({
    student_name: '',
    graduation_year: '',
    thesis_title: '',
    degree: '',
    reason: '',
    contact: '',
  });

  let saving = $state(false);

  async function addGuest(e: Event) {
    e.preventDefault();
    if (!userId || guestForm.name.trim().length < 2) return;
    saving = true;
    saveError = '';

    const { error } = await supabase.from('ifb_fest_guests').insert({
      created_by: userId,
      name: guestForm.name.trim(),
      organization: guestForm.organization.trim() || null,
      role_title: guestForm.role_title.trim() || null,
      email: guestForm.email.trim() || null,
      guest_type: guestForm.guest_type,
      note: guestForm.note.trim() || null,
    });

    if (error) {
      saveError = `Gast konnte nicht gespeichert werden: ${error.message}`;
    } else {
      guestForm = {
        name: '',
        organization: '',
        role_title: '',
        email: '',
        guest_type: 'normal',
        note: '',
      };
      await loadAll();
    }
    saving = false;
  }

  async function addTalk(e: Event) {
    e.preventDefault();
    if (!userId || !talkCanSubmit) return;
    saving = true;
    saveError = '';

    const { error } = await supabase.from('ifb_fest_talks').insert({
      created_by: userId,
      speaker_name: talkForm.speaker_name.trim() || null,
      speaker_affiliation: talkForm.speaker_affiliation.trim() || null,
      title: talkForm.title.trim() || null,
      abstract: talkForm.abstract.trim() || null,
      preferred_day: talkForm.preferred_day || null,
      duration_minutes: talkForm.duration_minutes || null,
    });

    if (error) {
      saveError = `Vorschlag konnte nicht gespeichert werden: ${error.message}`;
    } else {
      talkForm = {
        speaker_name: '',
        speaker_affiliation: '',
        title: '',
        abstract: '',
        preferred_day: '',
        duration_minutes: 20,
      };
      await loadAll();
    }
    saving = false;
  }

  async function addAlumnus(e: Event) {
    e.preventDefault();
    if (!userId || alumniForm.student_name.trim().length < 2) return;
    saving = true;
    saveError = '';

    const year = parseInt(alumniForm.graduation_year, 10);
    const { error } = await supabase.from('ifb_fest_alumni').insert({
      created_by: userId,
      student_name: alumniForm.student_name.trim(),
      graduation_year: Number.isFinite(year) ? year : null,
      thesis_title: alumniForm.thesis_title.trim() || null,
      degree: alumniForm.degree || null,
      reason: alumniForm.reason.trim() || null,
      contact: alumniForm.contact.trim() || null,
    });

    if (error) {
      saveError = `Vorschlag konnte nicht gespeichert werden: ${error.message}`;
    } else {
      alumniForm = {
        student_name: '',
        graduation_year: '',
        thesis_title: '',
        degree: '',
        reason: '',
        contact: '',
      };
      await loadAll();
    }
    saving = false;
  }

  async function remove(table: string, id: string) {
    saveError = '';
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      saveError = `Eintrag konnte nicht gelöscht werden: ${error.message}`;
      return;
    }
    await loadAll();
  }

  /** Person oder Thema – eines von beidem muss angegeben sein */
  const talkCanSubmit = $derived(
    talkForm.speaker_name.trim().length >= 2 || talkForm.title.trim().length >= 3
  );

  const GUEST_TYPES: Array<{ id: GuestType; label: string; hint: string }> = [
    { id: 'vip', label: 'VIP', hint: 'Ehrengast' },
    { id: 'alumni', label: 'Alumni', hint: 'Ehemalige:r des IfB' },
    { id: 'normal', label: 'Normal', hint: 'regulärer Gast' },
  ];

  const guestTypeStyles: Record<GuestType, string> = {
    vip: 'bg-amber-100 text-amber-800',
    alumni: 'bg-haw-hellblau/25 text-haw-blau',
    normal: 'bg-haw-blau-10 text-haw-blau-70',
  };

  const guestTypeLabel = (t: GuestType) =>
    GUEST_TYPES.find((g) => g.id === t)?.label ?? t;

  const authorName = (row: { profiles?: Author }) => row.profiles?.full_name || 'Unbekannt';
  const dayLabel = (d: string | null) =>
    d === 'tag1' ? 'Do., 21.10.' : d === 'tag2' ? 'Fr., 22.10.' : 'egal';
  const degreeLabel = (d: string | null) =>
    d === 'bachelor' ? 'Bachelor' : d === 'master' ? 'Master' : d === 'sonstige' ? 'Sonstige' : '–';

  const inputClass =
    'w-full border border-haw-blau-30 rounded px-3 py-2 text-sm focus:border-haw-blau focus:outline-none';

  const tabs: Array<[Tab, string]> = [
    ['gaeste', 'Gäste'],
    ['vortraege', 'Referent:innen'],
    ['arbeiten', 'Abschlussarbeiten'],
  ];

  const counts = $derived({
    gaeste: guests.length,
    vortraege: talks.length,
    arbeiten: alumni.length,
  });
</script>

{#if loading}
  <p class="text-haw-blau-50">Lade …</p>
{:else if !userId}
  <!-- Nicht eingeloggt -->
  <h1 class="font-serif text-3xl font-bold text-haw-blau mb-2">Intern – 10 Jahre IfB</h1>
  <div class="haw-gradient-line w-12 mb-6"></div>
  <p class="text-haw-blau-70 mb-6">
    Dieser Bereich ist für Hochschulangehörige, die sich zum Fest am {festDateLabel()} angemeldet
    haben. Geben Sie Ihre <strong>@{INTERNAL_EMAIL_DOMAIN}</strong>-Adresse ein, wir senden Ihnen
    einen Zugangslink.
  </p>

  <form onsubmit={sendLoginLink} class="space-y-3 max-w-md">
    <input
      type="email"
      bind:value={loginEmail}
      required
      class={inputClass}
      placeholder={`vorname.nachname@${INTERNAL_EMAIL_DOMAIN}`}
    />
    <button
      type="submit"
      disabled={loginSending || !loginEmail.trim()}
      class="bg-haw-blau text-white font-bold py-2.5 px-6 rounded text-sm hover:bg-haw-blau-90 transition-colors disabled:opacity-50 cursor-pointer"
    >
      {loginSending ? 'Wird gesendet …' : 'Zugangslink anfordern'}
    </button>
  </form>

  {#if loginMessage}
    <p class="text-sm text-haw-blau bg-haw-blau-10 rounded px-4 py-2 mt-4">{loginMessage}</p>
  {/if}
  {#if loginError}
    <p class="text-sm text-red-600 bg-red-50 rounded px-4 py-2 mt-4">{loginError}</p>
  {/if}

  <p class="text-sm text-haw-blau-50 mt-6">
    Noch nicht angemeldet?
    <a href={basePath('/veranstaltungen/10-jahre-ifb')} class="text-haw-blau underline">
      Zur Anmeldung
    </a>
  </p>
{:else if !isInternal}
  <!-- Eingeloggt, aber kein interner Zugang -->
  <div class="text-center py-12">
    <h1 class="font-serif text-3xl font-bold text-haw-blau mb-4">Kein Zugang</h1>
    <p class="text-haw-blau-70 mb-2">
      Der interne Fest-Bereich steht Hochschulangehörigen mit einer
      <strong>@{INTERNAL_EMAIL_DOMAIN}</strong>-Adresse offen.
    </p>
    <p class="text-haw-blau-70 mb-6">
      Sie sind als <strong>{userEmail}</strong> angemeldet. Wenn das ein Versehen ist, schreiben Sie
      uns an
      <a href={`mailto:${FEST_CONTACT_EMAIL}`} class="text-haw-blau underline">{FEST_CONTACT_EMAIL}</a>.
    </p>
    <a href={basePath('/veranstaltungen/10-jahre-ifb')} class="text-haw-blau underline text-sm">
      Zur Fest-Seite
    </a>
  </div>
{:else}
  <!-- Interner Bereich -->
  <div class="flex flex-wrap items-start justify-between gap-3 mb-2">
    <h1 class="font-serif text-3xl font-bold text-haw-blau">Intern – 10 Jahre IfB</h1>
    {#if isModerator}
      <span class="text-xs font-bold px-3 py-1 rounded bg-haw-hellblau/20 text-haw-blau">
        Moderator:in
      </span>
    {/if}
  </div>
  <div class="haw-gradient-line w-12 mb-6"></div>

  <div class="p-4 bg-haw-blau-10 rounded text-sm text-haw-blau-70 mb-8">
    <p class="font-bold text-haw-blau mb-1">Phase {phaseNumber} – {phase.label}</p>
    <p>
      Wir sammeln, was das Fest am {festDateLabel()} tragen soll: Gäste, die eingeladen werden
      sollen, Themen für die Vortragsblöcke und herausragende Abschlussarbeiten aus zehn Jahren IfB.
      Alle Einträge sind für das Kollegium sichtbar – eigene Einträge können Sie wieder löschen.
    </p>
  </div>

  {#if loadError}
    <p class="text-sm text-red-600 bg-red-50 rounded px-4 py-2 mb-6">{loadError}</p>
  {/if}
  {#if saveError}
    <p class="text-sm text-red-600 bg-red-50 rounded px-4 py-2 mb-6">{saveError}</p>
  {/if}

  <!-- Tabs -->
  <div class="flex flex-wrap gap-2 mb-6 border-b border-haw-blau-10 pb-3">
    {#each tabs as [id, label] (id)}
      <button
        onclick={() => (activeTab = id)}
        class="px-4 py-2 rounded text-sm border transition-colors cursor-pointer {activeTab === id
          ? 'bg-haw-blau text-white border-haw-blau font-bold'
          : 'border-haw-blau-30 text-haw-blau-70 hover:border-haw-blau'}"
      >
        {label}
        <span class="ml-1 opacity-70">({counts[id]})</span>
      </button>
    {/each}
  </div>

  {#if activeTab === 'gaeste'}
    <!-- ---------- Gäste ---------- -->
    <h2 class="font-bold text-haw-blau mb-1">Gast vorschlagen</h2>
    <p class="text-sm text-haw-blau-50 mb-4">
      Wen sollen wir einladen? Ehrengäste und mögliche Redner:innen bitte markieren.
    </p>

    <form onsubmit={addGuest} class="space-y-3 mb-10 border border-haw-blau-30 rounded p-4">
      <div class="grid sm:grid-cols-2 gap-3">
        <div>
          <label for="g-name" class="block text-xs font-bold text-haw-blau mb-1">Name *</label>
          <input id="g-name" type="text" bind:value={guestForm.name} required class={inputClass} />
        </div>
        <div>
          <label for="g-org" class="block text-xs font-bold text-haw-blau mb-1">
            Organisation
          </label>
          <input id="g-org" type="text" bind:value={guestForm.organization} class={inputClass} />
        </div>
        <div>
          <label for="g-role" class="block text-xs font-bold text-haw-blau mb-1">
            Funktion / Titel
          </label>
          <input id="g-role" type="text" bind:value={guestForm.role_title} class={inputClass} />
        </div>
        <div>
          <label for="g-email" class="block text-xs font-bold text-haw-blau mb-1">
            Kontakt (optional)
          </label>
          <input id="g-email" type="text" bind:value={guestForm.email} class={inputClass} />
        </div>
      </div>

      <fieldset>
        <legend class="block text-xs font-bold text-haw-blau mb-1">Art des Gastes</legend>
        <div class="flex flex-wrap gap-2">
          {#each GUEST_TYPES as type (type.id)}
            <label
              class="flex items-center gap-2 border border-haw-blau-30 rounded px-3 py-2 text-sm cursor-pointer hover:border-haw-blau transition-colors"
            >
              <input
                type="radio"
                name="guest_type"
                value={type.id}
                bind:group={guestForm.guest_type}
                class="accent-haw-blau"
              />
              <span>
                <span class="font-bold text-haw-blau">{type.label}</span>
                <span class="text-haw-blau-50"> – {type.hint}</span>
              </span>
            </label>
          {/each}
        </div>
        <p class="text-xs text-haw-blau-50 mt-2">
          Personen, die reden sollen, bitte unter „Referent:innen“ eintragen.
        </p>
      </fieldset>

      <div>
        <label for="g-note" class="block text-xs font-bold text-haw-blau mb-1">Notiz</label>
        <textarea
          id="g-note"
          bind:value={guestForm.note}
          rows="2"
          class="{inputClass} resize-y"
          placeholder="Bezug zum Institut, wer stellt den Kontakt her …"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={saving || guestForm.name.trim().length < 2}
        class="bg-haw-blau text-white font-bold py-2 px-5 rounded text-sm hover:bg-haw-blau-90 transition-colors disabled:opacity-50 cursor-pointer"
      >
        Gast eintragen
      </button>
    </form>

    {#if guests.length === 0}
      <p class="text-haw-blau-50">Noch keine Gäste vorgeschlagen.</p>
    {:else}
      <div class="space-y-3">
        {#each guests as g (g.id)}
          <div class="border border-haw-blau-30 rounded p-4">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p class="font-bold text-haw-blau">
                  {g.name}
                  <span
                    class="ml-2 text-xs font-bold px-2 py-0.5 rounded {guestTypeStyles[
                      g.guest_type
                    ]}"
                  >
                    {guestTypeLabel(g.guest_type)}
                  </span>
                </p>
                <p class="text-sm text-haw-blau-70">
                  {[g.role_title, g.organization].filter(Boolean).join(' · ') || '–'}
                </p>
                {#if g.email}
                  <p class="text-xs text-haw-blau-50">{g.email}</p>
                {/if}
              </div>
              {#if g.created_by === userId}
                <button
                  onclick={() => remove('ifb_fest_guests', g.id)}
                  class="text-xs text-haw-blau-50 hover:text-red-600 underline cursor-pointer"
                >
                  löschen
                </button>
              {/if}
            </div>
            {#if g.note}
              <p class="text-sm text-haw-blau-70 mt-2">{g.note}</p>
            {/if}
            <p class="text-xs text-haw-blau-50 mt-2">
              eingetragen von {authorName(g)} · {new Date(g.created_at).toLocaleDateString('de-DE')}
            </p>
          </div>
        {/each}
      </div>
    {/if}
  {:else if activeTab === 'vortraege'}
    <!-- ---------- Vortragsthemen ---------- -->
    <h2 class="font-bold text-haw-blau mb-1">Referent:in vorschlagen</h2>
    <p class="text-sm text-haw-blau-50 mb-4">
      Für die Vortragsblöcke und den Festakt – gern auch Sie selbst. Person oder Thema genügt,
      beides ist besser.
    </p>

    <form onsubmit={addTalk} class="space-y-3 mb-10 border border-haw-blau-30 rounded p-4">
      <div class="grid sm:grid-cols-2 gap-3">
        <div>
          <label for="t-speaker" class="block text-xs font-bold text-haw-blau mb-1">
            Name der/des Referent:in
          </label>
          <input
            id="t-speaker"
            type="text"
            bind:value={talkForm.speaker_name}
            class={inputClass}
            placeholder="leer lassen für ein reines Thema"
          />
        </div>
        <div>
          <label for="t-affil" class="block text-xs font-bold text-haw-blau mb-1">
            Organisation / Funktion
          </label>
          <input
            id="t-affil"
            type="text"
            bind:value={talkForm.speaker_affiliation}
            class={inputClass}
          />
        </div>
      </div>
      <div>
        <label for="t-title" class="block text-xs font-bold text-haw-blau mb-1">
          Thema / Arbeitstitel
        </label>
        <input id="t-title" type="text" bind:value={talkForm.title} class={inputClass} />
      </div>
      <div>
        <label for="t-abstract" class="block text-xs font-bold text-haw-blau mb-1">
          Kurzbeschreibung
        </label>
        <textarea
          id="t-abstract"
          bind:value={talkForm.abstract}
          rows="3"
          class="{inputClass} resize-y"
          placeholder="Worum geht es? Wen spricht der Vortrag an?"
        ></textarea>
      </div>
      <div class="grid sm:grid-cols-2 gap-3">
        <div>
          <label for="t-day" class="block text-xs font-bold text-haw-blau mb-1">Wunschtag</label>
          <select id="t-day" bind:value={talkForm.preferred_day} class={inputClass}>
            <option value="">egal</option>
            <option value="tag1">Do., 21.10. – Konferenztag</option>
            <option value="tag2">Fr., 22.10. – Vormittag</option>
          </select>
        </div>
        <div>
          <label for="t-dur" class="block text-xs font-bold text-haw-blau mb-1">
            Dauer (Minuten)
          </label>
          <input
            id="t-dur"
            type="number"
            min="5"
            max="180"
            bind:value={talkForm.duration_minutes}
            class={inputClass}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={saving || !talkCanSubmit}
        class="bg-haw-blau text-white font-bold py-2 px-5 rounded text-sm hover:bg-haw-blau-90 transition-colors disabled:opacity-50 cursor-pointer"
      >
        Vorschlag eintragen
      </button>
    </form>

    {#if talks.length === 0}
      <p class="text-haw-blau-50">Noch keine Referent:innen vorgeschlagen.</p>
    {:else}
      <div class="space-y-3">
        {#each talks as t (t.id)}
          <div class="border border-haw-blau-30 rounded p-4">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p class="font-bold text-haw-blau">{t.speaker_name || t.title}</p>
                {#if t.speaker_name && t.title}
                  <p class="text-sm text-haw-blau-70 italic">{t.title}</p>
                {/if}
                {#if t.speaker_affiliation}
                  <p class="text-xs text-haw-blau-50">{t.speaker_affiliation}</p>
                {/if}
              </div>
              {#if t.created_by === userId}
                <button
                  onclick={() => remove('ifb_fest_talks', t.id)}
                  class="text-xs text-haw-blau-50 hover:text-red-600 underline cursor-pointer"
                >
                  löschen
                </button>
              {/if}
            </div>
            {#if t.abstract}
              <p class="text-sm text-haw-blau-70 mt-2">{t.abstract}</p>
            {/if}
            <p class="text-xs text-haw-blau-50 mt-2">
              {dayLabel(t.preferred_day)}
              {#if t.duration_minutes}· {t.duration_minutes} Min{/if}
              · {authorName(t)}
            </p>
          </div>
        {/each}
      </div>
    {/if}
  {:else}
    <!-- ---------- Abschlussarbeiten ---------- -->
    <h2 class="font-bold text-haw-blau mb-1">Herausragende Abschlussarbeit vorschlagen</h2>
    <p class="text-sm text-haw-blau-50 mb-4">
      Für die Ehrung der besten Arbeiten des letzten Jahrzehnts beim Festakt.
    </p>

    <form onsubmit={addAlumnus} class="space-y-3 mb-10 border border-haw-blau-30 rounded p-4">
      <div class="grid sm:grid-cols-2 gap-3">
        <div>
          <label for="a-name" class="block text-xs font-bold text-haw-blau mb-1">
            Name der/des Studierenden *
          </label>
          <input
            id="a-name"
            type="text"
            bind:value={alumniForm.student_name}
            required
            class={inputClass}
          />
        </div>
        <div>
          <label for="a-year" class="block text-xs font-bold text-haw-blau mb-1">
            Abschlussjahr
          </label>
          <input
            id="a-year"
            type="number"
            min="2015"
            max="2030"
            bind:value={alumniForm.graduation_year}
            class={inputClass}
            placeholder="z. B. 2021"
          />
        </div>
      </div>
      <div>
        <label for="a-thesis" class="block text-xs font-bold text-haw-blau mb-1">
          Titel der Arbeit
        </label>
        <input id="a-thesis" type="text" bind:value={alumniForm.thesis_title} class={inputClass} />
      </div>
      <div class="grid sm:grid-cols-2 gap-3">
        <div>
          <label for="a-degree" class="block text-xs font-bold text-haw-blau mb-1">Abschluss</label>
          <select id="a-degree" bind:value={alumniForm.degree} class={inputClass}>
            <option value="">bitte wählen</option>
            <option value="bachelor">Bachelor</option>
            <option value="master">Master</option>
            <option value="sonstige">Sonstige</option>
          </select>
        </div>
        <div>
          <label for="a-contact" class="block text-xs font-bold text-haw-blau mb-1">
            Kontakt (optional)
          </label>
          <input id="a-contact" type="text" bind:value={alumniForm.contact} class={inputClass} />
        </div>
      </div>
      <div>
        <label for="a-reason" class="block text-xs font-bold text-haw-blau mb-1">Begründung</label>
        <textarea
          id="a-reason"
          bind:value={alumniForm.reason}
          rows="3"
          class="{inputClass} resize-y"
          placeholder="Warum verdient diese Arbeit eine Auszeichnung?"
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={saving || alumniForm.student_name.trim().length < 2}
        class="bg-haw-blau text-white font-bold py-2 px-5 rounded text-sm hover:bg-haw-blau-90 transition-colors disabled:opacity-50 cursor-pointer"
      >
        Vorschlag eintragen
      </button>
    </form>

    {#if alumni.length === 0}
      <p class="text-haw-blau-50">Noch keine Vorschläge eingetragen.</p>
    {:else}
      <div class="space-y-3">
        {#each alumni as a (a.id)}
          <div class="border border-haw-blau-30 rounded p-4">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p class="font-bold text-haw-blau">
                  {a.student_name}
                  {#if a.graduation_year}
                    <span class="font-normal text-haw-blau-50">({a.graduation_year})</span>
                  {/if}
                </p>
                {#if a.thesis_title}
                  <p class="text-sm text-haw-blau-70 italic">{a.thesis_title}</p>
                {/if}
              </div>
              {#if a.created_by === userId}
                <button
                  onclick={() => remove('ifb_fest_alumni', a.id)}
                  class="text-xs text-haw-blau-50 hover:text-red-600 underline cursor-pointer"
                >
                  löschen
                </button>
              {/if}
            </div>
            {#if a.reason}
              <p class="text-sm text-haw-blau-70 mt-2">{a.reason}</p>
            {/if}
            <p class="text-xs text-haw-blau-50 mt-2">
              {degreeLabel(a.degree)}
              {#if a.contact}· {a.contact}{/if}
              · {authorName(a)}
            </p>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
{/if}
