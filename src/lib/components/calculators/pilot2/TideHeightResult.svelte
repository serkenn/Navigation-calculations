<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import InfoGrid from '$lib/components/shared/InfoGrid.svelte';
  import ResultRows from '$lib/components/shared/ResultRows.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';
  import { formatClock, formatDuration } from '$lib/utils/navigationMath';

  let { result }: { result: any } = $props();
</script>

<Sheet title="Tide at Standard Port">
  <InfoGrid
    items={[
      {
        label: '高潮 HW',
        lines: [
          `${formatClock(result.hwTime)}  ${result.hwHeight.toFixed(2)} m`,
        ],
      },
      {
        label: '低潮 LW',
        lines: [
          `${formatClock(result.lwTime)}  ${result.lwHeight.toFixed(2)} m`,
        ],
      },
    ]}
  />
  <ResultRows
    rows={[
      { label: '潮差 Range', value: `${result.range.toFixed(2)} m` },
      {
        label: result.rising ? '上げ潮の時間 T' : '下げ潮の時間 T',
        value: formatDuration(result.duration, false),
      },
      {
        label: '低潮からの経過 t',
        value: formatDuration(result.elapsed, false),
      },
      { label: 'π·t / T', value: `${(180 * result.ratio).toFixed(1)}°` },
      { label: 'h = LW + R/2 (1 − cos πt/T)', value: '', muted: true },
    ]}
  />
  <Highlight
    items={[
      {
        label: `${formatClock(result.targetTime)} の潮高`,
        value: result.height.toFixed(2),
        unit: 'm',
      },
    ]}
  />
</Sheet>
