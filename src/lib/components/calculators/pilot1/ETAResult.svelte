<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import ResultRows from '#lib/components/shared/ResultRows.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import { formatClock, formatDuration } from '#lib/utils/navigationMath.js';

  let { result }: { result: any } = $props();

  // 日時は UTC 上で計算しているので、表示も UTC の値をそのまま使う
  const arrival = $derived(new Date(result.arrival));
  const arrDate = $derived(arrival.toISOString().slice(0, 10));
  const arrHours = $derived(
    arrival.getUTCHours() + arrival.getUTCMinutes() / 60,
  );
</script>

<Sheet title="Estimated Time of Arrival">
  <ResultRows
    rows={[
      { label: '航程 Distance', value: `${result.distance} NM` },
      { label: '速力 Speed', value: `${result.speed} kn` },
      { label: '航海時間', value: formatDuration(result.travelHours, false) },
      {
        label: '（10 進数）',
        value: `${result.travelHours.toFixed(2)} h`,
        muted: true,
      },
      {
        label: '出発',
        value: `${result.depDate} ${formatClock(result.depHours)}`,
      },
      ...(result.zoneChange
        ? [
            {
              label: '時差',
              value: `${result.zoneChange > 0 ? '+' : ''}${result.zoneChange} h`,
            },
          ]
        : []),
    ]}
  />
  <Highlight
    items={[
      { label: '到着予定日', value: arrDate },
      { label: '到着予定時刻 ETA', value: formatClock(arrHours) },
    ]}
  />
</Sheet>
