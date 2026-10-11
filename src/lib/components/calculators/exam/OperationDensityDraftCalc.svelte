<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import { calculateDraftByDensityAndConsumption } from '$lib/utils/examOperation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let displacement = $state(12900);
  let tpc = $state(21.5);
  let mtc = $state(155);
  let shipLength = $state(145);
  let lcf = $state(0);
  let sourceDensity = $state(1.023);
  let destDensity = $state(1.012);
  let fwdDraft = $state(7.1);
  let aftDraft = $state(7.1);
  let fuel = $state(200);
  let fuelPos = $state(37);
  let fresh = $state(11);
  let freshPos = $state(-8);

  function calculate() {
    onResult({
      displacement,
      tpc,
      mtc,
      shipLength,
      lcf,
      sourceDensity,
      destDensity,
      fwdDraft,
      aftDraft,
      fuel,
      fuelPos,
      fresh,
      freshPos,
      ...calculateDraftByDensityAndConsumption(
        displacement,
        tpc,
        fwdDraft,
        aftDraft,
        sourceDensity,
        destDensity,
        fuel,
        fuelPos,
        fresh,
        freshPos,
        mtc,
        lcf,
        shipLength,
      ),
    });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard title="出港時の状態">
    <NumberInput label="排水量" bind:value={displacement} unit="t" />
    <NumberInput label="出港地の海水比重" bind:value={sourceDensity} />
    <NumberInput label="船首喫水" bind:value={fwdDraft} unit="m" />
    <NumberInput label="船尾喫水" bind:value={aftDraft} unit="m" />
  </SectionCard>
  <SectionCard title="船の諸元">
    <NumberInput label="TPC" bind:value={tpc} unit="t/cm" />
    <NumberInput label="MTC" bind:value={mtc} unit="t·m/cm" />
    <NumberInput label="垂線間長 L" bind:value={shipLength} unit="m" />
    <NumberInput
      label="浮面心 LCF（中央から、前方 +）"
      bind:value={lcf}
      unit="m"
    />
  </SectionCard>
  <SectionCard title="航海中の消費（位置は船体中央から、前方 +）">
    <NumberInput label="燃料消費量" bind:value={fuel} unit="t" />
    <NumberInput label="燃料タンク位置" bind:value={fuelPos} unit="m" />
    <NumberInput label="清水消費量" bind:value={fresh} unit="t" />
    <NumberInput label="清水タンク位置" bind:value={freshPos} unit="m" />
  </SectionCard>
  <SectionCard title="入港地" cols={1}>
    <NumberInput label="入港地の海水比重" bind:value={destDensity} />
  </SectionCard>
</CalcForm>
