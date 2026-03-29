<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">計算過程</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">第1方位</span>
        <span class="print-row-value">{result?.bearing1?.toFixed(1)}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">第2方位</span>
        <span class="print-row-value">{result?.bearing2?.toFixed(1)}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">真針路</span>
        <span class="print-row-value">{result?.courseTrue?.toFixed(1)}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">航走距離</span>
        <span class="print-row-value">{result?.distanceRun?.toFixed(2)} nm</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">物標までの距離</span>
        <span class="print-row-value">{result?.distanceFromObject?.toFixed(2)} nm</span>
      </div>
    </div>
  </div>

  <div class="print-final-answer">
    <div class="print-final-answer-title">【最終答案】</div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">船位 (緯度)</span>
      <span class="print-answer-value">{result?.fixLatDMS}</span>
    </div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">船位 (経度)</span>
      <span class="print-answer-value">{result?.fixLonDMS}</span>
    </div>
  </div>
</div>
