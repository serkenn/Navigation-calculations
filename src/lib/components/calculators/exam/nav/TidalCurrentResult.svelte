<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">計算過程</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">高潮時刻</span>
        <span class="print-row-value">{String(result?.highTideH).padStart(2,'0')}:{String(result?.highTideM).padStart(2,'0')}</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">目標時刻</span>
        <span class="print-row-value">{String(result?.targetH).padStart(2,'0')}:{String(result?.targetM).padStart(2,'0')}</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">高潮からの経過時間</span>
        <span class="print-row-value">{result?.hoursFromHighTide?.toFixed(2)} 時間</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">大潮期流速</span>
        <span class="print-row-value">{result?.springRate} kn</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">小潮期流速</span>
        <span class="print-row-value">{result?.neapRate} kn</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">潮差比</span>
        <span class="print-row-value">{result?.springNeapFactor}</span>
      </div>
    </div>
  </div>

  <div class="print-final-answer">
    <div class="print-final-answer-title">【最終答案】</div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">補間流速</span>
      <span class="print-answer-value">{result?.interpolatedRate?.toFixed(2)} kn</span>
    </div>
  </div>
</div>
