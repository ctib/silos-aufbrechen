<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import {
    FEST_PHASES,
    FEST_START,
    currentPhase,
    phaseEnd,
    festIsOver,
    formatDate,
    type FestPhaseId,
  } from '../lib/ifbFest';

  let now = $state(new Date());
  let interval: ReturnType<typeof setInterval>;

  onMount(() => {
    interval = setInterval(() => {
      now = new Date();
    }, 1000);
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });

  const phase = $derived(currentPhase(now));
  const activeIndex = $derived(FEST_PHASES.findIndex((p) => p.id === phase.id));
  const over = $derived(festIsOver(now));

  function parts(target: Date) {
    const diff = Math.max(0, target.getTime() - now.getTime());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  }

  const toEvent = $derived(parts(new Date(FEST_START)));
  const phaseTarget = $derived(phaseEnd(phase.id as FestPhaseId));
  const toPhaseEnd = $derived(parts(phaseTarget));

  const phaseCountdownLabel: Record<string, string> = {
    intern: 'Interne Anmeldung läuft noch',
    extern: 'Anmeldung läuft noch',
    programm: 'Bis zur Veranstaltung',
    durchfuehrung: 'Die Veranstaltung läuft',
  };

  const unitLabels: Array<[keyof ReturnType<typeof parts>, string]> = [
    ['days', 'Tage'],
    ['hours', 'Std'],
    ['minutes', 'Min'],
    ['seconds', 'Sek'],
  ];
</script>

<!-- Zeitstrahl der Phasen -->
<div class="bg-white border-b border-haw-blau-10">
  <div class="max-w-4xl mx-auto px-4 py-4">
    <div class="flex items-center justify-between">
      {#each FEST_PHASES as p, i (p.id)}
        {#if i > 0}
          <div
            class="flex-1 h-0.5 mx-1 sm:mx-2 {i <= activeIndex ? 'bg-haw-blau' : 'bg-haw-blau-30'}"
          ></div>
        {/if}
        <div
          class="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap
            {i === activeIndex
            ? 'bg-haw-blau text-white font-bold shadow-sm'
            : i < activeIndex
              ? 'bg-haw-blau-10 text-haw-blau'
              : 'bg-haw-blau-10 text-haw-blau-50'}"
          title={p.description}
        >
          <span
            class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0
              {i === activeIndex ? 'bg-white text-haw-blau' : 'bg-haw-blau-30 text-white'}"
          >
            {i < activeIndex ? '✓' : i + 1}
          </span>
          <span class="hidden sm:inline">{p.label}</span>
          <span class="sm:hidden">{p.short}</span>
        </div>
      {/each}
    </div>

    <p class="text-xs text-haw-blau-70 mt-3 text-center">
      <strong class="text-haw-blau">Phase {activeIndex + 1} – {phase.label}:</strong>
      {phase.description}
      {#if phase.id !== 'durchfuehrung'}
        <span class="block text-haw-blau-50 mt-0.5">
          Nächste Phase ab {formatDate(phaseTarget.toISOString())}
        </span>
      {/if}
    </p>
  </div>
</div>

{#if !over}
  <!-- Zwei Countdowns: Veranstaltung und laufende Phase -->
  <div class="bg-haw-blau-10 py-8 px-4">
    <div class="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8">
      <div class="text-center">
        <p class="text-sm font-bold text-haw-blau mb-3">Bis zur Veranstaltung</p>
        <div class="flex justify-center gap-2 sm:gap-3 font-mono text-2xl sm:text-3xl font-bold text-haw-blau">
          {#each unitLabels as [key, label], i (key)}
            {#if i > 0}
              <span class="text-haw-blau-30 self-start pt-1">:</span>
            {/if}
            <div class="flex flex-col items-center">
              <span class="bg-white rounded px-2 sm:px-3 py-1 shadow-sm">
                {String(toEvent[key]).padStart(2, '0')}
              </span>
              <span class="text-[10px] sm:text-xs mt-1 font-sans font-normal text-haw-blau-50">
                {label}
              </span>
            </div>
          {/each}
        </div>
      </div>

      <div class="text-center sm:border-l sm:border-haw-blau-30">
        <p class="text-sm font-bold text-haw-blau mb-3">
          {phaseCountdownLabel[phase.id] ?? 'Aktuelle Phase'}
        </p>
        {#if phase.id === 'durchfuehrung'}
          <p class="text-2xl font-bold text-haw-blau py-4">Willkommen!</p>
        {:else}
          <div class="flex justify-center gap-2 sm:gap-3 font-mono text-2xl sm:text-3xl font-bold text-haw-blau">
            {#each unitLabels as [key, label], i (key)}
              {#if i > 0}
                <span class="text-haw-blau-30 self-start pt-1">:</span>
              {/if}
              <div class="flex flex-col items-center">
                <span class="bg-white rounded px-2 sm:px-3 py-1 shadow-sm">
                  {String(toPhaseEnd[key]).padStart(2, '0')}
                </span>
                <span class="text-[10px] sm:text-xs mt-1 font-sans font-normal text-haw-blau-50">
                  {label}
                </span>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
