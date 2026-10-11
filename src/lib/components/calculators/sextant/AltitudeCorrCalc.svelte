<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import DMSInput from '$lib/components/shared/DMSInput.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import Segmented from '$lib/components/shared/Segmented.svelte';
  import type { DMSValue } from '$lib/types/navigation';
  import { dmsToDecimal } from '$lib/utils/navigationMath';
  import { altitudeCorrection } from '$lib/utils/sextant';

  type BodyType = 'sun_lower' | 'sun_upper' | 'star' | 'planet' | 'moon';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let hs: DMSValue = $state({ d: 35, m: 30, dir: 1 });
  let indexError = $state(0);
  let heightOfEye = $state(12);
  let bodyType = $state<BodyType>('sun_lower');
  let temp = $state(10);
  let pressure = $state(1010);
  let SD = $state(16.0);
  let HP = $state(54.5);

  const hasSD = $derived(bodyType !== 'star' && bodyType !== 'planet');

  function calculate() {
    // 器差（Index Error）を改正した値を観測高度として扱う
    const corrected = dmsToDecimal(hs) + indexError / 60;
    onResult({
      ...altitudeCorrection(
        corrected,
        heightOfEye,
        bodyType,
        temp,
        pressure,
        HP,
        SD,
      ),
      rawHs: dmsToDecimal(hs),
      indexError,
    });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard cols={1}>
    <Segmented
      label="天体"
      bind:value={bodyType}
      options={[
        { value: 'sun_lower', label: '太陽下辺' },
        { value: 'sun_upper', label: '太陽上辺' },
        { value: 'moon', label: '月下辺' },
        { value: 'star', label: '恒星' },
        { value: 'planet', label: '惑星' },
      ]}
    />
  </SectionCard>
  <SectionCard title="観測値">
    <DMSInput label="六分儀高度 (Hs)" bind:value={hs} />
    <NumberInput
      label="器差 (Index Corr.)"
      bind:value={indexError}
      unit="'"
      hint="器差改正値（オン・ザ・アークなら負）"
    />
    <NumberInput
      label="眼高 (Height of Eye)"
      bind:value={heightOfEye}
      unit="m"
    />
  </SectionCard>
  <SectionCard title="気象・天体の諸元">
    <NumberInput label="気温" bind:value={temp} unit="℃" />
    <NumberInput label="気圧" bind:value={pressure} unit="hPa" />
    {#if hasSD}
      <NumberInput label="視半径 (SD)" bind:value={SD} unit="'" />
    {/if}
    {#if bodyType === 'moon'}
      <NumberInput label="水平視差 (HP)" bind:value={HP} unit="'" />
    {/if}
  </SectionCard>
</CalcForm>
