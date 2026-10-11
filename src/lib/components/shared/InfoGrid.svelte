<script lang="ts">
  /** 入力条件の要約（見出し + 複数行）を横並びで表示 */
  let { items }: { items: { label: string; lines: string[] }[] } = $props();
</script>

<div
  class="grid grid-cols-2 gap-4 border-b border-slate-200 dark:border-slate-800 pb-4"
>
  {#each items as item (item.label)}
    <div>
      <p
        class="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400"
      >
        {item.label}
      </p>
      {#each item.lines as line, i (i)}
        <p class="font-mono">{line}</p>
      {/each}
    </div>
  {/each}
</div>
