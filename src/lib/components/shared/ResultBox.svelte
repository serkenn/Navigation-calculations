<script lang="ts">
  import type { Snippet } from 'svelte';
  let { label, children }: { label: string; children: Snippet } = $props();
</script>

<div class="bg-white dark:bg-slate-900 border-4 border-double border-slate-800 dark:border-slate-400 p-4 text-center shadow-lg">
  <p class="text-xs text-slate-400 uppercase tracking-widest mb-2">{label}</p>
  {@render children()}
</div>
