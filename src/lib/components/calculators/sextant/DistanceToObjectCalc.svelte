<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import DMSInput from '#lib/components/shared/DMSInput.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import Segmented from '#lib/components/shared/Segmented.svelte';
  import type { DMSValue } from '#lib/types/navigation.js';
  import { dmsToDecimal } from '#lib/utils/navigationMath.js';
  import {
    distanceByVerticalAngle,
    geographicalRange,
  } from '#lib/utils/sextant.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let mode: 'vertical' | 'range' = $state('vertical');
  let angle: DMSValue = $state({ d: 0, m: 45, dir: 1 });
  let height = $state(50);
  let heightOfEye = $state(12);
  let error = $state('');

  function calculate() {
    if (mode === 'vertical') {
      const a = dmsToDecimal(angle);
      const r = distanceByVerticalAngle(a, height);
      if (!Number.isFinite(r.distanceM)) {
        error = '垂直角と物標の高さは 0 より大きい値を入力してください。';
        return;
      }
      error = '';
      onResult({ mode, angle: a, height, ...r });
    } else {
      error = '';
      onResult({
        mode,
        height,
        heightOfEye,
        ...geographicalRange(height, heightOfEye),
      });
    }
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard cols={1}>
    <Segmented
      label="計算方法"
      bind:value={mode}
      options={[
        { value: 'vertical', label: '垂直角による距離' },
        { value: 'range', label: '光達距離' },
      ]}
    />
  </SectionCard>
  {#if mode === 'vertical'}
    <SectionCard title="観測値">
      <DMSInput
        label="垂直角 (Vertical Angle)"
        bind:value={angle}
        hint="物標の頂部と水際の間の角度"
      />
      <NumberInput label="物標の高さ (Height)" bind:value={height} unit="m" />
    </SectionCard>
  {:else}
    <SectionCard title="高さ">
      <NumberInput
        label="灯高 (Height of Light)"
        bind:value={height}
        unit="m"
      />
      <NumberInput
        label="眼高 (Height of Eye)"
        bind:value={heightOfEye}
        unit="m"
      />
    </SectionCard>
  {/if}
</CalcForm>
