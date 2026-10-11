<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import Step from '$lib/components/shared/Step.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';
  import {
    formatLat,
    formatLon,
    formatDirected,
    formatBearing,
    formatDuration,
  } from '$lib/utils/navigationMath';

  let { result }: { result: any } = $props();
</script>

<Sheet title="Dead Reckoning (Mid. Lat. Sailing)">
  <Step
    title="1. 航程"
    lines={[
      `${result.speed} kn × ${formatDuration(result.hours, false)} = ${result.distance.toFixed(1)}'`,
    ]}
  />
  <Step
    title="2. 変緯・東西距"
    lines={[
      `D.Lat = ${result.distance.toFixed(1)}' × cos ${formatBearing(result.course)} = ${formatDirected(result.dLatMin, 'N', 'S')}`,
      `Dep = ${result.distance.toFixed(1)}' × sin ${formatBearing(result.course)} = ${formatDirected(result.dep, 'E', 'W')}`,
    ]}
  />
  <Step
    title="3. 中分緯度と変経"
    lines={[
      `到着緯度 l2 = ${formatLat(result.lat2)}`,
      `Mid.Lat = (l1 + l2) / 2 = ${formatLat(result.midLat)}`,
      `D.Long = Dep / cos Mid.Lat = ${formatDirected(result.dLonMin, 'E', 'W')}`,
    ]}
  />
  <Highlight
    items={[
      { label: '推測位置 緯度', value: formatLat(result.lat2) },
      { label: '推測位置 経度', value: formatLon(result.lon2) },
    ]}
  />
</Sheet>
