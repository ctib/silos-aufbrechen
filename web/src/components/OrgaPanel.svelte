<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../lib/supabase';
  import { basePath } from '../lib/paths';
  import type { Profile, Registration, WorkshopTable, TableAssignment, NachmeldungRequest } from '../lib/types';

  let loading = $state(true);
  let authorized = $state(false);
  let activeTab = $state<'teilnehmer' | 'nachmeldungen' | 'tische' | 'studis' | 'export'>('teilnehmer');

  // Data
  let profiles = $state<Profile[]>([]);
  let registrations = $state<Registration[]>([]);
  let tables = $state<WorkshopTable[]>([]);
  let assignments = $state<TableAssignment[]>([]);
  let nachmeldungen = $state<NachmeldungRequest[]>([]);

  let loadError = $state('');

  // Edit states
  let editingTable = $state<string | null>(null);
  let editTitle = $state('');
  let editDescription = $state('');
  let editCapacity = $state(15);

  // Studi assignment
  let selectedStudi = $state('');
  let selectedTable = $state('');

  onMount(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { loading = false; return; }

    // Check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'orga' && profile?.role !== 'admin') { loading = false; return; }
    authorized = true;

    await loadData();
    loading = false;
  });

  async function loadData() {
    try {
      const [profilesRes, regsRes, tablesRes, assignRes, nachmRes] = await Promise.all([
        supabase.from('profiles').select('*').order('full_name'),
        supabase.from('registrations').select('*, profiles(full_name, email), workshop_tables(number, title)').order('created_at'),
        supabase.from('workshop_tables').select('*').order('number'),
        supabase.from('table_assignments').select('*, profiles(full_name, email, role), workshop_tables(number, title)').order('created_at'),
        supabase.from('nachmeldung_requests').select('*').order('created_at', { ascending: false }),
      ]);
      profiles = profilesRes.data ?? [];
      registrations = regsRes.data ?? [];
      tables = tablesRes.data ?? [];
      assignments = assignRes.data ?? [];
      nachmeldungen = nachmRes.data ?? [];
      loadError = '';
    } catch (err) {
      console.error('Orga-Daten laden fehlgeschlagen:', err);
      loadError = 'Daten konnten nicht geladen werden. Bitte Seite neu laden.';
    }
  }

  // Stats
  const totalRegistrations = $derived(registrations.length);
  const attendsWorkshop = $derived(registrations.filter(r => r.attends_workshop).length);
  const attendsDinner = $derived(registrations.filter(r => r.attends_dinner).length);
  const totalCompanions = $derived(registrations.reduce((sum, r) => sum + (r.companion_count || 0), 0));
  const studis = $derived(profiles.filter(p => p.role === 'studi'));
  const pendingNachmeldungen = $derived(nachmeldungen.filter(n => n.status === 'pending'));

  function registrationsForTable(tableId: string) {
    return registrations.filter(r => r.table_preference === tableId);
  }

  function assignmentsForTable(tableId: string) {
    return assignments.filter(a => a.table_id === tableId);
  }

  // Table editing
  function startEditTable(table: WorkshopTable) {
    editingTable = table.id;
    editTitle = table.title;
    editDescription = table.description || '';
    editCapacity = table.capacity;
  }

  async function saveTable() {
    if (!editingTable) return;
    await supabase.from('workshop_tables').update({
      title: editTitle,
      description: editDescription,
      capacity: editCapacity,
    }).eq('id', editingTable);
    editingTable = null;
    await loadData();
  }

  // Studi assignment
  async function assignStudi() {
    if (!selectedStudi || !selectedTable) return;
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from('table_assignments').upsert({
      table_id: selectedTable,
      profile_id: selectedStudi,
      assigned_by: session?.user.id,
    }, { onConflict: 'table_id,profile_id' });
    selectedStudi = '';
    selectedTable = '';
    await loadData();
  }

  async function removeAssignment(id: string) {
    await supabase.from('table_assignments').delete().eq('id', id);
    await loadData();
  }

  // CSV Export
  function exportCSV() {
    const headers = ['Name', 'E-Mail', 'Rolle', 'Vorträge', 'Workshop', 'Abend', 'Tischwunsch', 'Begleitung', 'Quelle', 'Anmeldedatum'];
    const rows = registrations.map(r => [
      r.profiles?.full_name ?? '',
      r.profiles?.email ?? '',
      profiles.find(p => p.email === r.profiles?.email)?.role ?? '',
      r.attends_lecture ? 'Ja' : 'Nein',
      r.attends_workshop ? 'Ja' : 'Nein',
      r.attends_dinner ? 'Ja' : 'Nein',
      r.workshop_tables ? `Tisch ${r.workshop_tables.number}: ${r.workshop_tables.title}` : '',
      String(r.companion_count || 0),
      r.source || 'website',
      new Date(r.created_at).toLocaleDateString('de-DE'),
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';')).join('\n');
    const bom = '\uFEFF';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teilnehmer-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function updateRole(profileId: string, newRole: string) {
    await supabase.from('profiles').update({ role: newRole }).eq('id', profileId);
    await loadData();
  }

  // Nachmeldung management
  let processingId = $state<string | null>(null);
  let nachmeldungMessage = $state('');
  let nachmeldungError = $state('');

  async function approveNachmeldung(req: NachmeldungRequest) {
    processingId = req.id;
    nachmeldungMessage = '';
    nachmeldungError = '';

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      nachmeldungError = 'Sitzung abgelaufen. Bitte Seite neu laden.';
      processingId = null;
      return;
    }

    // 1. Update DB status FIRST (while session is still valid)
    const { error: dbError } = await supabase.from('nachmeldung_requests').update({
      status: 'approved',
      reviewed_by: session.user.id,
      reviewed_at: new Date().toISOString(),
    }).eq('id', req.id);

    if (dbError) {
      nachmeldungError = `Fehler beim Aktualisieren: ${dbError.message}`;
      processingId = null;
      return;
    }

    // 2. Send magic link to create account / grant access
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: req.email,
      options: {
        data: { full_name: req.name },
        shouldCreateUser: true,
        emailRedirectTo: window.location.origin + basePath('/auth/callback'),
      },
    });

    // 3. Create registration for the new user (idempotent — does nothing if already exists)
    await supabase.rpc('create_registration_for_email', { p_email: req.email });

    if (otpError) {
      nachmeldungMessage = `Genehmigt, aber der Zugangslink konnte nicht gesendet werden: ${otpError.message}. Bitte manuell einen Link senden.`;
    } else {
      nachmeldungMessage = `${req.name} wurde genehmigt und als Teilnehmer*in registriert. Zugangslink an ${req.email} gesendet.`;
    }

    // 4. Re-authenticate in case signInWithOtp disrupted the session
    await supabase.auth.refreshSession();

    processingId = null;
    await loadData();
  }

  async function rejectNachmeldung(req: NachmeldungRequest) {
    processingId = req.id;
    nachmeldungMessage = '';
    nachmeldungError = '';

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      nachmeldungError = 'Sitzung abgelaufen. Bitte Seite neu laden.';
      processingId = null;
      return;
    }

    const { error: dbError } = await supabase.from('nachmeldung_requests').update({
      status: 'rejected',
      reviewed_by: session.user.id,
      reviewed_at: new Date().toISOString(),
    }).eq('id', req.id);

    if (dbError) {
      nachmeldungError = `Fehler beim Ablehnen: ${dbError.message}`;
      processingId = null;
      return;
    }

    nachmeldungMessage = `Anfrage von ${req.name} wurde abgelehnt.`;
    processingId = null;
    await loadData();
  }
