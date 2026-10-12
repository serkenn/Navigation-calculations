<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import { tpcFromWaterplane, mtcFromGML } from '#lib/utils/exam2nOperation.js';
  import {
    calculateDraftAfterCargo,
    calculateTrimFromShift,
  } from '#lib/utils/examOperation.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let waterplane = $state(4500);
  let density = $state(1.025);
  let displacement = $state(28000);
  let gml = $state(300);
  let length = $state(200);
  let weight = $state(500);
  let shift = $state(60);

  function calculate() {
    const tpc = tpcFromWaterplane(waterplane, density);
    const mtc = mtcFromGML(displacement, gml, length);
    onResult({
      waterplane,
      density,
      displacement,
      gml,
      length,
      weight,
      shift,
      tpc,
      mtc,
      sinkCm: calculateDraftAfterCargo(0, weight, tpc).draftIncreaseCm,
      trimCm: calculateTrimFromShift(weight, shift, mtc).trimCm,
    });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard title="TPC（毎 cm 排水トン数）">
    <NumberInput label="水線面積 Aw" bind:value={waterplane} unit="m²" />
    <NumberInput label="水の密度 ρ" bind:value={density} unit="t/m³" />
  </SectionCard>
  <SectionCard title="MTC（毎 cm トリムモーメント）">
    <NumberInput label="排水量 W" bind:value={displacement} unit="t" />
    <NumberInput label="縦メタセンタ高さ GML" bind:value={gml} unit="m" />
    <NumberInput label="垂線間長 L" bind:value={length} unit="m" />
  </SectionCard>
  <SectionCard title="貨物の積載・移動（応用）">
    <NumberInput label="貨物の重量 w" bind:value={weight} unit="t" />
    <NumberInput
      label="船首尾方向の移動距離 d"
      bind:value={shift}
      unit="m"
      hint="浮面心上に積載したときの沈下量と、移動したときのトリム変化を求めます"
    />
  </SectionCard>
</CalcForm>
