<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <h3 class="font-bold mb-3">1. A港で船幅を逆算</h3>
    <div class="flex justify-between"><span>船幅 B</span><span class="font-bold">{result.beamM.toFixed(2)} m</span></div>
    <div class="text-xs text-slate-500 mt-2">B = T × sqrt(GM) ÷ 0.8</div>
  </div>

  <div class="border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <h3 class="font-bold mb-3">2. B港のGM</h3>
    <div class="flex justify-between"><span>GM (B港)</span><span class="font-bold">{result.gmAtPortB.toFixed(3)} m</span></div>
    <div class="text-xs text-slate-500 mt-2">GM_B = GM_A × (T_A / T_B)^2</div>
  </div>
</div>
