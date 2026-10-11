<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import DMSInput from '$lib/components/shared/DMSInput.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import Segmented from '$lib/components/shared/Segmented.svelte';
  import type { DMSValue } from '$lib/types/navigation';
  import { dmsToDecimal } from '$lib/utils/navigationMath';
  import { amplitude, compassError } from '$lib/utils/astronomy';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let lat: DMSValue = $state({ d: 31, m: 15, dir: 1 });
  let dec: DMSValue = $state({ d: 18, m: 48, dir: -1 });
  let rising = $state(false);
  let gyroBearing = $state(246.5);

  function calculate() {
    const la = dmsToDecimal(lat);
    const d = dmsToDecimal(dec);
    const amp = amplitude(la, d, rising);
    onResult({
      lat: la,
      dec: d,
      rising,
      gyroBearing,
      ...amp,
      error: compassError(amp.trueBearing, gyroBearing),
    });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard cols={1}>
    <Segmented
      label="現象"
      bind:value={rising}
      options={[
        { value: true, label: '日出 (Rising)' },
        { value: false, label: '日没 (Setting)' },
      ]}
    />
  </SectionCard>
  <SectionCard title="緯度・赤緯">
    <DMSInput label="推測緯度" bind:value={lat} sign="NS" />
    <DMSInput label="太陽の赤緯" bind:value={dec} sign="NS" />
  </SectionCard>
  <SectionCard cols={1}>
    <NumberInput
      label="ジャイロコンパスによる方位"
      bind:value={gyroBearing}
      unit="°"
    />
  </SectionCard>
</CalcForm>
