<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <h3 class="font-bold mb-3">平均喫水変化</h3>
    <div class="flex justify-between"><span>初期平均喫水</span><span>{(result.initialMeanDraftCm / 100).toFixed(3)} m</span></div>
    <div class="flex justify-between"><span>比重差による変化</span><span>{result.draftChangeCm >= 0 ? '+' : ''}{result.draftChangeCm.toFixed(2)} cm</span></div>
    <div class="flex justify-between font-bold"><span>移動後平均喫水</span><span>{(result.predictedMeanDraftCm / 100).toFixed(3)} m</span></div>
  </div>
</div>
