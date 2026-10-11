<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import Step from '#lib/components/shared/Step.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import Note from '#lib/components/shared/Note.svelte';
  import {
    formatLat,
    formatLon,
    formatBearing,
  } from '#lib/utils/navigationMath.js';

  let { result }: { result: any } = $props();
</script>

<Sheet title="Cross Bearing Fix">
  <Step
    title="1. 物標と方位"
    lines={[
      `A ${formatLat(result.aLat)} ${formatLon(result.aLon)}  方位 ${formatBearing(result.bearingA)}`,
      `B ${formatLat(result.bLat)} ${formatLon(result.bLon)}  方位 ${formatBearing(result.bearingB)}`,
      `交角 ${result.cutAngle.toFixed(1)}°`,
    ]}
  />
  <Step
    title="2. 各物標までの距離（方位線の交点から）"
    lines={[
      `A まで ${result.distA.toFixed(2)}'　B まで ${result.distB.toFixed(2)}'`,
    ]}
  />
  <Highlight
    items={[
      { label: '船位 緯度', value: formatLat(result.lat) },
      { label: '船位 経度', value: formatLon(result.lon) },
    ]}
  />
  {#if result.cutAngle < 30 || result.cutAngle > 150}
    <Note tone="warn"
      >交角が 30° 未満（150° 超）なので、船位の精度は低くなります。</Note
    >
  {/if}
  <Note>物標付近の狭い範囲なので、平面（中分緯度）近似で計算しています。</Note>
</Sheet>
