<script lang="ts">
  import { Calculator } from 'lucide-svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import {
    calculateTPC,
    calculateDraftAfterCargo,
    calculateCargoFromDraftChange,
  } from '$lib/utils/examOperation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let lengthM = $state(100);
  let breadthM = $state(25);
  let density = $state(1.025);
  let initialDraftM = $state(3.0);
  let cargoTon = $state(300);
  let observedFinalDraftM = $state(5.0);

  function handleCalculate() {
    const tpc = calculateTPC(lengthM, breadthM, density);
    const byCargo = calculateDraftAfterCargo(initialDraftM, cargoTon, tpc);
    const byObserved = calculateCargoFromDraftChange(
      lengthM,
      breadthM,
      density,
      initialDraftM,
      observedFinalDraftM,
    );

    onResult({
      lengthM,
      breadthM,
      density,
      initialDraftM,
      cargoTon,
      observedFinalDraftM,
      tpc,
      ...byCargo,
      observedDraftChangeCm: byObserved.draftChangeCm,
      cargoFromObservedTon: byObserved.cargoTon,
    });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-indigo-600 pl-3">TPC・平均喫水</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">箱形船のTPC、積載後喫水、喫水差からの貨物重量を計算</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">船体条件</div>
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="長さ" bind:value={lengthM} unit="m" step={0.1} />
      <NumberInput label="幅" bind:value={breadthM} unit="m" step={0.1} />
      <NumberInput label="海水比重" bind:value={density} unit="" step={0.001} />
      <NumberInput label="積荷前平均喫水" bind:value={initialDraftM} unit="m" step={0.01} />
    </div>
  </section>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">積載ケース</div>
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="積載貨物重量" bind:value={cargoTon} unit="ton" step={0.1} />
      <NumberInput label="観測後平均喫水" bind:value={observedFinalDraftM} unit="m" step={0.01} />
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Calculator size={20} /> 計算実行 (CALC)
  </button>
</div>
