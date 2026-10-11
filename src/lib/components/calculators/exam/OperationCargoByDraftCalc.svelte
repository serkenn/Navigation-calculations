<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import { calculateCargoFromForeAftDraftChange } from '$lib/utils/examOperation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let length = $state(130);
  let breadth = $state(28);
  let density = $state(1.023);
  let fwd1 = $state(4.8);
  let aft1 = $state(6.1);
  let fwd2 = $state(5.7);
  let aft2 = $state(7.3);

  function calculate() {
    onResult({
      length,
      breadth,
      density,
      fwd1,
      aft1,
      fwd2,
      aft2,
      ...calculateCargoFromForeAftDraftChange(
        length,
        breadth,
        density,
        fwd1,
        aft1,
        fwd2,
        aft2,
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
  <SectionCard title="積荷前">
    <NumberInput label="船首喫水" bind:value={fwd1} unit="m" />
    <NumberInput label="船尾喫水" bind:value={aft1} unit="m" />
  </SectionCard>
  <SectionCard title="積荷後">
    <NumberInput label="船首喫水" bind:value={fwd2} unit="m" />
    <NumberInput label="船尾喫水" bind:value={aft2} unit="m" />
  </SectionCard>
</CalcForm>
