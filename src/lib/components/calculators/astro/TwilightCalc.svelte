<script lang="ts">
  import { Sunset } from 'lucide-svelte';
  import DMSInput from '$lib/components/shared/DMSInput.svelte';
  import type { DMSValue } from '$lib/types/navigation';
  import { toDecimal } from '$lib/utils/navigationMath';
  import { allTwilights } from '$lib/utils/astronomy';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let lat: DMSValue = $state({ d: 35, m: 0, dir: 1 });
  let dec: DMSValue = $state({ d: 23, m: 0, dir: 1 });
  let lon: DMSValue = $state({ d: 139, m: 45, dir: 1 });
  let eqTime: number = $state(0);

  function handleCalculate() {
    const la = toDecimal(lat.d, lat.m) * lat.dir;
    const de = toDecimal(dec.d, dec.m) * dec.dir;
    const lo = toDecimal(lon.d, lon.m) * lon.dir;
    const result = allTwilights(la, de, lo, eqTime);
    onResult({ lat: la, dec: de, lon: lo, eqTime, ...result });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-amber-600 pl-3">薄明時</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">市民薄明・航海薄明・日出没時刻を計算します</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="grid grid-cols-2 gap-4">
      <DMSInput label="緯度 (Lat)" bind:value={lat} showSign signType="NS" />
      <DMSInput label="経度 (Lon)" bind:value={lon} showSign signType="EW" />
    </div>
    <div class="grid grid-cols-2 gap-4 border-t border-dashed border-slate-200 dark:border-slate-700 pt-4">
      <DMSInput label="太陽赤緯 (Dec)" bind:value={dec} showSign signType="NS" />
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">均時差 (Eq. of Time)</span>
        <div class="flex items-center gap-2 mt-1">
          <input type="number" step="0.1" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={eqTime} />
          <span class="text-sm text-slate-500 dark:text-slate-400">min</span>
        </div>
      </div>
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Sunset size={20} /> 計算実行 (CALC)
  </button>
</div>
