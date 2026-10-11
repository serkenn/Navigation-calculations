<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import Step from '$lib/components/shared/Step.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';
  import {
    formatDMS,
    formatLat,
    formatLon,
    formatDirected,
    formatBearing,
    formatClockSeconds,
  } from '$lib/utils/navigationMath';
  import { formatHMS } from '$lib/utils/timeConversion';

  let { result }: { result: any } = $props();

  const r = $derived(result);
  const signedMin = (v: number) =>
    `(${v >= 0 ? '+' : '−'}) ${Math.abs(v).toFixed(1)}'`;
  const longTime = $derived(
    `(${r.run.lon2 >= 0 ? '−' : '+'}) ${formatHMS(Math.abs(r.run.lon2) / 15, 0)}`,
  );
</script>

<Sheet title="1. 午前の位置の線 (Morning Sight)">
  <Step
    title="真高度"
    lines={[
      `Ho = ${formatDMS(r.hs1)} ${signedMin(r.corr1)} = ${formatDMS(r.ho1)}`,
    ]}
  />
  <Step
    title="地方時角"
    lines={[
      `LHA = GHA + λ = ${formatDMS(r.gha1)} + ${formatLon(r.lon1)}`,
      `= ${formatDMS(r.lha1)}`,
    ]}
  />
  <Step
    title="計算高度・方位角"
    lines={[
      `l = ${formatLat(r.lat1)}　d = ${formatLat(r.dec1)}`,
      `Hc = ${formatDMS(r.hc1)}　Zn = ${formatBearing(r.z1)}`,
      `修正差 a = Ho − Hc = ${Math.abs(r.a1).toFixed(1)}' ${r.a1 >= 0 ? 'Toward' : 'Away'}`,
    ]}
  />
</Sheet>

<Sheet title="2. 正午の推測位置 (D.R. at Noon)">
  <Step
    title="中分緯度航法"
    lines={[
      `針路 ${formatBearing(r.course)}　航程 ${r.distance}'`,
      `D.Lat = ${formatDirected(r.run.dLatMin, 'N', 'S')}　Dep = ${formatDirected(r.run.dep, 'E', 'W')}`,
      `Mid.Lat = ${formatLat(r.run.midLat)}　D.Long = ${formatDirected(r.run.dLonMin, 'E', 'W')}`,
    ]}
  />
  <Highlight
    items={[
      { label: '正午推測緯度', value: formatLat(r.run.lat2) },
      { label: '正午推測経度', value: formatLon(r.run.lon2) },
    ]}
  />
</Sheet>

<Sheet title="3. 正中時刻 (Meridian Passage)">
  <Step
    title="視正午 → 地方平時 → 世界時 → 標準時"
    lines={[
      `L.A.T. 12-00-00　Eq. of T. (${r.eqt >= 0 ? '−' : '+'}) ${formatHMS(Math.abs(r.eqt), 0)}`,
      `L.M.T. ${formatClockSeconds(r.lmt)}　Long in Time ${longTime}`,
      `U.T. ${formatClockSeconds(r.ut)}　Zone (${r.zoneMeridian >= 0 ? '+' : '−'}) ${formatHMS(Math.abs(r.zoneMeridian) / 15, 0)}`,
    ]}
  />
  <Highlight
    items={[{ label: '正中時 Z.T.', value: formatClockSeconds(r.zt) }]}
  />
</Sheet>

<Sheet title="4. 正午緯度 (Latitude by Meridian Altitude)">
  <Step
    title="子午線高度緯度法"
    lines={[
      `Ho = ${formatDMS(r.hs2)} ${signedMin(r.corr2)} = ${formatDMS(r.ho2)}`,
      `z = 90° − Ho = ${formatDMS(r.zenith)}（太陽は ${r.bearing === 'S' ? '南' : '北'}）`,
      `l = d ${r.bearing === 'S' ? '+' : '−'} z = ${formatLat(r.dec2)} ${r.bearing === 'S' ? '+' : '−'} ${formatDMS(r.zenith)} = ${formatLat(r.noonLat)}`,
    ]}
  />
</Sheet>

<Sheet title="5. 経度の改正 (Meripass)">
  <Step
    title="午前の位置の線を正午へ転位し、正午緯度との交点を求める"
    lines={[
      `ΔL = 正午緯度 − 推測緯度 = ${formatDirected(r.deltaLat, 'N', 'S')}`,
      `東西距改正 = a / sin Z − ΔL / tan Z = ${formatDirected(r.depCorr, 'E', 'W')}`,
      `経度改正 = 東西距改正 / cos l = ${formatDirected(r.dLongCorr, 'E', 'W')}`,
    ]}
  />
  <Highlight
    items={[
      { label: '正午位置 緯度', value: formatLat(r.noonLat) },
      { label: '正午位置 経度', value: formatLon(r.noonLon) },
    ]}
  />
</Sheet>
