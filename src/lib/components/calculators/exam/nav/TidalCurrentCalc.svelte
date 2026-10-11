<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import TimeInput from '#lib/components/shared/TimeInput.svelte';
  import type { HMSValue } from '#lib/types/navigation.js';
  import { hmsToHours } from '#lib/utils/timeConversion.js';
  import { tidalStream } from '#lib/utils/tide.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let slack: HMSValue = $state({ h: 7, m: 28, s: 0, sign: 1 });
  let max: HMSValue = $state({ h: 10, m: 40, s: 0, sign: 1 });
  let maxRate = $state(5.2);
  let dir = $state(90);
  let target: HMSValue = $state({ h: 9, m: 0, s: 0, sign: 1 });
  let error = $state('');

  const hours = (t: HMSValue) => hmsToHours(t.h, t.m, 0);

  function calculate() {
    const r = tidalStream(
      hours(slack),
      hours(max),
      maxRate,
      dir,
      hours(target),
    );
    if (!r.inRange) {
      error = '求める時刻は、転流時から次の転流時までの間にしてください。';
      return;
    }
    error = '';
    onResult({
      slackTime: hours(slack),
      maxTime: hours(max),
      maxRate,
      targetTime: hours(target),
      ...r,
    });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="潮汐表（潮流）の値">
    <TimeInput label="転流時" bind:value={slack} />
    <TimeInput label="最強時" bind:value={max} />
    <NumberInput label="最強流速" bind:value={maxRate} unit="kn" />
    <NumberInput label="流向" bind:value={dir} unit="°" />
  </SectionCard>
  <SectionCard title="求める時刻">
    <TimeInput label="時刻" bind:value={target} />
  </SectionCard>
</CalcForm>
