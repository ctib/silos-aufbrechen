<script lang="ts">
  import { t } from '../lib/i18n';
  import { basePath } from '../lib/paths';
  import { TEMP_CTAS } from '../lib/config';

  const now = new Date();
  const activeCTAs = TEMP_CTAS.filter(cta => now < cta.expires);
</script>

<!-- Hero -->
<section class="bg-haw-blau-10 py-16 sm:py-20">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-haw-blau leading-tight text-justify whitespace-pre-line">
      {$t('hero.title')}
    </h1>
    <p class="mt-4 text-xl sm:text-2xl text-haw-blau-70 font-serif italic text-justify">
      {$t('hero.subtitle')}
    </p>
  </div>
</section>

<!-- Kiel-Motiv -->
<section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div class="bg-white border-l-4 border-haw-blau rounded-r-lg p-6 sm:p-8">
    <p class="text-lg sm:text-xl leading-relaxed italic text-haw-blau-70">
      {$t('kiel.quote')}
    </p>
    <p class="mt-3 text-sm text-haw-blau-50 text-right">– {$t('kiel.attribution')}</p>
  </div>
  <div class="haw-gradient-line mt-8 w-24"></div>
  <p class="mt-8 text-lg leading-relaxed">
    {$t('kiel.text')}
  </p>
</section>

<!-- Rückblick -->
<section class="bg-haw-blau text-white py-12">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="font-serif text-3xl font-bold mb-6">{$t('review.title')}</h2>
    <p class="text-lg leading-relaxed text-haw-hellblau">
      {$t('review.text1')}
    </p>
    <p class="mt-4 text-lg leading-relaxed text-white/80">
      {$t('review.text2')}
    </p>
    <a
      href={basePath('/veranstaltungen')}
      class="inline-block mt-6 bg-haw-hellblau text-haw-blau font-bold py-3 px-8 rounded hover:bg-white transition-colors"
    >
      {$t('review.link')}
    </a>
  </div>
</section>

<!-- Temporäre CTAs -->
{#if activeCTAs.length > 0}
  <section class="bg-haw-orange/10 py-10">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <p class="text-center text-haw-blau-70 mb-6">{$t('cta.heading')}</p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        {#each activeCTAs as cta}
          <a
            href={cta.url}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block bg-haw-orange text-white font-bold py-3 px-8 rounded hover:bg-haw-blau transition-colors text-center"
          >
            {$t(cta.i18nKey)}
          </a>
        {/each}
      </div>
    </div>
  </section>
{/if}

<!-- Team -->
<section class="bg-haw-blau-10 py-12">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="font-serif text-3xl font-bold text-haw-blau mb-8">{$t('team.title')}</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Meike Wocken -->
      <div class="bg-white rounded-lg shadow-sm p-6 border-t-4 border-haw-hellblau">
        <h3 class="font-bold text-lg text-haw-blau">
          <a href="https://www.haw-kiel.de/person/meike-wocken/" target="_blank" rel="noopener noreferrer" class="hover:text-haw-hellblau transition-colors">
            Prof. Dr. Meike Wocken
          </a>
        </h3>
        <p class="text-haw-blau-70 text-sm mt-1">Wirtschaftsinformatik, FB Wirtschaft</p>
        <div class="haw-gradient-line mt-4 w-12"></div>
        <p class="mt-4 text-sm leading-relaxed">
          {$t('team.wocken.focus')}
        </p>
      </div>
      <!-- Christoph Göbel -->
      <div class="bg-white rounded-lg shadow-sm p-6 border-t-4 border-haw-blau">
        <h3 class="font-bold text-lg text-haw-blau">
          <a href="https://www.haw-kiel.de/person/christoph-goebel" target="_blank" rel="noopener noreferrer" class="hover:text-haw-hellblau transition-colors">
            Prof. Dr.-Ing. Christoph Göbel
          </a>
        </h3>
        <p class="text-haw-blau-70 text-sm mt-1">Gebäudetechnologie, FB Medien/Bauwesen</p>
        <div class="haw-gradient-line mt-4 w-12"></div>
        <p class="mt-4 text-sm leading-relaxed">
          {$t('team.goebel.focus')}
        </p>
      </div>
      <!-- Tammo Peters -->
      <div class="bg-white rounded-lg shadow-sm p-6 border-t-4 border-haw-hellblau">
        <h3 class="font-bold text-lg text-haw-blau">
          <a href="https://www.haw-kiel.de/person/tammo-peters/" target="_blank" rel="noopener noreferrer" class="hover:text-haw-hellblau transition-colors">
            Prof. Dr. Tammo Peters
          </a>
        </h3>
        <p class="text-haw-blau-70 text-sm mt-1">Grünlandwirtschaft, FB Agrarwirtschaft</p>
        <div class="haw-gradient-line mt-4 w-12"></div>
        <p class="mt-4 text-sm leading-relaxed">
          {$t('team.peters.focus')}
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Ausblick -->
<section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <h2 class="font-serif text-3xl font-bold text-haw-blau mb-6">{$t('outlook.title')}</h2>
  <p class="text-lg leading-relaxed text-haw-blau-70">
    {$t('outlook.text1')}
  </p>
  <p class="mt-4 text-lg leading-relaxed">
    {$t('outlook.text2')}
  </p>
  <div class="haw-gradient-line mt-8 w-24"></div>
</section>
