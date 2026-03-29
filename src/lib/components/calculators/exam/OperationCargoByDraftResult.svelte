<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">噂溻貨物重量鄻算</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">積載前平均喫水</span>
        <span class="print-row-value">{result.initialMeanDraftM.toFixed(3)} m</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">積載後平均喫水</span>
        <span class="print-row-value">{result.finalMeanDraftM.toFixed(3)} m</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">喫水変化</span>
        <span class="print-row-value">{result.draftChangeCm.toFixed(1)} cm</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">TPC</span>
        <span class="print-row-value">{result.tpcTonPerCm.toFixed(2)} ton/cm</span>
      </div>
    </div>
  </div>

  <!-- Final Answer Box -->
  <div class="print-final-answer">
    <div class="print-final-answer-title">【最終答案】</div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">積載重量</span>
      <span class="print-answer-value">{result.cargoTon.toFixed(1)} ton</span>
    </div>
  </div>
</div>
