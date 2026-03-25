<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
  <div class="relative">
    <h3 class="text-sm font-bold bg-green-700 text-white inline-block px-3 py-1 mb-3">Time → Arc Conversion</h3>
    <div class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
      <div class="border-b border-slate-200 dark:border-slate-800 pb-4">
        <p class="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-2">Input (Time)</p>
        <p class="text-xl font-mono font-bold text-slate-800 dark:text-white">
          {result.inputH}h {result.inputM}m {result.inputS}s
        </p>
      </div>
      <div>
        <p class="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-2">Result (Arc)</p>
        <p class="text-3xl font-mono font-bold text-green-700 dark:text-green-400">
          {result.deg}° {result.min}' {result.sec}"
        </p>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
          = {result.totalDegrees.toFixed(4)}° (10進数)
        </p>
      </div>
      <div class="text-xs text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-3 mt-3">
        <p>1h = 15°, 1m = 15', 1s = 15"</p>
      </div>
    </div>
  </div>
</div>
