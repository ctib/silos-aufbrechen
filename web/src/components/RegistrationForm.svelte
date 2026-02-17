<script lang="ts">
  import { supabase } from '../lib/supabase';
  import { basePath } from '../lib/paths';

  // Form state
  let fullName = $state('');
  let email = $state('');
  let background = $state('');
  let attendsLecture = $state(true);
  let attendsWorkshop = $state(true);
  let attendsDinner = $state(false);
  let tablePreference = $state('');
  let companionCount = $state(0);
  let companionUnder16 = $state(false);
  let companionUnder12 = $state(false);
  let showNamePublic = $state(false);
  let gdprConsent = $state(false);

  let step = $state<'form' | 'magic-link-sent' | 'error'>('form');
  let errorMessage = $state('');
  let loading = $state(false);

  // Workshop tables (loaded from Supabase or fallback)
  let tables = $state([
    { id: '1', number: 1, title: 'Nahrungsmittelproduktion in der Stadt' },
    { id: '2', number: 2, title: 'Umweltbildung' },
    { id: '3', number: 3, title: 'Sensorik & Datenauswertung' },
    { id: '4', number: 4, title: 'Gerechten Städtebau fördern' },
    { id: '5', number: 5, title: 'Gebäudetechnik aufwerten' },
  ]);

  // Load tables from Supabase on mount
  import { onMount } from 'svelte';
  onMount(async () => {
    try {
      const { data } = await supabase
        .from('workshop_tables')
        .select('id, number, title')
        .eq('is_active', true)
        .order('number');
      if (data && data.length > 0) {
        tables = data;
      }
    } catch {
      // Use fallback tables
    }
  });

  async function handleSubmit() {
    if (!gdprConsent) {
      errorMessage = 'Bitte stimmen Sie der Datenverarbeitung zu.';
      step = 'error';
      return;
    }

    if (!fullName.trim() || !email.trim()) {
      errorMessage = 'Bitte füllen Sie Name und E-Mail aus.';
      step = 'error';
      return;
    }

    loading = true;
    errorMessage = '';

    try {
      // Send magic link with registration metadata
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          data: {
            full_name: fullName.trim(),
            background: background.trim(),
            attends_lecture: attendsLecture,
            attends_workshop: attendsWorkshop,
            attends_dinner: attendsDinner,
            table_preference: tablePreference || null,
            companion_count: companionCount,
            companion_under_16: companionUnder16,
            companion_under_12: companionUnder12,
            show_name_public: showNamePublic,
            gdpr_consent: gdprConsent,
          },
          emailRedirectTo: window.location.origin + basePath('/auth/callback'),
        },
      });

      if (error) throw error;
      step = 'magic-link-sent';
    } catch (err: any) {
      errorMessage = err.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.';
      step = 'error';
    } finally {
      loading = false;
    }
  }
</script>

