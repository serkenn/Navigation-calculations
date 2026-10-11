<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import DateInput from '#lib/components/shared/DateInput.svelte';
  import TimeInput from '#lib/components/shared/TimeInput.svelte';
  import type { HMSValue } from '#lib/types/navigation.js';
  import { hmsToHours } from '#lib/utils/timeConversion.js';
  import { parseDate } from '#lib/utils/astronomy.js';
  import { solarPosition } from '#lib/utils/ephemeris.js';
  import {
    todayLocal,
    isValidDateString,
    INVALID_DATE_MESSAGE,
  } from '#lib/utils/dates.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let date = $state(todayLocal());
  let error = $state('');
  let ut: HMSValue = $state({ h: 12, m: 0, s: 0, sign: 1 });

  function calculate() {
    if (!isValidDateString(date)) {
      error = INVALID_DATE_MESSAGE;
      return;
    }
    error = '';
    const { year, month, day } = parseDate(date);
    const hours = hmsToHours(ut.h, ut.m, ut.s);
    onResult({ date, ut: hours, ...solarPosition(year, month, day, hours) });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="日時 (UT)">
    <DateInput label="日付 (Date)" bind:value={date} />
    <TimeInput label="世界時 (UT)" bind:value={ut} seconds />
  </SectionCard>
</CalcForm>
