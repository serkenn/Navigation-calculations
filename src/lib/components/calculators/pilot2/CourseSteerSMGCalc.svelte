<script lang="ts">
  import { Compass } from 'lucide-svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import { courseToSteerSMG } from '$lib/utils/currentVector';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let requiredCMG: number = $state(90);
  let shipSpeed: number = $state(12);
  let setDir: number = $state(180);
  let driftSpeed: number = $state(2);

  function handleCalculate() {
    const r = courseToSteerSMG(requiredCMG, shipSpeed, setDir, driftSpeed);
    onResult({ requiredCMG, shipSpeed, setDir, driftSpeed, shipCourse: r.shipCourse, smg: r.smg, possible: r.possible });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-cyan-600 pl-3">視針路・実航速力</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">船速固定で目標CMG方向へ進む視針路とSMGを計算</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">条件</div>
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="目標CMG" bind:value={requiredCMG} unit="°" step={0.1} />
      <NumberInput label="船速 (Ship Speed)" bind:value={shipSpeed} unit="kn" step={0.1} />
    </div>
  </section>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">潮流 (Current)</div>
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="流向 (Set)" bind:value={setDir} unit="°" step={0.1} />
      <NumberInput label="流速 (Drift)" bind:value={driftSpeed} unit="kn" step={0.1} />
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Compass size={20} /> 計算実行 (CALC)
  </button>
</div>
