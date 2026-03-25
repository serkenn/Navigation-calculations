<script lang="ts">
  import { MapPin } from 'lucide-svelte';
  import PositionInput from '$lib/components/shared/PositionInput.svelte';
  import type { DMSValue } from '$lib/types/navigation';
  import { toDecimal } from '$lib/utils/navigationMath';
  import { mercatorDeadReckoning } from '$lib/utils/mercatorSailing';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let lat1: DMSValue = $state({ d: 35, m: 0, dir: 1 });
  let lon1: DMSValue = $state({ d: 139, m: 45, dir: 1 });
  let course: number = $state(225);
  let distance: number = $state(120);

  function handleCalculate() {
    const la1 = toDecimal(lat1.d, lat1.m) * lat1.dir;
    const lo1 = toDecimal(lon1.d, lon1.m) * lon1.dir;
    const result = mercatorDeadReckoning(la1, lo1, course, distance);
    onResult({ lat1: la1, lon1: lo1, course, distance, ...result });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-blue-600 pl-3">到着点</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">出発位置、針路、航程から到着点を計算します</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">出発点 (From)</div>
    <PositionInput bind:lat={lat1} bind:lon={lon1} />
  </section>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">針路・航程</div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">針路 (Course)</span>
        <div class="flex items-center gap-2 mt-1">
          <input type="number" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={course} />
          <span class="text-sm text-slate-500">&deg;</span>
        </div>
      </div>
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">航程 (Distance)</span>
        <div class="flex items-center gap-2 mt-1">
          <input type="number" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={distance} />
          <span class="text-sm text-slate-500">NM</span>
        </div>
      </div>
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <MapPin size={20} /> 計算実行 (CALC)
  </button>
</div>
