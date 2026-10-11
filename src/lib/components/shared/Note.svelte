<script lang="ts">
  import type { Snippet } from 'svelte';

  /** 補足・注意書き */
  let {
    tone = 'info',
    children,
  }: { tone?: 'info' | 'warn'; children: Snippet } = $props();

  const toneClass = {
    info: 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300',
    warn: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
  };
</script>

<div
  class="text-xs leading-relaxed border rounded-lg px-3 py-2 font-sans {toneClass[
    tone
  ]}"
>
  {@render children()}
</div>
