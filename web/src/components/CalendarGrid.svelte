<script lang="ts">
  import { t, locale } from '../lib/i18n';
  import type { CalendarEvent } from '../data/events';

  let { events: filteredEvents }: { events: CalendarEvent[] } = $props();

  const today = new Date();
  let currentYear = $state(today.getFullYear());
  let currentMonth = $state(today.getMonth());
  let selectedDay = $state<number | null>(null);

  const WEEKDAYS_DE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const WEEKDAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  let weekdays = $derived($locale === 'en' ? WEEKDAYS_EN : WEEKDAYS_DE);

  let monthLabel = $derived(
    new Date(currentYear, currentMonth, 1).toLocaleDateString(
      $locale === 'en' ? 'en-GB' : 'de-DE',
      { month: 'long', year: 'numeric' },
    ),
  );

  interface GridDay {
    day: number;
    isCurrentMonth: boolean;
    date: Date;
  }

  let grid = $derived.by(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    // Monday-based day of week (0=Mo … 6=So)
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    const totalCells = Math.ceil((startDow + daysInMonth) / 7) * 7;

    const rows: GridDay[][] = [];
    let row: GridDay[] = [];
    let currentDay = 1;
    let nextMonthDay = 1;

    for (let i = 0; i < totalCells; i++) {
      if (i < startDow) {
        const day = daysInPrevMonth - startDow + i + 1;
        row.push({ day, isCurrentMonth: false, date: new Date(currentYear, currentMonth - 1, day) });
      } else if (currentDay <= daysInMonth) {
        row.push({ day: currentDay, isCurrentMonth: true, date: new Date(currentYear, currentMonth, currentDay) });
        currentDay++;
      } else {
        row.push({ day: nextMonthDay, isCurrentMonth: false, date: new Date(currentYear, currentMonth + 1, nextMonthDay) });
        nextMonthDay++;
      }
      if (row.length === 7) {
        rows.push(row);
        row = [];
      }
    }
    return rows;
  });

  function eventsForDay(date: Date): CalendarEvent[] {
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    return filteredEvents.filter((e) => {
      const eStart = new Date(e.start);
      const eEnd = new Date(e.end);
      return eStart < dayEnd && eEnd >= dayStart;
    });
  }

  let selectedDayEvents = $derived.by(() => {
    if (selectedDay === null) return [];
    return eventsForDay(new Date(currentYear, currentMonth, selectedDay));
  });

  function isTodayCell(date: Date): boolean {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  function prevMonth() {
    if (currentMonth === 0) { currentMonth = 11; currentYear--; }
    else { currentMonth--; }
    selectedDay = null;
  }

  function nextMonth() {
    if (currentMonth === 11) { currentMonth = 0; currentYear++; }
    else { currentMonth++; }
    selectedDay = null;
  }

  function goToday() {
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    selectedDay = null;
  }

  function selectDay(day: number) {
    selectedDay = selectedDay === day ? null : day;
  }

  function eventTitle(event: CalendarEvent): string {
    if ($locale === 'en' && event.title_en) return event.title_en;
    return event.title;
  }

  function eventDescription(event: CalendarEvent): string {
    if ($locale === 'en' && event.description_en) return event.description_en;
    return event.description;
  }

  function eventOrganizer(event: CalendarEvent): string | undefined {
    if ($locale === 'en' && event.organizer_en) return event.organizer_en;
    return event.organizer;
  }

  function formatDayDate(year: number, month: number, day: number): string {
    return new Date(year, month, day).toLocaleDateString(
      $locale === 'en' ? 'en-GB' : 'de-DE',
      { day: 'numeric', month: 'long', year: 'numeric' },
    );
  }
</script>

<div>
  <!-- Month Navigation -->
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center gap-2">
      <button
        onclick={prevMonth}
        class="w-8 h-8 flex items-center justify-center rounded border border-haw-blau/20 text-haw-blau hover:bg-haw-blau/10 transition-colors cursor-pointer"
        aria-label="Previous month"
      >&#8592;</button>
      <h2 class="font-serif text-xl font-bold text-haw-blau capitalize min-w-[10rem] text-center">
        {monthLabel}
      </h2>
      <button
        onclick={nextMonth}
        class="w-8 h-8 flex items-center justify-center rounded border border-haw-blau/20 text-haw-blau hover:bg-haw-blau/10 transition-colors cursor-pointer"
        aria-label="Next month"
      >&#8594;</button>
    </div>
    <button
      onclick={goToday}
      class="text-sm px-3 py-1.5 rounded border border-haw-blau text-haw-blau hover:bg-haw-blau hover:text-white transition-colors cursor-pointer"
    >
      {$t('events.calendar.today')}
    </button>
  </div>

  <!-- Grid -->
  <div class="grid grid-cols-7 gap-px bg-haw-blau/10 border border-haw-blau/10 rounded-lg overflow-hidden">
    <!-- Weekday headers -->
    {#each weekdays as wd}
      <div class="bg-haw-blau/5 text-center text-xs font-bold text-haw-blau py-2">{wd}</div>
    {/each}

    <!-- Day cells -->
    {#each grid as row}
      {#each row as cell}
        {@const dayEvents = eventsForDay(cell.date)}
        <button
          onclick={() => cell.isCurrentMonth && selectDay(cell.day)}
          class="bg-white min-h-12 sm:min-h-[4.5rem] p-1 text-left transition-colors
            {cell.isCurrentMonth ? 'text-haw-blau hover:bg-haw-blau/5 cursor-pointer' : 'text-haw-blau/30 cursor-default'}
            {cell.isCurrentMonth && selectedDay === cell.day ? 'ring-2 ring-haw-blau ring-inset' : ''}
            {isTodayCell(cell.date) ? 'bg-haw-blau/10' : ''}"
          disabled={!cell.isCurrentMonth}
        >
          <span class="text-sm font-medium">{cell.day}</span>
          {#if dayEvents.length > 0}
            <!-- Mobile: dots only -->
            <div class="flex flex-wrap gap-0.5 mt-1 sm:hidden">
              {#each dayEvents as ev}
                <span class="block w-2 h-2 rounded-full {ev.category === 'intern' ? 'bg-blue-500' : 'bg-orange-500'}"></span>
              {/each}
            </div>
            <!-- Desktop: abbreviated titles -->
            <div class="hidden sm:block mt-1 space-y-0.5">
              {#each dayEvents as ev}
                <div class="text-[10px] leading-tight truncate px-0.5 rounded {ev.category === 'intern' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}">
                  {eventTitle(ev)}
                </div>
              {/each}
            </div>
          {/if}
        </button>
      {/each}
    {/each}
  </div>

  <!-- Day Detail -->
  {#if selectedDay !== null}
    <div class="mt-6 border border-haw-blau/10 rounded-lg p-4 bg-white">
      <h3 class="font-serif text-lg font-bold text-haw-blau mb-3">
        {formatDayDate(currentYear, currentMonth, selectedDay)}
      </h3>
      {#if selectedDayEvents.length === 0}
        <p class="text-haw-blau/50 text-sm">{$t('events.calendar.noEvents')}</p>
      {:else}
        <div class="space-y-4">
          {#each selectedDayEvents as event}
            <div class="border-l-4 {event.category === 'intern' ? 'border-blue-500' : 'border-orange-500'} pl-4">
              <h4 class="font-bold text-haw-blau">{eventTitle(event)}</h4>
              {#if eventOrganizer(event)}
                <p class="text-xs text-haw-blau/60">{$t('events.label.organizer')}: {eventOrganizer(event)}</p>
              {/if}
              <p class="text-sm text-haw-blau/70 mt-1">{eventDescription(event)}</p>
              {#if event.location}
                <p class="text-xs text-haw-blau/50 mt-1">{event.location}</p>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>
