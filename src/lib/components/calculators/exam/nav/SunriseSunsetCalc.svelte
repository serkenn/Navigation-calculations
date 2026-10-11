<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import PositionInput from '$lib/components/shared/PositionInput.svelte';
  import DMSInput from '$lib/components/shared/DMSInput.svelte';
  import DateInput from '$lib/components/shared/DateInput.svelte';
  import type { DMSValue } from '$lib/types/navigation';
  import { dmsToDecimal } from '$lib/utils/navigationMath';
  import { sunEvent } from '$lib/utils/astronomy';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let date = $state(`${new Date().getFullYear()}-04-15`);
  let lat: DMSValue = $state({ d: 14, m: 0, dir: 1 });
  let lon: DMSValue = $state({ d: 28, m: 0, dir: -1 });
  let zone: DMSValue = $state({ d: 30, m: 0, dir: -1 });
  let error = $state('');

  function calculate() {
    const p = {
      date,
      lat: dmsToDecimal(lat),
      lon: dmsToDecimal(lon),
      zone: dmsToDecimal(zone),
    };
    const r = sunEvent(p.date, p.lat, p.lon, p.zone, -50 / 60);
    if (!r.possible) {
      error = 'この日・この緯度では太陽が出没しません（白夜または極夜）。';
      return;
    }
    error = '';
    onResult({ ...p, ...r });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="日付・位置">
    <div class="sm:col-span-2">
      <DateInput label="日付" bind:value={date} />
    </div>
    <PositionInput bind:lat bind:lon />
    <DMSInput label="標準子午線" bind:value={zone} sign="EW" />
  </SectionCard>
</CalcForm>
