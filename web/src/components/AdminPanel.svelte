<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../lib/supabase';
  import { basePath } from '../lib/paths';
  import { CALL_TYPES, callTypeLabel } from '../lib/callTypes';
  import type { ResearchCall, WorkshopTable } from '../lib/types';

  let loading = $state(true);
  let authorized = $state(false);
  let userRole = $state('');

  // Data
  let calls = $state<ResearchCall[]>([]);
  let tables = $state<WorkshopTable[]>([]);

  let loadError = $state('');
  let saveError = $state('');

  // Form state
  let showForm = $state(false);
  let editingId = $state<string | null>(null);
  let formTitle = $state('');
  let formDescription = $state('');
  let formUrl = $state('');
  let formDeadline = $state('');
  let formType = $state('other');
  let formTableTags = $state<string[]>([]);
  let saving = $state(false);

  const callTypes = CALL_TYPES;

  onMount(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { loading = false; return; }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin' && profile?.role !== 'orga') { loading = false; return; }
    authorized = true;
    userRole = profile.role;

    await loadData();
    loading = false;
  });

  async function loadData() {
    try {
      const [callsRes, tablesRes] = await Promise.all([
        supabase.from('research_calls').select('*, call_table_tags(table_id)').order('created_at', { ascending: false }),
        supabase.from('workshop_tables').select('*').order('number'),
      ]);
      calls = callsRes.data ?? [];
      tables = tablesRes.data ?? [];
      loadError = '';
    } catch (err) {
      console.error('Forschungscalls laden fehlgeschlagen:', err);
      loadError = 'Daten konnten nicht geladen werden. Bitte Seite neu laden.';
    }
  }

  function resetForm() {
    editingId = null;
    formTitle = '';
    formDescription = '';
    formUrl = '';
    formDeadline = '';
    formType = 'other';
    formTableTags = [];
    showForm = false;
  }

  function startEdit(call: ResearchCall) {
    editingId = call.id;
    formTitle = call.title;
    formDescription = call.description || '';
    formUrl = call.url || '';
    formDeadline = call.deadline || '';
    formType = call.call_type;
    formTableTags = (call.call_table_tags || []).map((t: { table_id: string }) => t.table_id);
    showForm = true;
  }

  function startCreate() {
    resetForm();
    showForm = true;
  }

  async function saveCall() {
    saving = true;
    saveError = '';

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const payload = {
        title: formTitle,
        description: formDescription || null,
        url: formUrl || null,
        deadline: formDeadline || null,
        call_type: formType,
        created_by: session?.user.id,
      };

      let callId = editingId;

      if (editingId) {
        const { error } = await supabase.from('research_calls').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('research_calls').insert(payload).select('id').single();
        if (error) throw error;
        callId = data?.id;
      }

      // Update table tags
      if (callId) {
        await supabase.from('call_table_tags').delete().eq('call_id', callId);
        if (formTableTags.length > 0) {
          await supabase.from('call_table_tags').insert(
            formTableTags.map(tableId => ({ call_id: callId, table_id: tableId }))
          );
        }
      }

      resetForm();
      await loadData();
    } catch (err) {
      console.error('Speichern fehlgeschlagen:', err);
      saveError = 'Eintrag konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.';
    }

    saving = false;
  }

  async function deleteCall(id: string) {
    if (!confirm('Forschungscall wirklich löschen?')) return;
    await supabase.from('research_calls').delete().eq('id', id);
    await loadData();
  }

  function toggleTableTag(tableId: string) {
    if (formTableTags.includes(tableId)) {
      formTableTags = formTableTags.filter(t => t !== tableId);
    } else {
      formTableTags = [...formTableTags, tableId];
    }
  }
</script>

