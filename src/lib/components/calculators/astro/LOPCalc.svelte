<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import PositionInput from '$lib/components/shared/PositionInput.svelte';
  import DMSInput from '$lib/components/shared/DMSInput.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import type { DMSValue } from '$lib/types/navigation';
  import { dmsToDecimal } from '$lib/utils/navigationMath';
  import {
    intercept,
    localHourAngle,
    sightReduction,
  } from '$lib/utils/astronomy';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let lat: DMSValue = $state({ d: 35, m: 0, dir: 1 });
  let lon: DMSValue = $state({ d: 139, m: 45, dir: 1 });
  let hs: DMSValue = $state({ d: 48, m: 10, dir: 1 });
  let totalCorr = $state(9.6);
  let gha: DMSValue = $state({ d: 181, m: 0, dir: 1 });
  let dec: DMSValue = $state({ d: 13, m: 3, dir: 1 });

  function calculate() {
    const la = dmsToDecimal(lat);
    const lo = dmsToDecimal(lon);
    const ho = dmsToDecimal(hs) + totalCorr / 60;
    const g = dmsToDecimal(gha);
    const d = dmsToDecimal(dec);
    const lha = localHourAngle(g, lo);
    const { hc, z } = sightReduction(la, d, lha);
    onResult({
      lat: la,
      lon: lo,
      ho,
      gha: g,
      dec: d,
      lha,
      hc,
      z,
      intercept: intercept(ho, hc),
    });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard title="推測位置 (DR)">
    <PositionInput bind:lat bind:lon />
  </SectionCard>
  <SectionCard title="観測高度">
    <DMSInput label="六分儀高度 (Hs)" bind:value={hs} />
    <NumberInput
      label="改正総数 (Total Corr.)"
      bind:value={totalCorr}
      unit="'"
      hint="マイナスの改正は負の値で入力"
    />
  </SectionCard>
  <SectionCard title="天測暦">
    <DMSInput label="グリニッジ時角 (GHA)" bind:value={gha} />
    <DMSInput label="赤緯 (Dec)" bind:value={dec} sign="NS" />
  </SectionCard>
</CalcForm>
