<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  const FORMS_URL = 'https://forms.office.com/pages/responsepage.aspx?id=SlFZYNubNECdLWtc9Zdpa95yTsFJlbBDntdDxMV4KBtUNjdTUzM4NVpXSkc5Tk9OM1JEUlJNNFNPMi4u&route=shorturl';
  const REG_DEADLINE = new Date('2026-04-24T23:59:59');
  const EVENT_DATE = new Date('2026-05-07T14:30:00');

  let now = $state(new Date());
  let interval: ReturnType<typeof setInterval>;

  // Registration countdown (days only)
  const regDiff = $derived(REG_DEADLINE.getTime() - now.getTime());
  const regExpired = $derived(regDiff <= 0);
  const regDays = $derived(Math.ceil(regDiff / (1000 * 60 * 60 * 24)));

  // Event countdown (full precision)
  const eventDiff = $derived(EVENT_DATE.getTime() - now.getTime());
  const eventExpired = $derived(eventDiff <= 0);
  const eventDays = $derived(Math.floor(eventDiff / (1000 * 60 * 60 * 24)));
  const eventHours = $derived(Math.floor((eventDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const eventMinutes = $derived(Math.floor((eventDiff % (1000 * 60 * 60)) / (1000 * 60)));
  const eventSeconds = $derived(Math.floor((eventDiff % (1000 * 60)) / 1000));

  onMount(() => {
    interval = setInterval(() => { now = new Date(); }, 1000);
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

<!-- Event Countdown (always visible until event) -->
{#if !eventExpired}
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

        <!-- Right: Registration Button -->
        <div class="flex flex-col items-center lg:items-end gap-2">
          {#if !regExpired}
            <a
              href={FORMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block bg-haw-hellblau text-haw-blau font-bold py-3 px-8 rounded hover:bg-white transition-colors text-lg"
            >
              Jetzt anmelden
            </a>
            <p class="text-xs text-white/50">bis zum 24. April 2026</p>
          {:else}
            <a
              href="/anmeldung"
              class="inline-block bg-haw-hellblau text-haw-blau font-bold py-3 px-8 rounded hover:bg-white transition-colors text-lg"
            >
              Verbindlich anmelden
            </a>
          {/if}
        </div>
      </div>

    </div>
  </div>

  <!-- Event Countdown (outside dark banner) -->
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
    <p class="mt-3 text-sm text-haw-blau-70">bis zum Start der Veranstaltung.</p>
  </div>
{/if}
