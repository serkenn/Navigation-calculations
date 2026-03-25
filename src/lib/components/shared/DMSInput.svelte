<script lang="ts">
  import type { DMSValue } from '$lib/types/navigation';

  let { value = $bindable(), label, showSign = false, signType = 'NS' }: {
    value: DMSValue;
    label: string;
    showSign?: boolean;
    signType?: 'NS' | 'EW';
  } = $props();
</script>

<div class="flex flex-col">
  <span class="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">{label}</span>
  <div class="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded p-1 shadow-sm transition-colors">
    <input
      type="number"
      class="w-10 text-right outline-none font-mono text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400"
      bind:value={value.d}
      placeholder="deg"
    />
    <span class="text-slate-400 text-xs">&deg;</span>
    <input
      type="number"
      class="w-12 text-right outline-none font-mono text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400"
      bind:value={value.m}
      placeholder="min"
    />
    <span class="text-slate-400 text-xs">&apos;</span>
    {#if showSign}
      <select
        class="text-xs bg-transparent outline-none font-bold text-slate-700 dark:text-slate-200"
        bind:value={value.dir}
      >
        {#if signType === 'NS'}
          <option value={1} class="text-slate-900 bg-white dark:bg-slate-800 dark:text-white">N</option>
          <option value={-1} class="text-slate-900 bg-white dark:bg-slate-800 dark:text-white">S</option>
        {:else}
          <option value={1} class="text-slate-900 bg-white dark:bg-slate-800 dark:text-white">E</option>
          <option value={-1} class="text-slate-900 bg-white dark:bg-slate-800 dark:text-white">W</option>
        {/if}
      </select>
    {/if}
  </div>
</div>
