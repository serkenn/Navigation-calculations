<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import { courseToSteerSMG } from '$lib/utils/currentVector';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let track = $state(180);
  let shipSpeed = $state(15);
  let setDir = $state(270);
  let drift = $state(2);
  let error = $state('');

  function calculate() {
    const r = courseToSteerSMG(track, shipSpeed, setDir, drift);
    if (!r.possible) {
      error = '潮流が強すぎて、この速力では目的の針路線上を進めません。';
      return;
    }
    error = '';
    onResult({ track, shipSpeed, setDir, drift, ...r });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="目的の針路線・速力">
    <NumberInput label="針路線（実航針路）" bind:value={track} unit="°" />
    <NumberInput label="速力（対水）" bind:value={shipSpeed} unit="kn" />
  </SectionCard>
  <SectionCard title="潮流">
    <NumberInput label="流向" bind:value={setDir} unit="°" />
    <NumberInput label="流速" bind:value={drift} unit="kn" />
  </SectionCard>
</CalcForm>
