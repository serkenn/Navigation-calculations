<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import DMSInput from '$lib/components/shared/DMSInput.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import Segmented from '$lib/components/shared/Segmented.svelte';
  import type { DMSValue } from '$lib/types/navigation';
  import { dmsToDecimal, normalize360 } from '$lib/utils/navigationMath';
  import { identifyBody, sightReduction } from '$lib/utils/astronomy';
  import { navigationStars } from '$lib/data/stars';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let mode: 'predict' | 'identify' = $state('predict');
  let lat: DMSValue = $state({ d: 35, m: 0, dir: 1 });
  let lhaAries: DMSValue = $state({ d: 45, m: 0, dir: 1 });
  let minAlt = $state(15);
  let maxAlt = $state(75);
  let obsAlt: DMSValue = $state({ d: 40, m: 0, dir: 1 });
  let obsAz = $state(120);

  function calculate() {
    const la = dmsToDecimal(lat);
    const aries = dmsToDecimal(lhaAries);
    if (mode === 'predict') {
      const stars = navigationStars
        .map((s) => ({
          ...s,
          ...sightReduction(la, s.dec, normalize360(aries + s.sha)),
        }))
        .filter((s) => s.hc >= minAlt && s.hc <= maxAlt)
        .sort((a, b) => a.z - b.z);
      onResult({ mode, lat: la, lhaAries: aries, minAlt, maxAlt, stars });
      return;
    }
    // 同定: 高度・方位 → 赤緯・LHA → SHA を求め、近い恒星を探す
    const alt = dmsToDecimal(obsAlt);
    const body = identifyBody(la, alt, obsAz);
    const sha = normalize360(body.lha - aries);
    const candidates = navigationStars
      .map((s) => {
        const dSha = Math.abs(((s.sha - sha + 540) % 360) - 180);
        const dDec = Math.abs(s.dec - body.dec);
        return {
          ...s,
          distance: Math.hypot(
            dSha * Math.cos((body.dec * Math.PI) / 180),
            dDec,
          ),
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
    onResult({
      mode,
      lat: la,
      lhaAries: aries,
      alt,
      az: obsAz,
      ...body,
      sha,
      candidates,
    });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard cols={1}>
    <Segmented
      label="計算の種類"
      bind:value={mode}
      options={[
        { value: 'predict', label: '予測 (Prediction)' },
        { value: 'identify', label: '同定 (Identification)' },
      ]}
    />
  </SectionCard>

  <SectionCard title="推測緯度・春分点時角">
    <DMSInput label="推測緯度 (Lat)" bind:value={lat} sign="NS" />
    <DMSInput label="春分点の地方時角 (LHA ♈)" bind:value={lhaAries} />
  </SectionCard>

  {#if mode === 'predict'}
    <SectionCard title="表示する高度の範囲">
      <NumberInput label="最低高度" bind:value={minAlt} unit="°" />
      <NumberInput label="最高高度" bind:value={maxAlt} unit="°" />
    </SectionCard>
  {:else}
    <SectionCard title="観測した天体">
      <DMSInput label="高度 (Altitude)" bind:value={obsAlt} />
      <NumberInput label="方位 (Azimuth)" bind:value={obsAz} unit="°" />
    </SectionCard>
  {/if}
</CalcForm>
