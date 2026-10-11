<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import InfoGrid from '#lib/components/shared/InfoGrid.svelte';
  import ResultRows from '#lib/components/shared/ResultRows.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import Note from '#lib/components/shared/Note.svelte';
  import {
    formatLat,
    formatLon,
    formatDirected,
    formatBearing,
    toQuadrantBearing,
  } from '#lib/utils/navigationMath.js';

  let { result }: { result: any } = $props();

  const isMercator = $derived(result.method === 'mercator');

  const rows = $derived([
    { label: '変緯 D.Lat', value: formatDirected(result.dLat, 'N', 'S') },
    { label: '変経 D.Long', value: formatDirected(result.dLon, 'E', 'W') },
    ...(isMercator
      ? [{ label: '漸長緯度差 DMP', value: `${result.dmp.toFixed(1)}'` }]
      : [
          { label: '中分緯度 Mid.Lat', value: formatLat(result.midLat) },
          { label: '東西距 Dep', value: formatDirected(result.dep, 'E', 'W') },
          ...(result.cosValue
            ? [
                {
                  label: `cos ${result.midLat.toFixed(1)}°`,
                  value: result.cosValue.toFixed(5),
                  muted: true,
                },
              ]
            : []),
        ]),
  ]);
</script>

<Sheet title={isMercator ? 'Mercator Sailing' : 'Middle Latitude Sailing'}>
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
        label: '針路 Course',
        value: formatBearing(result.course),
        sub: toQuadrantBearing(result.course),
      },
      {
        label: '航程 Distance',
        value: `${result.distance.toFixed(1)}'`,
        unit: '海里 (NM)',
      },
    ]}
  />
  {#if result.precision === 'manual' && !isMercator}
    <Note>
      手計算相当モード: 変緯・変経・中分緯度・東西距・針路を小数第 1
      位に丸めながら計算しています。
    </Note>
  {:else if isMercator}
    <Note>漸長緯度は WGS84 楕円体の式で計算しています。</Note>
  {/if}
</Sheet>
