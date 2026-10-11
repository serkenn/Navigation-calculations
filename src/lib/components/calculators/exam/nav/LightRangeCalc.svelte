<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import { lightRange } from '$lib/utils/examNavigation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let lightHeight = $state(50);
  let eyeHeight = $state(12);

  function calculate() {
    onResult({ lightHeight, eyeHeight, ...lightRange(lightHeight, eyeHeight) });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard title="高さ">
    <NumberInput label="灯高 H" bind:value={lightHeight} unit="m" />
    <NumberInput label="眼高 h" bind:value={eyeHeight} unit="m" />
  </SectionCard>
</CalcForm>
