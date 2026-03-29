<script lang="ts">
  import { calculateParallelSailing, calculateMeridionalSailing } from '$lib/utils/examNavigation';

  let latitude = $state(35.0);
  let longitudeDelta = $state(120.0);
  let latitudeStart = $state(35.0);
  let latitudeEnd = $state(40.0);
  
  let result: any = $state(null);

  function handleCalculate() {
    const parallel = calculateParallelSailing(latitude, longitudeDelta);
    const meridional = calculateMeridionalSailing(latitudeStart, latitudeEnd);
    
    result = {
      parallel,
      meridional,
      timestamp: new Date().toLocaleTimeString()
    };
  }
</script>

<div class="space-y-6 p-6">
  <!-- Parallel Sailing Section -->
  <div class="border-2 border-indigo-300 dark:border-indigo-700 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900/20">
    <h3 class="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-4">平行線航 {latitude !== undefined && `（緯度 ${latitude}°）`}</h3>
    <div class="space-y-4">
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">緯度 (Latitude) [度]</label>
        <input
          type="number"
          bind:value={latitude}
          step="0.1"
          min="-90"
          max="90"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
        />
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">経度差 (Δλ) [分]</label>
        <input
          type="number"
          bind:value={longitudeDelta}
          step="0.1"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
        />
      </div>
    </div>
  </div>

  <!-- Meridional Sailing Section -->
  <div class="border-2 border-purple-300 dark:border-purple-700 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
    <h3 class="text-lg font-bold text-purple-900 dark:text-purple-100 mb-4">正子午線航</h3>
    <div class="space-y-4">
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">開始緯度 (Start Lat) [度]</label>
        <input
          type="number"
          bind:value={latitudeStart}
          step="0.1"
          min="-90"
          max="90"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
        />
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">終了緯度 (End Lat) [度]</label>
        <input
          type="number"
          bind:value={latitudeEnd}
          step="0.1"
          min="-90"
          max="90"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
        />
      </div>
    </div>
  </div>

  <!-- Calculate Button -->
  <button
    onclick={handleCalculate}
    class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
  >
    計算 (Calculate)
  </button>

  <!-- Results -->
  {#if result}
    <div class="border-t-2 border-slate-300 dark:border-slate-700 pt-6 mt-6 space-y-4 animate-in fade-in">
      <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">平行線航 計算結果</p>
        <p class="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
          {result.parallel.distanceNm.toFixed(1)} nm
        </p>
        <p class="text-xs text-slate-500 mt-2">{result.parallel.dmsFormat}</p>
      </div>

      <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">正子午線航 計算結果</p>
        <p class="text-2xl font-bold text-purple-700 dark:text-purple-400">
          {result.meridional.distanceNm.toFixed(1)} nm
        </p>
        <p class="text-xs text-slate-500 mt-2">
          Δ緯度: {Math.abs(result.meridional.latitudeDiff).toFixed(1)}°
        </p>
      </div>
    </div>
  {/if}
</div>

