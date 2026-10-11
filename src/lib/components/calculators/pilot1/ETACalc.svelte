<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import DateInput from '#lib/components/shared/DateInput.svelte';
  import TimeInput from '#lib/components/shared/TimeInput.svelte';
  import type { HMSValue } from '#lib/types/navigation.js';
  import { hmsToHours } from '#lib/utils/timeConversion.js';
  import {
    todayLocal,
    isValidDateString,
    INVALID_DATE_MESSAGE,
  } from '#lib/utils/dates.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let distance = $state(350);
  let speed = $state(14.5);
  let depDate = $state(todayLocal());
  let depTime: HMSValue = $state({ h: 8, m: 0, s: 0, sign: 1 });
  let zoneChange = $state(0);
  let error = $state('');

  function calculate() {
    if (!(speed > 0)) {
      error = '速力は 0 より大きい値を入力してください。';
      return;
    }
    if (!isValidDateString(depDate)) {
      error = INVALID_DATE_MESSAGE;
      return;
    }
    error = '';
    const travelHours = distance / speed;
    const dep = new Date(`${depDate}T00:00:00Z`);
    const depHours = hmsToHours(depTime.h, depTime.m, 0);
    // 到着地の時刻 = 出発時刻 + 航海時間 + 時差（到着地 − 出発地）
    const arrMs =
      dep.getTime() +
      Math.round((depHours + travelHours + zoneChange) * 3600_000);
    onResult({
      distance,
      speed,
      travelHours,
      depDate,
      depHours,
      zoneChange,
      arrival: new Date(arrMs).toISOString(),
    });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="航程・速力">
    <NumberInput label="航程 (Distance)" bind:value={distance} unit="NM" />
    <NumberInput label="速力 (Speed)" bind:value={speed} unit="kn" />
  </SectionCard>
  <SectionCard title="出発 (Departure)">
    <DateInput label="出発日" bind:value={depDate} />
    <TimeInput label="出発時刻" bind:value={depTime} />
    <NumberInput
      label="時差（到着地 − 出発地）"
      bind:value={zoneChange}
      unit="h"
      hint="船内時計を進めるなら +、遅らせるなら −"
    />
  </SectionCard>
</CalcForm>
