<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../lib/supabase';

  type UserRole = 'gast' | 'teilnehmer' | 'studi' | 'admin' | 'orga';

  let loading = $state(true);
  let authenticated = $state(false);
  let profile = $state<any>(null);
  let registration = $state<any>(null);
  let participants = $state<any[]>([]);
  let researchCalls = $state<any[]>([]);
  let tables = $state<any[]>([]);
  let userRole = $state<UserRole>('gast');

  onMount(async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      loading = false;
      return;
    }

    authenticated = true;

    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileData) {
      profile = profileData;
      userRole = profileData.role;
    }

    // Load own registration
    const { data: regData } = await supabase
      .from('registrations')
      .select('*, workshop_tables(title, number)')
      .eq('profile_id', session.user.id)
      .single();

    if (regData) registration = regData;

    // Load public participants
    const { data: pubParticipants } = await supabase
      .from('profiles')
      .select('full_name, background')
      .eq('show_name_public', true);

    if (pubParticipants) participants = pubParticipants;

    // Load workshop tables
    const { data: tablesData } = await supabase
      .from('workshop_tables')
      .select('*')
      .eq('is_active', true)
      .order('number');

    if (tablesData) tables = tablesData;

    // Load research calls
    const { data: callsData } = await supabase
      .from('research_calls')
      .select('*, call_table_tags(table_id)')
      .order('deadline', { ascending: true });

    if (callsData) researchCalls = callsData;

    loading = false;
  });

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  function callTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      call_for_papers: 'Call for Papers',
      funding: 'Förderung',
      conference: 'Konferenz',
      journal: 'Journal',
      other: 'Sonstiges',
    };
    return labels[type] || type;
  }
</script>

{#if loading}
  <div class="text-center py-12">
    <p class="text-haw-blau-70">Laden...</p>
  </div>
{:else if !authenticated}
  <div class="max-w-md mx-auto text-center py-12">
    <h1 class="font-serif text-3xl font-bold text-haw-blau mb-4">Interner Bereich</h1>
    <p class="text-haw-blau-70 mb-6">
      Bitte melden Sie sich an, um den internen Bereich zu sehen.
    </p>
    <a
      href="/anmeldung"
      class="inline-block bg-haw-blau text-white font-bold py-3 px-8 rounded hover:bg-haw-blau-90 transition-colors"
    >
      Zur Anmeldung
    </a>
  </div>
{:else}
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
    <div>
      <h1 class="font-serif text-3xl font-bold text-haw-blau">Interner Bereich</h1>
      <p class="text-haw-blau-70">
        Willkommen, {profile?.full_name}
        {#if userRole !== 'teilnehmer'}
          <span class="text-xs bg-haw-hellblau text-haw-blau px-2 py-0.5 rounded-full ml-2 font-bold uppercase">
            {userRole}
          </span>
        {/if}
      </p>
    </div>
    <div class="flex gap-3">
      {#if userRole === 'admin' || userRole === 'orga'}
        <a href="/admin" class="text-sm bg-haw-blau-10 text-haw-blau px-4 py-2 rounded hover:bg-haw-blau-30 transition-colors">
          Admin
        </a>
      {/if}
      {#if userRole === 'orga'}
        <a href="/orga" class="text-sm bg-haw-blau-10 text-haw-blau px-4 py-2 rounded hover:bg-haw-blau-30 transition-colors">
          Orga
        </a>
      {/if}
      <button
        onclick={handleLogout}
        class="text-sm text-haw-blau-50 hover:text-haw-blau transition-colors cursor-pointer"
      >
        Abmelden
      </button>
    </div>
  </div>

  <div class="haw-gradient-line w-16 mb-8"></div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Left column: Own registration + Participants -->
    <div class="lg:col-span-2 space-y-8">

      <!-- Own Registration -->
      {#if registration}
        <div class="bg-white border border-haw-blau-10 rounded-lg p-6">
          <h2 class="font-bold text-haw-blau text-lg mb-4">Ihre Anmeldung</h2>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-haw-blau-50">Vorträge</p>
              <p class="font-bold">{registration.attends_lecture ? 'Ja' : 'Nein'}</p>
            </div>
            <div>
              <p class="text-haw-blau-50">Workshop</p>
              <p class="font-bold">{registration.attends_workshop ? 'Ja' : 'Nein'}</p>
            </div>
            <div>
              <p class="text-haw-blau-50">Abendprogramm</p>
              <p class="font-bold">{registration.attends_dinner ? 'Ja' : 'Nein'}</p>
            </div>
            <div>
              <p class="text-haw-blau-50">Workshoptisch</p>
              <p class="font-bold">
                {registration.workshop_tables
                  ? `Tisch ${registration.workshop_tables.number}: ${registration.workshop_tables.title}`
                  : 'Nicht gewählt'}
              </p>
            </div>
            <div>
              <p class="text-haw-blau-50">Begleitung</p>
              <p class="font-bold">{registration.companion_count} Person(en)</p>
            </div>
          </div>
        </div>
      {/if}

      <!-- Participants list -->
      <div class="bg-white border border-haw-blau-10 rounded-lg p-6">
        <h2 class="font-bold text-haw-blau text-lg mb-4">
          Teilnehmende ({participants.length})
        </h2>
        {#if participants.length === 0}
          <p class="text-sm text-haw-blau-50">Noch keine öffentlichen Teilnehmenden.</p>
        {:else}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {#each participants as p}
              <div class="flex items-center gap-2 py-1">
                <span class="w-2 h-2 rounded-full bg-haw-hellblau shrink-0"></span>
                <span class="font-bold">{p.full_name}</span>
                {#if p.background}
                  <span class="text-haw-blau-50">({p.background})</span>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Right column: Research Calls -->
    <div>
      <div class="bg-white border border-haw-blau-10 rounded-lg p-6">
        <h2 class="font-bold text-haw-blau text-lg mb-4">Forschungscalls & Konferenzen</h2>
        {#if researchCalls.length === 0}
          <p class="text-sm text-haw-blau-50">Noch keine Einträge vorhanden.</p>
        {:else}
          <div class="space-y-4">
            {#each researchCalls as call}
              <div class="border-b border-haw-blau-10 pb-3 last:border-0">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-bold text-sm text-haw-blau">{call.title}</h3>
                  <span class="text-[10px] bg-haw-blau-10 text-haw-blau px-2 py-0.5 rounded shrink-0">
                    {callTypeLabel(call.call_type)}
                  </span>
                </div>
                {#if call.description}
                  <p class="text-xs text-haw-blau-70 mt-1">{call.description}</p>
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
                {#if call.call_table_tags?.length > 0}
                  <div class="flex gap-1 mt-2">
                    {#each call.call_table_tags as tag}
                      {@const table = tables.find(t => t.id === tag.table_id)}
                      {#if table}
                        <span class="text-[10px] bg-haw-hellblau-20 text-haw-blau px-1.5 py-0.5 rounded">
                          Tisch {table.number}
                        </span>
                      {/if}
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Workshop Tables links (for Studis) -->
      {#if userRole === 'studi' || userRole === 'orga'}
        <div class="bg-white border border-haw-blau-10 rounded-lg p-6 mt-6">
          <h2 class="font-bold text-haw-blau text-lg mb-4">Workshoptische</h2>
          <div class="space-y-2">
            {#each tables as table}
              <a
                href={`/tisch/${table.id}`}
                class="block p-3 rounded border border-haw-blau-10 hover:bg-haw-blau-10 transition-colors"
              >
                <p class="font-bold text-sm text-haw-blau">Tisch {table.number}: {table.title}</p>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}
