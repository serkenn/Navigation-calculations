<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import TimeInput from '#lib/components/shared/TimeInput.svelte';
  import type { HMSValue } from '#lib/types/navigation.js';
  import { hmsToHours } from '#lib/utils/timeConversion.js';
  import { tideHeight } from '#lib/utils/tide.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let hwHeight = $state(3.5);
  let hwTime: HMSValue = $state({ h: 14, m: 30, s: 0, sign: 1 });
  let lwHeight = $state(0.8);
  let lwTime: HMSValue = $state({ h: 8, m: 0, s: 0, sign: 1 });
  let target: HMSValue = $state({ h: 11, m: 0, s: 0, sign: 1 });
  let error = $state('');

  const hours = (t: HMSValue) => hmsToHours(t.h, t.m, 0);

  function calculate() {
    if (hwHeight <= lwHeight) {
      error = '高潮の潮高は低潮の潮高より大きくしてください。';
      return;
    }
    const r = tideHeight(
      hwHeight,
      lwHeight,
      hours(hwTime),
      hours(lwTime),
      hours(target),
    );
    if (!r.inRange) {
      error = '求める時刻は、低潮と高潮の間の時刻にしてください。';
      return;
    }
    error = '';
    onResult({
      hwHeight,
      lwHeight,
      hwTime: hours(hwTime),
      lwTime: hours(lwTime),
      targetTime: hours(target),
      ...r,
    });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="高潮 (HW)">
    <TimeInput label="時刻" bind:value={hwTime} />
    <NumberInput label="潮高" bind:value={hwHeight} unit="m" />
  </SectionCard>
  <SectionCard title="低潮 (LW)">
    <TimeInput label="時刻" bind:value={lwTime} />
    <NumberInput label="潮高" bind:value={lwHeight} unit="m" />
  </SectionCard>
  <SectionCard title="求める時刻">
    <TimeInput label="時刻 (Time)" bind:value={target} />
  </SectionCard>
</CalcForm>
