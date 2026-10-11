<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import {
    calculateDraftChangesByLoadingAtPosition,
    calculateTrimFromShift,
  } from '#lib/utils/examOperation.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let shipLength = $state(150);
  let lcf = $state(-5);
  let tpc = $state(24);
  let mtc = $state(110);
  let weight = $state(130);
  let posFromLcf = $state(30);
  let movedWeight = $state(40);
  let moveDistance = $state(80);

  function calculate() {
    onResult({
      shipLength,
      lcf,
      tpc,
      mtc,
      weight,
      posFromLcf,
      movedWeight,
      moveDistance,
      ...calculateDraftChangesByLoadingAtPosition(
        shipLength,
        lcf,
        tpc,
        mtc,
        weight,
        posFromLcf,
      ),
      shiftTrimCm: calculateTrimFromShift(movedWeight, moveDistance, mtc)
        .trimCm,
    });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard title="船の諸元">
    <NumberInput label="垂線間長 L" bind:value={shipLength} unit="m" />
    <NumberInput
      label="浮面心 LCF（船体中央から、前方 +）"
      bind:value={lcf}
      unit="m"
    />
    <NumberInput label="TPC" bind:value={tpc} unit="t/cm" />
    <NumberInput label="MTC" bind:value={mtc} unit="t·m/cm" />
  </SectionCard>
  <SectionCard title="貨物の積載">
    <NumberInput label="積載重量" bind:value={weight} unit="t" />
    <NumberInput
      label="積載位置（LCF から、前方 +）"
      bind:value={posFromLcf}
      unit="m"
    />
  </SectionCard>
  <SectionCard title="貨物の移動（参考）">
    <NumberInput label="移動重量" bind:value={movedWeight} unit="t" />
    <NumberInput label="移動距離" bind:value={moveDistance} unit="m" />
  </SectionCard>
</CalcForm>
