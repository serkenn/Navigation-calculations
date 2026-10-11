<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import PositionInput from '#lib/components/shared/PositionInput.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import type { DMSValue } from '#lib/types/navigation.js';
  import { dmsToDecimal } from '#lib/utils/navigationMath.js';
  import { crossBearingFix } from '#lib/utils/examNavigation.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let aLat: DMSValue = $state({ d: 35, m: 0, dir: 1 });
  let aLon: DMSValue = $state({ d: 139, m: 40, dir: 1 });
  let bearingA = $state(315);
  let bLat: DMSValue = $state({ d: 35, m: 0, dir: 1 });
  let bLon: DMSValue = $state({ d: 139, m: 50, dir: 1 });
  let bearingB = $state(45);
  let error = $state('');

  function calculate() {
    const p = {
      aLat: dmsToDecimal(aLat),
      aLon: dmsToDecimal(aLon),
      bLat: dmsToDecimal(bLat),
      bLon: dmsToDecimal(bLon),
      bearingA,
      bearingB,
    };
    const r = crossBearingFix(
      p.aLat,
      p.aLon,
      bearingA,
      p.bLat,
      p.bLon,
      bearingB,
    );
    if (!r.possible) {
      error =
        'この方位の組み合わせでは 2 本の方位線が船の前方で交わりません。方位を確認してください。';
      return;
    }
    error = '';
    onResult({ ...p, ...r });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="物標 A">
    <PositionInput bind:lat={aLat} bind:lon={aLon} />
    <NumberInput label="真方位" bind:value={bearingA} unit="°" />
  </SectionCard>
  <SectionCard title="物標 B">
    <PositionInput bind:lat={bLat} bind:lon={bLon} />
    <NumberInput label="真方位" bind:value={bearingB} unit="°" />
  </SectionCard>
</CalcForm>
