<script lang="ts">
  import type { TideHeightResult } from './TideHeightCalc.svelte';

  let { result }: { result: TideHeightResult } = $props();

  function fmt(h: number): string {
    return `${Math.floor(h).toString().padStart(2, '0')}:${Math.round((h % 1) * 60).toString().padStart(2, '0')}`;
  }
</script>

<div class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
  <div class="relative">
    <h3 class="text-sm font-bold bg-cyan-700 text-white inline-block px-3 py-1 mb-3">Tide Height</h3>
    <div class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
      <div class="grid grid-cols-2 gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">HW</p>
          <p class="font-mono">{result.hwHeight.toFixed(1)} m @ {fmt(result.hwTime)}</p>
        </div>
        <div>
          <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">LW</p>
          <p class="font-mono">{result.lwHeight.toFixed(1)} m @ {fmt(result.lwTime)}</p>
        </div>
      </div>
      <div class="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div class="flex justify-between"><span>Range</span><span class="font-mono font-bold">{result.range.toFixed(1)} m</span></div>
        <div class="flex justify-between"><span>Duration</span><span class="font-mono font-bold">{result.duration.toFixed(1)} h</span></div>
        <div class="flex justify-between"><span>Elapsed</span><span class="font-mono font-bold">{result.elapsed.toFixed(1)} h</span></div>
        <div class="flex justify-between"><span>Ratio</span><span class="font-mono font-bold">{(result.ratio * 100).toFixed(0)}%</span></div>
      </div>
      <div class="bg-cyan-50 dark:bg-cyan-900/40 p-4 text-center border border-cyan-200 dark:border-cyan-800">
        <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Height at {fmt(result.targetTime)}</p>
        <p class="text-4xl font-mono font-bold text-cyan-700 dark:text-cyan-400">{result.height.toFixed(2)}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400">m</p>
      </div>
    </div>
  </div>
</div>
