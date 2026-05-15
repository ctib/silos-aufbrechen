<script lang="ts">
  import { t } from '../lib/i18n';
  import { basePath } from '../lib/paths';

  const veranstaltungen = [
    {
      slug: 'silos-aufbrechen-2026',
      title: 'Silos aufbrechen – Zukunft bauen',
      date: '7. Mai 2026',
      location: 'HAW Kiel, Sokratesplatz 1',
      description_de: 'Interdisziplinärer Workshop mit Impulsen von Prof. Dr. Meike Wocken und Prof. Dr. Tammo Peters sowie Antrittsvorlesung von Prof. Dr.-Ing. Christoph Göbel.',
      description_en: 'Interdisciplinary workshop with talks by Prof. Dr. Meike Wocken and Prof. Dr. Tammo Peters, and inaugural lecture by Prof. Dr.-Ing. Christoph Göbel.',
      status: 'durchgeführt' as const,
    },
  ];
</script>

<section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <h1 class="font-serif text-4xl font-bold text-haw-blau mb-2">{$t('events.title')}</h1>
  <p class="text-haw-blau-70 mb-8">{$t('events.subtitle')}</p>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {#each veranstaltungen as v}
      <a
        href={basePath(`/veranstaltungen/${v.slug}`)}
        class="block bg-white border border-haw-blau-10 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
      >
        <div class="border-t-4 border-haw-blau p-6">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-bold text-haw-blau">{v.date}</span>
            <span class="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
              {$t('events.status.done')}
            </span>
          </div>
          <h2 class="font-serif text-xl font-bold text-haw-blau mb-2">{v.title}</h2>
          <p class="text-sm text-haw-blau-70 mb-2">
            {$t('events.title') === 'Events' ? v.description_en : v.description_de}
          </p>
          <p class="text-xs text-haw-blau-50">{v.location}</p>
        </div>
      </a>
    {/each}
  </div>
</section>
