<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import InfoGrid from '#lib/components/shared/InfoGrid.svelte';
  import ResultRows from '#lib/components/shared/ResultRows.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import {
    formatBearing,
    formatClock,
    formatDuration,
  } from '#lib/utils/navigationMath.js';

  let { result }: { result: any } = $props();
</script>

<Sheet title="Tidal Stream">
  <InfoGrid
    items={[
      { label: '転流時 Slack', lines: [formatClock(result.slackTime)] },
      {
        label: '最強時 Max',
        lines: [
          `${formatClock(result.maxTime)}  ${result.maxRate.toFixed(1)} kn`,
        ],
      },
    ]}
  />
  <ResultRows
    rows={[
      {
        label: '転流〜最強の間隔 T',
        value: formatDuration(result.interval, false),
      },
      {
        label: '転流時からの経過 t',
        value: formatDuration(result.elapsed, false),
      },
      { label: '90° × t / T', value: `${result.angle.toFixed(1)}°` },
      { label: 'v = Vmax · sin(90° × t / T)', value: '', muted: true },
    ]}
  />
  <Highlight
    items={[
      {
        label: `${formatClock(result.targetTime)} の流速`,
        value: result.rate.toFixed(1),
        unit: 'kn',
      },
      { label: '流向 Direction', value: formatBearing(result.dir) },
    ]}
  />
</Sheet>
