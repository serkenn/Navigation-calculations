<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import PositionInput from '#lib/components/shared/PositionInput.svelte';
  import DMSInput from '#lib/components/shared/DMSInput.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import TimeInput from '#lib/components/shared/TimeInput.svelte';
  import type { DMSValue, HMSValue } from '#lib/types/navigation.js';
  import { dmsToDecimal, normalize180 } from '#lib/utils/navigationMath.js';
  import { middleLatDeadReckoning } from '#lib/utils/mercatorSailing.js';
  import {
    intercept,
    latitudeByMeridianAltitude,
    localHourAngle,
    meripassLongitudeCorrection,
    sightReduction,
  } from '#lib/utils/astronomy.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  // 午前の観測
  let lat1: DMSValue = $state({ d: 37, m: 20, dir: 1 });
  let lon1: DMSValue = $state({ d: 146, m: 15, dir: 1 });
  let hs1: DMSValue = $state({ d: 48, m: 10.2, dir: 1 });
  let corr1 = $state(9.6);
  let gha1: DMSValue = $state({ d: 175, m: 40.0, dir: 1 });
  let dec1: DMSValue = $state({ d: 13, m: 2.8, dir: 1 });
  // 正午までの航走
  let course = $state(64);
  let distance = $state(45);
  // 正午の子午線高度
  let hs2: DMSValue = $state({ d: 65, m: 8.3, dir: 1 });
  let corr2 = $state(9.8);
  let dec2: DMSValue = $state({ d: 13, m: 0.8, dir: 1 });
  let eqTime: HMSValue = $state({ h: 0, m: 3, s: 47, sign: -1 });
  let zone: DMSValue = $state({ d: 135, m: 0, dir: 1 });

  function calculate() {
    // 1. 午前の位置の線
    const l1 = dmsToDecimal(lat1);
    const L1 = dmsToDecimal(lon1);
    const ho1 = dmsToDecimal(hs1) + corr1 / 60;
    const g1 = dmsToDecimal(gha1);
    const d1 = dmsToDecimal(dec1);
    const lha1 = localHourAngle(g1, L1);
    const { hc: hc1, z: z1 } = sightReduction(l1, d1, lha1);
    const a1 = intercept(ho1, hc1);

    // 2. 正午の推測位置（中分緯度航法）
    const run = middleLatDeadReckoning(l1, L1, course, distance);

    // 3. 正中時刻
    const eqt = (eqTime.h + eqTime.m / 60 + eqTime.s / 3600) * eqTime.sign;
    const lmt = 12 - eqt;
    const ut = lmt - run.lon2 / 15;
    const zoneMeridian = dmsToDecimal(zone);
    const zt = ut + zoneMeridian / 15;

    // 4. 正午緯度（天体が推測緯度より南なら南中）
    const ho2 = dmsToDecimal(hs2) + corr2 / 60;
    const d2 = dmsToDecimal(dec2);
    const bearing = d2 < run.lat2 ? 'S' : 'N';
    const noonLat = latitudeByMeridianAltitude(ho2, d2, bearing);

    // 5. 午前の LOP を正午へ転位し、正午緯度との交点で経度を改正
    const deltaLat = (noonLat.lat - run.lat2) * 60;
    const corr = meripassLongitudeCorrection(a1, z1, deltaLat, run.lat2);
    const noonLon = normalize180(run.lon2 + corr.dLongCorr / 60);

    onResult({
      lat1: l1,
      lon1: L1,
      hs1: dmsToDecimal(hs1),
      corr1,
      ho1,
      gha1: g1,
      dec1: d1,
      lha1,
      hc1,
      z1,
      a1,
      course,
      distance,
      run,
      eqt,
      lmt,
      ut,
      zt,
      zoneMeridian,
      hs2: dmsToDecimal(hs2),
      corr2,
      ho2,
      dec2: d2,
      bearing,
      zenith: noonLat.zenith,
      noonLat: noonLat.lat,
      deltaLat,
      depCorr: corr.depCorr,
      dLongCorr: corr.dLongCorr,
      noonLon,
    });
  }
</script>

<CalcForm onsubmit={calculate}>
  <SectionCard title="1. 午前の太陽観測">
    <PositionInput
      bind:lat={lat1}
      bind:lon={lon1}
      latLabel="推測緯度"
      lonLabel="推測経度"
    />
    <DMSInput label="六分儀高度 (Hs)" bind:value={hs1} />
    <NumberInput label="改正総数" bind:value={corr1} unit="'" />
    <DMSInput label="グリニッジ時角 (GHA)" bind:value={gha1} />
    <DMSInput label="赤緯 (Dec)" bind:value={dec1} sign="NS" />
  </SectionCard>

  <SectionCard title="2. 正午までの航走">
    <NumberInput label="真針路" bind:value={course} unit="°" />
    <NumberInput label="航程" bind:value={distance} unit="NM" />
  </SectionCard>

  <SectionCard title="3. 正午の子午線高度観測">
    <DMSInput label="子午線高度 (Hs)" bind:value={hs2} />
    <NumberInput label="改正総数" bind:value={corr2} unit="'" />
    <DMSInput label="赤緯 (Dec)" bind:value={dec2} sign="NS" />
    <TimeInput label="均時差 (Eq. of T.)" bind:value={eqTime} seconds signed />
    <DMSInput label="標準子午線" bind:value={zone} sign="EW" />
  </SectionCard>
</CalcForm>
