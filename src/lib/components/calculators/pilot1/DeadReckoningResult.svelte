<script lang="ts">
  import { formatDMS } from '$lib/utils/navigationMath';
  import { meridionalParts } from '$lib/utils/mercatorSailing';

  let { result }: { result: any } = $props();

  const isMercator = $derived(result.method === 'mercator');
  const dmp = $derived(isMercator ? meridionalParts(result.lat2) - meridionalParts(result.lat1) : 0);
</script>

<div class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
  <div class="relative">
    <h3 class="text-sm font-bold text-white inline-block px-3 py-1 mb-3 {isMercator ? 'bg-emerald-700' : 'bg-blue-700'}">
      {isMercator ? 'Mercator Sailing' : 'Middle Latitude Sailing'}
    </h3>
    <div class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
      <div class="border-b border-slate-200 dark:border-slate-800 pb-4">
        <p class="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">Departure</p>
        <p class="font-mono">{formatDMS(result.lat1, 'lat')} / {formatDMS(result.lon1, 'lon')}</p>
        <p class="mt-1">Course: {result.course}&deg; / Distance: {result.distance} NM</p>
      </div>

      <div class="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        {#if isMercator}
          <div class="flex justify-between"><span>D.Lat</span> <span class="font-mono">{(result.dLat * 60).toFixed(1)}' {result.dLat >= 0 ? 'N' : 'S'}</span></div>
          <div class="flex justify-between"><span>Dep</span> <span class="font-mono">{result.dep.toFixed(1)}'</span></div>
          <div class="flex justify-between"><span>DMP</span> <span class="font-mono">{dmp.toFixed(1)}'</span></div>
          <div class="flex justify-between"><span>D.Long</span> <span class="font-mono">{(result.dLon * 60).toFixed(1)}' {result.dLon >= 0 ? 'E' : 'W'}</span></div>
        {:else}
          <div class="flex justify-between"><span>D.Lat</span> <span class="font-mono">{result.dLatMin.toFixed(1)}' {result.dLat >= 0 ? 'N' : 'S'}</span></div>
          <div class="flex justify-between"><span>Dep</span> <span class="font-mono">{result.dep.toFixed(1)}'</span></div>
          <div class="flex justify-between"><span>Mid.Lat</span> <span class="font-mono">{formatDMS(result.midLat, 'lat')}</span></div>
          <div class="flex justify-between"><span>D.Long</span> <span class="font-mono">{result.dLonMin.toFixed(1)}' {result.dLon >= 0 ? 'E' : 'W'}</span></div>
        {/if}
      </div>

      <div class="bg-blue-50 dark:bg-blue-900/40 p-4 text-center border border-blue-200 dark:border-blue-800">
        <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">到着点 (Arrival Position)</p>
        <div class="flex justify-center gap-8 text-2xl font-mono font-bold text-blue-700 dark:text-blue-400">
          <span>{formatDMS(result.lat2, 'lat')}</span>
          <span>{formatDMS(result.lon2, 'lon')}</span>
        </div>
      </div>
    </div>
  </div>
</div>
