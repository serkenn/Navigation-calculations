<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import InfoGrid from '$lib/components/shared/InfoGrid.svelte';
  import ResultRows from '$lib/components/shared/ResultRows.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';
  import Note from '$lib/components/shared/Note.svelte';
  import {
    formatLat,
    formatLon,
    formatBearing,
  } from '$lib/utils/navigationMath';

  let { result }: { result: any } = $props();

  const nm = (v: number) => `${v.toFixed(1)}'`;

  const rows = $derived(
    result.isComposite
      ? [
          { label: '大圏区間 1', value: nm(result.gcDist1) },
          { label: '変針点 V1 経度', value: formatLon(result.lonV1) },
          { label: '平行圏区間', value: nm(result.parallelDist) },
          { label: '変針点 V2 経度', value: formatLon(result.lonV2) },
          { label: '大圏区間 2', value: nm(result.gcDist2) },
          {
            label: '（参考）通常の大圏距離',
            value: nm(result.distance),
            muted: true,
          },
        ]
      : [
          {
            label: '大圏の頂点緯度',
            value: result.vertex ? formatLat(result.vertex.lat) : '—',
          },
        ],
  );
</script>

<Sheet title="Composite Sailing">
  <InfoGrid
    items={[
      {
        label: 'From',
        lines: [formatLat(result.lat1), formatLon(result.lon1)],
      },
      { label: 'To', lines: [formatLat(result.lat2), formatLon(result.lon2)] },
    ]}
  />
  <ResultRows
    rows={[
      { label: '制限緯度 Limiting Lat', value: formatLat(result.limitLat) },
      ...rows,
    ]}
  />
  <Highlight
    items={[
      {
        label: '総航程 Total Distance',
        value: nm(result.totalDistance),
        unit: '海里 (NM)',
      },
      {
        label: '初針路 Initial Course',
        value: formatBearing(result.initialCourse),
      },
    ]}
  />
  {#if result.error}
    <Note tone="warn"
      >{result.error}。通常の大圏航法の結果を表示しています。</Note
    >
  {:else if !result.isComposite}
    <Note
      >大圏の頂点が制限緯度を超えないため、通常の大圏航法で航行できます。</Note
    >
  {/if}
</Sheet>
