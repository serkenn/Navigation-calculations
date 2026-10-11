<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import { courseToSteerSMG } from '$lib/utils/currentVector';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let cmg = $state(90);
  let shipSpeed = $state(12);
  let setDir = $state(180);
  let drift = $state(2);
  let error = $state('');

  function calculate() {
    const r = courseToSteerSMG(cmg, shipSpeed, setDir, drift);
    if (!r.possible) {
      error = '潮流が強すぎて、この速力では目標の針路線上を進めません。';
      return;
    }
    error = '';
    onResult({ cmg, shipSpeed, setDir, drift, ...r });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="目標針路・速力">
    <NumberInput label="実航針路 (CMG)" bind:value={cmg} unit="°" />
    <NumberInput label="対水速力 (Speed)" bind:value={shipSpeed} unit="kn" />
  </SectionCard>
  <SectionCard title="潮流 (Current)">
    <NumberInput label="流向 (Set)" bind:value={setDir} unit="°" />
    <NumberInput label="流速 (Drift)" bind:value={drift} unit="kn" />
  </SectionCard>
</CalcForm>
