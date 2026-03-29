<script lang="ts">
  import { calculateClockCorrection } from '$lib/utils/examNavigation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let depLonDeg = $state(135);
  let depLonMin = $state(0);
  let depLonEW: 'E' | 'W' = $state('E');
  let arrLonDeg = $state(140);
  let arrLonMin = $state(0);
  let arrLonEW: 'E' | 'W' = $state('E');
  let standardMeridian = $state(135);

  function handleCalculate() {
    const r = calculateClockCorrection(depLonDeg, depLonMin, depLonEW, arrLonDeg, arrLonMin, arrLonEW, standardMeridian);
    onResult({ ...r, standardMeridian, timestamp: new Date().toLocaleTimeString() });
  }
</script>

<div class="space-y-6 p-6">
  <div class="border-2 border-indigo-300 dark:border-indigo-700 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900/20">
    <h3 class="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-4">船内時計の改正</h3>
    <div class="space-y-4">
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">出発地 経度</label>
        <div class="flex gap-2 mt-1">
          <input type="number" bind:value={depLonDeg} min="0" max="180" class="w-1/3 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" placeholder="度" />
          <input type="number" bind:value={depLonMin} min="0" max="59.9" step="0.1" class="w-1/3 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" placeholder="分" />
          <select bind:value={depLonEW} class="w-1/3 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800">
            <option value="E">E</option>
            <option value="W">W</option>
          </select>
        </div>
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">到着地 経度</label>
        <div class="flex gap-2 mt-1">
          <input type="number" bind:value={arrLonDeg} min="0" max="180" class="w-1/3 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" placeholder="度" />
          <input type="number" bind:value={arrLonMin} min="0" max="59.9" step="0.1" class="w-1/3 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" placeholder="分" />
          <select bind:value={arrLonEW} class="w-1/3 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800">
            <option value="E">E</option>
            <option value="W">W</option>
          </select>
        </div>
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">標準子午線 [度]</label>
        <input type="number" bind:value={standardMeridian} step="15"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
      </div>
    </div>
  </div>

  <button onclick={handleCalculate}
    class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105">
    計算 (Calculate)
  </button>
</div>
