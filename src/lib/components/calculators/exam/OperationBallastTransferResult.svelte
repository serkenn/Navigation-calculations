<script lang="ts">
  let { result }: { result: any } = $props();

  function directionText(direction: string) {
    if (direction === 'aft-to-forward') return '後方タンク → 前方タンク';
    if (direction === 'forward-to-aft') return '前方タンク → 後方タンク';
    return '移送不要';
  }
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">等喫水化算出</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">現在トリム</span>
        <span class="print-row-value">{result.trimBySternCm.toFixed(1)} cm (船尾+)</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">必要モーメント</span>
        <span class="print-row-value">{result.requiredMoment.toFixed(1)} ton-m</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">移送方向</span>
        <span class="print-row-value">{directionText(result.direction)}</span>
      </div>
    </div>
  </div>

  <!-- Final Answer Box -->
  <div class="print-final-answer">
    <div class="print-final-answer-title">【最終答案】</div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">必要移送量</span>
      <span class="print-answer-value">{result.transferTon.toFixed(1)} ton</span>
    </div>
  </div>
</div>
