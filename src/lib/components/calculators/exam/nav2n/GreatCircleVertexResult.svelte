<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import InfoGrid from '#lib/components/shared/InfoGrid.svelte';
  import Step from '#lib/components/shared/Step.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import Note from '#lib/components/shared/Note.svelte';
  import {
    formatDMS,
    formatLat,
    formatLon,
    formatDirectedDMS,
    formatBearing,
    toQuadrantBearing,
    normalize180,
  } from '#lib/utils/navigationMath.js';

  let { result }: { result: any } = $props();

  /** 符号付きの度分（S・W を負として式に代入する形） */
  const signed = (v: number) => `${v < 0 ? '−' : ''}${formatDMS(Math.abs(v))}`;
  const D = $derived(result.distance / 60);
  const vertexDLon = $derived(normalize180(result.vertex.lon - result.lon1));
</script>

<Sheet title="Great Circle Sailing">
  <InfoGrid
    items={[
      {
        label: 'A 地点',
        lines: [formatLat(result.lat1), formatLon(result.lon1)],
      },
      {
        label: 'B 地点',
        lines: [formatLat(result.lat2), formatLon(result.lon2)],
      },
    ]}
  />
  <Step
    title="1. 変経 D.Long"
    lines={[
      `L2 − L1 = ${formatDirectedDMS(result.dLon, 'E', 'W')}（${result.dLon >= 0 ? '東' : '西'}回り）`,
    ]}
  />
  <Step
    title="2. 大圏距離 D"
    lines={[
      'cos D = sin l1・sin l2 + cos l1・cos l2・cos D.Long',
      `      = sin ${signed(result.lat1)}・sin ${signed(result.lat2)}`,
      `        + cos ${signed(result.lat1)}・cos ${signed(result.lat2)}・cos ${formatDMS(Math.abs(result.dLon))}`,
      `D = ${D.toFixed(4)}° = ${result.distance.toFixed(1)}'`,
    ]}
  />
  <Step
    title="3. 出発針路・到着針路"
    lines={[
      'tan C = sin D.Long / (cos l1・tan l2 − sin l1・cos D.Long)',
      `出発針路 ${formatBearing(result.course)}（${toQuadrantBearing(result.course)}）`,
      `到着針路 ${formatBearing(result.finalCourse)}（${toQuadrantBearing(result.finalCourse)}）`,
    ]}
  />
  <Step
    title="4. 頂点 V の位置"
    lines={[
      'cos lv = cos l1・sin C1',
      `       = cos ${signed(result.lat1)}・sin ${formatBearing(result.course)}`,
      `lv = ${formatLat(result.vertex.lat)}`,
      'cos DLov = tan l1 / tan lv',
      `DLov = ${formatDirectedDMS(vertexDLon, 'E', 'W')}（A 地点から頂点までの変経）`,
      `Lv = ${formatLon(result.lon1)} ${vertexDLon >= 0 ? '+' : '−'} ${formatDMS(Math.abs(vertexDLon))} = ${formatLon(result.vertex.lon)}`,
    ]}
  />
  {#if result.crossing}
    <Step
      title="5. 指定子午線と大圏との交点の緯度"
      lines={[
        'tan l = tan lv・cos(L − Lv)',
        `L − Lv = ${formatDirectedDMS(result.crossing.dLon, 'E', 'W')}`,
        `tan l = tan ${formatDMS(Math.abs(result.vertex.lat))}・cos ${formatDMS(Math.abs(result.crossing.dLon))}`,
        `l = ${formatLat(result.crossing.lat)}（${formatLon(result.crossing.lon)} の子午線上）`,
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
      { label: '出発針路', value: formatBearing(result.course) },
      { label: '到着針路', value: formatBearing(result.finalCourse) },
    ]}
  />
  <Highlight
    items={[
      { label: '頂点の緯度', value: formatLat(result.vertex.lat) },
      { label: '頂点の経度', value: formatLon(result.vertex.lon) },
      ...(result.crossing
        ? [
            {
              label: `${formatLon(result.crossing.lon)} との交点`,
              value: formatLat(result.crossing.lat),
            },
          ]
        : []),
    ]}
  />
  {#if !result.vertex.onRoute}
    <Note tone="warn">
      頂点は A 地点と B
      地点の間にはなく、航路を延長した大圏上にあります（航路上の最高緯度は出発点か到着点）。
    </Note>
  {/if}
</Sheet>
