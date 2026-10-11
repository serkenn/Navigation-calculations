<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import Step from '$lib/components/shared/Step.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';
  import {
    formatLat,
    formatLon,
    formatDirectedDMS,
    formatBearing,
    toQuadrantBearing,
  } from '$lib/utils/navigationMath';

  let { result }: { result: any } = $props();

  const D = $derived(result.distance / 60);
</script>

<Sheet title="Great Circle Sailing">
  <Step
    title="1. 出発地・到着地と変経"
    lines={[
      `出発地 ${formatLat(result.lat1)}  ${formatLon(result.lon1)}`,
      `到着地 ${formatLat(result.lat2)}  ${formatLon(result.lon2)}`,
      `D.Long = ${formatDirectedDMS(result.dLon, 'E', 'W')}`,
    ]}
  />
  <Step
    title="2. 大圏距離"
    lines={[
      'cos D = sin l1 sin l2 + cos l1 cos l2 cos D.Long',
      `D = ${D.toFixed(4)}° → ${result.distance.toFixed(1)}'`,
    ]}
  />
  <Step
    title="3. 初針路・終針路"
    lines={[
      'tan C = sin D.Long / (cos l1 tan l2 − sin l1 cos D.Long)',
      `初針路 ${formatBearing(result.course)}（${toQuadrantBearing(result.course)}）`,
      `終針路 ${formatBearing(result.finalCourse)}（${toQuadrantBearing(result.finalCourse)}）`,
    ]}
  />
  {#if result.vertex}
    <Step
      title="4. 頂点"
      lines={[
        'cos lv = cos l1 sin C',
        `頂点 ${formatLat(result.vertex.lat)}  ${formatLon(result.vertex.lon)}`,
      ]}
    />
  {/if}
  <Highlight
    items={[
      {
        label: '大圏距離',
        value: `${result.distance.toFixed(1)}'`,
        unit: '海里',
      },
      { label: '初針路', value: formatBearing(result.course) },
      { label: '終針路', value: formatBearing(result.finalCourse) },
    ]}
  />
</Sheet>
