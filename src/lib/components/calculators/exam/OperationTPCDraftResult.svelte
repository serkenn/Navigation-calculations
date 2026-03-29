<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <h3 class="font-bold mb-3">1. TPC</h3>
    <div class="flex justify-between"><span>TPC</span><span class="font-bold">{result.tpc.toFixed(2)} ton/cm</span></div>
    <div class="text-xs text-slate-500 mt-2">L × B × 0.01 × 比重</div>
  </div>

  <div class="border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <h3 class="font-bold mb-3">2. 積載重量から喫水を予測</h3>
    <div class="flex justify-between"><span>喫水増加</span><span>{result.draftIncreaseCm.toFixed(1)} cm</span></div>
    <div class="flex justify-between"><span>積載後平均喫水</span><span class="font-bold">{result.finalDraftM.toFixed(3)} m</span></div>
  </div>

  <div class="border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <h3 class="font-bold mb-3">3. 観測喫水差から積載重量を逆算</h3>
    <div class="flex justify-between"><span>喫水差</span><span>{result.observedDraftChangeCm.toFixed(1)} cm</span></div>
    <div class="flex justify-between"><span>逆算貨物重量</span><span class="font-bold">{result.cargoFromObservedTon.toFixed(1)} ton</span></div>
  </div>
</div>
