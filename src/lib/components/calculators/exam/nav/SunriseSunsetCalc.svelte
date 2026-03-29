<script lang="ts">
  import { calculateSunriseSunset } from '$lib/utils/examNavigation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let latitudeDeg = $state(14.0);
  let longitudeDeg = $state(-28.0);
  let month = $state(4);
  let day = $state(15);
  let standardMeridian = $state(-30);

  function getDayOfYear(m: number, d: number): number {
    const daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
    let doy = 0;
    for (let i = 0; i < m - 1; i++) doy += daysInMonth[i];
    return doy + d;
  }

  function handleCalculate() {
    const dayOfYear = getDayOfYear(month, day);
    const r = calculateSunriseSunset(latitudeDeg, longitudeDeg, dayOfYear, standardMeridian);
    onResult({
      ...r,
      latitudeDeg, longitudeDeg, month, day, dayOfYear, standardMeridian,
      timestamp: new Date().toLocaleTimeString()
    });
  }
</script>

<div class="space-y-6 p-6">
  <div class="border-2 border-indigo-300 dark:border-indigo-700 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900/20">
    <h3 class="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-4">常用日出没時</h3>
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-sm font-bold text-slate-700 dark:text-slate-300">緯度 [度] (S は負)</label>
          <input type="number" bind:value={latitudeDeg} step="0.1" min="-90" max="90"
            class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
        </div>
        <div>
          <label class="text-sm font-bold text-slate-700 dark:text-slate-300">経度 [度] (W は負)</label>
          <input type="number" bind:value={longitudeDeg} step="0.1"
            class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-sm font-bold text-slate-700 dark:text-slate-300">月</label>
          <input type="number" bind:value={month} min="1" max="12"
            class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
        </div>
        <div>
          <label class="text-sm font-bold text-slate-700 dark:text-slate-300">日</label>
          <input type="number" bind:value={day} min="1" max="31"
            class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
        </div>
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">標準子午線 [度] (W は負)</label>
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
