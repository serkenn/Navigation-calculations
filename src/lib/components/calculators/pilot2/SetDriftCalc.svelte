<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import { setAndDrift } from '#lib/utils/currentVector.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let shipCourse = $state(45);
  let shipSpeed = $state(12);
  let cmg = $state(50);
  let smg = $state(13);

  function calculate() {
    onResult({
      shipCourse,
      shipSpeed,
      cmg,
      smg,
      ...setAndDrift(shipCourse, shipSpeed, cmg, smg),
    });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard title="船の針路・速力">
    <NumberInput label="視針路 (Course)" bind:value={shipCourse} unit="°" />
    <NumberInput label="対水速力 (Speed)" bind:value={shipSpeed} unit="kn" />
  </SectionCard>
  <SectionCard title="実航 (Made Good)">
    <NumberInput label="実航針路 (CMG)" bind:value={cmg} unit="°" />
    <NumberInput label="実航速力 (SMG)" bind:value={smg} unit="kn" />
  </SectionCard>
</CalcForm>
