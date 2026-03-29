<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-4 p-4">
  <div class="print-section">
    <div class="print-section-title">進行軸計算</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">目標進路</span>
        <span class="print-row-value">{result.desiredTrack.toFixed(1)}°T</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">船速</span>
        <span class="print-row-value">{result.shipSpeed.toFixed(1)} kt</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">流向</span>
        <span class="print-row-value">{result.currentSet.toFixed(1)}°T</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">流速</span>
        <span class="print-row-value">{result.currentDrift.toFixed(1)} kt</span>
      </div>
    </div>
  </div>

  <div class="print-final-answer">
    <div class="print-answer-box">
      <span class="print-answer-label">進行軸 (Course to Steer)</span>
      <span class="print-answer-value">{result.courseToSteer.toFixed(1)}°</span>
    </div>
    <div class="print-answer-box">
      <span class="print-answer-label">対地速力 (Ground Speed)</span>
      <span class="print-answer-value">{result.groundSpeed.toFixed(1)} kt</span>
    </div>
  </div>
</div>
