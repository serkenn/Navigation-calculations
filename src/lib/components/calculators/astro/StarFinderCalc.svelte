<script lang="ts">
  import { Star } from 'lucide-svelte';
  import DMSInput from '$lib/components/shared/DMSInput.svelte';
  import type { DMSValue } from '$lib/types/navigation';
  import { toDecimal } from '$lib/utils/navigationMath';
  import { starAltAz } from '$lib/utils/astronomy';
  import { navigationStars } from '$lib/data/stars';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let lat: DMSValue = $state({ d: 35, m: 0, dir: 1 });
  let ghaAries: number = $state(45);
  let minAlt: number = $state(15);
  let maxAlt: number = $state(75);

  function handleCalculate() {
    const la = toDecimal(lat.d, lat.m) * lat.dir;
    const stars: { name: string; alt: number; az: number; sha: number; dec: number }[] = [];

    for (const star of navigationStars) {
      let lha = ghaAries + star.sha;
      while (lha >= 360) lha -= 360;
      while (lha < 0) lha += 360;
      const { alt, az } = starAltAz(la, star.dec, lha);
      if (alt >= minAlt && alt <= maxAlt) {
        stars.push({ name: star.name, alt, az, sha: star.sha, dec: star.dec });
      }
    }
    stars.sort((a, b) => b.alt - a.alt);

    onResult({ lat: la, ghaAries, stars });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-amber-600 pl-3">索星</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">観測可能な恒星の高度と方位を計算します</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="grid grid-cols-2 gap-4">
      <DMSInput label="推測緯度 (Lat)" bind:value={lat} showSign signType="NS" />
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">GHA Aries</span>
        <div class="flex items-center gap-2 mt-1">
          <input type="number" step="0.1" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={ghaAries} />
          <span class="text-sm text-slate-500">°</span>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4 border-t border-dashed border-slate-200 dark:border-slate-700 pt-4">
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">最低高度 (°)</span>
        <input type="number" class="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={minAlt} />
      </div>
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">最高高度 (°)</span>
        <input type="number" class="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={maxAlt} />
      </div>
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Star size={20} /> 計算実行 (CALC)
  </button>
</div>
