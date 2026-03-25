<script lang="ts">
  import { formatDMS } from '$lib/utils/navigationMath';

  let { result }: { result: any } = $props();
</script>

<div class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
  <div class="relative">
    <h3 class="text-sm font-bold bg-blue-700 text-white inline-block px-3 py-1 mb-3">Mercator Sailing</h3>
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

      <div class="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div class="flex justify-between"><span>D.Lat</span> <span class="font-mono">{result.dLat.toFixed(1)}'</span></div>
        <div class="flex justify-between"><span>D.Lon</span> <span class="font-mono">{result.dLon.toFixed(1)}'</span></div>
        <div class="flex justify-between"><span>DMP</span> <span class="font-mono">{result.dmp.toFixed(1)}'</span></div>
      </div>

      <div class="bg-blue-50 dark:bg-blue-900/40 p-4 text-center border border-blue-200 dark:border-blue-800">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Course</p>
            <p class="text-3xl font-mono font-bold text-blue-700 dark:text-blue-400">{result.course.toFixed(1)}&deg;</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Distance</p>
            <p class="text-3xl font-mono font-bold text-blue-700 dark:text-blue-400">{result.distance.toFixed(1)}'</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
