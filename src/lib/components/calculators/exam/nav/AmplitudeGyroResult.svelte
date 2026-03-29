<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">計算過程</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">緯度 φ</span>
        <span class="print-row-value">{result?.latitudeDeg}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">赤緯 d</span>
        <span class="print-row-value">{result?.declinationDeg}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">{result?.isRising ? '日出' : '日没'}</span>
        <span class="print-row-value">{result?.isRising ? 'Rising' : 'Setting'}</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">振幅 (Amplitude)</span>
        <span class="print-row-value">{result?.amplitudeLabel}</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">真方位 (T.B.)</span>
        <span class="print-row-value">{result?.trueBearing?.toFixed(1)}°</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">コンパス方位 (C.B.)</span>
        <span class="print-row-value">{result?.compassBearing?.toFixed(1)}°</span>
      </div>
    </div>
  </div>

  <div class="print-final-answer">
    <div class="print-final-answer-title">【最終答案】</div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">真方位</span>
      <span class="print-answer-value">{result?.trueBearing?.toFixed(1)}°</span>
    </div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">ジャイロ誤差</span>
      <span class="print-answer-value">{result?.gyroErrorLabel}</span>
    </div>
  </div>
</div>
