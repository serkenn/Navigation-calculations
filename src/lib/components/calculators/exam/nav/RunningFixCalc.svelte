<script lang="ts">
  import { calculateRunningFix, formatDMS } from '$lib/utils/examNavigation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let bearing1 = $state(293);
  let bearing2 = $state(308);
  let courseTrue = $state(190);
  let speedKts = $state(13);
  let timeBetweenMin = $state(30);
  let objectLat = $state(30.0);
  let objectLon = $state(136.0);

  function handleCalculate() {
    const r = calculateRunningFix(bearing1, bearing2, courseTrue, speedKts, timeBetweenMin, objectLat, objectLon);
    onResult({
      ...r,
      bearing1, bearing2, courseTrue, speedKts, timeBetweenMin,
      objectLat, objectLon,
      fixLatDMS: formatDMS(r.fixLat, 'lat'),
      fixLonDMS: formatDMS(r.fixLon, 'lon'),
      timestamp: new Date().toLocaleTimeString()
    });
  }
</script>

<div class="space-y-6 p-6">
  <div class="border-2 border-indigo-300 dark:border-indigo-700 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900/20">
    <h3 class="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-4">Running Fix（転位法）</h3>
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-sm font-bold text-slate-700 dark:text-slate-300">物標 緯度 [度]</label>
          <input type="number" bind:value={objectLat} step="0.001"
            class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
        </div>
        <div>
          <label class="text-sm font-bold text-slate-700 dark:text-slate-300">物標 経度 [度]</label>
          <input type="number" bind:value={objectLon} step="0.001"
            class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-sm font-bold text-slate-700 dark:text-slate-300">第1方位 [°]</label>
          <input type="number" bind:value={bearing1} step="0.1" min="0" max="360"
            class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
        </div>
        <div>
          <label class="text-sm font-bold text-slate-700 dark:text-slate-300">第2方位 [°]</label>
          <input type="number" bind:value={bearing2} step="0.1" min="0" max="360"
            class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
        </div>
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">真針路 [°]</label>
        <input type="number" bind:value={courseTrue} step="0.1" min="0" max="360"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-sm font-bold text-slate-700 dark:text-slate-300">速力 [kn]</label>
          <input type="number" bind:value={speedKts} step="0.1" min="0"
            class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
        </div>
        <div>
          <label class="text-sm font-bold text-slate-700 dark:text-slate-300">経過時間 [分]</label>
          <input type="number" bind:value={timeBetweenMin} step="1" min="0"
            class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
        </div>
      </div>
    </div>
  </div>

  <button onclick={handleCalculate}
    class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105">
    計算 (Calculate)
  </button>
</div>
