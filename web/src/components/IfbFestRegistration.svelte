<script lang="ts">
  import { supabase } from '../lib/supabase';
  import { basePath } from '../lib/paths';
  import {
    BOOKABLE_PROGRAM,
    MEAL_OPTIONS,
    FEST_MAX_COMPANIONS,
    FEST_CONTACT_EMAIL,
    registrationOpen,
    festIsOver,
    regDeadlineLabel,
    type MealPreference,
  } from '../lib/ifbFest';

  let fullName = $state('');
  let email = $state('');
  let organization = $state('');
  let selectedItems = $state<string[]>(BOOKABLE_PROGRAM.map((p) => p.id));
  let mealPreference = $state<MealPreference>('egal');
  let allergies = $state('');
  let companionCount = $state(0);
  let companionNames = $state('');
  let comment = $state('');
  let gdprConsent = $state(false);

  let sending = $state(false);
  let sent = $state(false);
  let error = $state('');

  const isOpen = registrationOpen();
  const isOver = festIsOver();

  const canSubmit = $derived(
    fullName.trim().length >= 2 &&
      /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()) &&
      selectedItems.length > 0 &&
      gdprConsent &&
      !sending
  );

  function toggleItem(id: string) {
    selectedItems = selectedItems.includes(id)
      ? selectedItems.filter((x) => x !== id)
      : [...selectedItems, id];
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!canSubmit) return;

    sending = true;
    error = '';

    const { error: dbError } = await supabase.from('ifb_fest_registrations').insert({
      full_name: fullName.trim(),
      email: email.trim(),
      organization: organization.trim() || null,
      program_items: selectedItems,
      meal_preference: mealPreference,
      allergies: allergies.trim() || null,
      companion_count: companionCount,
      companion_names: companionNames.trim() || null,
      comment: comment.trim() || null,
      gdpr_consent: gdprConsent,
    });

    if (dbError) {
      error =
        dbError.code === '23505'
          ? 'Unter dieser E-Mail-Adresse liegt bereits eine Anmeldung vor. Bei Änderungswünschen schreiben Sie uns bitte kurz.'
          : 'Die Anmeldung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt.';
      sending = false;
      return;
    }

    sent = true;
    sending = false;
  }

  const inputClass =
    'w-full border border-haw-blau-30 rounded px-4 py-2.5 text-sm focus:border-haw-blau focus:outline-none';
</script>

