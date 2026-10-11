<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import TimeInput from '$lib/components/shared/TimeInput.svelte';
  import Segmented from '$lib/components/shared/Segmented.svelte';
  import type { HMSValue } from '$lib/types/navigation';
  import { hmsToHours } from '$lib/utils/timeConversion';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let mode: 'convert' | 'speed' | 'distance' = $state('convert');
  let time: HMSValue = $state({ h: 9, m: 24, s: 30, sign: 1 });
  let distance = $state(120);
  let speed = $state(13.5);
  let error = $state('');

  function calculate() {
    const hours = hmsToHours(time.h, time.m, time.s);
    if (mode === 'speed' && !(hours > 0)) {
      error = '時間は 0 より大きい値を入力してください。';
      return;
    }
    error = '';
    onResult({ mode, hours, distance, speed });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard cols={1}>
    <Segmented
      label="計算の種類"
      bind:value={mode}
      options={[
        { value: 'convert', label: '10 進数変換' },
        { value: 'speed', label: '速力' },
        { value: 'distance', label: '航走距離' },
      ]}
    />
  </SectionCard>
  <SectionCard>
    <TimeInput label="航走時間 (Time)" bind:value={time} seconds />
    {#if mode === 'speed'}
      <NumberInput
        label="航走距離 (Distance)"
        bind:value={distance}
        unit="NM"
      />
    {:else if mode === 'distance'}
      <NumberInput label="速力 (Speed)" bind:value={speed} unit="kn" />
    {/if}
  </SectionCard>
</CalcForm>
