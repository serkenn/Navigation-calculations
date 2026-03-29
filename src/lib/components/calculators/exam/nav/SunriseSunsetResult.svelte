<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">計算過程</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">緯度</span>
        <span class="print-row-value">{result?.latitudeDeg}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">経度</span>
        <span class="print-row-value">{result?.longitudeDeg}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">日付</span>
        <span class="print-row-value">{result?.month}月{result?.day}日 (通日 {result?.dayOfYear})</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">太陽赤緯</span>
        <span class="print-row-value">{result?.declination}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">均時差</span>
        <span class="print-row-value">{result?.equationOfTime} 分</span>
      </div>
    </div>
  </div>

  <div class="print-final-answer">
    <div class="print-final-answer-title">【最終答案】</div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">常用日出時</span>
      <span class="print-answer-value">{result?.sunriseLocal}</span>
    </div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">正午</span>
      <span class="print-answer-value">{result?.solarNoonLocal}</span>
    </div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">常用日没時</span>
      <span class="print-answer-value">{result?.sunsetLocal}</span>
    </div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">可照時間</span>
      <span class="print-answer-value">{result?.daylightHours} 時間</span>
    </div>
  </div>
</div>
