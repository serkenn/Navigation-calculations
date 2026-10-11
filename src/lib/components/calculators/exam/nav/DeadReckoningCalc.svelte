<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import PositionInput from '#lib/components/shared/PositionInput.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import TimeInput from '#lib/components/shared/TimeInput.svelte';
  import type { DMSValue, HMSValue } from '#lib/types/navigation.js';
  import { dmsToDecimal } from '#lib/utils/navigationMath.js';
  import { hmsToHours } from '#lib/utils/timeConversion.js';
  import { middleLatDeadReckoning } from '#lib/utils/mercatorSailing.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let lat: DMSValue = $state({ d: 35, m: 0, dir: 1 });
  let lon: DMSValue = $state({ d: 139, m: 0, dir: 1 });
  let course = $state(90);
  let speed = $state(12);
  let elapsed: HMSValue = $state({ h: 2, m: 0, s: 0, sign: 1 });

  function calculate() {
    const la = dmsToDecimal(lat);
    const lo = dmsToDecimal(lon);
    const hours = hmsToHours(elapsed.h, elapsed.m, 0);
    const distance = speed * hours;
    onResult({
      lat1: la,
      lon1: lo,
      course,
      speed,
      hours,
      distance,
      ...middleLatDeadReckoning(la, lo, course, distance),
    });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard title="出発位置">
    <PositionInput bind:lat bind:lon />
  </SectionCard>
  <SectionCard title="針路・速力・航走時間">
    <NumberInput label="真針路" bind:value={course} unit="°" />
    <NumberInput label="速力" bind:value={speed} unit="kn" />
    <TimeInput label="航走時間" bind:value={elapsed} />
  </SectionCard>
</CalcForm>
