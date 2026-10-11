<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import ResultRows from '#lib/components/shared/ResultRows.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import { formatHMS } from '#lib/utils/timeConversion.js';

  let { result }: { result: any } = $props();

  const num = (v: number) => String(Math.round(v * 1e8) / 1e8);
  const isTime = $derived(result.kind === 'time');
  const fmtA = $derived(isTime ? formatHMS(result.a) : num(result.a));
  const fmtB = $derived(result.bIsNumber ? num(result.b) : formatHMS(result.b));
</script>

<Sheet title="Normal Computations">
  <ResultRows
    rows={[
      { label: 'A', value: fmtA },
      { label: result.op, value: fmtB },
    ]}
  />
  <Highlight
    items={isTime
      ? [
          { label: '答 (時分秒)', value: formatHMS(result.value) },
          { label: '答 (10 進数)', value: result.value.toFixed(4), unit: 'h' },
        ]
      : [{ label: '答', value: num(result.value) }]}
  />
</Sheet>
