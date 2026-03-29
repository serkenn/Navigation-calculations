<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">1. 平行線航計算 (Parallel Sailing)</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">緯度</span>
        <span class="print-row-value">{result?.parallel?.latitude?.toFixed(1) || 'N/A'}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">経度差</span>
        <span class="print-row-value">{result?.parallel?.longitudeDelta?.toFixed(1) || 'N/A'}'</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">距離計算式</span>
        <span class="print-row-value text-xs">Δλ × 60 × cos(lat)</span>
      </div>
    </div>
  </div>

  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">2. 正子午線航計算 (Meridional Sailing)</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">開始緯度</span>
        <span class="print-row-value">{result?.meridional?.latStart?.toFixed(1) || 'N/A'}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">終了緯度</span>
        <span class="print-row-value">{result?.meridional?.latEnd?.toFixed(1) || 'N/A'}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">緯度差</span>
        <span class="print-row-value">{result?.meridional?.latitudeDiff?.toFixed(2) || 'N/A'}°</span>
      </div>
    </div>
  </div>

  <!-- Final Answer Box -->
  <div class="print-final-answer">
    <div class="print-final-answer-title">【最終答案】</div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">平行線航距離</span>
      <span class="print-answer-value">{result?.parallel?.distanceNm?.toFixed(1) || 'N/A'} nm</span>
    </div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">正子午線航距離</span>
      <span class="print-answer-value">{result?.meridional?.distanceNm?.toFixed(1) || 'N/A'} nm</span>
    </div>
  </div>
</div>
