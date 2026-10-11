<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import Step from '#lib/components/shared/Step.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import { formatLon, formatDirectedDMS } from '#lib/utils/navigationMath.js';
  import { formatHMS } from '#lib/utils/timeConversion.js';

  let { result }: { result: any } = $props();

  const advance = $derived(result.direction === 'advance');
</script>

<Sheet title="Ship's Clock Correction">
  <Step
    title="1. 変経"
    lines={[
      `${formatLon(result.depLon)} → ${formatLon(result.arrLon)}`,
      `D.Long = ${formatDirectedDMS(result.dLon, 'E', 'W')}`,
    ]}
  />
  <Step
    title="2. 時間に換算（経度 1° = 4 分）"
    lines={[
      `${Math.abs(result.dLon).toFixed(3)}° × 4 = ${Math.abs(result.minutes).toFixed(1)} 分`,
    ]}
  />
  <Highlight
    items={[
      { label: '改正量', value: formatHMS(Math.abs(result.minutes) / 60, 0) },
      {
        label: '時計を',
        value: advance ? '進める' : '遅らせる',
        sub: advance ? '東航' : '西航',
      },
    ]}
  />
</Sheet>
