<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">1. 入力条件</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">船の方位</span>
        <span class="print-row-value">{result?.shipHeading?.toFixed(1) || 'N/A'}°T</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">船速</span>
        <span class="print-row-value">{result?.shipSpeed?.toFixed(1) || 'N/A'} kt</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">見掛風向</span>
        <span class="print-row-value">{result?.apparentWindDir?.toFixed(1) || 'N/A'}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">見掛風速</span>
        <span class="print-row-value">{result?.apparentWindSpeed?.toFixed(1) || 'N/A'} kt</span>
      </div>
    </div>
  </div>

  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">2. ベクトル計算</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">相対方位</span>
        <span class="print-row-value">{result?.relativeDirection?.toFixed(1) || 'N/A'}°</span>
      </div>
      <div class="text-xs text-slate-500 mt-2">真風 = 見掛風 + 船のベクトル</div>
    </div>
  </div>

  <!-- Final Answer Box -->
  <div class="print-final-answer">
    <div class="print-final-answer-title">【最終答案】</div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">真風風向</span>
      <span class="print-answer-value">{result?.trueWindDirection?.toFixed(1) || 'N/A'}°</span>
    </div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">真風風速</span>
      <span class="print-answer-value">{result?.trueWindSpeed?.toFixed(1) || 'N/A'} kt</span>
    </div>
  </div>
</div>
