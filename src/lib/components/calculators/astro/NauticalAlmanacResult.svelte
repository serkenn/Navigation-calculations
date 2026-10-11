<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import ResultRows from '#lib/components/shared/ResultRows.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import Note from '#lib/components/shared/Note.svelte';
  import {
    formatDMS,
    formatLat,
    formatClockSeconds,
  } from '#lib/utils/navigationMath.js';

  let { result }: { result: any } = $props();
</script>

<Sheet title="Nautical Almanac — Sun">
  <ResultRows
    rows={[
      {
        label: '日時',
        value: `${result.date} ${formatClockSeconds(result.ut)} UT`,
      },
      {
        label: '均時差 Eq. of Time',
        value: `${result.eqTime >= 0 ? '+' : '−'}${Math.abs(result.eqTime).toFixed(2)} 分`,
      },
      { label: '赤経 RA', value: formatDMS(result.ra) },
      { label: '春分点のグリニッジ時角 GHA ♈', value: formatDMS(result.gmst) },
    ]}
  />
  <Highlight
    items={[
      { label: '太陽 GHA', value: formatDMS(result.gha) },
      { label: '太陽 赤緯 Dec', value: formatLat(result.dec) },
    ]}
  />
  <Note>簡易暦（Meeus の略算式）による概算で、誤差はおおむね 1′ 以内です。</Note
  >
</Sheet>
