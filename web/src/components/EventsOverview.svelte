<script lang="ts">
  import { t, locale } from '../lib/i18n';
  import { basePath } from '../lib/paths';
  import { events, type CalendarEvent } from '../data/events';

  let filterCategory: 'all' | 'intern' | 'extern' = 'all';
  let filterAudience: 'all' | 'alle' | 'haw' = 'all';

  const now = new Date();

  $: filtered = events.filter(e => {
    if (filterCategory !== 'all' && e.category !== filterCategory) return false;
    if (filterAudience !== 'all' && e.audience !== filterAudience) return false;
    return true;
  });

  $: upcoming = filtered
    .filter(e => new Date(e.end) >= now)
    .sort((a, b) => a.start.localeCompare(b.start));

  $: past = filtered
    .filter(e => new Date(e.end) < now)
    .sort((a, b) => b.start.localeCompare(a.start));

  function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString($locale === 'en' ? 'en-GB' : 'de-DE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function eventTitle(event: CalendarEvent): string {
    if ($locale === 'en' && event.title_en) return event.title_en;
    return event.title;
  }

  function eventDescription(event: CalendarEvent): string {
    if ($locale === 'en' && event.description_en) return event.description_en;
    return event.description;
  }

  function toIcsDate(iso: string): string {
    return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  function escapeIcs(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  }

  function downloadIcs(event: CalendarEvent) {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//zukunftbauen.org//Veranstaltungskalender//DE',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event.id}@zukunftbauen.org`,
      `DTSTART:${toIcsDate(event.start)}`,
      `DTEND:${toIcsDate(event.end)}`,
      `SUMMARY:${escapeIcs(event.title)}`,
      `DESCRIPTION:${escapeIcs(event.description)}`,
    ];
    if (event.location) lines.push(`LOCATION:${escapeIcs(event.location)}`);
    if (event.url) lines.push(`URL:${event.url}`);
    lines.push('END:VEVENT', 'END:VCALENDAR');

    const content = lines.join('\r\n') + '\r\n';
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.id}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
</script>

