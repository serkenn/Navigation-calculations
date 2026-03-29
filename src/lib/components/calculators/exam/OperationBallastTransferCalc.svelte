<script lang="ts">
  import { Calculator } from 'lucide-svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import { calculateBallastTransferForEvenKeel } from '$lib/utils/examOperation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let forwardDraftM = $state(10.3);
  let aftDraftM = $state(11.5);
  let transferDistanceM = $state(125);
  let mtc = $state(1103);

  function handleCalculate() {
    const r = calculateBallastTransferForEvenKeel(
      forwardDraftM,
      aftDraftM,
      transferDistanceM,
      mtc,
    );

    onResult({ forwardDraftM, aftDraftM, transferDistanceM, mtc, ...r });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-indigo-600 pl-3">等喫水化バラスト移送</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">前後喫水差を0にするための移送量を計算</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="船首喫水" bind:value={forwardDraftM} unit="m" step={0.01} />
      <NumberInput label="船尾喫水" bind:value={aftDraftM} unit="m" step={0.01} />
      <NumberInput label="タンク間距離" bind:value={transferDistanceM} unit="m" step={0.1} />
      <NumberInput label="MTC" bind:value={mtc} unit="ton-m/cm" step={0.1} />
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Calculator size={20} /> 計算実行 (CALC)
  </button>
</div>
