<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-4 p-4">
  <div class="print-section">
    <div class="print-section-title">推測位置計算</div>
    <div class="print-section-content">
      <div class="print-row">
        <span class="print-row-label">初期位置</span>
        <span class="print-row-value">
          {result.latitude0.toFixed(4)}° / {result.longitude0.toFixed(4)}°
        </span>
      </div>
      <div class="print-row">
        <span class="print-row-label">進路</span>
        <span class="print-row-value">{result.course.toFixed(1)}°T</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">速力</span>
        <span class="print-row-value">{result.speed.toFixed(1)} kt</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">経過時間</span>
        <span class="print-row-value">{result.time.toFixed(1)} h</span>
      </div>
      <div class="print-row">
        <span class="print-row-label">走行距離</span>
        <span class="print-row-value">{result.distance.toFixed(1)} nm</span>
      </div>
    </div>
  </div>

  <div class="print-final-answer">
    <div class="print-answer-box">
      <span class="print-answer-label">推測位置 (Estimated Position)</span>
      <span class="print-answer-value">
        {result.endLatitude.toFixed(4)}° / {result.endLongitude.toFixed(4)}°
      </span>
    </div>
  </div>
</div>
