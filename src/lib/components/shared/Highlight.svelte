<script lang="ts">
  import { useAccent } from '#lib/theme/accent.js';

  /** 最終答案を大きく表示するボックス */
  let {
    items,
  }: {
    items: { label: string; value: string; unit?: string; sub?: string }[];
  } = $props();

  const accent = useAccent();
  const cols = $derived(
    items.length >= 3
      ? 'grid-cols-1 sm:grid-cols-3'
      : items.length === 2
        ? 'grid-cols-2'
        : 'grid-cols-1',
  );
</script>

<div class="sheet-highlight p-4 text-center border {accent().highlight}">
  <div class="grid {cols} gap-4">
    {#each items as item (item.label)}
      <div>
        <p
          class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1"
        >
          {item.label}
        </p>
        <p class="text-2xl font-mono font-bold {accent().highlightText}">
          {item.value}
        </p>
        {#if item.unit}
          <p class="text-xs text-slate-500 dark:text-slate-400">{item.unit}</p>
        {/if}
        {#if item.sub}
          <p class="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
            {item.sub}
          </p>
        {/if}
      </div>
    {/each}
  </div>
</div>
