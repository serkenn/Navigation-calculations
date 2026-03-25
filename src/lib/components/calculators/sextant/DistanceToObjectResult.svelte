<script lang="ts">
  import type { DistanceToObjectResult } from '$lib/types/navigation';

  interface Props {
    result: DistanceToObjectResult;
  }

  let { result }: Props = $props();
</script>

<div class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
  <div class="relative">
    <h3 class="text-sm font-bold bg-purple-700 text-white inline-block px-3 py-1 mb-3">
      {result.mode === 'vertical' ? 'Vertical Angle Method' : 'Geographical Range'}
    </h3>
    <div class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
      <div class="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        {#if result.angle !== undefined}
          <div class="flex justify-between"><span>垂直角</span> <span class="font-mono font-bold">{result.angle}&deg;</span></div>
        {/if}
        <div class="flex justify-between"><span>物標高さ</span> <span class="font-mono">{result.height} m</span></div>
        <div class="flex justify-between"><span>眼高</span> <span class="font-mono">{result.heightOfEye} m</span></div>
      </div>

      <div class="bg-purple-50 dark:bg-purple-900/40 p-4 text-center border border-purple-200 dark:border-purple-800">
        <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">距離 (Distance)</p>
        <p class="text-3xl font-mono font-bold text-purple-700 dark:text-purple-400">
          {result.distanceNM.toFixed(2)} NM
        </p>
        {#if result.mode === 'vertical' && result.distance > 0}
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            = {result.distance.toFixed(0)} m
          </p>
        {/if}
      </div>
    </div>
  </div>
</div>
