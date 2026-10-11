<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import InfoGrid from '#lib/components/shared/InfoGrid.svelte';
  import ResultRows from '#lib/components/shared/ResultRows.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import {
    formatLat,
    formatLon,
    formatDirected,
    formatBearing,
  } from '#lib/utils/navigationMath.js';
  import { meridionalParts } from '#lib/utils/mercatorSailing.js';

  let { result }: { result: any } = $props();

  const isMercator = $derived(result.method === 'mercator');

  const rows = $derived([
    { label: '変緯 D.Lat', value: formatDirected(result.dLat * 60, 'N', 'S') },
    { label: '東西距 Dep', value: formatDirected(result.dep, 'E', 'W') },
    isMercator
      ? {
          label: '漸長緯度差 DMP',
          value: `${(meridionalParts(result.lat2) - meridionalParts(result.lat1)).toFixed(1)}'`,
        }
      : { label: '中分緯度 Mid.Lat', value: formatLat(result.midLat) },
    { label: '変経 D.Long', value: formatDirected(result.dLon * 60, 'E', 'W') },
  ]);
</script>

<Sheet title={isMercator ? 'Mercator Sailing' : 'Middle Latitude Sailing'}>
  <InfoGrid
    items={[
      {
        label: '出発点',
        lines: [formatLat(result.lat1), formatLon(result.lon1)],
      },
      {
        label: '針路・航程',
        lines: [formatBearing(result.course), `${result.distance} NM`],
      },
    ]}
  />
  <ResultRows {rows} />
  <Highlight
    items={[
      { label: '到着点 緯度', value: formatLat(result.lat2) },
      { label: '到着点 経度', value: formatLon(result.lon2) },
    ]}
  />
</Sheet>
