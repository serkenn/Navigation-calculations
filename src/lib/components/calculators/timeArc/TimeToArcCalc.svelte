<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import TimeInput from '$lib/components/shared/TimeInput.svelte';
  import Segmented from '$lib/components/shared/Segmented.svelte';
  import type { HMSValue } from '$lib/types/navigation';
  import { hmsToHours, timeToArc } from '$lib/utils/timeConversion';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let a: HMSValue = $state({ h: 9, m: 24, s: 30, sign: 1 });
  let op: '' | '+' | '-' = $state('');
  let b: HMSValue = $state({ h: 0, m: 0, s: 0, sign: 1 });

  function calculate() {
    const ha = hmsToHours(a.h, a.m, a.s);
    const hb = hmsToHours(b.h, b.m, b.s);
    const hours = op === '+' ? ha + hb : op === '-' ? ha - hb : ha;
    onResult({ a: ha, b: hb, op, hours, arc: timeToArc(hours) });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard cols={1}>
    <TimeInput label="時間 A" bind:value={a} seconds />
    <Segmented
      label="計算"
      bind:value={op}
      options={[
        { value: '', label: '換算のみ' },
        { value: '+', label: 'A + B' },
        { value: '-', label: 'A − B' },
      ]}
    />
    {#if op}
      <TimeInput label="時間 B" bind:value={b} seconds />
    {/if}
  </SectionCard>
</CalcForm>
