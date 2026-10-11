<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import { courseToSteer } from '$lib/utils/currentVector';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let cmg = $state(90);
  let smg = $state(12);
  let setDir = $state(180);
  let drift = $state(2);

  function calculate() {
    onResult({
      cmg,
      smg,
      setDir,
      drift,
      ...courseToSteer(cmg, smg, setDir, drift),
    });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard title="目標の実航針路・実航速力">
    <NumberInput label="実航針路 (CMG)" bind:value={cmg} unit="°" />
    <NumberInput label="実航速力 (SMG)" bind:value={smg} unit="kn" />
  </SectionCard>
  <SectionCard title="潮流 (Current)">
    <NumberInput label="流向 (Set)" bind:value={setDir} unit="°" />
    <NumberInput label="流速 (Drift)" bind:value={drift} unit="kn" />
  </SectionCard>
</CalcForm>
