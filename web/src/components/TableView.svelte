<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { supabase } from '../lib/supabase';
  import { basePath } from '../lib/paths';
  import { callTypeLabel } from '../lib/callTypes';
  import type { WorkshopTable, TableNote, TableAssignment, ResearchCall, NoteSection } from '../lib/types';

  interface Props {
    tableNumber: number;
  }
  let { tableNumber }: Props = $props();

  const sectionOrder: NoteSection[] = ['offene_notizen', 'ideensammlung', 'protokoll'];
  const sectionLabels: Partial<Record<NoteSection, string>> = {
    offene_notizen: 'Offene Notizen',
    ideensammlung: 'Ideensammlung',
    protokoll: 'Protokoll',
  };

  let loading = $state(true);
  let authorized = $state(false);
  let userRole = $state('');
  let table = $state<WorkshopTable | null>(null);
  let notes = $state<TableNote[]>([]);
  let participants = $state<TableAssignment[]>([]);
  let calls = $state<ResearchCall[]>([]);
  let interests = $state<{ full_name: string; role: string; total_tables: number }[]>([]);
  let activeSection = $state<NoteSection>('offene_notizen');
  // canEdit depends on section: offene_notizen is writable by everyone, others only by studi/orga
  const canEdit = $derived(
    userRole === 'studi' || userRole === 'orga' || userRole === 'admin' || activeSection === 'offene_notizen'
  );
  let allProfiles = $state<{ id: string; full_name: string; role: string }[]>([]);
  let selectedProfileId = $state('');
  let assigning = $state(false);
  let saving = $state(false);
  let loadError = $state('');
  let realtimeChannel: ReturnType<typeof supabase.channel> | null = null;

  const canManageAssignments = $derived(
    userRole === 'studi' || userRole === 'admin' || userRole === 'orga'
  );
  const availableProfiles = $derived(
    allProfiles.filter(p => !participants.some(a => a.profile_id === p.id))
  );
  const studiInterests = $derived(
    interests.filter(i => i.role === 'studi')
  );
  const filteredInterests = $derived(
    interests.filter(i => i.role !== 'studi')
  );

  // Current note content for active section
  const currentNote = $derived(notes.find(n => n.section === activeSection));
  let editContent = $state('');

  // Sync editContent when section changes
  $effect(() => {
    const note = notes.find(n => n.section === activeSection);
    editContent = note?.content ?? '';
  });

  onMount(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { loading = false; return; }

    // Check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const role = profile?.role;
    if (!role || role === 'gast') { loading = false; return; }
    authorized = true;
    userRole = role;

    // Load table by number
    const { data: tableData } = await supabase
      .from('workshop_tables')
      .select('*')
      .eq('number', tableNumber)
      .single();

    if (!tableData) { loading = false; return; }
    table = tableData;

    await loadData(tableData.id);

    // Load all profiles for assignment dropdown (studi/admin/orga only)
    if (canManageAssignments) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .order('full_name');
      allProfiles = profileData ?? [];
    }

    // Realtime subscription for notes
    realtimeChannel = supabase
      .channel(`table-notes-${tableData.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'table_notes',
        filter: `table_id=eq.${tableData.id}`,
      }, (payload: any) => {
        notes = notes.map(n => n.id === payload.new.id ? { ...n, ...payload.new } : n);
      })
      .subscribe();

    loading = false;
  });

  onDestroy(() => {
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
    }
  });

  async function loadData(tableId: string) {
    try {
      const [notesRes, assignRes, callsRes, interestsRes] = await Promise.all([
        supabase.from('table_notes').select('*').eq('table_id', tableId).order('section'),
        supabase.from('table_assignments').select('*, profiles(full_name, email, role)').eq('table_id', tableId),
        supabase.from('research_calls').select('*, call_table_tags!inner(table_id)').eq('call_table_tags.table_id', tableId).order('deadline'),
        supabase.rpc('get_table_interests', { p_table_number: tableNumber }),
      ]);
      notes = notesRes.data ?? [];
      participants = assignRes.data ?? [];
      calls = callsRes.data ?? [];
      interests = interestsRes.data ?? [];
      loadError = '';
    } catch (err) {
      console.error('Tischdaten laden fehlgeschlagen:', err);
      loadError = 'Daten konnten nicht geladen werden. Bitte Seite neu laden.';
    }
  }

  async function saveNote() {
    if (!currentNote || !canEdit) return;
    saving = true;
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from('table_notes').update({
      content: editContent,
      last_edited_by: session?.user.id,
    }).eq('id', currentNote.id);
    saving = false;
  }

  // Auto-save with debounce
  let saveTimeout: ReturnType<typeof setTimeout>;
  function handleInput() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveNote, 1500);
  }

  async function assignProfile() {
    if (!selectedProfileId || !table) return;
    assigning = true;
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from('table_assignments').upsert({
      table_id: table.id,
      profile_id: selectedProfileId,
      assigned_by: session?.user.id,
    }, { onConflict: 'table_id,profile_id' });
    selectedProfileId = '';
    await loadData(table.id);
    assigning = false;
  }

  async function removeAssignment(id: string) {
    if (!table) return;
    await supabase.from('table_assignments').delete().eq('id', id);
    await loadData(table.id);
  }

</script>

{#if loading}
  <div class="text-center py-12">
    <p class="text-haw-blau-70">Laden...</p>
  </div>
{:else if !authorized || !table}
  <div class="max-w-md mx-auto text-center py-12">
    <h1 class="font-serif text-3xl font-bold text-haw-blau mb-4">Kein Zugang</h1>
    <p class="text-haw-blau-70 mb-6">Bitte melden Sie sich an, um den Tischbereich zu sehen.</p>
    <a href={basePath('/intern')} class="inline-block bg-haw-blau text-white font-bold py-3 px-8 rounded hover:bg-haw-blau-90 transition-colors">
      Zum Veranstaltungsbereich
    </a>
  </div>
{:else}
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <p class="text-sm text-haw-blau-50">Tisch {table.number}</p>
      <h1 class="font-serif text-3xl font-bold text-haw-blau">{table.title}</h1>
      {#if table.description}
        <p class="text-haw-blau-70 mt-1">{table.description}</p>
      {/if}
    </div>
    <a href={basePath('/intern')} class="text-sm bg-haw-blau-10 text-haw-blau px-4 py-2 rounded hover:bg-haw-blau-30 transition-colors self-start">
      Zurück
    </a>
  </div>

  <div class="haw-gradient-line w-16 mb-6"></div>

  {#if loadError}
    <div class="bg-red-50 text-red-700 rounded-lg p-3 text-sm mb-6">{loadError}</div>
  {/if}

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Left: Notes (Etherpad) -->
    <div class="lg:col-span-2">
      <!-- Section tabs -->
      <div class="flex gap-1 mb-4 overflow-x-auto">
        {#each sectionOrder as section}
          <button
            onclick={() => activeSection = section}
            class="px-3 py-1.5 text-xs font-bold rounded-t transition-colors cursor-pointer whitespace-nowrap
              {activeSection === section
                ? 'bg-haw-blau text-white'
                : 'bg-haw-blau-10 text-haw-blau-50 hover:bg-haw-blau-30 hover:text-haw-blau'}"
          >{sectionLabels[section]}</button>
        {/each}
      </div>

      <!-- Note editor -->
      <div class="bg-white border border-haw-blau-10 rounded-lg rounded-tl-none p-1">
        {#if canEdit}
          <textarea
            bind:value={editContent}
            oninput={handleInput}
            class="w-full min-h-[400px] p-4 text-sm font-mono resize-y border-0 focus:outline-none focus:ring-0"
            placeholder="Hier Notizen erfassen..."
          ></textarea>
          <div class="flex items-center justify-between px-4 py-2 border-t border-haw-blau-10 text-xs text-haw-blau-50">
            <span>{saving ? 'Speichern...' : 'Automatische Speicherung'}</span>
            <button
              onclick={saveNote}
              class="text-haw-blau hover:underline cursor-pointer"
            >Jetzt speichern</button>
          </div>
        {:else}
          <div class="p-4 min-h-[400px] text-sm whitespace-pre-wrap">
            {currentNote?.content || 'Noch keine Notizen vorhanden.'}
          </div>
          <div class="px-4 py-2 border-t border-haw-blau-10 text-xs text-haw-blau-50">
            Nur Studis und Orga können Notizen bearbeiten.
          </div>
        {/if}
      </div>
    </div>

    <!-- Right: Interests + Participants + Calls -->
    <div class="space-y-6">
      <!-- Interests (from registration preferences) -->
      <div class="bg-white border border-haw-blau-10 rounded-lg p-5">
        <h3 class="font-bold text-haw-blau mb-3">Interessierte ({filteredInterests.length})</h3>
        {#if filteredInterests.length === 0}
          <p class="text-xs text-haw-blau-50">Noch keine Interessenten.</p>
        {:else}
          <div class="space-y-2">
            {#each filteredInterests as person}
              <div class="flex items-center gap-2 text-sm">
                <span class="w-2 h-2 rounded-full shrink-0
                  {person.role === 'studi' ? 'bg-haw-orange' : 'bg-haw-hellblau'}"></span>
                <span class="font-bold">{person.full_name}</span>
                {#if person.total_tables > 1}
                  <span class="text-[10px] text-haw-blau-50">zu {Math.round(100 / person.total_tables)}%</span>
                {/if}
                {#if person.role === 'studi'}
                  <span class="text-[10px] bg-haw-orange/20 text-haw-orange px-1.5 py-0.5 rounded">Studi</span>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Participants at this table (assigned, with management) -->
      <div class="bg-white border border-haw-blau-10 rounded-lg p-5">
        <h3 class="font-bold text-haw-blau mb-3">Am Tisch ({participants.length})</h3>
        {#if participants.length === 0}
          <p class="text-xs text-haw-blau-50">Noch keine Teilnehmenden zugewiesen.</p>
        {:else}
          <div class="space-y-2">
            {#each participants as p}
              <div class="flex items-center gap-2 text-sm">
                <span class="w-2 h-2 rounded-full shrink-0
                  {p.profiles?.role === 'studi' ? 'bg-haw-orange' : 'bg-haw-hellblau'}"></span>
                <span class="font-bold flex-1">{p.profiles?.full_name}</span>
                {#if p.profiles?.role === 'studi'}
                  <span class="text-[10px] bg-haw-orange/20 text-haw-orange px-1.5 py-0.5 rounded">Studi</span>
                {/if}
                {#if canManageAssignments}
                  <button
                    onclick={() => removeAssignment(p.id)}
                    class="text-red-400 hover:text-red-600 text-xs font-bold cursor-pointer"
                    title="Zuweisung entfernen"
                  >✕</button>
                {/if}
              </div>
            {/each}
          </div>
        {/if}

        {#if canManageAssignments}
          <div class="mt-3 flex gap-2">
            <select
              bind:value={selectedProfileId}
              class="flex-1 text-xs border border-haw-blau-10 rounded px-2 py-1.5"
            >
              <option value="">Person wählen…</option>
              {#each availableProfiles as profile}
                <option value={profile.id}>{profile.full_name} ({profile.role})</option>
              {/each}
            </select>
            <button
              onclick={assignProfile}
              disabled={!selectedProfileId || assigning}
              class="text-xs bg-haw-blau text-white px-3 py-1.5 rounded hover:bg-haw-blau-90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >{assigning ? '…' : 'Zuweisen'}</button>
          </div>
        {/if}
      </div>

      <!-- Quick links to other tables -->
      <div class="bg-haw-blau-10 rounded-lg p-5">
        <h3 class="font-bold text-haw-blau mb-3 text-sm">Andere Tische</h3>
        <div class="flex flex-wrap gap-2">
          {#each [
            { nr: 1, short: 'Nahrung' },
            { nr: 2, short: 'Bildung' },
            { nr: 3, short: 'Sensorik' },
            { nr: 4, short: 'Städtebau' },
            { nr: 5, short: 'Gebäude' },
            { nr: 6, short: 'Frei' },
          ] as t}
            {#if t.nr !== tableNumber}
              <a
                href={basePath(`/tisch/${t.nr}`)}
                class="text-xs bg-white text-haw-blau px-3 py-1.5 rounded hover:bg-haw-blau hover:text-white transition-colors"
                title="Tisch {t.nr}"
              >{t.short}</a>
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- Tischteam (Moderator + Studis, full width below notes) -->
  {#if table.moderator_name || studiInterests.length > 0}
    <div class="mt-8">
      <div class="bg-white border border-haw-blau-10 rounded-lg p-6">
        <h2 class="font-bold text-haw-blau text-lg mb-4">Tischteam</h2>
        <div class="flex flex-wrap gap-4">
          {#if table.moderator_name}
            <div class="flex items-center gap-2 text-sm">
              <span class="w-2 h-2 rounded-full shrink-0 bg-haw-blau"></span>
              <span class="font-bold">{table.moderator_name}</span>
              <span class="text-[10px] bg-haw-blau/15 text-haw-blau px-1.5 py-0.5 rounded">Moderation</span>
            </div>
          {/if}
          {#each studiInterests as person}
            <div class="flex items-center gap-2 text-sm">
              <span class="w-2 h-2 rounded-full shrink-0 bg-haw-orange"></span>
              <span class="font-bold">{person.full_name}</span>
              <span class="text-[10px] bg-haw-orange/20 text-haw-orange px-1.5 py-0.5 rounded">Studi</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  <!-- Research calls for this table (full width, below notes) -->
  {#if calls.length > 0}
    <div class="mt-8">
      <div class="bg-white border border-haw-blau-10 rounded-lg p-6">
        <h2 class="font-bold text-haw-blau text-lg mb-4">Forschungscalls für diesen Tisch</h2>
        <div class="space-y-4">
          {#each calls as call}
            <div class="border-b border-haw-blau-10 pb-4 last:border-0 last:pb-0">
              <div class="flex items-start justify-between gap-2">
                <h3 class="font-bold text-sm text-haw-blau">{call.title}</h3>
                <span class="text-[10px] bg-haw-blau-10 text-haw-blau px-2 py-0.5 rounded shrink-0">
                  {callTypeLabel(call.call_type)}
                </span>
              </div>
              {#if call.description}
                <p class="text-sm text-haw-blau-70 mt-1">{call.description}</p>
              {/if}
              <div class="flex items-center gap-3 mt-2 text-xs text-haw-blau-50">
                {#if call.deadline}
                  <span>Deadline: {new Date(call.deadline).toLocaleDateString('de-DE')}</span>
                {/if}
                {#if call.url}
                  <a href={call.url} target="_blank" rel="noopener noreferrer" class="text-haw-hellblau hover:underline">
                    Link
                  </a>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
{/if}
