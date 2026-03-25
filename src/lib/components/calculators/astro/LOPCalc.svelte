<script lang="ts">
  import { Crosshair } from 'lucide-svelte';
  import DMSInput from '$lib/components/shared/DMSInput.svelte';
  import type { DMSValue } from '$lib/types/navigation';
  import { toDecimal, calculateSightReduction, calculateTrueAltitude } from '$lib/utils/navigationMath';
  import type { LOPResult } from '$lib/types/navigation';

  interface Props {
    onResult: (r: LOPResult) => void;
  }

  let { onResult }: Props = $props();

  let lat: DMSValue = $state({ d: 35, m: 0, dir: 1 });
  let lon: DMSValue = $state({ d: 139, m: 45, dir: 1 });
  let hs: DMSValue = $state({ d: 48, m: 10, dir: 1 });
  let totalCorr = $state(9.6);
  let corrSign = $state(1);
  let gha: DMSValue = $state({ d: 315, m: 10, dir: 1 });
  let dec: DMSValue = $state({ d: 13, m: 3, dir: 1 });

  function handleCalculate() {
    const la = toDecimal(lat.d, lat.m) * lat.dir;
    const lo = toDecimal(lon.d, lon.m) * lon.dir;
    const { ho } = calculateTrueAltitude(toDecimal(hs.d, hs.m), totalCorr * corrSign);
    const ghaVal = toDecimal(gha.d, gha.m);
    const decVal = toDecimal(dec.d, dec.m) * dec.dir;
    let lha = ghaVal + lo;
    while (lha >= 360) lha -= 360;
    while (lha < 0) lha += 360;
    const { hc, Z } = calculateSightReduction(la, decVal, lha);
    const intercept = (ho - hc) * 60;

    onResult({ lat: la, lon: lo, ho, hc, intercept, azimuth: Z, lha, dec: decVal, gha: ghaVal });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-amber-600 pl-3">位置の線</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">天体観測からインターセプトと方位角を求めます</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="grid grid-cols-2 gap-4">
      <DMSInput label="推測緯度 (Lat)" bind:value={lat} showSign signType="NS" />
      <DMSInput label="推測経度 (Lon)" bind:value={lon} showSign signType="EW" />
    </div>
    <div class="grid grid-cols-2 gap-4 border-t border-dashed border-slate-200 dark:border-slate-700 pt-4">
      <DMSInput label="器械高度 (hs)" bind:value={hs} />
      <div>
        <label class="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">改正総数</label>
        <div class="flex items-center gap-1 mt-1">
          <select class="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded p-1.5 text-sm font-bold text-slate-900 dark:text-white outline-none" bind:value={corrSign}>
            <option value={1} class="bg-white dark:bg-slate-800">+</option>
            <option value={-1} class="bg-white dark:bg-slate-800">-</option>
          </select>
          <input type="number" class="w-full p-1.5 border border-slate-300 dark:border-slate-600 rounded text-right text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={totalCorr} />
          <span class="text-xs text-slate-400">'</span>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4 border-t border-dashed border-slate-200 dark:border-slate-700 pt-4">
      <DMSInput label="GHA" bind:value={gha} />
      <DMSInput label="赤緯 (Dec)" bind:value={dec} showSign signType="NS" />
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Crosshair size={20} /> 計算実行 (CALC)
  </button>
</div>
