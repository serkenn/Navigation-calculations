<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import InfoGrid from '$lib/components/shared/InfoGrid.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';
  import { formatBearing } from '$lib/utils/navigationMath';

  let { result }: { result: any } = $props();
</script>

<Sheet title="Course to Steer and Speed Made Good">
  <InfoGrid
    items={[
      {
        label: '条件 Given',
        lines: [
          `CMG ${formatBearing(result.cmg)}`,
          `Speed ${result.shipSpeed.toFixed(1)} kn`,
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
      {
        label: '視針路 Course to Steer',
        value: formatBearing(result.shipCourse),
      },
      { label: '実航速力 SMG', value: result.smg.toFixed(1), unit: 'kn' },
    ]}
  />
</Sheet>
