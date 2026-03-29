<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">1. 出発地と到着地</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">出発地</span>
        <span class="print-row-value">{result?.startLat?.toFixed(2)}°, {result?.startLon?.toFixed(2)}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">到着地</span>
        <span class="print-row-value">{result?.endLat?.toFixed(2)}°, {result?.endLon?.toFixed(2)}°</span>
      </div>
    </div>
  </div>

  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">2. 大圏航路計算</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">初期針路 (Initial Course)</span>
        <span class="print-row-value">{result?.initialCourse?.toFixed(1) || 'N/A'}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">終了針路 (Final Course)</span>
        <span class="print-row-value">{result?.finalCourse?.toFixed(1) || 'N/A'}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">大圏距離</span>
        <span class="print-row-value">{result?.distanceNm?.toFixed(1) || 'N/A'} nm</span>
      </div>
    </div>
  </div>

  <!-- Final Answer Box -->
  <div class="print-final-answer">
    <div class="print-final-answer-title">【最終答案】</div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">大圏距離</span>
      <span class="print-answer-value">{result?.distanceNm?.toFixed(1) || 'N/A'} nm</span>
    </div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">初期針路</span>
      <span class="print-answer-value">{result?.initialCourse?.toFixed(1) || 'N/A'}°</span>
    </div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">終了針路</span>
      <span class="print-answer-value">{result?.finalCourse?.toFixed(1) || 'N/A'}°</span>
    </div>
  </div>
</div>
