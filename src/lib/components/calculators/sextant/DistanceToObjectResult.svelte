<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import ResultRows from '#lib/components/shared/ResultRows.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import { formatDMS } from '#lib/utils/navigationMath.js';

  let { result }: { result: any } = $props();
</script>

{#if result.mode === 'vertical'}
  <Sheet title="Distance by Vertical Angle">
    <ResultRows
      rows={[
        { label: '垂直角 α', value: formatDMS(result.angle) },
        { label: '物標の高さ H', value: `${result.height} m` },
        {
          label: 'D = H / tan α',
          value: `${result.distanceM.toFixed(0)} m`,
          muted: true,
        },
      ]}
    />
    <Highlight
      items={[
        {
          label: '距離 Distance',
          value: result.distanceNM.toFixed(2),
          unit: '海里 (NM)',
        },
        {
          label: '（メートル）',
          value: result.distanceM.toFixed(0),
          unit: 'm',
        },
      ]}
    />
  </Sheet>
{:else}
  <Sheet title="Geographical Range">
    <ResultRows
      rows={[
        {
          label: `2.083 √H (灯高 ${result.height} m)`,
          value: `${result.lightPart.toFixed(2)} NM`,
        },
        {
          label: `2.083 √h (眼高 ${result.heightOfEye} m)`,
          value: `${result.eyePart.toFixed(2)} NM`,
        },
      ]}
    />
    <Highlight
      items={[
        {
          label: '光達距離 Range',
          value: result.range.toFixed(1),
          unit: '海里 (NM)',
        },
      ]}
    />
  </Sheet>
{/if}
