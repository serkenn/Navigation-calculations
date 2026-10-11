<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import DMSInput from '#lib/components/shared/DMSInput.svelte';
  import Segmented from '#lib/components/shared/Segmented.svelte';
  import type { DMSValue } from '#lib/types/navigation.js';
  import { dmsToDecimal, normalize180 } from '#lib/utils/navigationMath.js';
  import {
    meridianSailing,
    parallelSailing,
  } from '#lib/utils/examNavigation.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let mode: 'parallel' | 'meridian' = $state('parallel');
  let lat: DMSValue = $state({ d: 35, m: 0, dir: 1 });
  let lon1: DMSValue = $state({ d: 139, m: 0, dir: 1 });
  let lon2: DMSValue = $state({ d: 141, m: 0, dir: 1 });
  let lat2: DMSValue = $state({ d: 40, m: 0, dir: 1 });

  function calculate() {
    const la = dmsToDecimal(lat);
    if (mode === 'parallel') {
      const l1 = dmsToDecimal(lon1);
      const l2 = dmsToDecimal(lon2);
      const dLonMin = normalize180(l2 - l1) * 60;
      onResult({
        mode,
        lat: la,
        lon1: l1,
        lon2: l2,
        dLonMin,
        ...parallelSailing(la, dLonMin),
      });
    } else {
      const la2 = dmsToDecimal(lat2);
      onResult({ mode, lat: la, lat2: la2, ...meridianSailing(la, la2) });
    }
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard cols={1}>
    <Segmented
      label="航法"
      bind:value={mode}
      options={[
        { value: 'parallel', label: '平行航法（東西に航行）' },
        { value: 'meridian', label: '正子午線航法（南北に航行）' },
      ]}
    />
  </SectionCard>
  {#if mode === 'parallel'}
    <SectionCard title="同一緯度上の 2 地点">
      <div class="sm:col-span-2">
        <DMSInput label="緯度 (Lat)" bind:value={lat} sign="NS" />
      </div>
      <DMSInput label="出発地 経度" bind:value={lon1} sign="EW" />
      <DMSInput label="到着地 経度" bind:value={lon2} sign="EW" />
    </SectionCard>
  {:else}
    <SectionCard title="同一子午線上の 2 地点">
      <DMSInput label="出発地 緯度" bind:value={lat} sign="NS" />
      <DMSInput label="到着地 緯度" bind:value={lat2} sign="NS" />
    </SectionCard>
  {/if}
</CalcForm>
