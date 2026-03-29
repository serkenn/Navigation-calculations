<script lang="ts">
  import { calculateAmplitudeGyroError } from '$lib/utils/examNavigation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let latitudeDeg = $state(31.25);
  let declinationDeg = $state(-18.8);
  let compassBearing = $state(261.5);
  let isRising = $state(false);

  function handleCalculate() {
    const r = calculateAmplitudeGyroError(latitudeDeg, declinationDeg, compassBearing, isRising);
    onResult({
      ...r,
      latitudeDeg, declinationDeg, compassBearing, isRising,
      timestamp: new Date().toLocaleTimeString()
    });
  }
</script>

<div class="space-y-6 p-6">
  <div class="border-2 border-indigo-300 dark:border-indigo-700 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900/20">
    <h3 class="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-4">出没方位角・ジャイロ誤差</h3>
    <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">Z = cos⁻¹(sin d / cos φ)</p>
    <div class="space-y-4">
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">緯度 φ [度] (S は負)</label>
        <input type="number" bind:value={latitudeDeg} step="0.01"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">太陽赤緯 d [度] (S は負)</label>
        <input type="number" bind:value={declinationDeg} step="0.01"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">ジャイロコンパス方位 [°]</label>
        <input type="number" bind:value={compassBearing} step="0.1" min="0" max="360"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">日出 / 日没</label>
        <select bind:value={isRising}
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800">
          <option value={true}>日出 (Rising)</option>
          <option value={false}>日没 (Setting)</option>
        </select>
      </div>
    </div>
  </div>

  <button onclick={handleCalculate}
    class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105">
    計算 (Calculate)
  </button>
</div>
