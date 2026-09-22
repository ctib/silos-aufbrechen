<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../lib/supabase';
  import { basePath } from '../lib/paths';
  import { BOOKABLE_OPTIONS, MEAL_OPTIONS, bookableLabel } from '../lib/ifbFest';

  interface FestRegistration {
    id: string;
    full_name: string;
    email: string;
    organization: string | null;
    program_items: string[];
    meal_preference: string;
    allergies: string | null;
    companion_count: number;
    companion_names: string | null;
    comment: string | null;
    status: 'confirmed' | 'waitlist' | 'cancelled';
    orga_note: string | null;
    is_internal: boolean;
    is_moderator: boolean;
    created_at: string;
  }

  let loading = $state(true);
  let authorized = $state(false);
  let rows = $state<FestRegistration[]>([]);
  let loadError = $state('');
  let statusFilter = $state<'alle' | 'confirmed' | 'waitlist' | 'cancelled'>('alle');

  onMount(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      loading = false;
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'orga' && profile?.role !== 'admin') {
      loading = false;
      return;
    }
    authorized = true;
    await loadData();
    loading = false;
  });

  async function loadData() {
    const { data, error } = await supabase
      .from('ifb_fest_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('IfB-Fest-Anmeldungen laden fehlgeschlagen:', error);
      loadError = 'Daten konnten nicht geladen werden. Bitte Seite neu laden.';
      return;
    }
    rows = (data ?? []) as FestRegistration[];
    loadError = '';
  }

  const visible = $derived(
    statusFilter === 'alle' ? rows : rows.filter((r) => r.status === statusFilter)
  );

  const active = $derived(rows.filter((r) => r.status === 'confirmed'));
  const totalHeads = $derived(
    active.reduce((sum, r) => sum + 1 + (r.companion_count || 0), 0)
  );

  function countForItem(itemId: string) {
    return active
      .filter((r) => (r.program_items ?? []).includes(itemId))
      .reduce((sum, r) => sum + 1 + (r.companion_count || 0), 0);
  }

  function countForMeal(mealId: string) {
    return active.filter((r) => r.meal_preference === mealId).length;
  }

  const withAllergies = $derived(
    active.filter((r) => r.allergies && r.allergies.trim() !== '')
  );

  async function setStatus(id: string, status: FestRegistration['status']) {
    const { error } = await supabase
      .from('ifb_fest_registrations')
      .update({ status })
      .eq('id', id);
    if (error) {
      console.error('Status ändern fehlgeschlagen:', error);
      loadError = `Status konnte nicht geändert werden: ${error.message}`;
      return;
    }
    await loadData();
  }

  const itemLabel = bookableLabel;

  function mealLabel(id: string) {
    return MEAL_OPTIONS.find((m) => m.id === id)?.label ?? id;
  }

  function csvCell(value: unknown): string {
    const s = value === null || value === undefined ? '' : String(value);
    return `"${s.replace(/"/g, '""')}"`;
  }

  function exportCsv() {
    const header = [
      'Name',
      'E-Mail',
      'Organisation',
      'Programmteile',
      'Verpflegung',
      'Allergien',
      'Begleitpersonen',
      'Namen Begleitung',
      'Anmerkungen',
      'Status',
      'Angemeldet am',
    ];
    const lines = [
      header.map(csvCell).join(';'),
      ...visible.map((r) =>
        [
          r.full_name,
          r.email,
          r.organization,
          (r.program_items ?? []).map(itemLabel).join(', '),
          mealLabel(r.meal_preference),
          r.allergies,
          r.companion_count,
          r.companion_names,
          r.comment,
          r.status,
          new Date(r.created_at).toLocaleString('de-DE'),
        ]
          .map(csvCell)
          .join(';')
      ),
    ];
    // BOM, damit Excel UTF-8 erkennt
    const blob = new Blob(['﻿' + lines.join('\r\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ifb-fest-anmeldungen-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const statusStyles: Record<FestRegistration['status'], string> = {
    confirmed: 'bg-haw-hellblau/20 text-haw-blau',
    waitlist: 'bg-amber-100 text-amber-800',
    cancelled: 'bg-red-50 text-red-700',
  };

  const statusLabels: Record<FestRegistration['status'], string> = {
    confirmed: 'Angemeldet',
    waitlist: 'Warteliste',
    cancelled: 'Abgesagt',
  };
</script>

{#if loading}
  <p class="text-haw-blau-50">Lade …</p>
{:else if !authorized}
  <div class="text-center py-12">
    <h1 class="font-serif text-3xl font-bold text-haw-blau mb-4">Kein Zugriff</h1>
    <p class="text-haw-blau-70 mb-6">
      Diese Seite ist dem Orga-Team vorbehalten. Bitte melden Sie sich an.
    </p>
    <a href={basePath('/intern/10-jahre-ifb')} class="text-haw-blau underline">Zur Anmeldung</a>
  </div>
{:else}
  <div class="flex flex-wrap items-center justify-between gap-4 mb-2">
    <h1 class="font-serif text-3xl font-bold text-haw-blau">IfB-Fest – Anmeldungen</h1>
    <button
      onclick={exportCsv}
      class="bg-haw-blau text-white font-bold py-2 px-5 rounded text-sm hover:bg-haw-blau-90 transition-colors cursor-pointer"
    >
      CSV exportieren
    </button>
  </div>
  <div class="haw-gradient-line w-12 mb-8"></div>

  {#if loadError}
    <p class="text-sm text-red-600 bg-red-50 rounded px-4 py-2 mb-6">{loadError}</p>
  {/if}

  <!-- Kennzahlen -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
    <div class="bg-haw-blau-10 rounded p-4">
      <p class="text-3xl font-bold text-haw-blau">{active.length}</p>
      <p class="text-xs text-haw-blau-70">Anmeldungen</p>
    </div>
    <div class="bg-haw-blau-10 rounded p-4">
      <p class="text-3xl font-bold text-haw-blau">{totalHeads}</p>
      <p class="text-xs text-haw-blau-70">Personen inkl. Begleitung</p>
    </div>
    <div class="bg-haw-blau-10 rounded p-4">
      <p class="text-3xl font-bold text-haw-blau">
        {rows.filter((r) => r.status === 'waitlist').length}
      </p>
      <p class="text-xs text-haw-blau-70">Warteliste</p>
    </div>
    <div class="bg-haw-blau-10 rounded p-4">
      <p class="text-3xl font-bold text-haw-blau">{withAllergies.length}</p>
      <p class="text-xs text-haw-blau-70">mit Allergiehinweis</p>
    </div>
  </div>

  <!-- Verteilung -->
  <div class="grid sm:grid-cols-2 gap-8 mb-8">
    <div>
      <h2 class="font-bold text-haw-blau mb-3">Personen je Programmteil</h2>
      <div class="space-y-1 text-sm">
        {#each BOOKABLE_OPTIONS as item (item.id)}
          <div class="flex justify-between border-b border-haw-blau-10 py-1.5">
            <span class="text-haw-blau-70">{item.label}</span>
            <span class="font-bold text-haw-blau">{countForItem(item.id)}</span>
          </div>
        {/each}
      </div>
    </div>
    <div>
      <h2 class="font-bold text-haw-blau mb-3">Verpflegung</h2>
      <div class="space-y-1 text-sm">
        {#each MEAL_OPTIONS as option (option.id)}
          <div class="flex justify-between border-b border-haw-blau-10 py-1.5">
            <span class="text-haw-blau-70">{option.label}</span>
            <span class="font-bold text-haw-blau">{countForMeal(option.id)}</span>
          </div>
        {/each}
      </div>
      {#if withAllergies.length > 0}
        <h3 class="font-bold text-haw-blau mt-6 mb-2 text-sm">Allergien</h3>
        <ul class="text-sm text-haw-blau-70 space-y-1">
          {#each withAllergies as r (r.id)}
            <li><strong>{r.full_name}:</strong> {r.allergies}</li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>

  <!-- Filter -->
  <div class="flex flex-wrap gap-2 mb-4">
    {#each [['alle', 'Alle'], ['confirmed', 'Angemeldet'], ['waitlist', 'Warteliste'], ['cancelled', 'Abgesagt']] as [value, label] (value)}
      <button
        onclick={() => (statusFilter = value as typeof statusFilter)}
        class="px-4 py-1.5 rounded text-sm border transition-colors cursor-pointer {statusFilter ===
        value
          ? 'bg-haw-blau text-white border-haw-blau'
          : 'border-haw-blau-30 text-haw-blau-70 hover:border-haw-blau'}"
      >
        {label}
      </button>
    {/each}
  </div>

  <!-- Liste -->
  {#if visible.length === 0}
    <p class="text-haw-blau-50 py-8">Noch keine Anmeldungen in dieser Auswahl.</p>
  {:else}
    <div class="space-y-3">
      {#each visible as r (r.id)}
        <div class="border border-haw-blau-30 rounded p-4">
          <div class="flex flex-wrap items-start justify-between gap-3 mb-2">
            <div>
              <p class="font-bold text-haw-blau">
                {r.full_name}
                {#if r.companion_count > 0}
                  <span class="font-normal text-haw-blau-50">+{r.companion_count}</span>
                {/if}
              </p>
              <p class="text-sm text-haw-blau-70">
                <a href={`mailto:${r.email}`} class="underline">{r.email}</a>
                {#if r.organization}
                  · {r.organization}
                {/if}
              </p>
            </div>
            <div class="flex flex-wrap gap-1.5">
              {#if r.is_internal}
                <span class="text-xs font-bold px-3 py-1 rounded bg-haw-blau-10 text-haw-blau">
                  HAW intern
                </span>
              {/if}
              <span class="text-xs font-bold px-3 py-1 rounded {statusStyles[r.status]}">
                {statusLabels[r.status]}
              </span>
            </div>
          </div>

          <p class="text-sm text-haw-blau-70">
            <strong>Programm:</strong>
            {(r.program_items ?? []).map(itemLabel).join(', ') || '–'}
          </p>
          <p class="text-sm text-haw-blau-70">
            <strong>Verpflegung:</strong>
            {mealLabel(r.meal_preference)}{r.allergies ? ` · ${r.allergies}` : ''}
          </p>
          {#if r.companion_names}
            <p class="text-sm text-haw-blau-70"><strong>Begleitung:</strong> {r.companion_names}</p>
          {/if}
          {#if r.comment}
            <p class="text-sm text-haw-blau-70"><strong>Anmerkung:</strong> {r.comment}</p>
          {/if}

          <div class="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-haw-blau-10">
            <span class="text-xs text-haw-blau-50 mr-auto">
              {new Date(r.created_at).toLocaleString('de-DE')}
            </span>
            {#each [['confirmed', 'Angemeldet'], ['waitlist', 'Warteliste'], ['cancelled', 'Abgesagt']] as [value, label] (value)}
              {#if r.status !== value}
                <button
                  onclick={() => setStatus(r.id, value as FestRegistration['status'])}
                  class="text-xs border border-haw-blau-30 text-haw-blau-70 px-3 py-1 rounded hover:border-haw-blau hover:text-haw-blau transition-colors cursor-pointer"
                >
                  → {label}
                </button>
              {/if}
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
{/if}
