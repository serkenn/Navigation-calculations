<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import InfoGrid from '#lib/components/shared/InfoGrid.svelte';
  import ResultRows from '#lib/components/shared/ResultRows.svelte';
  import Step from '#lib/components/shared/Step.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import Note from '#lib/components/shared/Note.svelte';
  import CelestialFixPlot from './CelestialFixPlot.svelte';
  import {
    formatDMS,
    formatLat,
    formatLon,
    formatBearing,
    formatDirected,
    formatClockSeconds,
    formatDuration,
  } from '#lib/utils/navigationMath.js';
  import type { ReducedSight } from '#lib/utils/exam2nNavigation.js';

  let { result }: { result: any } = $props();

  /** 符号付きの度分（S・W を負として式に代入する形） */
  const signedDMS = (v: number) =>
    `${v < 0 ? '−' : ''}${formatDMS(Math.abs(v))}`;
  const signedMin = (v: number) =>
    `${v >= 0 ? '+' : '−'} ${Math.abs(v).toFixed(1)}'`;

  function steps(s: ReducedSight) {
    const l = signedDMS(result.drLat);
    const d = signedDMS(s.dec);
    const h = formatDMS(s.lha);
    const ac = formatDMS(s.hc);
    return {
      hourAngle: [
        `hG      ${formatDMS(s.gha)}`,
        `L       ${formatDMS(Math.abs(result.drLon))} (${result.drLon >= 0 ? '+' : '−'}  ← ${result.drLon >= 0 ? '東経なので +' : '西経なので −'}`,
        `h       ${h}`,
      ],
      altitude: [
        'ac = sin⁻¹(sin d・sin l + cos d・cos l・cos h)',
        `   = sin⁻¹(sin ${d}・sin ${l}`,
        `       + cos ${d}・cos ${l}・cos ${h})`,
        `   = ${ac}`,
      ],
      azimuth: [
        'Z = cos⁻¹{(sin d − sin l・sin ac) / (cos l・cos ac)}',
        `  = cos⁻¹{(sin ${d} − sin ${l}・sin ${ac})`,
        `       / (cos ${l}・cos ${ac})}`,
        `  = ${s.zHalf.toFixed(1)}°`,
        `h が 180° より${s.side === 'E' ? '大きい' : '小さい'}ので Z の符号は ${s.side}`,
        `Z = ${s.zHalf.toFixed(1)}° ${s.side}（真方位 ${formatBearing(s.azimuth)}）`,
      ],
      intercept: [
        { label: '測高度 as', value: formatDMS(s.hs) },
        { label: '高度改正値 Corr.', value: signedMin(s.corr) },
        { label: '真高度 at', value: formatDMS(s.ht) },
        { label: '計算高度 ac', value: ac },
        {
          label: `修正差 I（${s.intercept >= 0 ? '天体方向' : '天体と反対方向'}）`,
          value: signedMin(s.intercept),
          bold: true,
        },
      ],
    };
  }

  const sights = $derived(
    [result.first, result.second].map((s: ReducedSight) => ({
      s,
      ...steps(s),
    })),
  );
  const circled = ['①', '②'];
</script>

<div class="fix-sheet space-y-8">
  <Sheet title="Celestial Fix — 2 Bodies">
    <InfoGrid
      items={[
        {
          label: '推測位置 DR',
          lines: [formatLat(result.drLat), formatLon(result.drLon)],
        },
        {
          label: '針路・速力',
          lines: [formatBearing(result.course), `${result.speed} kn`],
        },
      ]}
    />
    <Note
      >推測緯度を l、推測経度を L、地方時角を h とし、d・l は N を正・S
      を負として代入する。</Note
    >
  </Sheet>

  <div class="fix-pair space-y-8">
    {#each sights as { s, hourAngle, altitude, azimuth, intercept }, i (i)}
      <Sheet
        title="{circled[i]} {s.name} の位置の線（{formatClockSeconds(
          s.time,
        )} U.T.）"
      >
        <Step title="地方時角 h" lines={hourAngle} />
        <Step title="計算高度 ac" lines={altitude} />
        <Step title="方位角 Z" lines={azimuth} />
        <ResultRows rows={intercept} />
      </Sheet>
    {/each}
  </div>

  <Sheet title="③ 船位の決定">
    <div class="fix-final space-y-4">
      <div class="space-y-4">
        <ResultRows
          rows={[
            {
              label: '観測時間差',
              value: formatDuration(result.interval),
            },
            {
              label: `進出距離 ${result.speed} kn × 時間差`,
              value: `${result.run.toFixed(1)}'`,
            },
            {
              label: `${result.first.name} の位置の線を針路 ${formatBearing(result.course)} へ転位`,
              value: '',
              muted: true,
            },
            {
              label: `転位後の修正差（参考）`,
              value: signedMin(result.transferredIntercept),
              muted: true,
            },
            {
              label: '位置の線の交角',
              value: `${result.cutAngle.toFixed(1)}°`,
              muted: true,
            },
          ]}
        />
        <ResultRows
          rows={[
            { label: 'DR. lat', value: formatLat(result.drLat) },
            {
              label: 'd. lat',
              value: formatDirected(result.dLat, "N'ly", "S'ly"),
            },
            { label: 'Obs. lat', value: formatLat(result.lat), bold: true },
            { label: 'DR. Lon', value: formatLon(result.drLon) },
            {
              label: 'D. Lon',
              value: formatDirected(result.dLon, "E'ly", "W'ly"),
            },
            { label: 'Obs. Lon', value: formatLon(result.lon), bold: true },
          ]}
        />
        <Highlight
          items={[
            { label: '後測時の船位 Obs. lat', value: formatLat(result.lat) },
            { label: 'Obs. Lon', value: formatLon(result.lon) },
          ]}
        />
      </div>
      <CelestialFixPlot {result} />
    </div>
    <Note>
      先測天体の位置の線を観測時間差の航走分だけ転位し、推測位置を中心とした平面近似（天測位置決定用図と同じ考え方）で交点を求めています。
      作図による解答とは 0.1' 程度の差が出ることがあります。
    </Note>
  </Sheet>
</div>
