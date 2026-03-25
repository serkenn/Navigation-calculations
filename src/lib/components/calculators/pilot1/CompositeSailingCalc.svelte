<script lang="ts">
  import { Globe } from 'lucide-svelte';
  import PositionInput from '$lib/components/shared/PositionInput.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import type { DMSValue } from '$lib/types/navigation';
  import { toDecimal } from '$lib/utils/navigationMath';
  import { compositeSailing } from '$lib/utils/greatCircle';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let lat1: DMSValue = $state({ d: 35, m: 0, dir: 1 });
  let lon1: DMSValue = $state({ d: 139, m: 45, dir: 1 });
  let lat2: DMSValue = $state({ d: 37, m: 47, dir: 1 });
  let lon2: DMSValue = $state({ d: 122, m: 25, dir: -1 });
  let limitLat: number = $state(45);

  function handleCalculate() {
    const la1 = toDecimal(lat1.d, lat1.m) * lat1.dir;
    const lo1 = toDecimal(lon1.d, lon1.m) * lon1.dir;
    const la2 = toDecimal(lat2.d, lat2.m) * lat2.dir;
    const lo2 = toDecimal(lon2.d, lon2.m) * lon2.dir;
    const r = compositeSailing(la1, lo1, la2, lo2, limitLat);
    onResult({ lat1: la1, lon1: lo1, lat2: la2, lon2: lo2, limitLat, ...r });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-blue-600 pl-3">集成大圏航法</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">制限緯度を持つ集成大圏航法の計算</p>
  </header>
  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">出発点 (From)</div>
    <PositionInput bind:lat={lat1} bind:lon={lon1} />
  </section>
  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">到着点 (To)</div>
    <PositionInput bind:lat={lat2} bind:lon={lon2} />
  </section>
  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <NumberInput label="制限緯度 (Limit Lat)" bind:value={limitLat} unit="°" step={0.1} />
  </section>
  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Globe size={20} /> 計算実行 (CALC)
  </button>
</div>
