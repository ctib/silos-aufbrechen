<script lang="ts">
  import { supabase } from '../lib/supabase';
  import { basePath } from '../lib/paths';
  import {
    BOOKABLE_OPTIONS,
    MEAL_OPTIONS,
    FEST_MAX_COMPANIONS,
    FEST_CONTACT_EMAIL,
    INTERNAL_EMAIL_DOMAIN,
    isInternalEmail,
    currentPhase,
    festIsOver,
    regDeadlineLabel,
    type MealPreference,
  } from '../lib/ifbFest';

  let fullName = $state('');
  let email = $state('');
  let organization = $state('');
  let selectedItems = $state<string[]>(BOOKABLE_OPTIONS.map((o) => o.id));
  let mealPreference = $state<MealPreference>('egal');
  let allergies = $state('');
  let companionCount = $state(0);
  let companionNames = $state('');
  let comment = $state('');
  let gdprConsent = $state(false);

  let sending = $state(false);
  let sent = $state(false);
  let linkSent = $state(false);
  let linkWarning = $state('');
  let error = $state('');

  const phase = currentPhase();
  const isOver = festIsOver();
  /** Phase 1: nur Hochschulangehörige */
  const internalOnly = phase.id === 'intern';
  const isOpen = phase.id === 'intern' || phase.id === 'extern';

  const emailValid = $derived(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()));
  const emailAllowed = $derived(!internalOnly || isInternalEmail(email));
  const willBeInternal = $derived(emailValid && isInternalEmail(email));

  const canSubmit = $derived(
    fullName.trim().length >= 2 &&
      emailValid &&
      emailAllowed &&
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
    linkWarning = '';

    const address = email.trim().toLowerCase();

    const { error: dbError } = await supabase.from('ifb_fest_registrations').insert({
      full_name: fullName.trim(),
      email: address,
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

    // Hochschulangehörige bekommen sofort einen Zugangslink für den
    // internen Fest-Bereich (Moderator:innen-Status).
    if (isInternalEmail(address)) {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: address,
        options: {
          data: { full_name: fullName.trim() },
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin + basePath('/auth/callback'),
        },
      });

      if (otpError) {
        console.error('[IfB-Fest] Zugangslink fehlgeschlagen:', otpError);
        linkWarning =
          'Die Anmeldung ist gespeichert, der Zugangslink konnte aber nicht versendet werden. ' +
          'Sie können ihn jederzeit im internen Bereich erneut anfordern.';
      } else {
        linkSent = true;
      }
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
    <p class="text-haw-blau-70 mb-4">Wir freuen uns auf Sie!</p>

    {#if linkSent}
      <div class="p-4 bg-haw-blau-10 rounded text-left text-sm text-haw-blau-70 mb-4">
        <p class="font-bold text-haw-blau mb-1">Zugangslink unterwegs</p>
        <p>
          An <strong>{email}</strong> ist ein Login-Link für den internen Fest-Bereich gegangen.
          Dort können Sie Gäste, Vortragsthemen und Vorschläge für die Ehrung eintragen.
        </p>
      </div>
    {:else if linkWarning}
      <p class="text-sm text-amber-800 bg-amber-50 rounded px-4 py-3 mb-4 text-left">
        {linkWarning}
      </p>
    {:else}
      <p class="text-haw-blau-70 mb-4">
        Eine Bestätigung geht an <strong>{email}</strong>. Sollte die E-Mail nicht ankommen,
        schauen Sie bitte auch in den Spam-Ordner.
      </p>
    {/if}

    <a
      href={basePath(linkSent ? '/intern/10-jahre-ifb' : '/veranstaltungen')}
      class="text-sm text-haw-blau-50 hover:text-haw-blau transition-colors"
    >
      {linkSent ? 'Zum internen Fest-Bereich' : 'Zur Veranstaltungsübersicht'}
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

  {#if internalOnly}
    <div class="p-4 bg-haw-blau-10 rounded text-sm text-haw-blau-70 mb-6">
      <p class="font-bold text-haw-blau mb-1">Phase 1 – Anmeldung für Hochschulangehörige</p>
      <p>
        Zurzeit können sich Angehörige der HAW Kiel mit einer
        <strong>@{INTERNAL_EMAIL_DOMAIN}</strong>-Adresse anmelden. Sie erhalten einen Zugangslink
        zum internen Fest-Bereich und Moderator:innen-Status, um Gäste, Vortragsthemen und
        Vorschläge für die Ehrung einzubringen.
      </p>
      <p class="mt-2">Ab dem 1. März 2027 öffnet die Anmeldung für alle.</p>
    </div>
  {:else}
    <p class="text-haw-blau-70 mb-6">
      Die Teilnahme ist kostenfrei. Wir bitten um Anmeldung bis zum
      <strong>{regDeadlineLabel()}</strong>, damit wir planen können.
    </p>
  {/if}

  <div class="haw-gradient-line w-12 mb-6"></div>

  <form onsubmit={handleSubmit} class="space-y-6">
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
          placeholder={internalOnly ? `vorname.nachname@${INTERNAL_EMAIL_DOMAIN}` : 'ihre.email@beispiel.de'}
        />
        {#if internalOnly && email.trim() !== '' && !emailAllowed}
          <p class="text-xs text-red-600 mt-1">
            In dieser Phase sind nur Adressen auf <strong>@{INTERNAL_EMAIL_DOMAIN}</strong> möglich.
            Die Anmeldung für alle öffnet am 1. März 2027.
          </p>
        {:else if willBeInternal}
          <p class="text-xs text-haw-blau-50 mt-1">
            Sie erhalten an diese Adresse einen Zugangslink zum internen Fest-Bereich.
          </p>
        {/if}
      </div>
      <div>
        <label for="fest-org" class="block text-sm font-bold text-haw-blau mb-1">
          Organisation / Fachbereich
        </label>
        <input
          id="fest-org"
          type="text"
          bind:value={organization}
          autocomplete="organization"
          class={inputClass}
          placeholder="z. B. FB Medien/Bauwesen, Musterbau GmbH"
        />
      </div>
    </div>

    <fieldset>
      <legend class="block text-sm font-bold text-haw-blau mb-1">
        Woran möchten Sie teilnehmen? *
      </legend>
      <p class="text-xs text-haw-blau-50 mb-3">
        Mehrfachauswahl möglich – bitte mindestens einen Punkt wählen. Änderungen sind bis zum
        Anmeldeschluss möglich.
      </p>
      <div class="space-y-2">
        {#each BOOKABLE_OPTIONS as item (item.id)}
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
              <span class="font-bold text-haw-blau">{item.label}</span>
              {#if item.hint}
                <span class="block text-haw-blau-50">{item.hint}</span>
              {/if}
            </span>
          </label>
        {/each}
      </div>
    </fieldset>

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
