<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">計算過程</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">灯高 H</span>
        <span class="print-row-value">{result?.lightHeightM} m</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">眼高 h</span>
        <span class="print-row-value">{result?.eyeHeightM} m</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">灯台の地理的視認距離</span>
        <span class="print-row-value">2.083 × √{result?.lightHeightM} = {result?.lightGeoRange?.toFixed(2)} nm</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">観測者の地理的視認距離</span>
        <span class="print-row-value">2.083 × √{result?.eyeHeightM} = {result?.eyeGeoRange?.toFixed(2)} nm</span>
      </div>
    </div>
  </div>

  <div class="print-final-answer">
    <div class="print-final-answer-title">【最終答案】</div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">地理的光達距離 D</span>
      <span class="print-answer-value">{result?.totalRange?.toFixed(2)} nm</span>
    </div>
  </div>
</div>
