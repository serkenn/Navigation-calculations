<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import InfoGrid from '$lib/components/shared/InfoGrid.svelte';
  import ResultRows from '$lib/components/shared/ResultRows.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';
  import Note from '$lib/components/shared/Note.svelte';
  import {
    formatLat,
    formatLon,
    formatDirectedDMS,
    formatBearing,
  } from '$lib/utils/navigationMath';

  let { result }: { result: any } = $props();

  const rows = $derived([
    { label: '変経 D.Long', value: formatDirectedDMS(result.dLon, 'E', 'W') },
    { label: '終針路 Final Course', value: formatBearing(result.finalCourse) },
    ...(result.vertex
      ? [
          { label: '頂点緯度 Vertex Lat', value: formatLat(result.vertex.lat) },
          {
            label: '頂点経度 Vertex Long',
            value: formatLon(result.vertex.lon),
          },
        ]
      : []),
  ]);
</script>

<Sheet title="Great Circle Sailing">
  <InfoGrid
    items={[
      {
        label: 'From',
        lines: [formatLat(result.lat1), formatLon(result.lon1)],
      },
      { label: 'To', lines: [formatLat(result.lat2), formatLon(result.lon2)] },
    ]}
  />
  <ResultRows {rows} />
  <Highlight
    items={[
      {
        label: '大圏距離 Distance',
        value: `${result.distance.toFixed(1)}'`,
        unit: '海里 (NM)',
      },
      { label: '初針路 Initial Course', value: formatBearing(result.course) },
    ]}
  />
  {#if result.vertex && !result.vertex.onRoute}
    <Note
      >頂点は出発点と到着点の間にはありません（航路の延長上にあります）。</Note
    >
  {/if}
</Sheet>
