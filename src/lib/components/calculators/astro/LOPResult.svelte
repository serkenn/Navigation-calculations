<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import InfoGrid from '#lib/components/shared/InfoGrid.svelte';
  import ResultRows from '#lib/components/shared/ResultRows.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import {
    formatDMS,
    formatLat,
    formatLon,
    formatBearing,
  } from '#lib/utils/navigationMath.js';

  let { result }: { result: any } = $props();

  const toward = $derived(result.intercept >= 0);
</script>

<Sheet title="Line of Position">
  <InfoGrid
    items={[
      {
        label: '推測位置 DR',
        lines: [formatLat(result.lat), formatLon(result.lon)],
      },
      {
        label: '天測暦',
        lines: [`GHA ${formatDMS(result.gha)}`, `Dec ${formatLat(result.dec)}`],
      },
    ]}
  />
  <ResultRows
    rows={[
      { label: '地方時角 LHA = GHA + λ', value: formatDMS(result.lha) },
      { label: '真高度 Ho', value: formatDMS(result.ho) },
      { label: '計算高度 Hc', value: formatDMS(result.hc) },
      {
        label: 'sin Hc = sin L sin d + cos L cos d cos LHA',
        value: '',
        muted: true,
      },
    ]}
  />
  <Highlight
    items={[
      {
        label: '修正差 Intercept',
        value: `${Math.abs(result.intercept).toFixed(1)}'`,
        sub: toward ? 'Toward（天体に向かう）' : 'Away（天体から離れる）',
      },
      { label: '方位角 Zn', value: formatBearing(result.z) },
    ]}
  />
</Sheet>
