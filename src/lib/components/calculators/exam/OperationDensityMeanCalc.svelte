<script lang="ts">
  import { Calculator } from 'lucide-svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import { calculateMeanDraftByDensity } from '$lib/utils/examOperation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let displacementTon = $state(18000);
  let tpc = $state(28.0);
  let sourceDensity = $state(1.023);
  let destinationDensity = $state(1.003);
  let initialForwardDraftM = $state(8.6);
  let initialAftDraftM = $state(9.1);

  function handleCalculate() {
    const r = calculateMeanDraftByDensity(
      displacementTon,
      tpc,
      sourceDensity,
      destinationDensity,
      initialForwardDraftM,
      initialAftDraftM,
    );

    onResult({
      displacementTon,
      tpc,
      sourceDensity,
      destinationDensity,
      initialForwardDraftM,
      initialAftDraftM,
      ...r,
    });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-indigo-600 pl-3">比重差による平均喫水</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">海水→河水など、比重差のみを考慮した平均喫水変化</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="排水量" bind:value={displacementTon} unit="ton" step={1} />
      <NumberInput label="TPC" bind:value={tpc} unit="ton/cm" step={0.1} />
      <NumberInput label="元の比重" bind:value={sourceDensity} unit="" step={0.001} />
      <NumberInput label="移動先比重" bind:value={destinationDensity} unit="" step={0.001} />
      <NumberInput label="船首喫水" bind:value={initialForwardDraftM} unit="m" step={0.01} />
      <NumberInput label="船尾喫水" bind:value={initialAftDraftM} unit="m" step={0.01} />
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Calculator size={20} /> 計算実行 (CALC)
  </button>
</div>
