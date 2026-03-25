<script lang="ts">
  import { formatDMS } from '$lib/utils/navigationMath';
  import type { PositionFixResult } from '$lib/types/navigation';

  interface Props {
    result: PositionFixResult;
  }

  let { result }: Props = $props();
</script>

<div class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
  <div class="relative">
    <h3 class="text-sm font-bold bg-amber-700 text-white inline-block px-3 py-1 mb-3">Position Fix</h3>
    <div class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
      <div class="border-b border-slate-200 dark:border-slate-800 pb-3">
        <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">DR Position</p>
        <p class="font-mono">{formatDMS(result.drLat, 'lat')} / {formatDMS(result.drLon, 'lon')}</p>
      </div>

      <div class="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {#each result.lops as lop, i}
          <div class="flex justify-between">
            <span>LOP {i + 1}</span>
            <span class="font-mono">
              I = {Math.abs(lop.intercept).toFixed(1)}' {lop.intercept >= 0 ? 'T' : 'A'}, Z = {lop.azimuth.toFixed(1)}&deg;
            </span>
          </div>
        {/each}
      </div>

      <div class="bg-white dark:bg-slate-900 border-4 border-double border-slate-800 dark:border-slate-400 p-4 text-center shadow-lg">
        <p class="text-xs text-slate-400 uppercase tracking-widest mb-2">FIX POSITION</p>
        <div class="flex justify-center gap-8 text-2xl font-bold text-amber-700 dark:text-amber-400 font-mono">
          <span>{formatDMS(result.fixLat, 'lat')}</span>
          <span>{formatDMS(result.fixLon, 'lon')}</span>
        </div>
      </div>
    </div>
  </div>
</div>
