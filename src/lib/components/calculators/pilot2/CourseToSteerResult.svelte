<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import InfoGrid from '$lib/components/shared/InfoGrid.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';
  import { formatBearing } from '$lib/utils/navigationMath';

  let { result }: { result: any } = $props();
</script>

<Sheet title="Course and Speed to Make Good">
  <InfoGrid
    items={[
      {
        label: '目標 Required',
        lines: [
          `CMG ${formatBearing(result.cmg)}`,
          `SMG ${result.smg.toFixed(1)} kn`,
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
      {
        label: '対水速力 Speed',
        value: result.shipSpeed.toFixed(1),
        unit: 'kn',
      },
    ]}
  />
</Sheet>
