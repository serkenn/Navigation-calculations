<script lang="ts">
  import { formatDMS } from '$lib/utils/navigationMath';

  let { result }: { result: any } = $props();
</script>

<div class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
  <div class="relative">
    <h3 class="text-sm font-bold bg-amber-700 text-white inline-block px-3 py-1 mb-3">Solar Ephemeris (Simplified)</h3>
    <div class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
      <div class="border-b border-slate-200 dark:border-slate-800 pb-3">
        <p class="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">Date & Time</p>
        <p class="font-mono font-bold text-lg">
          {result.year}/{String(result.month).padStart(2, '0')}/{String(result.day).padStart(2, '0')} {Math.floor(result.utcHours).toString().padStart(2, '0')}:{Math.floor((result.utcHours % 1) * 60).toString().padStart(2, '0')} UTC
        </p>
      </div>

      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="font-bold">GHA Sun</span>
          <span class="font-mono text-lg font-bold text-amber-700 dark:text-amber-400">{formatDMS(result.gha, 'angle')}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-bold">Dec Sun</span>
          <span class="font-mono text-lg font-bold text-amber-700 dark:text-amber-400">{formatDMS(result.dec, 'lat')}</span>
        </div>
        <div class="flex justify-between text-slate-500 dark:text-slate-400">
          <span>RA</span>
          <span class="font-mono">{result.ra.toFixed(4)}°</span>
        </div>
        <div class="flex justify-between text-slate-500 dark:text-slate-400">
          <span>Eq. of Time</span>
          <span class="font-mono">{result.eqTime.toFixed(2)} min</span>
        </div>
      </div>

      <div class="bg-amber-50 dark:bg-amber-900/30 p-3 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
        ※ 簡易計算のため実際の天測暦と数分の誤差が生じる場合があります
      </div>
    </div>
  </div>
</div>