{#if sent}
  <div class="text-center">
    <div
      class="w-16 h-16 bg-haw-hellblau/20 rounded-full flex items-center justify-center mx-auto mb-4"
    >
      <span class="text-2xl text-haw-blau">&#10003;</span>
    </div>
    <h2 class="font-serif text-3xl font-bold text-haw-blau mb-4">Anmeldung eingegangen</h2>
    <p class="text-haw-blau-70 mb-2">Wir freuen uns auf Sie!</p>
    <p class="text-haw-blau-70 mb-6">
      Eine Bestätigung geht an <strong>{email}</strong>. Sollte die E-Mail nicht ankommen,
      schauen Sie bitte auch in den Spam-Ordner.
    </p>
    <a
      href={basePath('/veranstaltungen')}
      class="text-sm text-haw-blau-50 hover:text-haw-blau transition-colors"
    >
      Zur Veranstaltungsübersicht
    </a>
  </div>
{:else if isOver}
  <div class="p-6 bg-haw-blau-10 rounded text-center">
    <h2 class="font-serif text-2xl font-bold text-haw-blau mb-2">Das Fest hat stattgefunden</h2>
    <p class="text-haw-blau-70">
      Vielen Dank an alle, die dabei waren. Eine Anmeldung ist nicht mehr möglich.
    </p>
  </div>
{:else if !isOpen}
  <div class="p-6 bg-haw-blau-10 rounded text-center">
    <h2 class="font-serif text-2xl font-bold text-haw-blau mb-2">Anmeldeschluss erreicht</h2>
    <p class="text-haw-blau-70">
      Die Anmeldefrist ist am {regDeadlineLabel()} abgelaufen. Wenn Sie kurzfristig
      teilnehmen möchten, schreiben Sie uns gerne an
      <a href={`mailto:${FEST_CONTACT_EMAIL}`} class="text-haw-blau underline"
        >{FEST_CONTACT_EMAIL}</a
      >.
    </p>
  </div>
{:else}
  <h2 class="font-serif text-3xl font-bold text-haw-blau mb-2">Anmeldung</h2>
  <p class="text-haw-blau-70 mb-6">
    Die Teilnahme ist kostenfrei. Wir bitten um Anmeldung bis zum
    <strong>{regDeadlineLabel()}</strong>, damit wir planen können.
  </p>

  <div class="haw-gradient-line w-12 mb-6"></div>

  <form onsubmit={handleSubmit} class="space-y-6">
    <!-- Basisdaten -->
    <div class="space-y-4">
      <div>
        <label for="fest-name" class="block text-sm font-bold text-haw-blau mb-1">Name *</label>
        <input
          id="fest-name"
          type="text"
          bind:value={fullName}
          required
          autocomplete="name"
          class={inputClass}
          placeholder="Vor- und Nachname"
        />
      </div>
      <div>
        <label for="fest-email" class="block text-sm font-bold text-haw-blau mb-1">E-Mail *</label>
        <input
          id="fest-email"
          type="email"
          bind:value={email}
          required
          autocomplete="email"
          class={inputClass}
          placeholder="ihre.email@beispiel.de"
        />
      </div>
      <div>
        <label for="fest-org" class="block text-sm font-bold text-haw-blau mb-1">
          Organisation / Hochschule
        </label>
        <input
          id="fest-org"
          type="text"
          bind:value={organization}
          autocomplete="organization"
          class={inputClass}
          placeholder="z. B. HAW Kiel, Musterbau GmbH"
        />
      </div>
    </div>

    <!-- Programmteile -->
    <fieldset>
      <legend class="block text-sm font-bold text-haw-blau mb-1">
        Woran möchten Sie teilnehmen? *
      </legend>
      <p class="text-xs text-haw-blau-50 mb-3">
        Mehrfachauswahl möglich – bitte mindestens einen Punkt wählen.
      </p>
      <div class="space-y-2">
        {#each BOOKABLE_PROGRAM as item (item.id)}
          <label
            class="flex items-start gap-3 border border-haw-blau-30 rounded px-4 py-3 cursor-pointer hover:border-haw-blau transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              onchange={() => toggleItem(item.id)}
              class="mt-1 accent-haw-blau"
            />
            <span class="text-sm">
              <span class="font-bold text-haw-blau">{item.time} – {item.title}</span>
              {#if item.description}
                <span class="block text-haw-blau-50">{item.description}</span>
              {/if}
            </span>
          </label>
        {/each}
      </div>
    </fieldset>

    <!-- Verpflegung -->
    <fieldset>
      <legend class="block text-sm font-bold text-haw-blau mb-1">Verpflegung</legend>
      <div class="flex flex-wrap gap-2 mb-3">
        {#each MEAL_OPTIONS as option (option.id)}
          <label
            class="flex items-center gap-2 border border-haw-blau-30 rounded px-4 py-2 text-sm cursor-pointer hover:border-haw-blau transition-colors"
          >
            <input
              type="radio"
              name="meal"
              value={option.id}
              bind:group={mealPreference}
              class="accent-haw-blau"
            />
            {option.label}
          </label>
        {/each}
      </div>
      <label for="fest-allergies" class="block text-sm font-bold text-haw-blau mb-1">
        Allergien / Unverträglichkeiten
      </label>
      <input
        id="fest-allergies"
        type="text"
        bind:value={allergies}
        class={inputClass}
        placeholder="z. B. Nussallergie, laktosefrei"
      />
    </fieldset>

    <!-- Begleitpersonen -->
    <fieldset>
      <legend class="block text-sm font-bold text-haw-blau mb-1">Begleitpersonen</legend>
      <div class="flex items-center gap-3 mb-3">
        <label for="fest-companions" class="text-sm text-haw-blau-70">Anzahl</label>
        <input
          id="fest-companions"
          type="number"
          min="0"
          max={FEST_MAX_COMPANIONS}
          bind:value={companionCount}
          class="w-24 border border-haw-blau-30 rounded px-3 py-2 text-sm focus:border-haw-blau focus:outline-none"
        />
        <span class="text-xs text-haw-blau-50">max. {FEST_MAX_COMPANIONS}</span>
      </div>
      {#if companionCount > 0}
        <label for="fest-companion-names" class="block text-sm font-bold text-haw-blau mb-1">
          Namen der Begleitpersonen
        </label>
        <input
          id="fest-companion-names"
          type="text"
          bind:value={companionNames}
          class={inputClass}
          placeholder="durch Komma getrennt"
        />
      {/if}
    </fieldset>

    <!-- Kommentar -->
    <div>
      <label for="fest-comment" class="block text-sm font-bold text-haw-blau mb-1">
        Anmerkungen
      </label>
      <textarea
        id="fest-comment"
        bind:value={comment}
        rows="3"
        class="{inputClass} resize-y"
        placeholder="Barrierefreiheit, Anreise, Grußwort – alles, was wir wissen sollten"
      ></textarea>
    </div>

    <!-- DSGVO -->
    <label class="flex items-start gap-3 text-sm text-haw-blau-70 cursor-pointer">
      <input type="checkbox" bind:checked={gdprConsent} class="mt-1 accent-haw-blau" required />
      <span>
        Ich bin damit einverstanden, dass meine Angaben zur Organisation der Veranstaltung
        gespeichert und verarbeitet werden. Näheres in der
        <a href={basePath('/datenschutz')} class="text-haw-blau underline">Datenschutzerklärung</a>. *
      </span>
    </label>

    {#if error}
      <p class="text-sm text-red-600 bg-red-50 rounded px-4 py-2">{error}</p>
    {/if}

    <button
      type="submit"
      disabled={!canSubmit}
      class="w-full bg-haw-blau text-white font-bold py-3 px-8 rounded hover:bg-haw-blau-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {sending ? 'Wird gesendet...' : 'Verbindlich anmelden'}
    </button>
  </form>

  <div class="mt-8 p-4 bg-haw-blau-10 rounded text-sm text-haw-blau-70">
    <p class="font-bold text-haw-blau mb-1">Fragen zum Fest?</p>
    <p>
      Schreiben Sie an
      <a href={`mailto:${FEST_CONTACT_EMAIL}`} class="text-haw-blau underline"
        >{FEST_CONTACT_EMAIL}</a
      >.
    </p>
  </div>
{/if}
