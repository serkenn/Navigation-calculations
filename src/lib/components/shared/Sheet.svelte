<script lang="ts">
  import type { Snippet } from 'svelte';
  import { useAccent } from '$lib/theme/accent';

  /** 結果シートの 1 セクション（見出しバッジ + 枠） */
  let { title, children }: { title: string; children: Snippet } = $props();

  const accent = useAccent();
</script>

<section class="sheet-section">
  <h3
    class="sheet-badge text-sm font-bold {accent()
      .badge} text-white inline-block px-3 py-1 mb-3"
  >
    {title}
  </h3>
  <div
    class="sheet-body bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-5 text-sm shadow-sm space-y-4"
  >
    {@render children()}
  </div>
</section>
