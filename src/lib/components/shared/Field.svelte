<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    label,
    hint = '',
    children,
  }: { label: string; hint?: string; children: Snippet } = $props();
</script>

<!-- svelte-ignore a11y_label_has_associated_control -->
<label class="block min-w-0">
  <span
    class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1"
    >{label}</span
  >
  {@render children()}
  {#if hint}
    <span class="block text-[10px] text-slate-400 mt-1">{hint}</span>
  {/if}
</label>
