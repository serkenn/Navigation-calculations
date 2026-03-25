<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
  <div class="relative">
    <h3 class="text-sm font-bold bg-rose-700 text-white inline-block px-3 py-1 mb-3">Arithmetic Result</h3>
    <div class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
      <div class="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-slate-500 dark:text-slate-400 text-xs font-bold">A</span>
          <span class="font-mono text-lg text-slate-800 dark:text-white">{result.h1}h {result.m1}m {result.s1}s</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-slate-500 dark:text-slate-400 text-xs font-bold">Op</span>
          <span class="font-mono text-2xl font-bold text-slate-800 dark:text-white">{result.op}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-slate-500 dark:text-slate-400 text-xs font-bold">B</span>
          <span class="font-mono text-lg text-slate-800 dark:text-white">{result.h2}h {result.m2}m {result.s2}s</span>
        </div>
      </div>
      <div>
        <p class="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-2">Result</p>
        <p class="text-3xl font-mono font-bold text-rose-700 dark:text-rose-400">
          {result.sign < 0 ? '-' : ''}{result.h}h {result.m}m {result.s}s
        </p>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
          = {result.decimal.toFixed(6)} hours
        </p>
      </div>
    </div>
  </div>
</div>
