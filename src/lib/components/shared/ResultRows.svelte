<script lang="ts">
  import ResultRow from './ResultRow.svelte';

  /** ResultRow をまとめて表示（途中計算の一覧） */
  let {
    rows,
  }: {
    rows: { label: string; value: string; bold?: boolean; muted?: boolean }[];
  } = $props();
</script>

<div class="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
  {#each rows as row (row.label)}
    <ResultRow {...row} />
  {/each}
</div>
