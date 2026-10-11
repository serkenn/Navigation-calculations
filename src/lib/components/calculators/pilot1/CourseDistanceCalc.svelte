<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import PositionInput from '#lib/components/shared/PositionInput.svelte';
  import Segmented from '#lib/components/shared/Segmented.svelte';
  import type { DMSValue } from '#lib/types/navigation.js';
  import { dmsToDecimal } from '#lib/utils/navigationMath.js';
  import {
    middleLatCourseDistance,
    middleLatCourseDistanceManual,
    mercatorCourseDistance,
  } from '#lib/utils/mercatorSailing.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let lat1: DMSValue = $state({ d: 35, m: 0, dir: 1 });
  let lon1: DMSValue = $state({ d: 139, m: 45, dir: 1 });
  let lat2: DMSValue = $state({ d: 33, m: 30, dir: 1 });
  let lon2: DMSValue = $state({ d: 135, m: 45, dir: 1 });
  let method: 'midlat' | 'mercator' = $state('midlat');
  let precision: 'exact' | 'manual' = $state('exact');

  function calculate() {
    const p = {
      lat1: dmsToDecimal(lat1),
      lon1: dmsToDecimal(lon1),
      lat2: dmsToDecimal(lat2),
      lon2: dmsToDecimal(lon2),
    };
    const r =
      method === 'mercator'
        ? mercatorCourseDistance(p.lat1, p.lon1, p.lat2, p.lon2)
        : precision === 'manual'
          ? middleLatCourseDistanceManual(p.lat1, p.lon1, p.lat2, p.lon2)
          : middleLatCourseDistance(p.lat1, p.lon1, p.lat2, p.lon2);
    onResult({ ...p, ...r, method, precision });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard cols={1}>
    <Segmented
      label="航法"
      bind:value={method}
      options={[
        { value: 'midlat', label: '中分緯度航法' },
        { value: 'mercator', label: '漸長緯度航法' },
      ]}
    />
    {#if method === 'midlat'}
      <Segmented
        label="計算方法"
        bind:value={precision}
        options={[
          { value: 'exact', label: '通常計算' },
          { value: 'manual', label: '手計算相当' },
        ]}
        hint={precision === 'manual'
          ? '各段階で小数第 1 位に丸めて、関数電卓による手計算と同じ手順で計算します'
          : '途中で丸めずに計算します'}
      />
    {/if}
  </SectionCard>

  <SectionCard title="出発点 (From)">
    <PositionInput bind:lat={lat1} bind:lon={lon1} />
  </SectionCard>

  <SectionCard title="到着点 (To)">
    <PositionInput bind:lat={lat2} bind:lon={lon2} />
  </SectionCard>
</CalcForm>
