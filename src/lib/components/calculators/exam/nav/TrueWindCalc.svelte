<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import { trueWind } from '#lib/utils/wind.js';
  import { relativeFromTrue } from '#lib/utils/examNavigation.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let heading = $state(180);
  let shipSpeed = $state(15);
  let appDir = $state(45);
  let appSpeed = $state(12);

  function calculate() {
    const relativeDir = relativeFromTrue(appDir, heading);
    onResult({
      heading,
      shipSpeed,
      appDir,
      appSpeed,
      relativeDir,
      ...trueWind(relativeDir, appSpeed, heading, shipSpeed),
    });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard title="船の針路・速力">
    <NumberInput label="真針路" bind:value={heading} unit="°" />
    <NumberInput label="速力" bind:value={shipSpeed} unit="kn" />
  </SectionCard>
  <SectionCard title="視風（船上で観測した風）">
    <NumberInput
      label="視風向（真方位）"
      bind:value={appDir}
      unit="°"
      hint="風が吹いてくる方向"
    />
    <NumberInput label="視風速" bind:value={appSpeed} unit="kn" />
  </SectionCard>
</CalcForm>
