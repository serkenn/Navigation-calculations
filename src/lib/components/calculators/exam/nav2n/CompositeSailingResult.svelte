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
    formatBearing,
    normalize180,
  } from '#lib/utils/navigationMath.js';

  let { result }: { result: any } = $props();

  const abs = (v: number) => formatDMS(Math.abs(v));
  const nm = (v: number) => `${v.toFixed(1)}'`;
  const east = $derived(result.dLon >= 0);
  const dir = $derived(east ? 'E' : 'W');
  const opposite = $derived(east ? 'W' : 'E');
  /** 経度に方向付きの変経を加える式（例: 141° 00.0' E + 44° 08.1' E = 174° 51.9' W） */
  const sumLon = (base: number, dLo: number, sign: 'E' | 'W') =>
    `${formatLon(base)} + ${abs(dLo)} ${sign} = ${formatLon(
      normalize180(base + (sign === 'E' ? dLo : -dLo)),
    )}`;
</script>

<Sheet title="Composite Sailing">
  <InfoGrid
    items={[
      {
        label: 'A 地点 (l1, L1)',
        lines: [formatLat(result.lat1), formatLon(result.lon1)],
      },
      {
        label: 'B 地点 (l2, L2)',
        lines: [formatLat(result.lat2), formatLon(result.lon2)],
      },
    ]}
  />
  {#if result.isComposite}
    <Step
      title="1. 頂点 V1・V2 の経度"
      lines={[
        `制限緯度 lv = ${formatLat(result.limitLat)}`,
        'cos L1 = tan l1 / tan lv',
        `       = tan ${abs(result.lat1)} / tan ${abs(result.limitLat)}`,
        `L1 = ${abs(result.dLo1)} ${dir}（${east ? '東' : '西'}に向けて航走するので ${dir}）`,
        `V1 = ${sumLon(result.lon1, result.dLo1, dir)}`,
        'cos L2 = tan l2 / tan lv',
        `       = tan ${abs(result.lat2)} / tan ${abs(result.limitLat)}`,
        `L2 = ${abs(result.dLo2)} ${opposite}（到着点からは反対の ${opposite}）`,
        `V2 = ${sumLon(result.lon2, result.dLo2, opposite)}`,
      ]}
    />
    <Step
      title="2. 大圏距離 AV1・BV2"
      lines={[
        'cos AV1 = sin l1 / sin lv',
        `        = sin ${abs(result.lat1)} / sin ${abs(result.limitLat)}`,
        `AV1 = ${formatDMS(result.gcDist1 / 60)} = ${nm(result.gcDist1)}`,
        'cos BV2 = sin l2 / sin lv',
        `        = sin ${abs(result.lat2)} / sin ${abs(result.limitLat)}`,
        `BV2 = ${formatDMS(result.gcDist2 / 60)} = ${nm(result.gcDist2)}`,
      ]}
    />
    <Step
      title="3. 距等圏 V1V2（距等圏航法）"
      lines={[
        'V1V2 = L3 × cos lv（L3: V1V2 間の変経）',
        `L3 = ${abs(result.parallelDLo)} = ${(result.parallelDLo * 60).toFixed(1)}'`,
        `V1V2 = ${(result.parallelDLo * 60).toFixed(1)} × cos ${abs(result.limitLat)} = ${nm(result.parallelDist)}`,
      ]}
    />
    <Step
      title="4. 集成大圏距離"
      lines={[
        'AV1V2B = AV1 + BV2 + V1V2',
        `       = ${nm(result.gcDist1)} + ${nm(result.gcDist2)} + ${nm(result.parallelDist)}`,
        `       = ${nm(result.totalDistance)}`,
      ]}
    />
    <Highlight
      items={[
        { label: 'V1 の経度', value: formatLon(result.lonV1) },
        { label: 'V2 の経度', value: formatLon(result.lonV2) },
        {
          label: '集成大圏航路の距離',
          value: nm(result.totalDistance),
          unit: '海里',
        },
      ]}
    />
    <Step
      title="（参考）出発針路と通常の大圏距離"
      lines={[
        'sin C1 = cos lv / cos l1',
        `出発針路 ${formatBearing(result.initialCourse)}`,
        `通常の大圏距離 ${nm(result.distance)}（頂点 ${formatLat(result.vertex.lat)}）`,
      ]}
    />
  {:else}
    <Step
      title="大圏の頂点"
      lines={[
        `頂点の緯度 ${result.vertex ? formatLat(result.vertex.lat) : '—'}`,
        `制限緯度 ${formatLat(result.limitLat)}`,
      ]}
    />
    <Highlight
      items={[
        { label: '大圏距離', value: nm(result.distance), unit: '海里' },
        { label: '出発針路', value: formatBearing(result.course) },
      ]}
    />
    <Note>
      大圏の頂点が制限緯度を超えないため、集成大圏航法は不要です。通常の大圏航法で航行できます。
    </Note>
  {/if}
</Sheet>
