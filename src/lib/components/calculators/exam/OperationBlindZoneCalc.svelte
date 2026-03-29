<script lang="ts">
  import { Calculator } from 'lucide-svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import { calculateBlindZoneDistance } from '$lib/utils/examOperation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let draftM = $state(5.5);
  let eyeHeightFromKeelM = $state(20.5);
  let obstacleTopFromKeelM = $state(11.0);
  let eyeToObstacleM = $state(85.5);

  function handleCalculate() {
    const r = calculateBlindZoneDistance(
      eyeHeightFromKeelM,
      obstacleTopFromKeelM,
      draftM,
      eyeToObstacleM,
    );
    onResult({ draftM, eyeHeightFromKeelM, obstacleTopFromKeelM, eyeToObstacleM, ...r });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-indigo-600 pl-3">見張り死角距離</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">船首部材により生じる死角の水平距離を計算</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="喫水" bind:value={draftM} unit="m" step={0.1} />
      <NumberInput label="眼高 (キール基準)" bind:value={eyeHeightFromKeelM} unit="m" step={0.1} />
      <NumberInput label="船首部材上面 (キール基準)" bind:value={obstacleTopFromKeelM} unit="m" step={0.1} />
      <NumberInput label="眼から部材まで水平距離" bind:value={eyeToObstacleM} unit="m" step={0.1} />
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Calculator size={20} /> 計算実行 (CALC)
  </button>
</div>
