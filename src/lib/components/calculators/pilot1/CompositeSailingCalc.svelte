<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import PositionInput from '#lib/components/shared/PositionInput.svelte';
  import DMSInput from '#lib/components/shared/DMSInput.svelte';
  import type { DMSValue } from '#lib/types/navigation.js';
  import { dmsToDecimal } from '#lib/utils/navigationMath.js';
  import { compositeSailing } from '#lib/utils/greatCircle.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let lat1: DMSValue = $state({ d: 35, m: 0, dir: 1 });
  let lon1: DMSValue = $state({ d: 139, m: 45, dir: 1 });
  let lat2: DMSValue = $state({ d: 37, m: 47, dir: 1 });
  let lon2: DMSValue = $state({ d: 122, m: 25, dir: -1 });
  let limit: DMSValue = $state({ d: 45, m: 0, dir: 1 });

  function calculate() {
    const p = {
      lat1: dmsToDecimal(lat1),
      lon1: dmsToDecimal(lon1),
      lat2: dmsToDecimal(lat2),
      lon2: dmsToDecimal(lon2),
    };
    onResult({
      ...p,
      ...compositeSailing(p.lat1, p.lon1, p.lat2, p.lon2, dmsToDecimal(limit)),
    });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard title="出発点 (From)">
    <PositionInput bind:lat={lat1} bind:lon={lon1} />
  </SectionCard>
  <SectionCard title="到着点 (To)">
    <PositionInput bind:lat={lat2} bind:lon={lon2} />
  </SectionCard>
  <SectionCard title="制限緯度">
    <DMSInput label="制限緯度 (Limiting Lat)" bind:value={limit} sign="NS" />
  </SectionCard>
</CalcForm>
