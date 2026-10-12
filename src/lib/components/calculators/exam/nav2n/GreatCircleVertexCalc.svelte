<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import PositionInput from '#lib/components/shared/PositionInput.svelte';
  import DMSInput from '#lib/components/shared/DMSInput.svelte';
  import Segmented from '#lib/components/shared/Segmented.svelte';
  import type { DMSValue } from '#lib/types/navigation.js';
  import { dmsToDecimal } from '#lib/utils/navigationMath.js';
  import {
    greatCircleSailing,
    latitudeOnGreatCircle,
  } from '#lib/utils/greatCircle.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  // 初期値は過去問【R4/02】: 40°25'N 71°W → 35°50'N 7°10'W、25°W の子午線との交点
  let lat1: DMSValue = $state({ d: 40, m: 25, dir: 1 });
  let lon1: DMSValue = $state({ d: 71, m: 0, dir: -1 });
  let lat2: DMSValue = $state({ d: 35, m: 50, dir: 1 });
  let lon2: DMSValue = $state({ d: 7, m: 10, dir: -1 });
  let withCrossing = $state(true);
  let crossingLon: DMSValue = $state({ d: 25, m: 0, dir: -1 });
  let error = $state('');

  function calculate() {
    const p = {
      lat1: dmsToDecimal(lat1),
      lon1: dmsToDecimal(lon1),
      lat2: dmsToDecimal(lat2),
      lon2: dmsToDecimal(lon2),
    };
    const gc = greatCircleSailing(p.lat1, p.lon1, p.lat2, p.lon2);
    if (!gc.vertex) {
      error = '出発点と到着点が同一点または対蹠点のため、大圏が定まりません。';
      return;
    }
    error = '';
    const crossing = withCrossing
      ? {
          lon: dmsToDecimal(crossingLon),
          ...latitudeOnGreatCircle(
            gc.vertex.lat,
            gc.vertex.lon,
            dmsToDecimal(crossingLon),
          ),
        }
      : null;
    onResult({ ...p, ...gc, crossing });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="A 地点（出発点）">
    <PositionInput bind:lat={lat1} bind:lon={lon1} />
  </SectionCard>
  <SectionCard title="B 地点（到着点）">
    <PositionInput bind:lat={lat2} bind:lon={lon2} />
  </SectionCard>
  <SectionCard title="子午線との交点">
    <Segmented
      label="指定した子午線と大圏との交点の緯度"
      bind:value={withCrossing}
      options={[
        { value: true, label: '求める' },
        { value: false, label: '求めない' },
      ]}
    />
    {#if withCrossing}
      <DMSInput label="子午線の経度" bind:value={crossingLon} sign="EW" />
    {/if}
  </SectionCard>
</CalcForm>
