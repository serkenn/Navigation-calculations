<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">入力データ</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">物標A 位置</span>
        <span class="print-row-value">{result?.obj1Lat?.toFixed(3)}°, {result?.obj1Lon?.toFixed(3)}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">物標A 方位</span>
        <span class="print-row-value">{result?.bearing1?.toFixed(1)}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">物標B 位置</span>
        <span class="print-row-value">{result?.obj2Lat?.toFixed(3)}°, {result?.obj2Lon?.toFixed(3)}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">物標B 方位</span>
        <span class="print-row-value">{result?.bearing2?.toFixed(1)}°</span>
      </div>
    </div>
  </div>

  <div class="print-final-answer">
    <div class="print-final-answer-title">【最終答案】</div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">船位 (緯度)</span>
      <span class="print-answer-value">{result?.shipLatDMS}</span>
    </div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">船位 (経度)</span>
      <span class="print-answer-value">{result?.shipLonDMS}</span>
    </div>
  </div>
</div>
