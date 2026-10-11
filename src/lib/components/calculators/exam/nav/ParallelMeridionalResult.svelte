<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import Step from '#lib/components/shared/Step.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import {
    formatLat,
    formatLon,
    formatDirected,
  } from '#lib/utils/navigationMath.js';

  let { result }: { result: any } = $props();
</script>

{#if result.mode === 'parallel'}
  <Sheet title="Parallel Sailing">
    <Step
      title="1. 変経"
      lines={[
        `λ1 = ${formatLon(result.lon1)}　λ2 = ${formatLon(result.lon2)}`,
        `D.Long = ${formatDirected(result.dLonMin, 'E', 'W')}`,
      ]}
    />
    <Step
      title="2. 東西距 = 変経 × cos L"
      lines={[
        `L = ${formatLat(result.lat)}　cos L = ${result.cosL.toFixed(4)}`,
        `Dep = ${Math.abs(result.dLonMin).toFixed(1)}' × ${result.cosL.toFixed(4)} = ${Math.abs(result.departure).toFixed(1)}'`,
      ]}
    />
    <Highlight
      items={[
        {
          label: '航程 Distance',
          value: `${Math.abs(result.departure).toFixed(1)}'`,
          unit: '海里',
        },
        { label: '針路 Course', value: result.dLonMin >= 0 ? '090°' : '270°' },
      ]}
    />
  </Sheet>
{:else}
  <Sheet title="Meridian Sailing">
    <Step
      title="1. 変緯 = 航程"
      lines={[
        `l1 = ${formatLat(result.lat)}　l2 = ${formatLat(result.lat2)}`,
        `D.Lat = ${formatDirected(result.dLatMin, 'N', 'S')}`,
      ]}
    />
    <Highlight
      items={[
        {
          label: '航程 Distance',
          value: `${result.distance.toFixed(1)}'`,
          unit: '海里',
        },
        { label: '針路 Course', value: result.dLatMin >= 0 ? '000°' : '180°' },
      ]}
    />
  </Sheet>
{/if}
