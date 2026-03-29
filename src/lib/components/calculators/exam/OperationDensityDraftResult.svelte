<script lang="ts">
  let { result }: { result: any } = $props();

  function trimLabel(trimBySternCm: number) {
    if (Math.abs(trimBySternCm) < 1e-9) return 'トリムなし';
    return trimBySternCm > 0 ? '船尾トリム' : '船首トリム';
  }
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <h3 class="font-bold mb-3">1. 平均喫水の変化</h3>
    <div class="flex justify-between"><span>出港平均喫水</span><span>{(result.initialMeanDraftCm / 100).toFixed(3)} m</span></div>
    <div class="flex justify-between"><span>消費後平均喫水</span><span>{(result.meanDraftAfterConsumeCm / 100).toFixed(3)} m</span></div>
    <div class="flex justify-between"><span>比重差補正</span><span>{result.densityChangeCm >= 0 ? '+' : ''}{result.densityChangeCm.toFixed(2)} cm</span></div>
    <div class="flex justify-between font-bold"><span>入港平均喫水</span><span>{(result.predictedMeanDraftCm / 100).toFixed(3)} m</span></div>
  </div>

  <div class="border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <h3 class="font-bold mb-3">2. 消費によるトリム</h3>
    <div class="flex justify-between"><span>トリムモーメント</span><span>{result.trimMomentByStern.toFixed(1)} ton-m</span></div>
    <div class="flex justify-between"><span>トリム変化</span><span>{Math.abs(result.trimBySternCm).toFixed(2)} cm ({trimLabel(result.trimBySternCm)})</span></div>
  </div>

  <div class="border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <h3 class="font-bold mb-3">3. 入港前後喫水</h3>
    <div class="flex justify-between"><span>船首喫水</span><span class="font-bold">{(result.forwardDraftCm / 100).toFixed(3)} m</span></div>
    <div class="flex justify-between"><span>船尾喫水</span><span class="font-bold">{(result.aftDraftCm / 100).toFixed(3)} m</span></div>
  </div>
</div>
