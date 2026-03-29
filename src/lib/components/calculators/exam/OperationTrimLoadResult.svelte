<script lang="ts">
  let { result }: { result: any } = $props();

  function trimLabel(trimBySternCm: number) {
    if (Math.abs(trimBySternCm) < 1e-9) return 'トリムなし';
    return trimBySternCm > 0 ? '船尾トリム' : '船首トリム';
  }
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">1. 積載位置による喫水変化</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">平均沈下量</span>
        <span class="print-row-value">{result.meanSinkCm.toFixed(2)} cm</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">トリム変化</span>
        <span class="print-row-value">{Math.abs(result.trimBySternCm).toFixed(2)} cm</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">({trimLabel(result.trimBySternCm)})</span>
        <span class="print-row-value"></span>
      </div>
    </div>
  </div>

  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">2. 貨物移動によるトリム変化</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">トリム変化量</span>
        <span class="print-row-value">{result.trimShiftCm.toFixed(2)} cm</span>
      </div>
      <div class="text-xs text-slate-500 mt-2">式: W × d ÷ MTC</div>
    </div>
  </div>

  <!-- Final Answer Box -->
  <div class="print-final-answer">
    <div class="print-final-answer-title">【最終答案】</div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">船首喫水変化</span>
      <span class="print-answer-value">{result.forwardChangeCm >= 0 ? '+' : ''}{result.forwardChangeCm.toFixed(2)} cm</span>
    </div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">船尾喫水変化</span>
      <span class="print-answer-value">{result.aftChangeCm >= 0 ? '+' : ''}{result.aftChangeCm.toFixed(2)} cm</span>
    </div>
  </div>
</div>
