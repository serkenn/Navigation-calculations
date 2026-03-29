<script lang="ts">
  import { Calculator } from 'lucide-svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import { calculateCargoFromForeAftDraftChange } from '$lib/utils/examOperation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let lengthM = $state(130);
  let breadthM = $state(28);
  let density = $state(1.023);

  let initialForwardDraftM = $state(4.8);
  let initialAftDraftM = $state(6.1);
  let finalForwardDraftM = $state(5.7);
  let finalAftDraftM = $state(7.3);

  function handleCalculate() {
    const r = calculateCargoFromForeAftDraftChange(
      lengthM,
      breadthM,
      density,
      initialForwardDraftM,
      initialAftDraftM,
      finalForwardDraftM,
      finalAftDraftM,
    );

    onResult({
      lengthM,
      breadthM,
      density,
      initialForwardDraftM,
      initialAftDraftM,
      finalForwardDraftM,
      finalAftDraftM,
      ...r,
    });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-indigo-600 pl-3">前後喫水差から積載重量</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">積荷前後の船首・船尾喫水から積載重量を逆算</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="船長" bind:value={lengthM} unit="m" step={0.1} />
      <NumberInput label="船幅" bind:value={breadthM} unit="m" step={0.1} />
      <NumberInput label="比重" bind:value={density} unit="" step={0.001} />
    </div>
  </section>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">積荷前</div>
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="船首喫水" bind:value={initialForwardDraftM} unit="m" step={0.01} />
      <NumberInput label="船尾喫水" bind:value={initialAftDraftM} unit="m" step={0.01} />
    </div>
  </section>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">積荷後</div>
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="船首喫水" bind:value={finalForwardDraftM} unit="m" step={0.01} />
      <NumberInput label="船尾喫水" bind:value={finalAftDraftM} unit="m" step={0.01} />
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Calculator size={20} /> 計算実行 (CALC)
  </button>
</div>
