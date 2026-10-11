<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import TimeInput from '$lib/components/shared/TimeInput.svelte';
  import Segmented from '$lib/components/shared/Segmented.svelte';
  import type { HMSValue } from '$lib/types/navigation';
  import {
    applyOperator,
    hmsToHours,
    type Operator,
  } from '$lib/utils/timeConversion';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let kind: 'number' | 'time' = $state('number');
  let op = $state<Operator>('+');
  let numA = $state(12.5);
  let numB = $state(3.25);
  let timeA: HMSValue = $state({ h: 12, m: 30, s: 0, sign: 1 });
  let timeB: HMSValue = $state({ h: 3, m: 15, s: 0, sign: 1 });
  let error = $state('');

  // 時分秒どうしの乗除は意味を持たないので、B は数値として扱う
  const bIsNumber = $derived(kind === 'number' || op === '×' || op === '÷');

  function calculate() {
    const a = kind === 'number' ? numA : hmsToHours(timeA.h, timeA.m, timeA.s);
    const b = bIsNumber ? numB : hmsToHours(timeB.h, timeB.m, timeB.s);
    const value = applyOperator(a, op, b);
    if (!Number.isFinite(value)) {
      error = '0 で割ることはできません。';
      return;
    }
    error = '';
    onResult({ kind, op, a, b, bIsNumber, value });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard cols={1}>
    <Segmented
      label="値の種類"
      bind:value={kind}
      options={[
        { value: 'number', label: '数値' },
        { value: 'time', label: '時分秒' },
      ]}
    />
  </SectionCard>
  <SectionCard cols={1}>
    {#if kind === 'number'}
      <NumberInput label="A" bind:value={numA} />
    {:else}
      <TimeInput label="A" bind:value={timeA} seconds />
    {/if}
    <Segmented
      label="演算"
      bind:value={op}
      options={[
        { value: '+', label: '+' },
        { value: '-', label: '−' },
        { value: '×', label: '×' },
        { value: '÷', label: '÷' },
      ]}
    />
    {#if bIsNumber}
      <NumberInput label="B" bind:value={numB} />
    {:else}
      <TimeInput label="B" bind:value={timeB} seconds />
    {/if}
  </SectionCard>
</CalcForm>
