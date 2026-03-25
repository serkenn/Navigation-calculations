<script lang="ts">
  import { Wind } from 'lucide-svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import { trueWind } from '$lib/utils/wind';

  export interface TrueWindResult {
    relativeDir: number; relativeSpeed: number;
    shipCourse: number; shipSpeed: number;
    trueDir: number; trueSpeed: number;
  }

  let { onResult }: { onResult: (r: TrueWindResult) => void } = $props();

  let relativeDir = $state(45);
  let relativeSpeed = $state(15);
  let shipCourse = $state(0);
  let shipSpeed = $state(12);

  function handleCalculate() {
    const r = trueWind(relativeDir, relativeSpeed, shipCourse, shipSpeed);
    onResult({ relativeDir, relativeSpeed, shipCourse, shipSpeed, trueDir: r.trueDir, trueSpeed: r.trueSpeed });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-cyan-600 pl-3">真風向・風速</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">相対風向・風速と船速から真風向・真風速を計算</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">相対風 (Apparent Wind)</div>
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="相対風向 (船首基準)" bind:value={relativeDir} unit="°" step={1} />
      <NumberInput label="相対風速" bind:value={relativeSpeed} unit="kn" step={0.1} />
    </div>
  </section>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">船の状態</div>
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="船首方向 (Course)" bind:value={shipCourse} unit="°" step={0.1} />
      <NumberInput label="船速 (Speed)" bind:value={shipSpeed} unit="kn" step={0.1} />
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Wind size={20} /> 計算実行 (CALC)
  </button>
</div>
