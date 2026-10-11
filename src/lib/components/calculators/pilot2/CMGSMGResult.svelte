<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import InfoGrid from '#lib/components/shared/InfoGrid.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import { formatBearing } from '#lib/utils/navigationMath.js';

  let { result }: { result: any } = $props();
</script>

<Sheet title="Course and Speed Made Good">
  <InfoGrid
    items={[
      {
        label: '船 Ship',
        lines: [
          `Co ${formatBearing(result.shipCourse)}`,
          `Spd ${result.shipSpeed.toFixed(1)} kn`,
        ],
      },
      {
        label: '潮流 Current',
        lines: [
          `Set ${formatBearing(result.setDir)}`,
          `Drift ${result.drift.toFixed(1)} kn`,
        ],
      },
    ]}
  />
  <Highlight
    items={[
      { label: '実航針路 CMG', value: formatBearing(result.cmg) },
      { label: '実航速力 SMG', value: result.smg.toFixed(1), unit: 'kn' },
    ]}
  />
</Sheet>
