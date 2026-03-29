<script lang="ts">
  let { result }: { result: any } = $props();

  function trimLabel(trimBySternCm: number) {
    if (Math.abs(trimBySternCm) < 1e-9) return 'トリムなし';
    return trimBySternCm > 0 ? '船尾トリム' : '船首トリム';
  }
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">1. 燃焼番舟の喫水変化</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">出港平均喫水</span>
        <span class="print-row-value">{(result.initialMeanDraftCm / 100).toFixed(3)} m</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">消費後平均喫水</span>
        <span class="print-row-value">{(result.meanDraftAfterConsumeCm / 100).toFixed(3)} m</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">比重変化補正</span>
        <span class="print-row-value">{result.densityChangeCm >= 0 ? '+' : ''}{result.densityChangeCm.toFixed(2)} cm</span>
      </div>
    </div>
  </div>

  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">2. 消費によるトリム</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">トリムモーメント</span>
        <span class="print-row-value">{result.trimMomentByStern.toFixed(1)} ton-m</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">トリム変化</span>
        <span class="print-row-value">{Math.abs(result.trimBySternCm).toFixed(2)} cm ({trimLabel(result.trimBySternCm)})</span>
      </div>
    </div>
  </div>

  <!-- Final Answer Box -->
  <div class="print-final-answer">
    <div class="print-final-answer-title">【最終答案】</div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">入港平均喫水</span>
      <span class="print-answer-value">{(result.predictedMeanDraftCm / 100).toFixed(3)} m</span>
    </div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">船首喫水</span>
      <span class="print-answer-value">{(result.forwardDraftCm / 100).toFixed(3)} m</span>
    </div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">船尾喫水</span>
      <span class="print-answer-value">{(result.aftDraftCm / 100).toFixed(3)} m</span>
    </div>
  </div>
</div>
