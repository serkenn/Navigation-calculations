<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import InfoGrid from '$lib/components/shared/InfoGrid.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';
  import { formatBearing } from '$lib/utils/navigationMath';

  let { result }: { result: any } = $props();
</script>

<Sheet title="Set and Drift">
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
        label: '実航 Made Good',
        lines: [
          `CMG ${formatBearing(result.cmg)}`,
          `SMG ${result.smg.toFixed(1)} kn`,
        ],
      },
    ]}
  />
  <Highlight
    items={[
      { label: '流向 Set', value: formatBearing(result.setDir) },
      { label: '流速 Drift', value: result.drift.toFixed(1), unit: 'kn' },
    ]}
  />
</Sheet>
