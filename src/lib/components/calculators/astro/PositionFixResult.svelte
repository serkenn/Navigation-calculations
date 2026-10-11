<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import InfoGrid from '$lib/components/shared/InfoGrid.svelte';
  import ResultRows from '$lib/components/shared/ResultRows.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';
  import {
    formatLat,
    formatLon,
    formatBearing,
    formatDirected,
  } from '$lib/utils/navigationMath';

  let { result }: { result: any } = $props();

  const lopLine = (l: { a: number; z: number }) =>
    `${Math.abs(l.a).toFixed(1)}' ${l.a >= 0 ? 'T' : 'A'}  Zn ${formatBearing(l.z)}`;
</script>

<Sheet title="Position Fix">
  <InfoGrid
    items={[
      {
        label: '推測位置 DR',
        lines: [formatLat(result.drLat), formatLon(result.drLon)],
      },
      { label: '位置の線 LOP', lines: result.lops.map(lopLine) },
    ]}
  />
  <ResultRows
    rows={[
      { label: '変緯 D.Lat', value: formatDirected(result.dLat, 'N', 'S') },
      { label: '東西距 Dep', value: formatDirected(result.dep, 'E', 'W') },
    ]}
  />
  <Highlight
    items={[
      { label: '船位 緯度', value: formatLat(result.lat) },
      { label: '船位 経度', value: formatLon(result.lon) },
    ]}
  />
</Sheet>
