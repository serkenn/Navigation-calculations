<script lang="ts">
  let { label, hours = $bindable(), minutes = $bindable(), seconds = $bindable() }: {
    label: string;
    hours: number;
    minutes: number;
    seconds: number;
  } = $props();
</script>

<div>
  <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{label}</span>
  <div class="flex items-center gap-1 mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded p-1 shadow-sm transition-colors">
    <input type="number" class="w-12 text-right outline-none font-mono text-sm bg-transparent text-slate-900 dark:text-white" bind:value={hours} placeholder="h" />
    <span class="text-slate-400 text-xs">h</span>
    <input type="number" class="w-12 text-right outline-none font-mono text-sm bg-transparent text-slate-900 dark:text-white" bind:value={minutes} placeholder="m" />
    <span class="text-slate-400 text-xs">m</span>
    <input type="number" class="w-12 text-right outline-none font-mono text-sm bg-transparent text-slate-900 dark:text-white" bind:value={seconds} placeholder="s" />
    <span class="text-slate-400 text-xs">s</span>
  </div>
</div>