{#if step === 'magic-link-sent'}
  <div class="bg-haw-blau-10 rounded-lg p-8 text-center">
    <div class="text-4xl mb-4">&#9993;</div>
    <h2 class="font-serif text-2xl font-bold text-haw-blau mb-2">E-Mail gesendet!</h2>
    <p class="text-haw-blau-70">
      Wir haben einen Bestätigungslink an <strong class="text-haw-blau">{email}</strong> gesendet.
      Bitte klicken Sie auf den Link in der E-Mail, um Ihre Anmeldung abzuschließen.
    </p>
    <p class="text-sm text-haw-blau-50 mt-4">
      Kein Link erhalten? Prüfen Sie Ihren Spam-Ordner oder
      <button onclick={() => { step = 'form'; }} class="underline cursor-pointer">versuchen Sie es erneut</button>.
    </p>
  </div>
{:else}
  <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">

    {#if step === 'error' && errorMessage}
      <div class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
        {errorMessage}
      </div>
    {/if}

    <!-- Persönliche Daten -->
    <fieldset class="space-y-4">
      <legend class="font-bold text-haw-blau text-lg">Persönliche Daten</legend>

      <div>
        <label for="fullName" class="block text-sm font-bold text-haw-blau mb-1">
          Vor- und Nachname <span class="text-haw-orange">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          bind:value={fullName}
          required
          class="w-full border border-haw-blau-30 rounded px-3 py-2 text-haw-blau focus:outline-none focus:ring-2 focus:ring-haw-hellblau focus:border-transparent"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-bold text-haw-blau mb-1">
          E-Mail-Adresse <span class="text-haw-orange">*</span>
        </label>
        <input
          id="email"
          type="email"
          bind:value={email}
          required
          class="w-full border border-haw-blau-30 rounded px-3 py-2 text-haw-blau focus:outline-none focus:ring-2 focus:ring-haw-hellblau focus:border-transparent"
        />
      </div>

      <div>
        <label for="background" class="block text-sm font-bold text-haw-blau mb-1">
          (Fachlicher) Hintergrund
        </label>
        <input
          id="background"
          type="text"
          bind:value={background}
          placeholder="z.B. Bausektor, Wirtschaft, Landwirtschaft, Informatik, ..."
          class="w-full border border-haw-blau-30 rounded px-3 py-2 text-haw-blau placeholder:text-haw-blau-30 focus:outline-none focus:ring-2 focus:ring-haw-hellblau focus:border-transparent"
        />
      </div>
    </fieldset>

    <div class="haw-gradient-line w-12"></div>

    <!-- Teilnahme -->
    <fieldset class="space-y-3">
      <legend class="font-bold text-haw-blau text-lg">Teilnahme an</legend>

      <label class="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" bind:checked={attendsLecture} class="w-4 h-4 accent-haw-blau" />
        <span>Vorträge & Antrittsvorlesung (15:00 – 16:45)</span>
      </label>

      <label class="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" bind:checked={attendsWorkshop} class="w-4 h-4 accent-haw-blau" />
        <span>Workshop (17:15 – 18:30)</span>
      </label>

      <label class="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" bind:checked={attendsDinner} class="w-4 h-4 accent-haw-blau" />
        <span>Abendprogramm mit musikalischer Begleitung (ab 19:00)</span>
      </label>
    </fieldset>

    <!-- Workshoptisch -->
    {#if attendsWorkshop}
      <fieldset class="space-y-2">
        <legend class="font-bold text-haw-blau text-lg">Wunsch-Workshoptisch</legend>
        <p class="text-sm text-haw-blau-50 mb-2">An welchem Tisch möchten Sie arbeiten?</p>
        <select
          bind:value={tablePreference}
          class="w-full border border-haw-blau-30 rounded px-3 py-2 text-haw-blau focus:outline-none focus:ring-2 focus:ring-haw-hellblau focus:border-transparent"
        >
          <option value="">— Bitte wählen —</option>
          {#each tables as table}
            <option value={table.id}>Tisch {table.number}: {table.title}</option>
          {/each}
        </select>
      </fieldset>
    {/if}

    <div class="haw-gradient-line w-12"></div>

    <!-- Begleitung -->
    <fieldset class="space-y-3">
      <legend class="font-bold text-haw-blau text-lg">Begleitung</legend>

      <div>
        <label for="companions" class="block text-sm font-bold text-haw-blau mb-1">
          Anzahl Begleitpersonen
        </label>
        <input
          id="companions"
          type="number"
          min="0"
          max="5"
          bind:value={companionCount}
          class="w-24 border border-haw-blau-30 rounded px-3 py-2 text-haw-blau focus:outline-none focus:ring-2 focus:ring-haw-hellblau focus:border-transparent"
        />
      </div>

      {#if companionCount > 0}
        <label class="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" bind:checked={companionUnder16} class="w-4 h-4 accent-haw-blau" />
          <span>Begleitung unter 16 Jahren dabei</span>
        </label>

        <label class="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" bind:checked={companionUnder12} class="w-4 h-4 accent-haw-blau" />
          <span>Begleitung unter 12 Jahren dabei</span>
        </label>
      {/if}
    </fieldset>

    <div class="haw-gradient-line w-12"></div>

    <!-- Datenschutz -->
    <fieldset class="space-y-3">
      <legend class="font-bold text-haw-blau text-lg">Datenschutz</legend>

      <label class="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" bind:checked={gdprConsent} required class="w-4 h-4 mt-1 accent-haw-blau" />
        <span class="text-sm">
          Ich stimme der Verarbeitung meiner Daten zum Zweck der Veranstaltungsorganisation zu.
          Die Daten werden nach der Veranstaltung gelöscht, sofern keine weiterführende
          Zusammenarbeit vereinbart wird. <span class="text-haw-orange">*</span>
        </span>
      </label>

      <label class="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" bind:checked={showNamePublic} class="w-4 h-4 mt-1 accent-haw-blau" />
        <span class="text-sm">
          Mein Name darf im internen Bereich der Veranstaltungswebseite für andere
          Teilnehmende sichtbar sein.
        </span>
      </label>
    </fieldset>

    <!-- Submit -->
    <div class="pt-4">
      <button
        type="submit"
        disabled={loading}
        class="w-full bg-haw-blau text-white font-bold py-3 px-8 rounded hover:bg-haw-blau-90 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {#if loading}
          Wird gesendet...
        {:else}
          Anmeldung absenden
        {/if}
      </button>
      <p class="text-xs text-haw-blau-50 mt-2 text-center">
        Sie erhalten einen Bestätigungslink per E-Mail.
      </p>
    </div>
  </form>
{/if}
