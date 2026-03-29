<script lang="ts">
  import { Calculator } from 'lucide-svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import { calculateDraftByDensityAndConsumption } from '$lib/utils/examOperation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let displacementTon = $state(12900);
  let tpc = $state(21.5);
  let mtc = $state(155);
  let shipLengthM = $state(145);
  let lcfFromMidshipM = $state(0);

  let sourceDensity = $state(1.023);
  let destinationDensity = $state(1.012);

  let initialForwardDraftM = $state(7.1);
  let initialAftDraftM = $state(7.1);

  let fuelConsumedTon = $state(200);
  let fuelPosFromMidshipM = $state(37);
  let freshConsumedTon = $state(11);
  let freshPosFromMidshipM = $state(-8);

  function handleCalculate() {
    const r = calculateDraftByDensityAndConsumption(
      displacementTon,
      tpc,
      initialForwardDraftM,
      initialAftDraftM,
      sourceDensity,
      destinationDensity,
      fuelConsumedTon,
      fuelPosFromMidshipM,
      freshConsumedTon,
      freshPosFromMidshipM,
      mtc,
      lcfFromMidshipM,
      shipLengthM,
    );

    onResult({
      displacementTon,
      tpc,
      mtc,
      shipLengthM,
      lcfFromMidshipM,
      sourceDensity,
      destinationDensity,
      initialForwardDraftM,
      initialAftDraftM,
      fuelConsumedTon,
      fuelPosFromMidshipM,
      freshConsumedTon,
      freshPosFromMidshipM,
      ...r,
    });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-indigo-600 pl-3">比重差と消費による入港喫水</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">消費による平均喫水減少、比重差補正、前後喫水を一括計算</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">船体・係数</div>
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="出港排水量" bind:value={displacementTon} unit="ton" step={1} />
      <NumberInput label="TPC" bind:value={tpc} unit="ton/cm" step={0.1} />
      <NumberInput label="MTC" bind:value={mtc} unit="ton-m/cm" step={0.1} />
      <NumberInput label="船長" bind:value={shipLengthM} unit="m" step={0.1} />
      <NumberInput label="LCF (中央基準, 前+ 後-)" bind:value={lcfFromMidshipM} unit="m" step={0.1} />
    </div>
  </section>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">喫水・比重</div>
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="出港船首喫水" bind:value={initialForwardDraftM} unit="m" step={0.01} />
      <NumberInput label="出港船尾喫水" bind:value={initialAftDraftM} unit="m" step={0.01} />
      <NumberInput label="出港海水比重" bind:value={sourceDensity} unit="" step={0.001} />
      <NumberInput label="入港水域比重" bind:value={destinationDensity} unit="" step={0.001} />
    </div>
  </section>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">消費量と位置 (中央基準)</div>
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="燃料消費" bind:value={fuelConsumedTon} unit="ton" step={0.1} />
      <NumberInput label="燃料タンク位置 (前+ 後-)" bind:value={fuelPosFromMidshipM} unit="m" step={0.1} />
      <NumberInput label="清水消費" bind:value={freshConsumedTon} unit="ton" step={0.1} />
      <NumberInput label="清水タンク位置 (前+ 後-)" bind:value={freshPosFromMidshipM} unit="m" step={0.1} />
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Calculator size={20} /> 計算実行 (CALC)
  </button>
</div>
