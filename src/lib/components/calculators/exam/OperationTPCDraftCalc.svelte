<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import {
    calculateTPC,
    calculateDraftAfterCargo,
    calculateCargoFromDraftChange,
  } from '$lib/utils/examOperation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let length = $state(100);
  let breadth = $state(25);
  let density = $state(1.025);
  let initialDraft = $state(3.0);
  let cargo = $state(300);
  let observedDraft = $state(5.0);

  function calculate() {
    const tpc = calculateTPC(length, breadth, density);
    onResult({
      length,
      breadth,
      density,
      initialDraft,
      cargo,
      observedDraft,
      tpc,
      ...calculateDraftAfterCargo(initialDraft, cargo, tpc),
      observed: calculateCargoFromDraftChange(
        length,
        breadth,
        density,
        initialDraft,
        observedDraft,
      ),
    });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard title="箱形船の寸法" cols={3}>
    <NumberInput label="長さ L" bind:value={length} unit="m" />
    <NumberInput label="幅 B" bind:value={breadth} unit="m" />
    <NumberInput label="海水比重 ρ" bind:value={density} />
  </SectionCard>
  <SectionCard title="喫水と積載" cols={3}>
    <NumberInput label="初めの平均喫水" bind:value={initialDraft} unit="m" />
    <NumberInput label="積載量" bind:value={cargo} unit="t" />
    <NumberInput
      label="積載後に読んだ喫水"
      bind:value={observedDraft}
      unit="m"
    />
  </SectionCard>
</CalcForm>
