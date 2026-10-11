<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import PositionInput from '#lib/components/shared/PositionInput.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import type { DMSValue } from '#lib/types/navigation.js';
  import { dmsToDecimal } from '#lib/utils/navigationMath.js';
  import { runningFix } from '#lib/utils/examNavigation.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let objLat: DMSValue = $state({ d: 30, m: 0, dir: 1 });
  let objLon: DMSValue = $state({ d: 136, m: 0, dir: 1 });
  let bearing1 = $state(293);
  let bearing2 = $state(308);
  let course = $state(190);
  let speed = $state(13);
  let minutes = $state(30);
  let error = $state('');

  function calculate() {
    const run = (speed * minutes) / 60;
    const p = {
      objLat: dmsToDecimal(objLat),
      objLon: dmsToDecimal(objLon),
      bearing1,
      bearing2,
      course,
      speed,
      minutes,
      run,
    };
    const r = runningFix(p.objLat, p.objLon, bearing1, bearing2, course, run);
    if (!r.possible) {
      error =
        'この方位と航走では船位が決まりません。方位・針路を確認してください。';
      return;
    }
    error = '';
    onResult({ ...p, ...r });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="物標の位置">
    <PositionInput bind:lat={objLat} bind:lon={objLon} />
  </SectionCard>
  <SectionCard title="方位">
    <NumberInput label="第 1 方位（真方位）" bind:value={bearing1} unit="°" />
    <NumberInput label="第 2 方位（真方位）" bind:value={bearing2} unit="°" />
  </SectionCard>
  <SectionCard title="2 回の測定の間の航走" cols={3}>
    <NumberInput label="真針路" bind:value={course} unit="°" />
    <NumberInput label="速力" bind:value={speed} unit="kn" />
    <NumberInput label="経過時間" bind:value={minutes} unit="分" />
  </SectionCard>
</CalcForm>
