<script lang="ts">
  import { locale } from '../lib/i18n';

  let current = $state<'de' | 'en'>('de');

  locale.subscribe(v => { current = v; });

  function toggle() {
    locale.toggle();
  }
</script>

<button
  onclick={toggle}
  class="text-xs font-bold px-2 py-1 rounded border border-haw-blau-30 text-haw-blau hover:bg-haw-blau-10 transition-colors cursor-pointer"
  title={current === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln'}
>
  {current === 'de' ? 'EN' : 'DE'}
</button>