<section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <h1 class="font-serif text-4xl font-bold text-haw-blau mb-2">{$t('events.title')}</h1>
  <p class="text-haw-blau-70 mb-8">{$t('events.subtitle')}</p>

  <!-- Filter-Bar -->
  <div class="flex flex-wrap gap-4 mb-6">
    <div>
      <label for="filter-category" class="block text-sm font-medium text-haw-blau mb-1">
        {$t('events.filter.category')}
      </label>
      <select
        id="filter-category"
        bind:value={filterCategory}
        class="rounded border border-haw-blau-20 bg-white px-3 py-1.5 text-sm text-haw-blau focus:outline-none focus:ring-2 focus:ring-haw-blau"
      >
        <option value="all">{$t('events.filter.all')}</option>
        <option value="intern">{$t('events.filter.intern')}</option>
        <option value="extern">{$t('events.filter.extern')}</option>
      </select>
    </div>
    <div>
      <label for="filter-audience" class="block text-sm font-medium text-haw-blau mb-1">
        {$t('events.filter.audience')}
      </label>
      <select
        id="filter-audience"
        bind:value={filterAudience}
        class="rounded border border-haw-blau-20 bg-white px-3 py-1.5 text-sm text-haw-blau focus:outline-none focus:ring-2 focus:ring-haw-blau"
      >
        <option value="all">{$t('events.filter.all')}</option>
        <option value="alle">{$t('events.filter.open')}</option>
        <option value="haw">{$t('events.filter.haw')}</option>
      </select>
    </div>
  </div>

  <!-- Abo-Hinweis -->
  <div class="bg-haw-blau/5 border border-haw-blau/10 rounded-lg p-4 mb-8 flex flex-col sm:flex-row sm:items-center gap-2">
    <span class="text-sm text-haw-blau">{$t('events.abo.text')}</span>
    <a
      href={basePath('/calendar.ics')}
      class="text-sm font-medium text-haw-blau underline hover:text-haw-blau/70 transition-colors"
    >
      {$t('events.abo.link')}
    </a>
    <span class="text-xs text-haw-blau/50 hidden sm:inline">— {$t('events.abo.hint')}</span>
  </div>

  <!-- Kommende Veranstaltungen -->
  {#if upcoming.length > 0}
    <h2 class="font-serif text-2xl font-bold text-haw-blau mb-4">{$t('events.upcoming')}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
      {#each upcoming as event (event.id)}
        <div class="bg-white border border-haw-blau/10 rounded-lg shadow-sm overflow-hidden">
          <div class="border-t-4 border-haw-blau p-6">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-bold text-haw-blau">{formatDate(event.start)}</span>
              <div class="flex gap-1">
                <span
                  class="text-xs px-2 py-0.5 rounded {event.category === 'intern'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-orange-100 text-orange-700'}"
                >
                  {$t(`events.badge.${event.category}`)}
                </span>
                <span
                  class="text-xs px-2 py-0.5 rounded {event.audience === 'alle'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'}"
                >
                  {$t(`events.badge.${event.audience}`)}
                </span>
              </div>
            </div>
            <h3 class="font-serif text-xl font-bold text-haw-blau mb-2">{eventTitle(event)}</h3>
            <p class="text-sm text-haw-blau/70 mb-2">{eventDescription(event)}</p>
            {#if event.location}
              <p class="text-xs text-haw-blau/50 mb-3">{event.location}</p>
            {/if}
            <div class="flex flex-wrap gap-2">
              {#if event.url}
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs px-3 py-1.5 rounded border border-haw-blau text-haw-blau hover:bg-haw-blau hover:text-white transition-colors"
                >
                  {$t('events.btn.website')}
                </a>
              {/if}
              {#if event.archivePath}
                <a
                  href={basePath(event.archivePath)}
                  class="text-xs px-3 py-1.5 rounded border border-haw-blau text-haw-blau hover:bg-haw-blau hover:text-white transition-colors"
                >
                  {$t('events.btn.archive')}
                </a>
              {/if}
              <button
                on:click={() => downloadIcs(event)}
                class="text-xs px-3 py-1.5 rounded border border-haw-blau text-haw-blau hover:bg-haw-blau hover:text-white transition-colors"
              >
                {$t('events.btn.ical')}
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Vergangene Veranstaltungen -->
  {#if past.length > 0}
    <h2 class="font-serif text-2xl font-bold text-haw-blau mb-4">{$t('events.past')}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {#each past as event (event.id)}
        <div class="bg-white border border-haw-blau/10 rounded-lg shadow-sm overflow-hidden opacity-80">
          <div class="border-t-4 border-haw-blau/40 p-6">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-bold text-haw-blau">{formatDate(event.start)}</span>
              <div class="flex gap-1">
                <span
                  class="text-xs px-2 py-0.5 rounded {event.category === 'intern'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-orange-100 text-orange-700'}"
                >
                  {$t(`events.badge.${event.category}`)}
                </span>
                <span
                  class="text-xs px-2 py-0.5 rounded {event.audience === 'alle'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'}"
                >
                  {$t(`events.badge.${event.audience}`)}
                </span>
              </div>
            </div>
            <h3 class="font-serif text-xl font-bold text-haw-blau mb-2">{eventTitle(event)}</h3>
            <p class="text-sm text-haw-blau/70 mb-2">{eventDescription(event)}</p>
            {#if event.location}
              <p class="text-xs text-haw-blau/50 mb-3">{event.location}</p>
            {/if}
            <div class="flex flex-wrap gap-2">
              {#if event.archivePath}
                <a
                  href={basePath(event.archivePath)}
                  class="text-xs px-3 py-1.5 rounded border border-haw-blau text-haw-blau hover:bg-haw-blau hover:text-white transition-colors"
                >
                  {$t('events.btn.archive')}
                </a>
              {/if}
              <button
                on:click={() => downloadIcs(event)}
                class="text-xs px-3 py-1.5 rounded border border-haw-blau text-haw-blau hover:bg-haw-blau hover:text-white transition-colors"
              >
                {$t('events.btn.ical')}
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  {#if upcoming.length === 0 && past.length === 0}
    <p class="text-haw-blau/50 text-center py-8">{$t('events.none')}</p>
  {/if}
</section>
