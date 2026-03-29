<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">1. A港データから船幅を逆算</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">GM (A港)</span>
        <span class="print-row-value">{result.gmAtPortA.toFixed(3)} m</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">船幅 B （逆算値）</span>
        <span class="print-row-value">{result.beamM.toFixed(2)} m</span>
      </div>
      <div class="text-xs text-slate-500 mt-2">式: B = T × √(GM) ÷ 0.8</div>
    </div>
  </div>

  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">2. B港でのGM計算</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">動揺周期 (B港)</span>
        <span class="print-row-value">{result.periodAtPortB.toFixed(2)} s</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">GM (B港)</span>
        <span class="print-row-value">{result.gmAtPortB.toFixed(3)} m</span>
      </div>
      <div class="text-xs text-slate-500 mt-2">式: GM_B = GM_A × (T_A / T_B)²</div>
    </div>
  </div>

  <!-- Final Answer Box -->
  <div class="print-final-answer">
    <div class="print-final-answer-title">【最終答案】</div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">船幅 B</span>
      <span class="print-answer-value">{result.beamM.toFixed(2)} m</span>
    </div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">GM (B港)</span>
      <span class="print-answer-value">{result.gmAtPortB.toFixed(3)} m</span>
    </div>
  </div>
</div>
