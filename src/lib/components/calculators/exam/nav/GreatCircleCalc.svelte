<script lang="ts">
  import { calculateGreatCircle } from '$lib/utils/examNavigation';

  let lat1 = $state(35.0);
  let lon1 = $state(139.0);
  let lat2 = $state(51.0);
  let lon2 = $state(0.0);
  
  let result: any = $state(null);

  function handleCalculate() {
    const gcResult = calculateGreatCircle(lat1, lon1, lat2, lon2);
    
    result = {
      ...gcResult,
      startLat: lat1,
      startLon: lon1,
      endLat: lat2,
      endLon: lon2
    };
  }
</script>

<div class="space-y-6 p-6">
  <div class="border-2 border-indigo-300 dark:border-indigo-700 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900/20">
    <h3 class="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-4">大圏航路 (Great Circle Route)</h3>
    
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">出発地 緯度 [度]</label>
        <input
          type="number"
          bind:value={lat1}
          step="0.01"
          min="-90"
          max="90"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
        />
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">出発地 経度 [度]</label>
        <input
          type="number"
          bind:value={lon1}
          step="0.01"
          min="-180"
          max="180"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
        />
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">到着地 緯度 [度]</label>
        <input
          type="number"
          bind:value={lat2}
          step="0.01"
          min="-90"
          max="90"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
        />
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">到着地 経度 [度]</label>
        <input
          type="number"
          bind:value={lon2}
          step="0.01"
          min="-180"
          max="180"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
        />
      </div>
    </div>
  </div>

  <button
    onclick={handleCalculate}
    class="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
  >
    計算 (Calculate)
  </button>

  {#if result}
    <div class="border-t-2 border-slate-300 dark:border-slate-700 pt-6 mt-6 space-y-3 animate-in fade-in">
      <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
        <p class="text-sm text-slate-600 dark:text-slate-400">大圏距離</p>
        <p class="text-3xl font-bold text-indigo-700 dark:text-indigo-400">
          {result.distanceNm.toFixed(1)} nm
        </p>
      </div>

      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">初期針路</p>
        <p class="text-2xl font-bold text-blue-700 dark:text-blue-400">
          {result.initialCourse.toFixed(1)}°
        </p>
      </div>

      <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">到着時針路</p>
        <p class="text-2xl font-bold text-purple-700 dark:text-purple-400">
          {result.finalCourse.toFixed(1)}°
        </p>
      </div>
    </div>
  {/if}
</div>
