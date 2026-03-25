<script lang="ts">
  import { Route } from 'lucide-svelte';
  import PositionInput from '$lib/components/shared/PositionInput.svelte';
  import type { DMSValue } from '$lib/types/navigation';
  import { toDecimal } from '$lib/utils/navigationMath';
  import { mercatorCourseDistance } from '$lib/utils/mercatorSailing';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let lat1: DMSValue = $state({ d: 35, m: 0, dir: 1 });
  let lon1: DMSValue = $state({ d: 139, m: 45, dir: 1 });
  let lat2: DMSValue = $state({ d: 33, m: 30, dir: 1 });
  let lon2: DMSValue = $state({ d: 135, m: 45, dir: 1 });

  function handleCalculate() {
    const la1 = toDecimal(lat1.d, lat1.m) * lat1.dir;
    const lo1 = toDecimal(lon1.d, lon1.m) * lon1.dir;
    const la2 = toDecimal(lat2.d, lat2.m) * lat2.dir;
    const lo2 = toDecimal(lon2.d, lon2.m) * lon2.dir;
    const result = mercatorCourseDistance(la1, lo1, la2, lo2);
    onResult({ ...result, lat1: la1, lon1: lo1, lat2: la2, lon2: lo2 });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-blue-600 pl-3">針路・航程</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">メルカトル航法による針路と航程を計算します</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">出発点 (From)</div>
    <PositionInput bind:lat={lat1} bind:lon={lon1} />
  </section>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">到着点 (To)</div>
    <PositionInput bind:lat={lat2} bind:lon={lon2} />
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Route size={20} /> 計算実行 (CALC)
  </button>
</div>
