<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import PositionInput from '#lib/components/shared/PositionInput.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import DMSInput from '#lib/components/shared/DMSInput.svelte';
  import TimeInput from '#lib/components/shared/TimeInput.svelte';
  import Field from '#lib/components/shared/Field.svelte';
  import { boxClass, inputClass } from '#lib/components/shared/inputStyles.js';
  import { useAccent } from '#lib/theme/accent.js';
  import type { DMSValue, HMSValue } from '#lib/types/navigation.js';
  import { dmsToDecimal } from '#lib/utils/navigationMath.js';
  import { hmsToHours } from '#lib/utils/timeConversion.js';
  import { celestialFix } from '#lib/utils/exam2nNavigation.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  const accent = useAccent();

  interface SightInput {
    name: string;
    time: HMSValue;
    hs: DMSValue;
    corr: number;
    gha: DMSValue;
    dec: DMSValue;
  }

  // 初期値は 2304〜2502 出題の例題
  let lat: DMSValue = $state({ d: 11, m: 20, dir: 1 });
  let lon: DMSValue = $state({ d: 60, m: 42, dir: 1 });
  let course = $state(100);
  let speed = $state(18);
  let sights: SightInput[] = $state([
    {
      name: 'Capella',
      time: { h: 15, m: 15, s: 23, sign: 1 },
      hs: { d: 55, m: 17.0, dir: 1 },
      corr: -9.6,
      gha: { d: 294, m: 42.2, dir: 1 },
      dec: { d: 46, m: 0.7, dir: 1 },
    },
    {
      name: 'Sirius',
      time: { h: 15, m: 21, s: 33, sign: 1 },
      hs: { d: 52, m: 43.7, dir: 1 },
      corr: -9.6,
      gha: { d: 274, m: 14.8, dir: 1 },
      dec: { d: 16, m: 44.6, dir: -1 },
    },
  ]);
  let error = $state('');

  function toSight(s: SightInput, i: number) {
    return {
      name: s.name.trim() || `天体 ${i + 1}`,
      time: hmsToHours(s.time.h, s.time.m, s.time.s),
      hs: dmsToDecimal(s.hs),
      corr: s.corr,
      gha: dmsToDecimal(s.gha),
      dec: dmsToDecimal(s.dec),
    };
  }

  function calculate() {
    const drLat = dmsToDecimal(lat);
    const drLon = dmsToDecimal(lon);
    const r = celestialFix(
      drLat,
      drLon,
      course,
      speed,
      toSight(sights[0], 0),
      toSight(sights[1], 1),
    );
    if (!r.possible) {
      error = '2 本の位置の線がほぼ平行なため、交点を求められません。';
      return;
    }
    error = '';
    onResult({ ...r, drLat, drLon, course, speed });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="推測位置・針路・速力">
    <PositionInput
      bind:lat
      bind:lon
      latLabel="推測緯度 (DR Lat)"
      lonLabel="推測経度 (DR Long)"
    />
    <NumberInput label="真針路 (Co.)" bind:value={course} unit="°" />
    <NumberInput label="速力 (Speed)" bind:value={speed} unit="kn" />
  </SectionCard>

  {#each sights as sight, i (i)}
    <SectionCard title="天体 {i + 1}">
      <Field label="天体名">
        <div class="{boxClass} {accent().focus}">
          <input
            type="text"
            class="{inputClass} !text-left"
            bind:value={sight.name}
          />
        </div>
      </Field>
      <TimeInput label="観測時刻 (U.T.)" bind:value={sight.time} seconds />
      <DMSInput label="測高度 (as)" bind:value={sight.hs} />
      <NumberInput
        label="高度改正値 (Corr.)"
        bind:value={sight.corr}
        unit="'"
        hint="減ずる場合は負の値"
      />
      <DMSInput label="グリニッジ時角 (hG)" bind:value={sight.gha} />
      <DMSInput label="赤緯 (d)" bind:value={sight.dec} sign="NS" />
    </SectionCard>
  {/each}
</CalcForm>
