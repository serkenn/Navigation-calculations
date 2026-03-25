<script lang="ts">
  import type { GyroResult } from '$lib/types/navigation';

  interface Props {
    result: GyroResult;
  }

  let { result }: Props = $props();
</script>

<div class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
  <div class="relative">
    <h3 class="text-sm font-bold bg-emerald-700 text-white inline-block px-3 py-1 mb-3">Amplitude Calculation</h3>
    <div class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
      <div class="grid grid-cols-2 gap-8 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <p class="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">Condition</p>
          <p class="text-xl font-bold text-slate-800 dark:text-white">{result.direction}</p>
        </div>
        <div class="text-right">
          <p class="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">True Azimuth (Base)</p>
          <p class="text-lg font-mono">
            N {result.trueAzimuthBase.toFixed(1)}&deg; {result.direction === 'Rise' ? 'E' : 'W'}
          </p>
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold text-slate-600 dark:text-slate-300">True Azimuth (360&deg;)</span>
          <span class="font-mono text-xl font-bold">{result.trueAzimuth360.toFixed(1)}&deg;</span>
        </div>
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold text-slate-600 dark:text-slate-300">Gyro Azimuth</span>
          <span class="font-mono text-xl">{result.gyroAzimuth.toFixed(1)}&deg;</span>
        </div>
        <div class="mt-4 pt-4 border-t-2 border-slate-800 dark:border-slate-500 flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4">
          <span class="font-bold text-emerald-800 dark:text-emerald-300">Gyro Error</span>
          <span class="font-mono text-3xl font-bold text-emerald-700 dark:text-emerald-400">
            {Math.abs(result.gyroError).toFixed(1)}&deg; {result.gyroError > 0 ? 'E (Low)' : result.gyroError < 0 ? 'W (High)' : ''}
          </span>
        </div>
        <p class="text-xs text-right text-slate-400 mt-2">Error = True - Gyro</p>
      </div>
    </div>
  </div>
</div>
