<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import ResultRows from '$lib/components/shared/ResultRows.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';
  import { formatHMS, formatDegMinSec } from '$lib/utils/timeConversion';

  let { result }: { result: any } = $props();
</script>

<Sheet title="Arc Computation">
  <ResultRows
    rows={[
      { label: 'A', value: formatDegMinSec(result.a) },
      ...(result.op
        ? [
            {
              label: result.op === '+' ? '+ B' : '− B',
              value: formatDegMinSec(result.b),
            },
            { label: '=', value: formatDegMinSec(result.degrees), bold: true },
          ]
        : []),
      { label: '15° = 1h、15′ = 1m、15″ = 1s', value: '', muted: true },
    ]}
  />
  <Highlight
    items={[
      { label: '弧度 Arc', value: formatDegMinSec(result.degrees) },
      { label: '時間 Time', value: formatHMS(result.time.hours) },
    ]}
  />
</Sheet>
