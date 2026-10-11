<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import ResultRows from '#lib/components/shared/ResultRows.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import Note from '#lib/components/shared/Note.svelte';
  import {
    formatDMS,
    formatLat,
    formatLon,
    formatClockSeconds,
  } from '#lib/utils/navigationMath.js';
  import { formatHMS } from '#lib/utils/timeConversion.js';

  let { result }: { result: any } = $props();

  const signed = (h: number) =>
    `(${h >= 0 ? '−' : '+'}) ${formatHMS(Math.abs(h), 0)}`;
</script>

<Sheet title="Meridian Passage — Sun">
  <ResultRows
    rows={[
      {
        label: '日付 / 経度',
        value: `${result.date}  ${formatLon(result.lon)}`,
      },
      { label: '視正午 L.A.T.', value: '12:00:00' },
      {
        label: '均時差 Eq. of T.',
        value: `(${result.eqTime >= 0 ? '−' : '+'}) ${formatHMS(Math.abs(result.eqTime) / 60, 0)}`,
      },
      { label: '正中時 L.M.T.', value: formatClockSeconds(result.lmt) },
      { label: '経度時 Long in Time', value: signed(result.longitudeTime) },
      { label: '世界時 U.T.', value: formatClockSeconds(result.ut) },
      {
        label: `標準時 Zone (${formatLon(result.zone)})`,
        value: `(${result.zone >= 0 ? '+' : '−'}) ${formatHMS(Math.abs(result.zone / 15), 0)}`,
      },
    ]}
  />
  <Highlight
    items={[
      { label: '正中時 Z.T.', value: formatClockSeconds(result.zt) },
      { label: '正中時の赤緯', value: formatLat(result.dec) },
    ]}
  />
  {#if result.latitude}
    <ResultRows
      rows={[
        { label: '真高度 Ho', value: formatDMS(result.ho) },
        {
          label: '天頂距離 z = 90° − Ho',
          value: formatDMS(result.latitude.zenith),
        },
        {
          label: result.bearing === 'S' ? '緯度 L = d + z' : '緯度 L = d − z',
          value: '',
          muted: true,
        },
      ]}
    />
    <Highlight
      items={[
        { label: '正午緯度 Latitude', value: formatLat(result.latitude.lat) },
      ]}
    />
  {/if}
  <Note
    >赤緯・均時差は簡易暦による概算です。正中時は U.T.
    の値で反復して求めています。</Note
  >
</Sheet>
