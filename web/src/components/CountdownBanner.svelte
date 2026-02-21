<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { basePath } from '../lib/paths';
  import { supabase } from '../lib/supabase';

  const FORMS_URL = 'https://forms.office.com/pages/responsepage.aspx?id=SlFZYNubNECdLWtc9Zdpa95yTsFJlbBDntdDxMV4KBtUNjdTUzM4NVpXSkc5Tk9OM1JEUlJNNFNPMi4u&route=shorturl';
  const REG_DEADLINE = new Date('2026-04-24T23:59:59');
  const EVENT_DATE = new Date('2026-05-07T14:30:00');
  const EVENT_END = new Date('2026-05-07T20:00:00');

  // Phase definitions
  const phases = [
    { id: 'anmeldung', label: 'Anmeldephase', until: REG_DEADLINE },
    { id: 'vorbereitung', label: 'Vorbereitungsphase', until: EVENT_DATE },
    { id: 'durchfuehrung', label: 'Durchführungsphase', until: EVENT_END },
  ] as const;

  let now = $state(new Date());
  let interval: ReturnType<typeof setInterval>;
  let phaseOverride = $state<string | null>(null);
  let isOrga = $state(false);

  // Computed current phase based on date
  const autoPhase = $derived(
    now < REG_DEADLINE ? 'anmeldung'
    : now < EVENT_DATE ? 'vorbereitung'
    : 'durchfuehrung'
  );
  const activePhase = $derived(phaseOverride ?? autoPhase);

  function togglePhase(id: string) {
    if (!isOrga) return;
    phaseOverride = phaseOverride === id ? null : id;
  }

  // Registration countdown (days only)
  const regDiff = $derived(REG_DEADLINE.getTime() - now.getTime());
  const regExpired = $derived(activePhase !== 'anmeldung');
  const regDays = $derived(Math.ceil(regDiff / (1000 * 60 * 60 * 24)));

  // Event countdown (full precision)
  const eventDiff = $derived(EVENT_DATE.getTime() - now.getTime());
  const eventExpired = $derived(eventDiff <= 0);
  const eventDays = $derived(Math.floor(eventDiff / (1000 * 60 * 60 * 24)));
  const eventHours = $derived(Math.floor((eventDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const eventMinutes = $derived(Math.floor((eventDiff % (1000 * 60 * 60)) / (1000 * 60)));
  const eventSeconds = $derived(Math.floor((eventDiff % (1000 * 60)) / 1000));

  onMount(async () => {
    interval = setInterval(() => { now = new Date(); }, 1000);

    // Check if logged-in user has orga role
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        isOrga = profile?.role === 'orga';
      }
    } catch {
      // Not logged in or no profile – phase override stays disabled
    }
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });

  function generateICS(): string {
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HAW Kiel//Silos aufbrechen//DE',
      'BEGIN:VEVENT',
      'DTSTART:20260507T143000',
      'DTEND:20260507T200000',
      'SUMMARY:Silos aufbrechen – Zukunft bauen',
      'DESCRIPTION:Interdisziplinärer Workshop für visionäre Köpfe unserer Region.\\nAntrittsvorlesung Prof. Dr.-Ing. Christoph Göbel mit Impulsen von Prof. Dr. Meike Wocken und Prof. Dr. Tammo Peters.\\n\\nProgramm: 14:30 Empfang\\, 15:00 Begrüßung\\, 15:15-16:45 Vorträge\\, 17:15 Workshop\\, ab 19:00 Ausklang.\\n\\nAnmeldung: ' + FORMS_URL,
      'LOCATION:HAW Kiel\\, Kiel',
      'URL:' + FORMS_URL,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
  }

  function downloadICS() {
    const blob = new Blob([generateICS()], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'silos-aufbrechen-2026.ics';
    a.click();
    URL.revokeObjectURL(url);
  }

  function googleCalendarUrl(): string {
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + '&text=' + encodeURIComponent('Silos aufbrechen – Zukunft bauen')
      + '&dates=20260507T143000/20260507T200000'
      + '&details=' + encodeURIComponent('Interdisziplinärer Workshop für visionäre Köpfe unserer Region.\nAntrittsvorlesung Prof. Dr.-Ing. Christoph Göbel.\n\nAnmeldung: ' + FORMS_URL)
      + '&location=' + encodeURIComponent('HAW Kiel, Kiel');
  }
</script>

<!-- Phase Timeline -->
<div class="bg-white border-b border-haw-blau-10">
  <div class="max-w-4xl mx-auto px-4 py-3">
    <div class="flex items-center justify-between">
      {#each phases as phase, i}
        {#if i > 0}
          <div class="flex-1 h-0.5 mx-1 sm:mx-2 {activePhase === phase.id || activePhase === phases[i - 1].id ? 'bg-haw-blau' : 'bg-haw-blau-30'}"></div>
        {/if}
        <button
          onclick={() => togglePhase(phase.id)}
          disabled={!isOrga}
          class="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all whitespace-nowrap
            {isOrga ? 'cursor-pointer' : 'cursor-default'}
            {activePhase === phase.id
              ? 'bg-haw-blau text-white font-bold shadow-sm'
              : isOrga
                ? 'bg-haw-blau-10 text-haw-blau-50 hover:bg-haw-blau-30 hover:text-haw-blau'
                : 'bg-haw-blau-10 text-haw-blau-50'}"
        >
          <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0
            {activePhase === phase.id ? 'bg-white text-haw-blau' : 'bg-haw-blau-30 text-white'}"
          >{i + 1}</span>
          <span class="hidden sm:inline">{phase.label}</span>
          <span class="sm:hidden">{phase.label.replace('phase', '')}</span>
        </button>
      {/each}
    </div>
    {#if phaseOverride}
      <p class="text-[10px] text-haw-orange mt-1 ml-1">Vorschau – Phase manuell umgeschaltet
        <button onclick={() => phaseOverride = null} class="underline cursor-pointer">zurücksetzen</button>
      </p>
    {/if}
  </div>
</div>

<!-- Event Countdown (always visible until event) -->
{#if !eventExpired || activePhase === 'durchfuehrung'}
  <div class="bg-haw-blau text-white py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Date + Calendar + Registration in one row -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <!-- Left: Date + Calendar Export -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <p class="text-2xl sm:text-3xl font-bold">7. Mai 2026</p>
            <p class="text-haw-hellblau">14:30 – 20:00 Uhr, HAW Kiel</p>
          </div>
          <div class="flex gap-2">
            <button
              onclick={downloadICS}
              class="text-xs bg-white/10 hover:bg-white/20 transition-colors rounded px-3 py-2 cursor-pointer"
              title="iCal-Datei herunterladen"
            >
              iCal
            </button>
            <a
              href={googleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              class="text-xs bg-white/10 hover:bg-white/20 transition-colors rounded px-3 py-2"
              title="In Google Calendar eintragen"
            >
              Google
            </a>
          </div>

          <!-- Registration days (before deadline) -->
          {#if !regExpired}
            <div class="sm:border-l sm:border-white/20 sm:pl-4">
              <p class="text-sm text-haw-hellblau">Anmeldung noch</p>
              <p class="text-2xl font-bold">{regDays} {regDays === 1 ? 'Tag' : 'Tage'}</p>
            </div>
          {/if}
        </div>

        <!-- Right: Phase-dependent action button -->
        <div class="flex flex-col items-center lg:items-end gap-2">
          {#if activePhase === 'anmeldung'}
            <a
              href={FORMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block bg-haw-hellblau text-haw-blau font-bold py-3 px-8 rounded hover:bg-white transition-colors text-lg"
            >
              Jetzt anmelden
            </a>
            <p class="text-xs text-white/50">bis zum 24. April 2026</p>
          {:else if activePhase === 'vorbereitung'}
            <div class="text-right">
              <p class="text-sm text-haw-hellblau mb-2">Anmeldung geschlossen</p>
              <a
                href={basePath('/nachmeldung')}
                class="inline-block bg-haw-hellblau text-haw-blau font-bold py-3 px-8 rounded hover:bg-white transition-colors text-lg"
              >
                Nachmeldung anfragen
              </a>
              <p class="text-xs text-white/50 mt-1">per Kontaktformular</p>
            </div>
          {:else}
            <a
              href={basePath('/intern')}
              class="inline-block bg-haw-hellblau text-haw-blau font-bold py-3 px-8 rounded hover:bg-white transition-colors text-lg"
            >
              Zum internen Bereich
            </a>
          {/if}
        </div>
      </div>

    </div>
  </div>

  <!-- Phase-dependent sub-banner -->
  {#if activePhase === 'durchfuehrung'}
    <div class="bg-haw-orange/10 py-6 px-4 text-center">
      <p class="text-2xl font-bold text-haw-blau">Willkommen zur Veranstaltung!</p>
      <p class="mt-2 text-sm text-haw-blau-70">7. Mai 2026, 14:30 – 20:00 Uhr, HAW Kiel</p>
    </div>
  {:else}
    <!-- Event Countdown -->
    <div class="bg-haw-blau-10 py-6 px-4 text-center">
      <div class="flex justify-center gap-3 sm:gap-5 font-mono text-2xl sm:text-3xl font-bold text-haw-blau">
        <div class="flex flex-col items-center">
          <span class="bg-white rounded px-2 sm:px-3 py-1 shadow-sm">{String(eventDays).padStart(2, '0')}</span>
          <span class="text-[10px] sm:text-xs mt-1 font-sans font-normal text-haw-blau-50">Tage</span>
        </div>
        <span class="text-haw-blau-30 self-start pt-1">:</span>
        <div class="flex flex-col items-center">
          <span class="bg-white rounded px-2 sm:px-3 py-1 shadow-sm">{String(eventHours).padStart(2, '0')}</span>
          <span class="text-[10px] sm:text-xs mt-1 font-sans font-normal text-haw-blau-50">Std</span>
        </div>
        <span class="text-haw-blau-30 self-start pt-1">:</span>
        <div class="flex flex-col items-center">
          <span class="bg-white rounded px-2 sm:px-3 py-1 shadow-sm">{String(eventMinutes).padStart(2, '0')}</span>
          <span class="text-[10px] sm:text-xs mt-1 font-sans font-normal text-haw-blau-50">Min</span>
        </div>
        <span class="text-haw-blau-30 self-start pt-1">:</span>
        <div class="flex flex-col items-center">
          <span class="bg-white rounded px-2 sm:px-3 py-1 shadow-sm">{String(eventSeconds).padStart(2, '0')}</span>
          <span class="text-[10px] sm:text-xs mt-1 font-sans font-normal text-haw-blau-50">Sek</span>
        </div>
      </div>
      {#if activePhase === 'anmeldung'}
        <p class="mt-3 text-sm text-haw-blau-70">bis zum Start der Veranstaltung.</p>
      {:else}
        <p class="mt-3 text-sm text-haw-blau-70">Anmeldung geschlossen – Nachmeldung nur auf Anfrage möglich.</p>
      {/if}
    </div>
  {/if}

  <!-- Vorbereitungsphase info banner -->
  {#if activePhase === 'vorbereitung'}
    <div class="bg-haw-hellblau-20 py-5 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <p class="text-sm font-bold text-haw-blau">Die Vorbereitung der Veranstaltung läuft.</p>
        <p class="text-sm text-haw-blau-70 mt-1">
          Ein Programm-Update folgt in Kürze. Alle angemeldeten Teilnehmer:innen werden
          sobald als möglich über die weiteren Details informiert.
        </p>
      </div>
    </div>
  {/if}
{/if}
