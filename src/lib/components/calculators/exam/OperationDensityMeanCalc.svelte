<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import { calculateMeanDraftByDensity } from '#lib/utils/examOperation.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let displacement = $state(18000);
  let tpc = $state(28.0);
  let sourceDensity = $state(1.023);
  let destDensity = $state(1.003);
  let fwdDraft = $state(8.6);
  let aftDraft = $state(9.1);

  function calculate() {
    onResult({
      displacement,
      tpc,
      sourceDensity,
      destDensity,
      fwdDraft,
      aftDraft,
      ...calculateMeanDraftByDensity(
        displacement,
        tpc,
        sourceDensity,
        destDensity,
        fwdDraft,
        aftDraft,
      ),
    });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard title="船の状態">
    <NumberInput label="排水量" bind:value={displacement} unit="t" />
    <NumberInput label="TPC" bind:value={tpc} unit="t/cm" />
    <NumberInput label="船首喫水" bind:value={fwdDraft} unit="m" />
    <NumberInput label="船尾喫水" bind:value={aftDraft} unit="m" />
  </SectionCard>
  <SectionCard title="海水比重">
    <NumberInput label="移動前" bind:value={sourceDensity} />
    <NumberInput label="移動後" bind:value={destDensity} />
  </SectionCard>
</CalcForm>
