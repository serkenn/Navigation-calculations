<script lang="ts">
  import { Calculator } from 'lucide-svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import {
    calculateBeamFromPeriodAndGM,
    calculateGMFromPeriodChange,
  } from '$lib/utils/examOperation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let gmAtPortA = $state(0.75);
  let periodA = $state(12);
  let periodB = $state(13);

  function handleCalculate() {
    const { beamM } = calculateBeamFromPeriodAndGM(periodA, gmAtPortA);
    const { gmAtPortB } = calculateGMFromPeriodChange(gmAtPortA, periodA, periodB);

    onResult({
      gmAtPortA,
      periodA,
      periodB,
      beamM,
      gmAtPortB,
    });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-indigo-600 pl-3">横揺れ周期とGM</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">式 T = 0.8B/sqrt(GM) を使ってB港のGMを推定</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="A港 GM" bind:value={gmAtPortA} unit="m" step={0.01} />
      <NumberInput label="A港 横揺れ周期" bind:value={periodA} unit="s" step={0.1} />
      <NumberInput label="B港 横揺れ周期" bind:value={periodB} unit="s" step={0.1} />
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Calculator size={20} /> 計算実行 (CALC)
  </button>
</div>
