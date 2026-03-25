<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
  <div class="relative">
    <h3 class="text-sm font-bold bg-cyan-700 text-white inline-block px-3 py-1 mb-3">Course to Steer</h3>
    <div class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
      <div class="grid grid-cols-2 gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Required</p>
          <p class="font-mono">CMG: {result.requiredCMG.toFixed(1)}&deg;</p>
          <p class="font-mono">SMG: {result.requiredSMG.toFixed(1)} kn</p>
        </div>
        <div>
          <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Current</p>
          <p class="font-mono">Set: {result.setDir.toFixed(1)}&deg;</p>
          <p class="font-mono">Drift: {result.driftSpeed.toFixed(1)} kn</p>
        </div>
      </div>
      <div class="bg-cyan-50 dark:bg-cyan-900/40 p-4 text-center border border-cyan-200 dark:border-cyan-800">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Ship Course</p>
            <p class="text-3xl font-mono font-bold text-cyan-700 dark:text-cyan-400">{result.shipCourse.toFixed(1)}&deg;</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Ship Speed</p>
            <p class="text-3xl font-mono font-bold text-cyan-700 dark:text-cyan-400">{result.shipSpeed.toFixed(1)}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">kn</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
