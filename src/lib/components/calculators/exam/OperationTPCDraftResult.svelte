<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <!-- Calculation Process Sections -->
  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">1. TPC (Tons Per Centimeter)</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">TPC 計算式</span>
        <span class="text-xs text-slate-500">L × B × 0.01 × 比重</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">TPC</span>
        <span class="print-row-value">{result.tpc.toFixed(2)} ton/cm</span>
      </div>
    </div>
  </div>

  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">2. 積載時の喫水変化</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">貨物重量</span>
        <span class="print-row-value">{result.cargoTon.toFixed(1)} ton</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">喫水増加</span>
        <span class="print-row-value">{result.draftIncreaseCm.toFixed(1)} cm</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">初期平均喫水</span>
        <span class="print-row-value">{result.initialDraftM.toFixed(3)} m</span>
      </div>
    </div>
  </div>

  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">3. 観測喫水から逆算</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">観測喫水増加</span>
        <span class="print-row-value">{result.observedDraftChangeCm.toFixed(1)} cm</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">逆算貨物重量</span>
        <span class="print-row-value">{result.cargoFromObservedTon.toFixed(1)} ton</span>
      </div>
    </div>
  </div>

  <!-- Final Answer Box -->
  <div class="print-final-answer">
    <div class="print-final-answer-title">【最終答案】</div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">積載後平均喫水</span>
      <span class="print-answer-value">{result.finalDraftM.toFixed(3)} m</span>
    </div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">逆算貨物重量</span>
      <span class="print-answer-value">{result.cargoFromObservedTon.toFixed(1)} ton</span>
    </div>
  </div>
</div>
