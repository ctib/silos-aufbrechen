<script lang="ts">
  import { t } from '../lib/i18n';
  import { basePath } from '../lib/paths';
</script>

<nav class="flex items-center gap-4 text-sm">
  <a href={basePath('/')} class="text-haw-blau font-bold hover:text-haw-hellblau transition-colors">
    {$t('nav.start')}
  </a>
  <a href={basePath('/veranstaltungen')} class="text-haw-blau-50 hover:text-haw-blau transition-colors">
    {$t('nav.events')}
  </a>
  <a href={basePath('/intern')} class="text-haw-blau-50 hover:text-haw-blau transition-colors">
    {$t('nav.intern')}
  </a>
</nav>
