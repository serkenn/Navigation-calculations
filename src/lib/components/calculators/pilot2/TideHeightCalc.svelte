<script lang="ts">
  import { ArrowUpDown } from 'lucide-svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import { tideHeight } from '$lib/utils/tide';

  export interface TideHeightResult {
    hwHeight: number; lwHeight: number;
    hwTime: number; lwTime: number;
    targetTime: number;
    height: number; range: number; duration: number; elapsed: number; ratio: number;
  }

  let { onResult }: { onResult: (r: TideHeightResult) => void } = $props();

  let hwHeight = $state(3.5);
  let lwHeight = $state(0.8);
  let hwTime = $state(14.5);
  let lwTime = $state(8.0);
  let targetTime = $state(11.0);

  function handleCalculate() {
    const r = tideHeight(hwHeight, lwHeight, hwTime, lwTime, targetTime);
    onResult({ hwHeight, lwHeight, hwTime, lwTime, targetTime, ...r });
  }

  function fmt(h: number): string {
    return `${Math.floor(h).toString().padStart(2, '0')}:${Math.round((h % 1) * 60).toString().padStart(2, '0')}`;
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-cyan-600 pl-3">潮高計算</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">cos補間法により任意時刻の潮高を計算します</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">高潮 (HW)</div>
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="潮高 (Height)" bind:value={hwHeight} unit="m" step={0.1} />
      <div>
        <NumberInput label="時刻 (10進)" bind:value={hwTime} unit="h" step={0.1} />
        <p class="text-xs text-slate-400 mt-0.5 pl-1">{fmt(hwTime)}</p>
      </div>
    </div>
  </section>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">低潮 (LW)</div>
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="潮高 (Height)" bind:value={lwHeight} unit="m" step={0.1} />
      <div>
        <NumberInput label="時刻 (10進)" bind:value={lwTime} unit="h" step={0.1} />
        <p class="text-xs text-slate-400 mt-0.5 pl-1">{fmt(lwTime)}</p>
      </div>
    </div>
  </section>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div>
      <NumberInput label="求めたい時刻 (Target Time)" bind:value={targetTime} unit="h" step={0.1} />
      <p class="text-xs text-slate-400 mt-0.5 pl-1">{fmt(targetTime)}</p>
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <ArrowUpDown size={20} /> 計算実行 (CALC)
  </button>
</div>
