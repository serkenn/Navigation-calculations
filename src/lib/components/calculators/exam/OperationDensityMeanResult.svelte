<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">比重差による平均喫水変化</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">初期平均喫水</span>
        <span class="print-row-value">{(result.initialMeanDraftCm / 100).toFixed(3)} m</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">比重差による変化</span>
        <span class="print-row-value">{result.draftChangeCm >= 0 ? '+' : ''}{result.draftChangeCm.toFixed(2)} cm</span>
      </div>
    </div>
  </div>

  <!-- Final Answer Box -->
  <div class="print-final-answer">
    <div class="print-final-answer-title">【最終答案】</div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">移動後平均喫水</span>
      <span class="print-answer-value">{(result.predictedMeanDraftCm / 100).toFixed(3)} m</span>
    </div>
  </div>
</div>
