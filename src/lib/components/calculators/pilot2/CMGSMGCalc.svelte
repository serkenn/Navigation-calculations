<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import { cmgSmg } from '$lib/utils/currentVector';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let shipCourse = $state(45);
  let shipSpeed = $state(12);
  let setDir = $state(180);
  let drift = $state(2);

  function calculate() {
    onResult({
      shipCourse,
      shipSpeed,
      setDir,
      drift,
      ...cmgSmg(shipCourse, shipSpeed, setDir, drift),
    });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard title="船の針路・速力">
    <NumberInput label="視針路 (Course)" bind:value={shipCourse} unit="°" />
    <NumberInput label="対水速力 (Speed)" bind:value={shipSpeed} unit="kn" />
  </SectionCard>
  <SectionCard title="潮流 (Current)">
    <NumberInput label="流向 (Set)" bind:value={setDir} unit="°" />
    <NumberInput label="流速 (Drift)" bind:value={drift} unit="kn" />
  </SectionCard>
</CalcForm>
