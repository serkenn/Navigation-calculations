<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import PositionInput from '#lib/components/shared/PositionInput.svelte';
  import DMSInput from '#lib/components/shared/DMSInput.svelte';
  import type { DMSValue } from '#lib/types/navigation.js';
  import { dmsToDecimal } from '#lib/utils/navigationMath.js';
  import { compositeSailing } from '#lib/utils/greatCircle.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  // 初期値は例題: 35°40'N 141°E → 38°N 120°20'W、制限緯度 45°N
  let lat1: DMSValue = $state({ d: 35, m: 40, dir: 1 });
  let lon1: DMSValue = $state({ d: 141, m: 0, dir: 1 });
  let lat2: DMSValue = $state({ d: 38, m: 0, dir: 1 });
  let lon2: DMSValue = $state({ d: 120, m: 20, dir: -1 });
  let limit: DMSValue = $state({ d: 45, m: 0, dir: 1 });
  let error = $state('');

  function calculate() {
    const p = {
      lat1: dmsToDecimal(lat1),
      lon1: dmsToDecimal(lon1),
      lat2: dmsToDecimal(lat2),
      lon2: dmsToDecimal(lon2),
    };
    const r = compositeSailing(
      p.lat1,
      p.lon1,
      p.lat2,
      p.lon2,
      dmsToDecimal(limit),
    );
    if ('error' in r && r.error) {
      error = r.error;
      return;
    }
    error = '';
    onResult({ ...p, ...r });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="A 地点（出発点）">
    <PositionInput bind:lat={lat1} bind:lon={lon1} />
  </SectionCard>
  <SectionCard title="B 地点（到着点）">
    <PositionInput bind:lat={lat2} bind:lon={lon2} />
  </SectionCard>
  <SectionCard title="制限緯度（最高緯度）">
    <DMSInput label="制限緯度 lv" bind:value={limit} sign="NS" />
  </SectionCard>
</CalcForm>
