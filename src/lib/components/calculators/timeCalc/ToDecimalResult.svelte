<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import ResultRows from '#lib/components/shared/ResultRows.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import { formatHMS } from '#lib/utils/timeConversion.js';

  let { result }: { result: any } = $props();

  const decimal = $derived(`${result.hours.toFixed(4)} h`);
</script>

<Sheet title="To HHH">
  <ResultRows
    rows={[
      { label: '時分秒', value: formatHMS(result.hours) },
      ...(result.mode === 'convert'
        ? []
        : [{ label: '10 進数', value: decimal }]),
      ...(result.mode === 'speed'
        ? [
            {
              label: '速力 = 距離 ÷ 時間',
              value: `${result.distance} NM ÷ ${decimal}`,
              muted: true,
            },
          ]
        : []),
      ...(result.mode === 'distance'
        ? [
            {
              label: '距離 = 速力 × 時間',
              value: `${result.speed} kn × ${decimal}`,
              muted: true,
            },
          ]
        : []),
    ]}
  />
  {#if result.mode === 'convert'}
    <Highlight
      items={[
        { label: '10 進数時間', value: result.hours.toFixed(4), unit: 'h' },
      ]}
    />
  {:else if result.mode === 'speed'}
    <Highlight
      items={[
        {
          label: '速力 Speed',
          value: (result.distance / result.hours).toFixed(2),
          unit: 'kn',
        },
      ]}
    />
  {:else}
    <Highlight
      items={[
        {
          label: '航走距離 Distance',
          value: (result.speed * result.hours).toFixed(2),
          unit: '海里 (NM)',
        },
      ]}
    />
  {/if}
</Sheet>
