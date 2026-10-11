<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import PositionInput from '#lib/components/shared/PositionInput.svelte';
  import DMSInput from '#lib/components/shared/DMSInput.svelte';
  import DateInput from '#lib/components/shared/DateInput.svelte';
  import type { DMSValue } from '#lib/types/navigation.js';
  import { dmsToDecimal } from '#lib/utils/navigationMath.js';
  import { sunEvents } from '#lib/utils/astronomy.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let date = $state(new Date().toISOString().slice(0, 10));
  let lat: DMSValue = $state({ d: 35, m: 0, dir: 1 });
  let lon: DMSValue = $state({ d: 139, m: 45, dir: 1 });
  let zone: DMSValue = $state({ d: 135, m: 0, dir: 1 });

  function calculate() {
    const p = {
      date,
      lat: dmsToDecimal(lat),
      lon: dmsToDecimal(lon),
      zone: dmsToDecimal(zone),
    };
    onResult({ ...p, ...sunEvents(p.date, p.lat, p.lon, p.zone) });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard title="日付・位置">
    <div class="sm:col-span-2">
      <DateInput label="日付 (Date)" bind:value={date} />
    </div>
    <PositionInput bind:lat bind:lon />
    <DMSInput
      label="標準子午線 (Zone Meridian)"
      bind:value={zone}
      sign="EW"
      hint="日本標準時は 135° E"
    />
  </SectionCard>
</CalcForm>
