<script lang="ts">
  import { Calculator, Clock, MapPin, ArrowRight, Sun } from 'lucide-svelte';
  import DMSInput from '$lib/components/shared/DMSInput.svelte';
  import type { DMSValue } from '$lib/types/navigation';
  import {
    toDecimal, calculateRun, calculateSightReduction,
    calculateTrueAltitude, calculateMeripass
  } from '$lib/utils/navigationMath';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let metaMonth: number = $state(8);
  let metaDay: number = $state(19);
  let metaZoneLong: number = $state(135);
  let metaZoneDir: number = $state(1);

  let morningDrLat: DMSValue = $state({ d: 37, m: 20, dir: 1 });
  let morningDrLong: DMSValue = $state({ d: 146, m: 15, dir: 1 });
  let morningHs: DMSValue = $state({ d: 48, m: 10.2, dir: 1 });
  let morningTotalCorr: number = $state(9.6);
  let morningTotalCorrSign: number = $state(1);
  let morningGha: DMSValue = $state({ d: 315, m: 10.5, dir: 1 });
  let morningDec: DMSValue = $state({ d: 13, m: 2.8, dir: 1 });

  let runCourse: number = $state(64);
  let runDist: number = $state(45);

  let noonHs: DMSValue = $state({ d: 65, m: 8.3, dir: 1 });
  let noonTotalCorr: number = $state(9.8);
  let noonTotalCorrSign: number = $state(1);
  let noonDec: DMSValue = $state({ d: 13, m: 0.8, dir: 1 });
  let noonEqTimeM: number = $state(3);
  let noonEqTimeS: number = $state(47);
  let noonEqTimeSign: number = $state(-1);

  const handleCalculate = () => {
    const lat1 = toDecimal(morningDrLat.d, morningDrLat.m) * morningDrLat.dir;
    const lon1 = toDecimal(morningDrLong.d, morningDrLong.m) * morningDrLong.dir;
    const { ho: ho1 } = calculateTrueAltitude(toDecimal(morningHs.d, morningHs.m), morningTotalCorr * morningTotalCorrSign);
    const gha1 = toDecimal(morningGha.d, morningGha.m);
    let lha1 = gha1 + lon1;
    while (lha1 >= 360) lha1 -= 360;
    while (lha1 < 0) lha1 += 360;
    const dec1 = toDecimal(morningDec.d, morningDec.m) * morningDec.dir;
    const { hc: hc1, Z: z1 } = calculateSightReduction(lat1, dec1, lha1);
    const intercept1 = (ho1 - hc1) * 60;
    const { dLat, dep, dLong, lat2: lat2_DR } = calculateRun(lat1, runCourse, runDist);
    let lon2_DR = lon1 + dLong;
    while (lon2_DR > 180) lon2_DR -= 360;
    while (lon2_DR <= -180) lon2_DR += 360;
    const { ho: ho2 } = calculateTrueAltitude(toDecimal(noonHs.d, noonHs.m), noonTotalCorr * noonTotalCorrSign);
    const dec2 = toDecimal(noonDec.d, noonDec.m) * noonDec.dir;
    const zenithDist = 90 - ho2;
    const latCandidate1 = dec2 + zenithDist;
    const latCandidate2 = dec2 - zenithDist;
    const lat2_Obs = Math.abs(latCandidate1 - lat2_DR) < Math.abs(latCandidate2 - lat2_DR) ? latCandidate1 : latCandidate2;
    const deltaL_miles = (lat2_Obs - lat2_DR) * 60;
    const { dLongCorr } = calculateMeripass(intercept1, z1, deltaL_miles, lat2_DR);
    let lon2_Obs = lon2_DR + (dLongCorr / 60);
    while (lon2_Obs > 180) lon2_Obs -= 360;
    while (lon2_Obs <= -180) lon2_Obs += 360;
    const eqtHours = (noonEqTimeM + noonEqTimeS / 60) / 60 * noonEqTimeSign;
    const lmtPass = 12 - eqtHours;
    const gmtPass = lmtPass - (lon2_DR / 15);
    const zoneOffset = Math.round(metaZoneLong / 15) * metaZoneDir;
    const ztPass = gmtPass + zoneOffset;

    onResult({
      lat1, lon1, gha1, lha1, dec1, ho1, hc1, z1, intercept1,
      dLat, dep, dLong, lat2_DR, lon2_DR, ho2, dec2, lat2_Obs,
      deltaL_miles, dLongCorr, lon2_Obs, lmtPass, gmtPass, ztPass, zoneOffset,
      course: runCourse, dist: runDist,
      morningHs, morningTotalCorr, morningTotalCorrSign,
      morningGha: morningGha, noonHs, noonTotalCorr, noonTotalCorrSign,
      noonEqTime: { m: noonEqTimeM, s: noonEqTimeS, sign: noonEqTimeSign },
    });
  };
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-blue-600 pl-3">Meripass Input</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">海技試験問題の値を入力してください</p>
  </header>

  <!-- Date & Zone -->
  <section class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
    <div class="flex items-center gap-2 mb-3 text-slate-700 dark:text-slate-300 font-bold text-sm uppercase tracking-wider">
      <Clock size={16} /> Date & Zone
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="flex gap-2">
        <input type="number" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-blue-500 transition-colors" bind:value={metaMonth} placeholder="月" />
        <span class="self-center text-slate-400">/</span>
        <input type="number" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-blue-500 transition-colors" bind:value={metaDay} placeholder="日" />
      </div>
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 block">標準子午線 (Zone)</span>
        <div class="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded p-1 transition-colors">
          <input type="number" class="w-full text-right outline-none font-bold bg-transparent text-slate-900 dark:text-white" bind:value={metaZoneLong} />
          <span class="text-xs text-slate-400">°</span>
          <select class="bg-transparent font-bold text-sm outline-none text-slate-900 dark:text-white" bind:value={metaZoneDir}>
            <option value={1} class="bg-white dark:bg-slate-800">E</option>
            <option value={-1} class="bg-white dark:bg-slate-800">W</option>
          </select>
        </div>
      </div>
    </div>
  </section>

  <!-- 1. Morning Sight -->
  <section class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
    <div class="bg-blue-50/50 dark:bg-blue-900/20 px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 font-bold text-blue-800 dark:text-blue-300 text-sm">
      <MapPin size={16} /> 1. 第1観測 (Morning)
    </div>
    <div class="p-4 space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <DMSInput label="推測緯度" bind:value={morningDrLat} showSign signType="NS" />
        <DMSInput label="推測経度" bind:value={morningDrLong} showSign signType="EW" />
      </div>
      <div class="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
        <DMSInput label="器械高度 (hs)" bind:value={morningHs} />
        <div>
          <label class="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">改正総数 (Corr)</label>
          <div class="flex items-center gap-1 mt-1">
            <select class="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded p-1.5 text-sm font-bold text-slate-900 dark:text-white outline-none" bind:value={morningTotalCorrSign}>
              <option value={1} class="bg-white dark:bg-slate-800">+</option>
              <option value={-1} class="bg-white dark:bg-slate-800">-</option>
            </select>
            <input type="number" class="w-full p-1.5 border border-slate-300 dark:border-slate-600 rounded text-right text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={morningTotalCorr} />
            <span class="text-xs text-slate-400">'</span>
          </div>
        </div>
      </div>
      <div class="pt-2 border-t border-dashed border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-4">
        <DMSInput label="GHA (Sun)" bind:value={morningGha} />
        <DMSInput label="赤緯 (Dec)" bind:value={morningDec} showSign signType="NS" />
      </div>
    </div>
  </section>

  <!-- 2. Run -->
  <section class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
    <div class="bg-slate-50 dark:bg-slate-800 px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 text-sm">
      <ArrowRight size={16} /> 2. 航走 (Run)
    </div>
    <div class="p-4 grid grid-cols-2 gap-6">
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">真針路 (Course)</span>
        <div class="flex items-center gap-2 mt-1">
          <input type="number" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={runCourse} />
          <span class="text-sm text-slate-500 dark:text-slate-400">°</span>
        </div>
      </div>
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">航程 (Dist)</span>
        <div class="flex items-center gap-2 mt-1">
          <input type="number" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={runDist} />
          <span class="text-sm text-slate-500 dark:text-slate-400">miles</span>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. Noon Sight -->
  <section class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
    <div class="bg-orange-50/50 dark:bg-orange-900/20 px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 font-bold text-orange-800 dark:text-orange-300 text-sm">
      <Sun size={16} /> 3. 正中観測 (Noon)
    </div>
    <div class="p-4 space-y-4">
      <div class="grid grid-cols-2 gap-4 pb-2 border-b border-dashed border-slate-200 dark:border-slate-700">
        <DMSInput label="赤緯 (Dec)" bind:value={noonDec} showSign signType="NS" />
        <div>
          <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Eq. of Time</span>
          <div class="flex items-center gap-1 mt-1">
            <select class="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded p-1 text-sm text-slate-900 dark:text-white outline-none" bind:value={noonEqTimeSign}>
              <option value={1} class="bg-white dark:bg-slate-800">+</option>
              <option value={-1} class="bg-white dark:bg-slate-800">-</option>
            </select>
            <input type="number" class="w-12 p-1 border border-slate-300 dark:border-slate-600 rounded text-right text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={noonEqTimeM} placeholder="m" />
            <span class="text-xs text-slate-400">m</span>
            <input type="number" class="w-12 p-1 border border-slate-300 dark:border-slate-600 rounded text-right text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={noonEqTimeS} placeholder="s" />
            <span class="text-xs text-slate-400">s</span>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 items-end">
        <DMSInput label="子午線高度 (hs)" bind:value={noonHs} />
        <div>
          <label class="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">改正総数 (Corr)</label>
          <div class="flex items-center gap-1 mt-1">
            <select class="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded p-1.5 text-sm font-bold text-slate-900 dark:text-white outline-none" bind:value={noonTotalCorrSign}>
              <option value={1} class="bg-white dark:bg-slate-800">+</option>
              <option value={-1} class="bg-white dark:bg-slate-800">-</option>
            </select>
            <input type="number" class="w-full p-1.5 border border-slate-300 dark:border-slate-600 rounded text-right text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={noonTotalCorr} />
            <span class="text-xs text-slate-400">'</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Calculator size={20} /> 計算実行 (RUN)
  </button>
</div>
