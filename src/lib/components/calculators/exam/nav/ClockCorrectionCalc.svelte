<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import DMSInput from '$lib/components/shared/DMSInput.svelte';
  import type { DMSValue } from '$lib/types/navigation';
  import { dmsToDecimal } from '$lib/utils/navigationMath';
  import { clockCorrection } from '$lib/utils/examNavigation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let depLon: DMSValue = $state({ d: 135, m: 0, dir: 1 });
  let arrLon: DMSValue = $state({ d: 140, m: 0, dir: 1 });

  function calculate() {
    const d = dmsToDecimal(depLon);
    const a = dmsToDecimal(arrLon);
    onResult({ depLon: d, arrLon: a, ...clockCorrection(d, a) });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard title="経度">
    <DMSInput label="前日正午（出発）の経度" bind:value={depLon} sign="EW" />
    <DMSInput label="当日正午（到着）の経度" bind:value={arrLon} sign="EW" />
  </SectionCard>
</CalcForm>
