<script lang="ts">
  import { Eye } from 'lucide-svelte';
  import { distanceByVerticalAngle, geographicalRange } from '$lib/utils/sextant';
  import type { DistanceToObjectResult } from '$lib/types/navigation';

  interface Props {
    onResult: (r: DistanceToObjectResult) => void;
  }

  let { onResult }: Props = $props();

  let mode: 'vertical' | 'geographic' = $state('vertical');
  let angle = $state(1.5);
  let height = $state(50);
  let heightOfEye = $state(12);

  const inputClass = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none";

  function handleCalculate() {
    if (mode === 'vertical') {
      const result = distanceByVerticalAngle(angle, height, heightOfEye);
      onResult({ mode, distance: result.distance, distanceNM: result.distanceNM, angle, height, heightOfEye });
    } else {
      const result = geographicalRange(height, heightOfEye);
      onResult({ mode, distance: 0, distanceNM: result.range, height, heightOfEye, geoRange: result.range });
    }
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-purple-600 pl-3">物標距離</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">六分儀の角度から物標までの距離を計算します</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div>
      <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block mb-1">計算方式</span>
      <div class="flex gap-2">
        <button onclick={() => mode = 'vertical'} class={`flex-1 py-2 rounded-lg font-bold border text-sm transition-colors ${mode === 'vertical' ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-400 text-purple-700 dark:text-purple-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500'}`}>
          垂直角法
        </button>
        <button onclick={() => mode = 'geographic'} class={`flex-1 py-2 rounded-lg font-bold border text-sm transition-colors ${mode === 'geographic' ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-400 text-purple-700 dark:text-purple-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500'}`}>
          地理学的視距離
        </button>
      </div>
    </div>

    {#if mode === 'vertical'}
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">垂直角 (&deg;)</span>
        <input type="number" step="0.01" class="{inputClass} mt-1" bind:value={angle} />
      </div>
    {/if}

    <div class="grid grid-cols-2 gap-4">
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">物標高さ (m)</span>
        <input type="number" class="{inputClass} mt-1" bind:value={height} />
      </div>
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">眼高 (m)</span>
        <input type="number" class="{inputClass} mt-1" bind:value={heightOfEye} />
      </div>
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Eye size={20} /> 計算実行 (CALC)
  </button>
</div>
