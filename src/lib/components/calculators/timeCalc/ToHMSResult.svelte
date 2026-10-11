<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import ResultRows from '$lib/components/shared/ResultRows.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';
  import { formatHMS } from '$lib/utils/timeConversion';

  let { result }: { result: any } = $props();
</script>

<Sheet title={result.mode === 'run' ? 'Running Time' : 'To HMS'}>
  <ResultRows
    rows={result.mode === 'run'
      ? [
          { label: '航走距離', value: `${result.distance} NM` },
          { label: '速力', value: `${result.speed} kn` },
          {
            label: '時間 = 距離 ÷ 速力',
            value: `${result.hours.toFixed(4)} h`,
          },
        ]
      : [{ label: '10 進数', value: `${result.hours} h` }]}
  />
  <Highlight
    items={[
      {
        label: result.mode === 'run' ? '航走時間' : '時分秒',
        value: formatHMS(result.hours),
      },
    ]}
  />
</Sheet>
