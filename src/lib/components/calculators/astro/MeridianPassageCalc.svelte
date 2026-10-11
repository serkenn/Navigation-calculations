<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import DMSInput from '#lib/components/shared/DMSInput.svelte';
  import DateInput from '#lib/components/shared/DateInput.svelte';
  import Segmented from '#lib/components/shared/Segmented.svelte';
  import type { DMSValue } from '#lib/types/navigation.js';
  import { dmsToDecimal } from '#lib/utils/navigationMath.js';
  import {
    latitudeByMeridianAltitude,
    sunMeridianPassage,
  } from '#lib/utils/astronomy.js';
  import {
    todayLocal,
    isValidDateString,
    INVALID_DATE_MESSAGE,
  } from '#lib/utils/dates.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let date = $state(todayLocal());
  let error = $state('');
  let lon: DMSValue = $state({ d: 139, m: 45, dir: 1 });
  let zone: DMSValue = $state({ d: 135, m: 0, dir: 1 });
  let useAltitude = $state(true);
  let ho: DMSValue = $state({ d: 65, m: 8, dir: 1 });
  let bearing: 'N' | 'S' = $state('S');

  function calculate() {
    if (!isValidDateString(date)) {
      error = INVALID_DATE_MESSAGE;
      return;
    }
    error = '';
    const lo = dmsToDecimal(lon);
    const z = dmsToDecimal(zone);
    const pass = sunMeridianPassage(date, lo, z);
    const latitude = useAltitude
      ? latitudeByMeridianAltitude(dmsToDecimal(ho), pass.dec, bearing)
      : null;
    onResult({
      date,
      lon: lo,
      zone: z,
      ...pass,
      ho: dmsToDecimal(ho),
      bearing,
      latitude,
    });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="日付・経度">
    <div class="sm:col-span-2">
      <DateInput label="日付 (Date)" bind:value={date} />
    </div>
    <DMSInput label="経度 (Long)" bind:value={lon} sign="EW" />
    <DMSInput
      label="標準子午線 (Zone Meridian)"
      bind:value={zone}
      sign="EW"
      hint="日本標準時は 135° E"
    />
  </SectionCard>

  <SectionCard title="子午線高度緯度法" cols={1}>
    <Segmented
      bind:value={useAltitude}
      options={[
        { value: true, label: '緯度も求める' },
        { value: false, label: '正中時刻のみ' },
      ]}
    />
    {#if useAltitude}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <DMSInput label="正中時の真高度 (Ho)" bind:value={ho} />
        <Segmented
          label="太陽の方向"
          bind:value={bearing}
          options={[
            { value: 'S', label: '南 (S)' },
            { value: 'N', label: '北 (N)' },
          ]}
        />
      </div>
    {/if}
  </SectionCard>
</CalcForm>
