<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import PositionInput from '$lib/components/shared/PositionInput.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import Segmented from '$lib/components/shared/Segmented.svelte';
  import type { DMSValue } from '$lib/types/navigation';
  import { dmsToDecimal } from '$lib/utils/navigationMath';
  import {
    middleLatDeadReckoning,
    mercatorDeadReckoning,
  } from '$lib/utils/mercatorSailing';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let lat1: DMSValue = $state({ d: 35, m: 0, dir: 1 });
  let lon1: DMSValue = $state({ d: 139, m: 45, dir: 1 });
  let course = $state(225);
  let distance = $state(120);
  let method: 'midlat' | 'mercator' = $state('midlat');

  function calculate() {
    const la = dmsToDecimal(lat1);
    const lo = dmsToDecimal(lon1);
    const r =
      method === 'mercator'
        ? mercatorDeadReckoning(la, lo, course, distance)
        : middleLatDeadReckoning(la, lo, course, distance);
    onResult({ lat1: la, lon1: lo, course, distance, method, ...r });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard cols={1}>
    <Segmented
      label="航法"
      bind:value={method}
      options={[
        { value: 'midlat', label: '中分緯度航法' },
        { value: 'mercator', label: '漸長緯度航法' },
      ]}
    />
  </SectionCard>

  <SectionCard title="出発点 (From)">
    <PositionInput bind:lat={lat1} bind:lon={lon1} />
  </SectionCard>

  <SectionCard title="針路・航程">
    <NumberInput label="針路 (Course)" bind:value={course} unit="°" />
    <NumberInput label="航程 (Distance)" bind:value={distance} unit="NM" />
  </SectionCard>
</CalcForm>
