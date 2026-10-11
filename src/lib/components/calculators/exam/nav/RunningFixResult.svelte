<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import Step from '#lib/components/shared/Step.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import {
    formatLat,
    formatLon,
    formatBearing,
  } from '#lib/utils/navigationMath.js';

  let { result }: { result: any } = $props();
</script>

<Sheet title="Running Fix">
  <Step
    title="1. 航走距離"
    lines={[
      `${result.speed} kn × ${result.minutes} 分 / 60 = ${result.run.toFixed(2)}'（針路 ${formatBearing(result.course)}）`,
    ]}
  />
  <Step
    title="2. 第 1 方位線を航走分だけ転位し、第 2 方位線との交点を求める"
    lines={[
      `第 1 方位 ${formatBearing(result.bearing1)}　第 2 方位 ${formatBearing(result.bearing2)}（交角 ${result.angle.toFixed(1)}°）`,
      `第 1 測定時の物標距離 ${result.dist1.toFixed(2)}'`,
      `第 2 測定時の物標距離 ${result.dist2.toFixed(2)}'`,
    ]}
  />
  <Highlight
    items={[
      { label: '第 2 測定時の船位 緯度', value: formatLat(result.lat) },
      { label: '経度', value: formatLon(result.lon) },
    ]}
  />
</Sheet>
