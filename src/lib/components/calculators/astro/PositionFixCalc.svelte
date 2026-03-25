<script lang="ts">
  import { Anchor } from 'lucide-svelte';
  import DMSInput from '$lib/components/shared/DMSInput.svelte';
  import type { DMSValue } from '$lib/types/navigation';
  import { toDecimal, rad } from '$lib/utils/navigationMath';
  import type { PositionFixResult } from '$lib/types/navigation';

  interface Props {
    onResult: (r: PositionFixResult) => void;
  }

  let { onResult }: Props = $props();

  let drLat: DMSValue = $state({ d: 35, m: 0, dir: 1 });
  let drLon: DMSValue = $state({ d: 139, m: 45, dir: 1 });
  let i1 = $state(5.2);
  let z1 = $state(45);
  let i2 = $state(-3.1);
  let z2 = $state(135);

  function handleCalculate() {
    const la = toDecimal(drLat.d, drLat.m) * drLat.dir;
    const lo = toDecimal(drLon.d, drLon.m) * drLon.dir;

    const z1R = rad(z1), z2R = rad(z2);
    const a11 = Math.cos(z1R), a12 = Math.sin(z1R);
    const a21 = Math.cos(z2R), a22 = Math.sin(z2R);
    const det = a11 * a22 - a12 * a21;

    let dLatMin = 0, dLonMin = 0;
    if (Math.abs(det) > 0.001) {
      dLatMin = (i1 * a22 - i2 * a12) / det;
      dLonMin = (a11 * i2 - a21 * i1) / det;
    }

    const fixLat = la + dLatMin / 60;
    const fixLon = lo + dLonMin / (60 * Math.cos(rad(la)));

    onResult({
      drLat: la, drLon: lo, fixLat, fixLon,
      lops: [{ intercept: i1, azimuth: z1 }, { intercept: i2, azimuth: z2 }],
    });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-amber-600 pl-3">船位決定</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">2本のLOPから船位を決定します</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">推測位置 (DR)</div>
    <div class="grid grid-cols-2 gap-4">
      <DMSInput label="緯度 (Lat)" bind:value={drLat} showSign signType="NS" />
      <DMSInput label="経度 (Lon)" bind:value={drLon} showSign signType="EW" />
    </div>
  </section>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">LOP 1</div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Intercept (')</span>
        <input type="number" step="0.1" class="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={i1} />
      </div>
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Azimuth (&deg;)</span>
        <input type="number" step="0.1" class="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={z1} />
      </div>
    </div>
  </section>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">LOP 2</div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Intercept (')</span>
        <input type="number" step="0.1" class="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={i2} />
      </div>
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Azimuth (&deg;)</span>
        <input type="number" step="0.1" class="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={z2} />
      </div>
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Anchor size={20} /> 計算実行 (CALC)
  </button>
</div>
