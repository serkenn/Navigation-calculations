<script lang="ts">
  let { label, value = $bindable(), unit = '', placeholder = '', step = 1 }: {
    label: string;
    value: number;
    unit?: string;
    placeholder?: string;
    step?: number;
  } = $props();
</script>

<div>
  <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{label}</span>
  <div class="flex items-center gap-2 mt-1">
    <input
      type="number"
      {step}
      class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
      bind:value
      {placeholder}
    />
    {#if unit}
      <span class="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{unit}</span>
    {/if}
  </div>
</div>
