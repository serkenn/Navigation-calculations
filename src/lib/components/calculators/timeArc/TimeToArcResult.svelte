<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import ResultRows from '#lib/components/shared/ResultRows.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import { formatHMS, formatDegMinSec } from '#lib/utils/timeConversion.js';

  let { result }: { result: any } = $props();
</script>

<Sheet title="Time Computation">
  <ResultRows
    rows={[
      { label: 'A', value: formatHMS(result.a) },
      ...(result.op
        ? [
            {
              label: result.op === '+' ? '+ B' : '− B',
              value: formatHMS(result.b),
            },
            { label: '=', value: formatHMS(result.hours), bold: true },
          ]
        : []),
      { label: '1h = 15°、1m = 15′、1s = 15″', value: '', muted: true },
    ]}
  />
  <Highlight
    items={[
      { label: '時間 Time', value: formatHMS(result.hours) },
      { label: '弧度 Arc', value: formatDegMinSec(result.arc.degrees) },
    ]}
  />
</Sheet>
