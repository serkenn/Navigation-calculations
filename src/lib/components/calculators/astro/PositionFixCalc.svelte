<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import PositionInput from '#lib/components/shared/PositionInput.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import type { DMSValue } from '#lib/types/navigation.js';
  import { dmsToDecimal } from '#lib/utils/navigationMath.js';
  import { intersectLOPs } from '#lib/utils/astronomy.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let lat: DMSValue = $state({ d: 35, m: 0, dir: 1 });
  let lon: DMSValue = $state({ d: 139, m: 45, dir: 1 });
  let a1 = $state(5.2);
  let z1 = $state(45);
  let a2 = $state(-3.1);
  let z2 = $state(135);
  let error = $state('');

  function calculate() {
    const la = dmsToDecimal(lat);
    const lo = dmsToDecimal(lon);
    const lops = [
      { a: a1, z: z1 },
      { a: a2, z: z2 },
    ];
    const fix = intersectLOPs(la, lo, lops[0], lops[1]);
    if (!fix.possible) {
      error = '2 本の位置の線がほぼ平行なため、交点を求められません。';
      return;
    }
    error = '';
    onResult({ drLat: la, drLon: lo, lops, ...fix });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="推測位置 (DR)">
    <PositionInput bind:lat bind:lon />
  </SectionCard>
  <SectionCard title="位置の線 1">
    <NumberInput
      label="修正差 (Intercept)"
      bind:value={a1}
      unit="'"
      hint="Toward は正、Away は負"
    />
    <NumberInput label="方位角 (Zn)" bind:value={z1} unit="°" />
  </SectionCard>
  <SectionCard title="位置の線 2">
    <NumberInput
      label="修正差 (Intercept)"
      bind:value={a2}
      unit="'"
      hint="Toward は正、Away は負"
    />
    <NumberInput label="方位角 (Zn)" bind:value={z2} unit="°" />
  </SectionCard>
</CalcForm>
