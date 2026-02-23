<script lang="ts">
  import { supabase } from '../lib/supabase';
  import { basePath } from '../lib/paths';
  import { CONTACT_EMAIL } from '../lib/config';

  let name = $state('');
  let email = $state('');
  let comment = $state('');
  let sending = $state(false);
  let sent = $state(false);
  let error = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    sending = true;
    error = '';

    const { error: dbError } = await supabase
      .from('nachmeldung_requests')
      .insert({
        name: name.trim(),
        email: email.trim(),
        comment: comment.trim() || null,
      });

    if (dbError) {
      error = 'Fehler beim Senden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.';
      sending = false;
      return;
    }

    sent = true;
    sending = false;
  }
</script>

{#if sent}
  <div class="text-center">
    <div class="w-16 h-16 bg-haw-hellblau/20 rounded-full flex items-center justify-center mx-auto mb-4">
      <span class="text-2xl text-haw-blau">&#10003;</span>
    </div>
    <h1 class="font-serif text-3xl font-bold text-haw-blau mb-4">Anfrage eingegangen</h1>
    <p class="text-haw-blau-70 mb-2">
      Vielen Dank für Ihr Interesse!
    </p>
    <p class="text-haw-blau-70 mb-6">
      Ihre Nachmeldung wird vom Orga-Team geprüft. Sie erhalten eine Rückmeldung
      per E-Mail an <strong>{email}</strong>, sobald über Ihre Anfrage entschieden wurde.
    </p>
    <a href={basePath('/')} class="text-sm text-haw-blau-50 hover:text-haw-blau transition-colors">
      Zurück zur Startseite
    </a>
  </div>
{:else}
  <h1 class="font-serif text-3xl font-bold text-haw-blau mb-2">Nachmeldung</h1>
  <p class="text-haw-blau-70 mb-6">
    Die reguläre Anmeldephase ist abgeschlossen. Wenn Sie dennoch teilnehmen möchten,
    können Sie hier Ihre Kontaktdaten hinterlassen. Das Orga-Team prüft, ob noch
    Plätze verfügbar sind, und meldet sich bei Ihnen.
  </p>

  <div class="haw-gradient-line w-12 mb-6"></div>

  <form onsubmit={handleSubmit} class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-bold text-haw-blau mb-1">Name *</label>
      <input
        id="name"
        type="text"
        bind:value={name}
        required
        class="w-full border border-haw-blau-30 rounded px-4 py-2.5 text-sm focus:border-haw-blau focus:outline-none"
        placeholder="Vor- und Nachname"
      />
    </div>
    <div>
      <label for="email" class="block text-sm font-bold text-haw-blau mb-1">E-Mail *</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        required
        class="w-full border border-haw-blau-30 rounded px-4 py-2.5 text-sm focus:border-haw-blau focus:outline-none"
        placeholder="ihre.email@beispiel.de"
      />
    </div>
    <div>
      <label for="comment" class="block text-sm font-bold text-haw-blau mb-1">Nachricht / Kommentar</label>
      <textarea
        id="comment"
        bind:value={comment}
        rows="4"
        class="w-full border border-haw-blau-30 rounded px-4 py-2.5 text-sm focus:border-haw-blau focus:outline-none resize-y"
        placeholder="Warum möchten Sie teilnehmen? Gibt es etwas, das wir wissen sollten?"
      ></textarea>
    </div>

    {#if error}
      <p class="text-sm text-red-600 bg-red-50 rounded px-4 py-2">{error}</p>
    {/if}

    <button
      type="submit"
      disabled={sending || !name.trim() || !email.trim()}
      class="w-full bg-haw-blau text-white font-bold py-3 px-8 rounded hover:bg-haw-blau-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {sending ? 'Wird gesendet...' : 'Nachmeldung absenden'}
    </button>
  </form>

  <div class="mt-8 p-4 bg-haw-blau-10 rounded text-sm text-haw-blau-70">
    <p class="font-bold text-haw-blau mb-1">Direkt Kontakt aufnehmen?</p>
    <p>
      Sie können auch direkt eine E-Mail an
      <a href={`mailto:${CONTACT_EMAIL}`} class="text-haw-blau underline">{CONTACT_EMAIL}</a>
      senden.
    </p>
  </div>
{/if}
