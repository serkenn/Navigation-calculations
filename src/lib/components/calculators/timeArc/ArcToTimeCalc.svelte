<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import Segmented from '$lib/components/shared/Segmented.svelte';
  import { arcToTime, dmsToDegrees } from '$lib/utils/timeConversion';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let a = $state({ d: 141, m: 7, s: 30 });
  let op: '' | '+' | '-' = $state('');
  let b = $state({ d: 0, m: 0, s: 0 });

  function calculate() {
    const da = dmsToDegrees(a.d, a.m, a.s);
    const db = dmsToDegrees(b.d, b.m, b.s);
    const degrees = op === '+' ? da + db : op === '-' ? da - db : da;
    onResult({ a: da, b: db, op, degrees, time: arcToTime(degrees) });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard title="角度 A" cols={3}>
    <NumberInput label="度" bind:value={a.d} unit="°" />
    <NumberInput label="分" bind:value={a.m} unit="'" />
    <NumberInput label="秒" bind:value={a.s} unit={'"'} />
  </SectionCard>
  <SectionCard cols={1}>
    <Segmented
      label="計算"
      bind:value={op}
      options={[
        { value: '', label: '換算のみ' },
        { value: '+', label: 'A + B' },
        { value: '-', label: 'A − B' },
      ]}
    />
  </SectionCard>
  {#if op}
    <SectionCard title="角度 B" cols={3}>
      <NumberInput label="度" bind:value={b.d} unit="°" />
      <NumberInput label="分" bind:value={b.m} unit="'" />
      <NumberInput label="秒" bind:value={b.s} unit={'"'} />
    </SectionCard>
  {/if}
</CalcForm>