</script>

{#if loading}
  <div class="text-center py-12">
    <p class="text-haw-blau-70">Laden...</p>
  </div>
{:else if !authorized}
  <div class="max-w-md mx-auto text-center py-12">
    <h1 class="font-serif text-3xl font-bold text-haw-blau mb-4">Kein Zugang</h1>
    <p class="text-haw-blau-70 mb-6">Dieser Bereich ist nur für das Orga-Team zugänglich.</p>
    <a href={basePath('/intern')} class="inline-block bg-haw-blau text-white font-bold py-3 px-8 rounded hover:bg-haw-blau-90 transition-colors">
      Zum Veranstaltungsbereich
    </a>
  </div>
{:else}
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <h1 class="font-serif text-3xl font-bold text-haw-blau">Orga-Bereich</h1>
      <p class="text-haw-blau-70">Verwaltung der Veranstaltung</p>
    </div>
    <div class="flex gap-3">
      <a href={basePath('/admin')} class="text-sm bg-haw-blau-10 text-haw-blau px-4 py-2 rounded hover:bg-haw-blau-30 transition-colors">Forschungsmöglichkeiten</a>
      <a href={basePath('/intern')} class="text-sm bg-haw-blau-10 text-haw-blau px-4 py-2 rounded hover:bg-haw-blau-30 transition-colors">Veranstaltung</a>
    </div>
  </div>

  {#if loadError}
    <div class="bg-red-50 text-red-700 rounded-lg p-3 text-sm mb-6">{loadError}</div>
  {/if}

  <!-- Stats -->
  <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
    <div class="bg-haw-blau text-white rounded-lg p-4 text-center">
      <p class="text-3xl font-bold">{totalRegistrations}</p>
      <p class="text-xs text-haw-hellblau mt-1">Anmeldungen</p>
    </div>
    <div class="bg-haw-blau-10 rounded-lg p-4 text-center">
      <p class="text-3xl font-bold text-haw-blau">{attendsWorkshop}</p>
      <p class="text-xs text-haw-blau-50 mt-1">Workshop</p>
    </div>
    <div class="bg-haw-blau-10 rounded-lg p-4 text-center">
      <p class="text-3xl font-bold text-haw-blau">{attendsDinner}</p>
      <p class="text-xs text-haw-blau-50 mt-1">Abendprogramm</p>
    </div>
    <div class="bg-haw-blau-10 rounded-lg p-4 text-center">
      <p class="text-3xl font-bold text-haw-blau">{totalCompanions}</p>
      <p class="text-xs text-haw-blau-50 mt-1">Begleitpersonen</p>
    </div>
    {#if pendingNachmeldungen.length > 0}
      <div class="bg-haw-orange/10 border border-haw-orange/30 rounded-lg p-4 text-center cursor-pointer" onclick={() => activeTab = 'nachmeldungen'}>
        <p class="text-3xl font-bold text-haw-orange">{pendingNachmeldungen.length}</p>
        <p class="text-xs text-haw-orange mt-1">Offene Anfragen</p>
      </div>
    {/if}
  </div>

  <div class="haw-gradient-line w-16 mb-6"></div>

  <!-- Tabs -->
  <div class="flex gap-1 mb-6 border-b border-haw-blau-10">
    {#each [
      { id: 'teilnehmer', label: 'Teilnehmende' },
      { id: 'nachmeldungen', label: `Nachmeldungen${pendingNachmeldungen.length ? ` (${pendingNachmeldungen.length})` : ''}` },
      { id: 'tische', label: 'Tische' },
      { id: 'studis', label: 'Studi-Zuweisung' },
      { id: 'export', label: 'Export' },
    ] as tab}
      <button
        onclick={() => activeTab = tab.id as typeof activeTab}
        class="px-4 py-2 text-sm font-bold transition-colors cursor-pointer -mb-px
          {activeTab === tab.id
            ? 'text-haw-blau border-b-2 border-haw-blau'
            : 'text-haw-blau-50 hover:text-haw-blau'}"
      >{tab.label}</button>
    {/each}
  </div>

  <!-- Tab: Teilnehmende -->
  {#if activeTab === 'teilnehmer'}
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b-2 border-haw-blau text-left">
            <th class="py-2 pr-4">Name</th>
            <th class="py-2 pr-4">E-Mail</th>
            <th class="py-2 pr-4">Rolle</th>
            <th class="py-2 pr-4">Workshop</th>
            <th class="py-2 pr-4">Tischwunsch</th>
            <th class="py-2 pr-4">Abend</th>
            <th class="py-2">Begl.</th>
          </tr>
        </thead>
        <tbody>
          {#each registrations as reg}
            <tr class="border-b border-haw-blau-10 hover:bg-haw-blau-10/50">
              <td class="py-2 pr-4 font-bold">{reg.profiles?.full_name}</td>
              <td class="py-2 pr-4 text-haw-blau-70">{reg.profiles?.email}</td>
              <td class="py-2 pr-4">
                <select
                  value={profiles.find(p => p.email === reg.profiles?.email)?.role ?? 'teilnehmer'}
                  onchange={(e) => {
                    const p = profiles.find(p => p.email === reg.profiles?.email);
                    if (p) updateRole(p.id, e.currentTarget.value);
                  }}
                  class="text-xs bg-haw-blau-10 border-0 rounded px-2 py-1 cursor-pointer"
                >
                  <option value="teilnehmer">Teilnehmer</option>
                  <option value="studi">Studi</option>
                  <option value="admin">F&amp;E</option>
                  <option value="orga">Orga</option>
                </select>
              </td>
              <td class="py-2 pr-4">{reg.attends_workshop ? 'Ja' : '–'}</td>
              <td class="py-2 pr-4 text-xs">
                {reg.workshop_tables ? `T${reg.workshop_tables.number}: ${reg.workshop_tables.title}` : '–'}
              </td>
              <td class="py-2 pr-4">{reg.attends_dinner ? 'Ja' : '–'}</td>
              <td class="py-2">{reg.companion_count || '–'}</td>
            </tr>
          {/each}
        </tbody>
      </table>
      {#if registrations.length === 0}
        <p class="text-center text-haw-blau-50 py-8">Noch keine Anmeldungen vorhanden.</p>
      {/if}
    </div>

  <!-- Tab: Nachmeldungen -->
  {:else if activeTab === 'nachmeldungen'}
    {#if nachmeldungMessage}
      <div class="bg-green-50 text-green-700 rounded-lg p-3 text-sm mb-4">{nachmeldungMessage}</div>
    {/if}
    {#if nachmeldungError}
      <div class="bg-red-50 text-red-700 rounded-lg p-3 text-sm mb-4">{nachmeldungError}</div>
    {/if}
    <div class="space-y-4">
      {#each nachmeldungen as req}
        <div class="bg-white border border-haw-blau-10 rounded-lg p-5 {processingId === req.id ? 'opacity-60' : ''}">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-bold text-haw-blau">{req.name}</h3>
                <span class="text-xs px-2 py-0.5 rounded
                  {req.status === 'pending' ? 'bg-haw-orange/20 text-haw-orange'
                    : req.status === 'approved' ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'}"
                >{req.status === 'pending' ? 'Offen' : req.status === 'approved' ? 'Genehmigt' : 'Abgelehnt'}</span>
              </div>
              <p class="text-sm text-haw-blau-70 mt-0.5">{req.email}</p>
              {#if req.comment}
                <p class="text-sm text-haw-blau-70 mt-2 bg-haw-blau-10 rounded p-3 italic">„{req.comment}"</p>
              {/if}
              <p class="text-xs text-haw-blau-50 mt-2">
                {new Date(req.created_at).toLocaleDateString('de-DE')} um {new Date(req.created_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {#if req.status === 'pending'}
              <div class="flex gap-2 shrink-0">
                <button
                  onclick={() => approveNachmeldung(req)}
                  disabled={processingId !== null}
                  class="text-xs bg-green-600 text-white px-3 py-1.5 rounded cursor-pointer hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >{processingId === req.id ? 'Wird genehmigt...' : 'Genehmigen'}</button>
                <button
                  onclick={() => rejectNachmeldung(req)}
                  disabled={processingId !== null}
                  class="text-xs bg-red-500 text-white px-3 py-1.5 rounded cursor-pointer hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >{processingId === req.id ? 'Wird abgelehnt...' : 'Ablehnen'}</button>
              </div>
            {/if}
          </div>
        </div>
      {/each}
      {#if nachmeldungen.length === 0}
        <p class="text-center text-haw-blau-50 py-8">Noch keine Nachmeldungen eingegangen.</p>
      {/if}
    </div>

  <!-- Tab: Tische -->
  {:else if activeTab === 'tische'}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each tables as table}
        <div class="bg-white border border-haw-blau-10 rounded-lg p-5">
          {#if editingTable === table.id}
            <div class="space-y-3">
              <input bind:value={editTitle} class="w-full border border-haw-blau-30 rounded px-3 py-1.5 text-sm" placeholder="Titel" />
              <textarea bind:value={editDescription} class="w-full border border-haw-blau-30 rounded px-3 py-1.5 text-sm" rows="2" placeholder="Beschreibung"></textarea>
              <div class="flex items-center gap-2">
                <label class="text-xs text-haw-blau-50">Kapazität:</label>
                <input type="number" bind:value={editCapacity} class="w-16 border border-haw-blau-30 rounded px-2 py-1 text-sm" />
              </div>
              <div class="flex gap-2">
                <button onclick={saveTable} class="text-xs bg-haw-blau text-white px-3 py-1.5 rounded cursor-pointer hover:bg-haw-blau-90">Speichern</button>
                <button onclick={() => editingTable = null} class="text-xs text-haw-blau-50 px-3 py-1.5 cursor-pointer hover:text-haw-blau">Abbrechen</button>
              </div>
            </div>
          {:else}
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs text-haw-blau-50">Tisch {table.number}</p>
                <h3 class="font-bold text-haw-blau">{table.title}</h3>
                {#if table.description}
                  <p class="text-xs text-haw-blau-70 mt-1">{table.description}</p>
                {/if}
              </div>
              <button onclick={() => startEditTable(table)} class="text-xs text-haw-blau-50 hover:text-haw-blau cursor-pointer">Bearbeiten</button>
            </div>
            <div class="mt-3 flex gap-4 text-xs text-haw-blau-50">
              <span>Wunsch: {registrationsForTable(table.id).length}</span>
              <span>Zugewiesen: {assignmentsForTable(table.id).length}</span>
              <span>Kapazität: {table.capacity}</span>
            </div>
          {/if}
        </div>
      {/each}
    </div>

  <!-- Tab: Studi-Zuweisung -->
  {:else if activeTab === 'studis'}
    <div class="max-w-lg space-y-6">
      <div class="bg-haw-blau-10 rounded-lg p-5">
        <h3 class="font-bold text-haw-blau mb-3">Studi einem Tisch zuweisen</h3>
        <div class="space-y-3">
          <select bind:value={selectedStudi} class="w-full border border-haw-blau-30 rounded px-3 py-2 text-sm">
            <option value="">Studi wählen...</option>
            {#each studis as studi}
              <option value={studi.id}>{studi.full_name} ({studi.email})</option>
            {/each}
          </select>
          <select bind:value={selectedTable} class="w-full border border-haw-blau-30 rounded px-3 py-2 text-sm">
            <option value="">Tisch wählen...</option>
            {#each tables as table}
              <option value={table.id}>Tisch {table.number}: {table.title}</option>
            {/each}
          </select>
          <button
            onclick={assignStudi}
            disabled={!selectedStudi || !selectedTable}
            class="bg-haw-blau text-white px-4 py-2 rounded text-sm font-bold cursor-pointer hover:bg-haw-blau-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >Zuweisen</button>
        </div>
      </div>

      <div>
        <h3 class="font-bold text-haw-blau mb-3">Aktuelle Zuweisungen</h3>
        {#if assignments.length === 0}
          <p class="text-sm text-haw-blau-50">Noch keine Zuweisungen.</p>
        {:else}
          <div class="space-y-2">
            {#each assignments as a}
              <div class="flex items-center justify-between bg-white border border-haw-blau-10 rounded px-4 py-2">
                <div class="text-sm">
                  <span class="font-bold">{a.profiles?.full_name}</span>
                  <span class="text-haw-blau-50 mx-2">&rarr;</span>
                  <span>Tisch {a.workshop_tables?.number}: {a.workshop_tables?.title}</span>
                </div>
                <button onclick={() => removeAssignment(a.id)} class="text-xs text-red-500 hover:text-red-700 cursor-pointer">Entfernen</button>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

  <!-- Tab: Export -->
  {:else if activeTab === 'export'}
    <div class="max-w-md space-y-6">
      <div class="bg-white border border-haw-blau-10 rounded-lg p-6">
        <h3 class="font-bold text-haw-blau mb-2">Teilnehmerliste exportieren</h3>
        <p class="text-sm text-haw-blau-70 mb-4">
          Exportiert alle {totalRegistrations} Anmeldungen als CSV-Datei (Semikolon-getrennt, UTF-8 mit BOM für Excel).
        </p>
        <button
          onclick={exportCSV}
          class="bg-haw-blau text-white px-6 py-2.5 rounded font-bold cursor-pointer hover:bg-haw-blau-90 transition-colors"
        >CSV herunterladen</button>
      </div>
    </div>
  {/if}
{/if}
