<script lang="ts">
  import { Eye } from 'lucide-svelte';
  import { solarPosition } from '$lib/utils/ephemeris';

  let { onResult }: { onResult: (r: any) => void } = $props();

  const now = new Date();
  let year: number = $state(now.getFullYear());
  let month: number = $state(now.getMonth() + 1);
  let day: number = $state(now.getDate());
  let utcH: number = $state(12);
  let utcM: number = $state(0);

  const inputClass = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none";

  function handleCalculate() {
    const utcHours = utcH + utcM / 60;
    const result = solarPosition(year, month, day, utcHours);
    onResult({ year, month, day, utcHours, ...result });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-amber-600 pl-3">天測暦</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">太陽のGHA・赤緯を簡易計算します（概算値）</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="grid grid-cols-3 gap-3">
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">年 (Year)</span>
        <input type="number" class="{inputClass} mt-1" bind:value={year} />
      </div>
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">月 (Month)</span>
        <input type="number" class="{inputClass} mt-1" min={1} max={12} bind:value={month} />
      </div>
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">日 (Day)</span>
        <input type="number" class="{inputClass} mt-1" min={1} max={31} bind:value={day} />
      </div>
    </div>
    <div class="border-t border-dashed border-slate-200 dark:border-slate-700 pt-4">
      <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">UTC 時刻</span>
      <div class="flex items-center gap-2 mt-1">
        <input type="number" class="w-20 p-2 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" min={0} max={23} bind:value={utcH} />
        <span class="text-slate-400">:</span>
        <input type="number" class="w-20 p-2 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" min={0} max={59} bind:value={utcM} />
        <span class="text-sm text-slate-500 dark:text-slate-400">UTC</span>
      </div>
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Eye size={20} /> 計算実行 (CALC)
  </button>
</div>