{#if loading}
  <div class="text-center py-12">
    <p class="text-haw-blau-70">Laden...</p>
  </div>
{:else if !authorized}
  <div class="max-w-md mx-auto text-center py-12">
    <h1 class="font-serif text-3xl font-bold text-haw-blau mb-4">Kein Zugang</h1>
    <p class="text-haw-blau-70 mb-6">Dieser Bereich ist nur für F&amp;E und das Orga-Team zugänglich.</p>
    <a href={basePath('/intern')} class="inline-block bg-haw-blau text-white font-bold py-3 px-8 rounded hover:bg-haw-blau-90 transition-colors">
      Zum Veranstaltungsbereich
    </a>
  </div>
{:else}
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <h1 class="font-serif text-3xl font-bold text-haw-blau">Forschungsmöglichkeiten</h1>
      <p class="text-haw-blau-70">Forschungscalls & Konferenzen verwalten</p>
    </div>
    <div class="flex gap-3">
      {#if userRole === 'orga'}
        <a href={basePath('/orga')} class="text-sm bg-haw-blau-10 text-haw-blau px-4 py-2 rounded hover:bg-haw-blau-30 transition-colors">Orga</a>
      {/if}
      <a href={basePath('/intern')} class="text-sm bg-haw-blau-10 text-haw-blau px-4 py-2 rounded hover:bg-haw-blau-30 transition-colors">Veranstaltung</a>
    </div>
  </div>

  <div class="haw-gradient-line w-16 mb-6"></div>

  {#if loadError}
    <div class="bg-red-50 text-red-700 rounded-lg p-3 text-sm mb-6">{loadError}</div>
  {/if}

  <!-- Action bar -->
  <div class="flex items-center justify-between mb-6">
    <p class="text-sm text-haw-blau-50">{calls.length} Einträge</p>
    <button
      onclick={startCreate}
      class="bg-haw-blau text-white px-4 py-2 rounded text-sm font-bold cursor-pointer hover:bg-haw-blau-90 transition-colors"
    >+ Neuer Eintrag</button>
  </div>

  <!-- Create/Edit Form -->
  {#if showForm}
    <div class="bg-haw-blau-10 rounded-lg p-6 mb-8">
      <h2 class="font-bold text-haw-blau mb-4">{editingId ? 'Eintrag bearbeiten' : 'Neuer Eintrag'}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="block text-xs text-haw-blau-50 mb-1">Titel *</label>
          <input bind:value={formTitle} class="w-full border border-haw-blau-30 rounded px-3 py-2 text-sm" placeholder="Titel des Calls" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-xs text-haw-blau-50 mb-1">Beschreibung</label>
          <textarea bind:value={formDescription} class="w-full border border-haw-blau-30 rounded px-3 py-2 text-sm" rows="3" placeholder="Kurze Beschreibung"></textarea>
        </div>
        <div>
          <label class="block text-xs text-haw-blau-50 mb-1">URL / Link</label>
          <input bind:value={formUrl} type="url" class="w-full border border-haw-blau-30 rounded px-3 py-2 text-sm" placeholder="https://..." />
        </div>
        <div>
          <label class="block text-xs text-haw-blau-50 mb-1">Deadline</label>
          <input bind:value={formDeadline} type="date" class="w-full border border-haw-blau-30 rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-xs text-haw-blau-50 mb-1">Typ</label>
          <select bind:value={formType} class="w-full border border-haw-blau-30 rounded px-3 py-2 text-sm">
            {#each callTypes as ct}
              <option value={ct.value}>{ct.label}</option>
            {/each}
          </select>
        </div>
        <div>
          <label class="block text-xs text-haw-blau-50 mb-1">Workshop-Tische</label>
          <div class="flex flex-wrap gap-2">
            {#each tables as table}
              <button
                onclick={() => toggleTableTag(table.id)}
                class="text-xs px-2.5 py-1 rounded-full cursor-pointer transition-colors
                  {formTableTags.includes(table.id)
                    ? 'bg-haw-blau text-white'
                    : 'bg-white border border-haw-blau-30 text-haw-blau-50 hover:border-haw-blau'}"
              >T{table.number}</button>
            {/each}
          </div>
        </div>
      </div>
      {#if saveError}
        <div class="bg-red-50 text-red-700 rounded p-3 text-sm mt-4">{saveError}</div>
      {/if}
      <div class="flex gap-3 mt-6">
        <button
          onclick={saveCall}
          disabled={!formTitle || saving}
          class="bg-haw-blau text-white px-6 py-2 rounded text-sm font-bold cursor-pointer hover:bg-haw-blau-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >{saving ? 'Speichern...' : 'Speichern'}</button>
        <button onclick={resetForm} class="text-sm text-haw-blau-50 px-4 py-2 cursor-pointer hover:text-haw-blau">Abbrechen</button>
      </div>
    </div>
  {/if}

  <!-- Calls list -->
  <div class="space-y-4">
    {#each calls as call}
      <div class="bg-white border border-haw-blau-10 rounded-lg p-5">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="font-bold text-haw-blau">{call.title}</h3>
              <span class="text-[10px] bg-haw-blau-10 text-haw-blau px-2 py-0.5 rounded">{callTypeLabel(call.call_type)}</span>
            </div>
            {#if call.description}
              <p class="text-sm text-haw-blau-70 mt-1">{call.description}</p>
            {/if}
            <div class="flex items-center gap-4 mt-2 text-xs text-haw-blau-50">
              {#if call.deadline}
                <span>Deadline: {new Date(call.deadline).toLocaleDateString('de-DE')}</span>
              {/if}
              {#if call.url}
                <a href={call.url} target="_blank" rel="noopener noreferrer" class="text-haw-hellblau hover:underline">Link</a>
              {/if}
            </div>
            {#if call.call_table_tags?.length > 0}
              <div class="flex gap-1 mt-2">
                {#each call.call_table_tags as tag}
                  {@const table = tables.find(t => t.id === tag.table_id)}
                  {#if table}
                    <span class="text-[10px] bg-haw-hellblau-20 text-haw-blau px-2 py-0.5 rounded">Tisch {table.number}</span>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
          <div class="flex gap-2 shrink-0">
            <button onclick={() => startEdit(call)} class="text-xs text-haw-blau-50 hover:text-haw-blau cursor-pointer">Bearbeiten</button>
            <button onclick={() => deleteCall(call.id)} class="text-xs text-red-400 hover:text-red-600 cursor-pointer">Löschen</button>
          </div>
        </div>
      </div>
    {/each}
    {#if calls.length === 0}
      <p class="text-center text-haw-blau-50 py-8">Noch keine Forschungscalls vorhanden. Erstellen Sie den ersten Eintrag.</p>
    {/if}
  </div>
{/if}
