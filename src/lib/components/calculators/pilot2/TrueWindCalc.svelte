<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import Segmented from '#lib/components/shared/Segmented.svelte';
  import { trueWind } from '#lib/utils/wind.js';
  import { normalize360 } from '#lib/utils/navigationMath.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let reference: 'relative' | 'true' = $state('relative');
  let windDir = $state(45);
  let windSpeed = $state(15);
  let shipCourse = $state(0);
  let shipSpeed = $state(12);

  function calculate() {
    // 視風向は船首からの角度（右回り）に揃えて計算する
    const relativeDir =
      reference === 'true'
        ? normalize360(windDir - shipCourse)
        : normalize360(windDir);
    onResult({
      relativeDir,
      apparentTrueDir: normalize360(shipCourse + relativeDir),
      windSpeed,
      shipCourse,
      shipSpeed,
      ...trueWind(relativeDir, windSpeed, shipCourse, shipSpeed),
    });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard title="視風 (Apparent Wind)">
    <div class="sm:col-span-2">
      <Segmented
        label="視風向の基準"
        bind:value={reference}
        options={[
          { value: 'relative', label: '船首から（相対）' },
          { value: 'true', label: '真方位' },
        ]}
      />
    </div>
    <NumberInput
      label={reference === 'relative'
        ? '視風向（船首から右回り）'
        : '視風向（真方位）'}
      bind:value={windDir}
      unit="°"
    />
    <NumberInput label="視風速" bind:value={windSpeed} unit="kn" />
  </SectionCard>
  <SectionCard title="船の針路・速力">
    <NumberInput label="針路 (Course)" bind:value={shipCourse} unit="°" />
    <NumberInput label="速力 (Speed)" bind:value={shipSpeed} unit="kn" />
  </SectionCard>
</CalcForm>
