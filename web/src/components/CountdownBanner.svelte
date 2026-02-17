<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  const FORMS_URL = 'https://forms.office.com/pages/responsepage.aspx?id=SlFZYNubNECdLWtc9Zdpa95yTsFJlbBDntdDxMV4KBtUNjdTUzM4NVpXSkc5Tk9OM1JEUlJNNFNPMi4u&route=shorturl';
  const DEADLINE = new Date('2026-04-24T23:59:59');

  let now = $state(new Date());
  let interval: ReturnType<typeof setInterval>;

  const diff = $derived(DEADLINE.getTime() - now.getTime());
  const isExpired = $derived(diff <= 0);
  const days = $derived(Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = $derived(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = $derived(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
  const seconds = $derived(Math.floor((diff % (1000 * 60)) / 1000));

  onMount(() => {
    interval = setInterval(() => { now = new Date(); }, 1000);
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

{#if !isExpired}
  <div class="bg-haw-blau text-white py-6 px-4">
    <div class="max-w-4xl mx-auto text-center">
      <p class="text-lg sm:text-xl font-bold mb-3">
        Anmeldung bis zum 24. April 2026
      </p>
      <div class="flex justify-center gap-4 sm:gap-6 mb-4 font-mono text-2xl sm:text-3xl font-bold">
        <div class="flex flex-col items-center">
          <span class="bg-white/10 rounded px-3 py-1">{String(days).padStart(2, '0')}</span>
          <span class="text-xs mt-1 font-sans font-normal text-haw-hellblau">Tage</span>
        </div>
        <span class="text-haw-hellblau self-start pt-1">:</span>
        <div class="flex flex-col items-center">
          <span class="bg-white/10 rounded px-3 py-1">{String(hours).padStart(2, '0')}</span>
          <span class="text-xs mt-1 font-sans font-normal text-haw-hellblau">Std</span>
        </div>
        <span class="text-haw-hellblau self-start pt-1">:</span>
        <div class="flex flex-col items-center">
          <span class="bg-white/10 rounded px-3 py-1">{String(minutes).padStart(2, '0')}</span>
          <span class="text-xs mt-1 font-sans font-normal text-haw-hellblau">Min</span>
        </div>
        <span class="text-haw-hellblau self-start pt-1">:</span>
        <div class="flex flex-col items-center">
          <span class="bg-white/10 rounded px-3 py-1">{String(seconds).padStart(2, '0')}</span>
          <span class="text-xs mt-1 font-sans font-normal text-haw-hellblau">Sek</span>
        </div>
      </div>
      <a
        href={FORMS_URL}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-block bg-haw-hellblau text-haw-blau font-bold py-3 px-8 rounded hover:bg-white transition-colors text-lg"
      >
        Jetzt anmelden
      </a>
    </div>
  </div>
{:else}
  <div class="bg-haw-blau text-white py-6 px-4">
    <div class="max-w-4xl mx-auto text-center">
      <p class="text-lg sm:text-xl font-bold mb-3">
        Die verbindliche Anmeldung ist jetzt geöffnet
      </p>
      <a
        href="/anmeldung"
        class="inline-block bg-haw-hellblau text-haw-blau font-bold py-3 px-8 rounded hover:bg-white transition-colors text-lg"
      >
        Verbindlich anmelden
      </a>
    </div>
  </div>
{/if}
