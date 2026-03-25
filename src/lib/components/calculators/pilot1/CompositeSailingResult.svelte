<script lang="ts">
  import { formatDMS } from '$lib/utils/navigationMath';

  let { result }: { result: any } = $props();
</script>

<div class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
  <div class="relative">
    <h3 class="text-sm font-bold bg-blue-700 text-white inline-block px-3 py-1 mb-3">Composite Sailing</h3>
    <div class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
      <div class="grid grid-cols-2 gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <p class="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">From</p>
          <p class="font-mono">{formatDMS(result.lat1, 'lat')}</p>
          <p class="font-mono">{formatDMS(result.lon1, 'lon')}</p>
        </div>
        <div>
          <p class="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">To</p>
          <p class="font-mono">{formatDMS(result.lat2, 'lat')}</p>
          <p class="font-mono">{formatDMS(result.lon2, 'lon')}</p>
        </div>
      </div>
      <div class="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <span class="text-slate-500 dark:text-slate-400">制限緯度</span>
        <span class="font-mono font-bold">{result.limitLat.toFixed(1)}&deg;</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500 dark:text-slate-400">集成航法の適用</span>
        <span class="font-bold {result.isComposite ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}">
          {result.isComposite ? '必要 (Composite)' : '不要 (Pure GC)'}
        </span>
      </div>
      {#if result.isComposite}
        <div class="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div class="flex justify-between"><span class="text-slate-500 dark:text-slate-400">大圏距離 1</span><span class="font-mono font-bold">{result.gcDist1.toFixed(1)} NM</span></div>
          <div class="flex justify-between"><span class="text-slate-500 dark:text-slate-400">平行圏距離</span><span class="font-mono font-bold">{result.parallelDist.toFixed(1)} NM</span></div>
          <div class="flex justify-between"><span class="text-slate-500 dark:text-slate-400">大圏距離 2</span><span class="font-mono font-bold">{result.gcDist2.toFixed(1)} NM</span></div>
          <div class="flex justify-between"><span class="text-slate-500 dark:text-slate-400">変針点 V1</span><span class="font-mono font-bold">{formatDMS(result.lonV1, 'lon')}</span></div>
          <div class="flex justify-between"><span class="text-slate-500 dark:text-slate-400">変針点 V2</span><span class="font-mono font-bold">{formatDMS(result.lonV2, 'lon')}</span></div>
        </div>
      {/if}
      <div class="bg-blue-50 dark:bg-blue-900/40 p-4 text-center border border-blue-200 dark:border-blue-800">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Total Distance</p>
            <p class="text-3xl font-mono font-bold text-blue-700 dark:text-blue-400">{result.totalDistance.toFixed(1)}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">NM</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Initial Course</p>
            <p class="text-3xl font-mono font-bold text-blue-700 dark:text-blue-400">{result.initialCourse.toFixed(1)}&deg;</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
