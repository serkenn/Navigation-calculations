<script lang="ts">
  import { calculateDeadReckoning } from '$lib/utils/examNavigation';

  let latitude0 = $state(35);
  let longitude0 = $state(139);
  let course = $state(90);
  let speed = $state(12);
  let time = $state(2);
  
  let result: any = $state(null);

  function handleCalculate() {
    const drResult = calculateDeadReckoning(latitude0, longitude0, course, speed, time);
    
    result = {
      ...drResult,
      latitude0,
      longitude0,
      course,
      speed,
      time
    };
  }
</script>

<div class="space-y-6 p-6">
  <div class="border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
    <h3 class="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4">推測位置計算 (Dead Reckoning)</h3>
    
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">初期緯度 (Initial Latitude) [°]</label>
        <input
          type="number"
          bind:value={latitude0}
          step="0.01"
          min="-90"
          max="90"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
        />
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">初期経度 (Initial Longitude) [°]</label>
        <input
          type="number"
          bind:value={longitude0}
          step="0.01"
          min="-180"
          max="180"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
        />
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">進路 (Course) [°T]</label>
        <input
          type="number"
          bind:value={course}
          step="1"
          min="0"
          max="360"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
        />
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">速力 (Speed) [kt]</label>
        <input
          type="number"
          bind:value={speed}
          step="0.1"
          min="0"
          max="50"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
        />
      </div>
      <div class="col-span-2">
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">経過時間 (Time Elapsed) [hours]</label>
        <input
          type="number"
          bind:value={time}
          step="0.5"
          min="0"
          max="120"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
        />
      </div>
    </div>
  </div>

  <button
    onclick={handleCalculate}
    class="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
  >
    計算 (Calculate)
  </button>

  {#if result}
    <div class="border-t-2 border-slate-300 dark:border-slate-700 pt-6 mt-6 space-y-3 animate-in fade-in">
      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p class="text-sm text-slate-600 dark:text-slate-400">最終緯度</p>
        <p class="text-3xl font-bold text-blue-700 dark:text-blue-400">
          {result.endLatitude.toFixed(4)}°
        </p>
      </div>

      <div class="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg">
        <p class="text-sm text-slate-600 dark:text-slate-400">最終経度</p>
        <p class="text-2xl font-bold text-cyan-700 dark:text-cyan-400">
          {result.endLongitude.toFixed(4)}°
        </p>
      </div>

      <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
        <p class="text-sm text-slate-600 dark:text-slate-400">走行距離</p>
        <p class="text-xl font-bold text-slate-700 dark:text-slate-300">
          {result.distance.toFixed(1)} nm
        </p>
      </div>
    </div>
  {/if}
</div>
