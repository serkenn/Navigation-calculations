<script lang="ts">
  import { formatDMS } from '$lib/utils/navigationMath';
  import type { LOPResult } from '$lib/types/navigation';

  interface Props {
    result: LOPResult;
  }

  let { result }: Props = $props();
</script>

<div class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
  <div class="relative">
    <h3 class="text-sm font-bold bg-amber-700 text-white inline-block px-3 py-1 mb-3">Line of Position</h3>
    <div class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-3">
      <div class="grid grid-cols-2 gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">DR Position</p>
          <p class="font-mono">{formatDMS(result.lat, 'lat')}</p>
          <p class="font-mono">{formatDMS(result.lon, 'lon')}</p>
        </div>
        <div>
          <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Celestial Data</p>
          <p class="font-mono">GHA: {formatDMS(result.gha, 'angle')}</p>
          <p class="font-mono">Dec: {formatDMS(result.dec, 'lat')}</p>
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex justify-between"><span>LHA</span> <span class="font-mono font-bold">{result.lha.toFixed(1)}&deg;</span></div>
        <div class="flex justify-between"><span>Ho (観測高度)</span> <span class="font-mono font-bold">{formatDMS(result.ho, 'angle')}</span></div>
        <div class="flex justify-between"><span>Hc (計算高度)</span> <span class="font-mono font-bold">{formatDMS(result.hc, 'angle')}</span></div>
      </div>

      <div class="bg-amber-50 dark:bg-amber-900/40 p-4 text-center border border-amber-200 dark:border-amber-800 mt-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Intercept</p>
            <p class="text-3xl font-mono font-bold text-amber-700 dark:text-amber-400">
              {Math.abs(result.intercept).toFixed(1)}' {result.intercept >= 0 ? 'T' : 'A'}
            </p>
            <p class="text-xs text-slate-500 mt-1">{result.intercept >= 0 ? 'Towards' : 'Away'}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Azimuth</p>
            <p class="text-3xl font-mono font-bold text-amber-700 dark:text-amber-400">
              {result.azimuth.toFixed(1)}&deg;
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
