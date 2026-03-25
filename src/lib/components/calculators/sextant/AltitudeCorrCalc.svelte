<script lang="ts">
  import { Telescope } from 'lucide-svelte';
  import { altitudeCorrection } from '$lib/utils/sextant';
  import type { AltitudeCorrResult } from '$lib/types/navigation';

  type BodyType = 'sun_lower' | 'sun_upper' | 'star' | 'moon' | 'planet';

  interface Props {
    onResult: (r: AltitudeCorrResult) => void;
  }

  let { onResult }: Props = $props();

  let hs = $state(35.5);
  let heightOfEye = $state(12);
  let bodyType: BodyType = $state('sun_lower');
  let temp = $state(10);
  let pressure = $state(1010);
  let HP = $state(54.5);
  let SD = $state(16.0);

  const bodyTypes: [BodyType, string][] = [
    ['sun_lower', '太陽下辺'],
    ['sun_upper', '太陽上辺'],
    ['star', '恒星'],
    ['planet', '惑星'],
    ['moon', '月'],
  ];

  let showSD = $derived(bodyType === 'sun_lower' || bodyType === 'sun_upper' || bodyType === 'moon');

  const inputClass = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none";

  function handleCalculate() {
    const result = altitudeCorrection(hs, heightOfEye, bodyType, temp, pressure, HP, SD);
    onResult(result);
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-purple-600 pl-3">測高度改正</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">六分儀測定値から真高度を計算します</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">六分儀高度 (hs)</span>
        <div class="flex items-center gap-2 mt-1">
          <input type="number" step="0.1" class={inputClass} bind:value={hs} />
          <span class="text-sm text-slate-500">&deg;</span>
        </div>
      </div>
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">眼高 (Eye Height)</span>
        <div class="flex items-center gap-2 mt-1">
          <input type="number" step="0.1" class={inputClass} bind:value={heightOfEye} />
          <span class="text-sm text-slate-500">m</span>
        </div>
      </div>
    </div>

    <div>
      <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block mb-1">天体種別</span>
      <div class="flex flex-wrap gap-2">
        {#each bodyTypes as [val, label]}
          <button
            onclick={() => bodyType = val}
            class={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors ${
              bodyType === val
                ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-400 text-purple-700 dark:text-purple-300'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400'
            }`}
          >
            {label}
          </button>
        {/each}
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 border-t border-dashed border-slate-200 dark:border-slate-700 pt-4">
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">気温 (&deg;C)</span>
        <input type="number" class="{inputClass} mt-1" bind:value={temp} />
      </div>
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">気圧 (hPa)</span>
        <input type="number" class="{inputClass} mt-1" bind:value={pressure} />
      </div>
    </div>

    {#if showSD}
      <div class="grid grid-cols-2 gap-4 border-t border-dashed border-slate-200 dark:border-slate-700 pt-4">
        <div>
          <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">SD (半径) '</span>
          <input type="number" step="0.1" class="{inputClass} mt-1" bind:value={SD} />
        </div>
        {#if bodyType === 'moon'}
          <div>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">HP (水平視差) '</span>
            <input type="number" step="0.1" class="{inputClass} mt-1" bind:value={HP} />
          </div>
        {/if}
      </div>
    {/if}
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Telescope size={20} /> 計算実行 (CALC)
  </button>
</div>
