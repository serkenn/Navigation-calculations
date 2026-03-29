<script lang="ts">
  import { calculateLightRange } from '$lib/utils/examNavigation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let lightHeightM = $state(50);
  let eyeHeightM = $state(12);

  function handleCalculate() {
    const r = calculateLightRange(lightHeightM, eyeHeightM);
    onResult({ ...r, lightHeightM, eyeHeightM, timestamp: new Date().toLocaleTimeString() });
  }
</script>

<div class="space-y-6 p-6">
  <div class="border-2 border-indigo-300 dark:border-indigo-700 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900/20">
    <h3 class="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-4">光達距離計算</h3>
    <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">D = 2.083 (√H + √h)</p>
    <div class="space-y-4">
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">灯台の灯高 H [m]</label>
        <input type="number" bind:value={lightHeightM} step="0.1" min="0"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">観測者の眼高 h [m]</label>
        <input type="number" bind:value={eyeHeightM} step="0.1" min="0"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
      </div>
    </div>
  </div>

  <button onclick={handleCalculate}
    class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105">
    計算 (Calculate)
  </button>
</div>
