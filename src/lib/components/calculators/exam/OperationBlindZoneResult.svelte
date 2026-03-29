<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <!-- Calculation Process -->
  <div class="print-section border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <div class="print-section-title mb-3">死角距離計算</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">眼高 (海面基準)</span>
        <span class="print-row-value">{Number.isFinite(result.eyeAboveSeaM) ? result.eyeAboveSeaM.toFixed(1) : '計算不可'} m</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">部材高さ (海面基準)</span>
        <span class="print-row-value">{Number.isFinite(result.obstacleAboveSeaM) ? result.obstacleAboveSeaM.toFixed(1) : '計算不可'} m</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">眼位置から部材まで距離</span>
        <span class="print-row-value">{Number.isFinite(result.blindFromObstacleM) && Number.isFinite(result.blindFromEyeM) ? result.blindFromEyeM.toFixed(1) : '計算不可'} m</span>
      </div>
    </div>
  </div>

  <!-- Final Answer Box -->
  <div class="print-final-answer">
    <div class="print-final-answer-title">【最終答案】</div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">部材から死角先端まで</span>
      <span class="print-answer-value">{Number.isFinite(result.blindFromObstacleM) ? result.blindFromObstacleM.toFixed(1) : '計算不可'} m</span>
    </div>
    <div class="print-final-answer-box">
      <span class="print-answer-label">眼位置から死角先端まで</span>
      <span class="print-answer-value">{Number.isFinite(result.blindFromEyeM) ? result.blindFromEyeM.toFixed(1) : '計算不可'} m</span>
    </div>
  </div>
</div>
