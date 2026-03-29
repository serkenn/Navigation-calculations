<script lang="ts">
  import { calculateTidalCurrent } from '$lib/utils/examNavigation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let highTideH = $state(7);
  let highTideM = $state(28);
  let targetH = $state(13);
  let targetM = $state(57);
  let springRate = $state(5.2);
  let neapRate = $state(3.8);
  let springNeapFactor = $state(0.7);

  function handleCalculate() {
    const r = calculateTidalCurrent(highTideH, highTideM, targetH, targetM, springRate, neapRate, springNeapFactor);
    onResult({
      ...r,
      highTideH, highTideM, targetH, targetM,
      springRate, neapRate, springNeapFactor,
      timestamp: new Date().toLocaleTimeString()
    });
  }
</script>

<div class="space-y-6 p-6">
  <div class="border-2 border-indigo-300 dark:border-indigo-700 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900/20">
    <h3 class="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-4">潮汐表の使用法</h3>
    <div class="space-y-4">
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">高潮時刻</label>
        <div class="flex gap-2 mt-1">
          <input type="number" bind:value={highTideH} min="0" max="23" class="w-1/2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" placeholder="時" />
          <input type="number" bind:value={highTideM} min="0" max="59" class="w-1/2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" placeholder="分" />
        </div>
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">目標時刻</label>
        <div class="flex gap-2 mt-1">
          <input type="number" bind:value={targetH} min="0" max="23" class="w-1/2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" placeholder="時" />
          <input type="number" bind:value={targetM} min="0" max="59" class="w-1/2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" placeholder="分" />
        </div>
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">大潮期流速 [kn]</label>
        <input type="number" bind:value={springRate} step="0.1" min="0"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">小潮期流速 [kn]</label>
        <input type="number" bind:value={neapRate} step="0.1" min="0"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
      </div>
      <div>
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">潮差比 (0=小潮, 1=大潮)</label>
        <input type="number" bind:value={springNeapFactor} step="0.1" min="0" max="1"
          class="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800" />
      </div>
    </div>
  </div>

  <button onclick={handleCalculate}
    class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105">
    計算 (Calculate)
  </button>
</div>
