<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <h3 class="font-bold mb-3">積載重量逆算</h3>
    <div class="flex justify-between"><span>積荷前平均喫水</span><span>{result.initialMeanDraftM.toFixed(3)} m</span></div>
    <div class="flex justify-between"><span>積荷後平均喫水</span><span>{result.finalMeanDraftM.toFixed(3)} m</span></div>
    <div class="flex justify-between"><span>喫水変化</span><span>{result.draftChangeCm.toFixed(1)} cm</span></div>
    <div class="flex justify-between"><span>TPC</span><span>{result.tpcTonPerCm.toFixed(2)} ton/cm</span></div>
    <div class="flex justify-between font-bold"><span>積載重量</span><span>{result.cargoTon.toFixed(1)} ton</span></div>
  </div>
</div>
