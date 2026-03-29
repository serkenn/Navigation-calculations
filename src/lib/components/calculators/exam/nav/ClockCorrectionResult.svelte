<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">計算過程</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">出発地 経度</span>
        <span class="print-row-value">{result?.departureLon?.toFixed(2)}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">到着地 経度</span>
        <span class="print-row-value">{result?.arrivalLon?.toFixed(2)}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">経度差</span>
        <span class="print-row-value">{result?.longitudeDiff?.toFixed(2)}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">出発地 時間帯</span>
        <span class="print-row-value">UTC{result?.departureZone >= 0 ? '+' : ''}{result?.departureZone}</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">到着地 時間帯</span>
        <span class="print-row-value">UTC{result?.arrivalZone >= 0 ? '+' : ''}{result?.arrivalZone}</span>
      </div>
    </div>
  </div>

  <div class="print-final-answer">
    <div class="print-final-answer-title">【最終答案】</div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">時差</span>
      <span class="print-answer-value">{result?.timeDiffHours}時間 {result?.timeDiffRemainMin?.toFixed(0)}分</span>
    </div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">船内時計を</span>
      <span class="print-answer-value">{result?.direction}</span>
    </div>
  </div>
</div>
