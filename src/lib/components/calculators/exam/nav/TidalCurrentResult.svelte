<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import Step from '$lib/components/shared/Step.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';
  import {
    formatBearing,
    formatClock,
    formatDuration,
  } from '$lib/utils/navigationMath';

  let { result }: { result: any } = $props();
</script>

<Sheet title="Tidal Current">
  <Step
    title="1. 転流時〜最強時の間隔と経過時間"
    lines={[
      `T = ${formatClock(result.maxTime)} − ${formatClock(result.slackTime)} = ${formatDuration(result.interval, false)}`,
      `t = ${formatClock(result.targetTime)} − ${formatClock(result.slackTime)} = ${formatDuration(result.elapsed, false)}`,
    ]}
  />
  <Step
    title="2. 流速 v = Vmax × sin(90° × t / T)"
    lines={[
      `90° × t / T = ${result.angle.toFixed(1)}°`,
      `v = ${result.maxRate.toFixed(1)} × sin ${result.angle.toFixed(1)}° = ${result.rate.toFixed(2)} kn`,
    ]}
  />
  <Highlight
    items={[
      { label: '流速', value: result.rate.toFixed(1), unit: 'kn' },
      { label: '流向', value: formatBearing(result.dir) },
    ]}
  />
</Sheet>
