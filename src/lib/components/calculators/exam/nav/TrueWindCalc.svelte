<script lang="ts">
  import { calculateTrueWind, calculateApparentWind } from '$lib/utils/examNavigation';

  let shipHeading = $state(180);
  let shipSpeed = $state(15);
  let apparentWindDir = $state(45);
  let apparentWindSpeed = $state(12);
  
  let result: any = $state(null);

  function handleCalculate() {
    const trueWind = calculateTrueWind(shipHeading, shipSpeed, apparentWindDir, apparentWindSpeed);
    
    result = {
      ...trueWind,
      shipHeading,
      shipSpeed,
      apparentWindDir,
      apparentWindSpeed
    };
  }
</script>

<div class="space-y-6 p-6">
  <div class="border-2 border-orange-300 dark:border-orange-700 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
    <h3 class="text-lg font-bold text-orange-900 dark:text-orange-100 mb-4">真風計算 (True Wind Calculation)</h3>
    
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">船の方位 (Heading) [°T]</label>
        <input
          type="number"
          bind:value={shipHeading}
          step="1"
          min="0"
          max="360"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
        />
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">船速 (Speed) [kt]</label>
        <input
          type="number"
          bind:value={shipSpeed}
          step="0.1"
          min="0"
          max="50"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
        />
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">見掛風向 (App. Wind Dir) [°]</label>
        <input
          type="number"
          bind:value={apparentWindDir}
          step="1"
          min="0"
          max="360"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
        />
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">見掛風速 (App. Wind Spd) [kt]</label>
        <input
          type="number"
          bind:value={apparentWindSpeed}
          step="0.1"
          min="0"
          max="50"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
        />
      </div>
    </div>
  </div>

  <button
    onclick={handleCalculate}
    class="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
  >
    計算 (Calculate)
  </button>

  {#if result}
    <div class="border-t-2 border-slate-300 dark:border-slate-700 pt-6 mt-6 space-y-3 animate-in fade-in">
      <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
        <p class="text-sm text-slate-600 dark:text-slate-400">真風風向</p>
        <p class="text-3xl font-bold text-orange-700 dark:text-orange-400">
          {result.trueWindDirection.toFixed(1)}°
        </p>
      </div>

      <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <p class="text-sm text-slate-600 dark:text-slate-400">真風風速</p>
        <p class="text-3xl font-bold text-red-700 dark:text-red-400">
          {result.trueWindSpeed.toFixed(1)} kt
        </p>
      </div>

      <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <p class="text-sm text-slate-600 dark:text-slate-400">相対方位</p>
        <p class="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
          {result.relativeDirection.toFixed(1)}°
        </p>
      </div>
    </div>
  {/if}
</div>
