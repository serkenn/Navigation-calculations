<script lang="ts">
  import { Calculator } from 'lucide-svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import {
    calculateDraftChangesByLoadingAtPosition,
    calculateTrimFromShift,
  } from '$lib/utils/examOperation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let shipLengthM = $state(150);
  let lcfFromMidshipM = $state(-5);
  let tpc = $state(24);
  let mtc = $state(110);
  let addedWeightTon = $state(130);
  let cargoPosFromLcfM = $state(30);

  let movedWeightTon = $state(40);
  let moveDistanceM = $state(80);

  function handleCalculate() {
    const loadCase = calculateDraftChangesByLoadingAtPosition(
      shipLengthM,
      lcfFromMidshipM,
      tpc,
      mtc,
      addedWeightTon,
      cargoPosFromLcfM,
    );

    const shiftCase = calculateTrimFromShift(movedWeightTon, moveDistanceM, mtc);

    onResult({
      shipLengthM,
      lcfFromMidshipM,
      tpc,
      mtc,
      addedWeightTon,
      cargoPosFromLcfM,
      movedWeightTon,
      moveDistanceM,
      ...loadCase,
      trimShiftCm: shiftCase.trimCm,
    });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-indigo-600 pl-3">トリム・前後喫水変化</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">TPC/MTC/LCFで船首船尾の喫水変化とトリムを計算</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">船体係数</div>
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="船長" bind:value={shipLengthM} unit="m" step={0.1} />
      <NumberInput label="LCF (中央基準, 前+ 後-)" bind:value={lcfFromMidshipM} unit="m" step={0.1} />
      <NumberInput label="TPC" bind:value={tpc} unit="ton/cm" step={0.1} />
      <NumberInput label="MTC" bind:value={mtc} unit="ton-m/cm" step={0.1} />
    </div>
  </section>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">ケースA: 貨物積載位置による変化</div>
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="積載重量" bind:value={addedWeightTon} unit="ton" step={0.1} />
      <NumberInput label="貨物位置 (LCF基準, 前+ 後-)" bind:value={cargoPosFromLcfM} unit="m" step={0.1} />
    </div>
  </section>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">ケースB: 甲板貨物の移動トリム</div>
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="移動重量" bind:value={movedWeightTon} unit="ton" step={0.1} />
      <NumberInput label="移動距離" bind:value={moveDistanceM} unit="m" step={0.1} />
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Calculator size={20} /> 計算実行 (CALC)
  </button>
</div>
