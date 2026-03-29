<script lang="ts">
  import { calculateCourseToSteer } from '$lib/utils/examNavigation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let desiredTrack = $state(180);
  let shipSpeed = $state(15);
  let currentSet = $state(270);
  let currentDrift = $state(2);
  
  let result: any = $state(null);

  function handleCalculate() {
    const courseResult = calculateCourseToSteer(desiredTrack, shipSpeed, currentSet, currentDrift);

    const calcResult = {
      ...courseResult,
      desiredTrack,
      shipSpeed,
      currentSet,
      currentDrift
    };

    result = calcResult;
    onResult(calcResult);
  }
</script>

<div class="space-y-6 p-6">
  <div class="border-2 border-green-300 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
    <h3 class="text-lg font-bold text-green-900 dark:text-green-100 mb-4">進行軸計算 (Course to Steer)</h3>
    
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">目標進路 (Desired Track) [°T]</label>
        <input
          type="number"
          bind:value={desiredTrack}
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
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">流向 (Current Set) [°T]</label>
        <input
          type="number"
          bind:value={currentSet}
          step="1"
          min="0"
          max="360"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
        />
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">流速 (Current Drift) [kt]</label>
        <input
          type="number"
          bind:value={currentDrift}
          step="0.1"
          min="0"
          max="10"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
        />
      </div>
    </div>
  </div>

  <button
    onclick={handleCalculate}
    class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
  >
    計算 (Calculate)
  </button>

  {#if result}
    <div class="border-t-2 border-slate-300 dark:border-slate-700 pt-6 mt-6 space-y-3 animate-in fade-in">
      <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <p class="text-sm text-slate-600 dark:text-slate-400">進行軸</p>
        <p class="text-3xl font-bold text-green-700 dark:text-green-400">
          {result.courseToSteer.toFixed(1)}°
        </p>
      </div>

      <div class="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
        <p class="text-sm text-slate-600 dark:text-slate-400">対地速力</p>
        <p class="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
          {result.groundSpeed.toFixed(1)} kt
        </p>
      </div>
    </div>
  {/if}
</div>
