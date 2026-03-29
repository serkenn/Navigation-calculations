<script lang="ts">
  import { calculateCrossBearing, formatDMS } from '$lib/utils/examNavigation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let obj1Lat = $state(35.0);
  let obj1Lon = $state(139.5);
  let bearing1 = $state(45);
  let obj2Lat = $state(35.1);
  let obj2Lon = $state(139.7);
  let bearing2 = $state(315);

  function handleCalculate() {
    const r = calculateCrossBearing(obj1Lat, obj1Lon, bearing1, obj2Lat, obj2Lon, bearing2);
    onResult({
      ...r,
      obj1Lat, obj1Lon, bearing1,
      obj2Lat, obj2Lon, bearing2,
      shipLatDMS: formatDMS(r.shipLat, 'lat'),
      shipLonDMS: formatDMS(r.shipLon, 'lon'),
      timestamp: new Date().toLocaleTimeString()
    });
  }
</script>

<div class="space-y-6 p-6">
  <div class="border-2 border-indigo-300 dark:border-indigo-700 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900/20">
    <h3 class="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-4">物標A</h3>
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-sm font-bold text-slate-700 dark:text-slate-300">緯度 [度]</label>
          <input type="number" bind:value={obj1Lat} step="0.001"
            class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
        </div>
        <div>
          <label class="text-sm font-bold text-slate-700 dark:text-slate-300">経度 [度]</label>
          <input type="number" bind:value={obj1Lon} step="0.001"
            class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
        </div>
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">方位 [°]</label>
        <input type="number" bind:value={bearing1} step="0.1" min="0" max="360"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
      </div>
    </div>
  </div>

  <div class="border-2 border-purple-300 dark:border-purple-700 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
    <h3 class="text-lg font-bold text-purple-900 dark:text-purple-100 mb-4">物標B</h3>
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-sm font-bold text-slate-700 dark:text-slate-300">緯度 [度]</label>
          <input type="number" bind:value={obj2Lat} step="0.001"
            class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
        </div>
        <div>
          <label class="text-sm font-bold text-slate-700 dark:text-slate-300">経度 [度]</label>
          <input type="number" bind:value={obj2Lon} step="0.001"
            class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
        </div>
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">方位 [°]</label>
        <input type="number" bind:value={bearing2} step="0.1" min="0" max="360"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
      </div>
    </div>
  </div>

  <button onclick={handleCalculate}
    class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105">
    計算 (Calculate)
  </button>
</div>
