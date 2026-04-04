<script lang="ts">
  import { formatDMS } from '$lib/utils/navigationMath';

  let { result }: { result: any } = $props();

  // Helper: format minutes value for display
  const fmtMin = (v: number) => Math.abs(v).toFixed(1);
  const fmtDeg = (v: number) => Math.abs(v).toFixed(1);
  const signChar = (v: number) => v >= 0 ? '+' : '-';
  const latDir = (v: number) => v >= 0 ? 'N' : 'S';
  const lonDir = (v: number) => v >= 0 ? 'E' : 'W';

  // Derived values
  const meanLat = $derived((result.lat1 + result.lat2_DR) / 2);
  const dLatMin = $derived(result.dLat * 60);
  const dLongMin = $derived(result.dLong * 60);
  const zenithDist = $derived(90 - result.ho2);

  // Format time components
  const fmtTime = (hours: number) => {
    const h = Math.floor(Math.abs(hours));
    const m = Math.floor((Math.abs(hours) % 1) * 60);
    const s = Math.round(((Math.abs(hours) * 60) % 1) * 60);
    return `${h}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
  };
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-[13px] leading-relaxed">

  <!-- ━━━ 1. 中分緯度・推測位置 ━━━ -->
  <section>
    <div class="font-bold text-base border-b-2 border-slate-800 dark:border-slate-400 pb-1 mb-4">
      (解) 1. 推測位置の算出 (D.R.P at Noon)
    </div>

    <!-- 画面: 縦並び / 印刷: 3列横並び -->
    <div class="drp-calc-grid ml-4 space-y-3">

      <!-- D.Lat -->
      <div class="drp-col-dlat">
        <div>
          <span class="font-bold">D.Lat</span>
          <span class="ml-2">= Dist × cos Co</span>
        </div>
        <div class="ml-4">= {result.dist}' × cos {result.course}°</div>
        <div class="ml-4 font-bold">= {fmtMin(dLatMin)}' {latDir(dLatMin)}</div>
        <div class="mt-2 border-t border-slate-300 dark:border-slate-700 pt-1">
          <div>l₁ = {formatDMS(result.lat1, 'lat')}</div>
          <div>{signChar(dLatMin)}{fmtMin(dLatMin)}'</div>
          <div class="font-bold border-t border-slate-400 dark:border-slate-600 pt-1 mt-1">
            l₂ = {formatDMS(result.lat2_DR, 'lat')}
          </div>
        </div>
      </div>

      <!-- 中分緯度 + Dep -->
      <div class="drp-col-ml mt-2">
        <div>
          <span class="font-bold">中分緯度</span>
        </div>
        <div class="ml-4">= (l₁ + l₂) / 2</div>
        <div class="ml-4 font-bold">= {formatDMS(meanLat, 'lat')}</div>
        <div class="mt-2 border-t border-slate-300 dark:border-slate-700 pt-1">
          <div><span class="font-bold">Dep</span> = Dist × sin Co</div>
          <div class="ml-4">= {result.dist}' × sin {result.course}°</div>
          <div class="ml-4 font-bold">= {fmtMin(result.dep)}'</div>
        </div>
      </div>

      <!-- D.Long -->
      <div class="drp-col-dlong mt-2">
        <div>
          <span class="font-bold">D.Long</span>
          <span class="ml-2">= Dep / cos(M.Lat)</span>
        </div>
        <div class="ml-4">= {fmtMin(result.dep)}' / cos {fmtDeg(meanLat)}°</div>
        <div class="ml-4 font-bold">= {fmtMin(dLongMin)}' {lonDir(dLongMin)}</div>
        <div class="mt-2 border-t border-slate-300 dark:border-slate-700 pt-1">
          <div>L₁ = {formatDMS(result.lon1, 'lon')}</div>
          <div>{signChar(dLongMin)}{fmtMin(dLongMin)}'</div>
          <div class="font-bold border-t border-slate-400 dark:border-slate-600 pt-1 mt-1">
            L₂ = {formatDMS(result.lon2_DR, 'lon')}
          </div>
        </div>
      </div>

    </div>

    <!-- DRP まとめ -->
    <div class="mt-4 border-2 border-slate-700 dark:border-slate-400 p-3 text-center">
      <div class="text-xs mb-1">正午推測位置 (Noon D.R.)</div>
      <div class="font-bold text-base">
        l₂ {formatDMS(result.lat2_DR, 'lat')}　　L₂ {formatDMS(result.lon2_DR, 'lon')}
      </div>
    </div>
  </section>

  <!-- ━━━ 2. 正中時刻 ━━━ -->
  <section>
    <div class="font-bold text-base border-b-2 border-slate-800 dark:border-slate-400 pb-1 mb-4">
      2. 正中時刻の算出
    </div>

    <div class="ml-4 space-y-1">
      <div class="flex justify-between max-w-sm">
        <span>L.A.T. Noon</span>
        <span>12-00-00</span>
      </div>
      <div class="flex justify-between max-w-sm">
        <span>Eq. of T.</span>
        <span>{result.noonEqTime.sign < 0 ? '(+)' : '(-)'} {String(result.noonEqTime.m).padStart(2,'0')}m {String(result.noonEqTime.s).padStart(2,'0')}s</span>
      </div>
      <div class="flex justify-between max-w-sm border-t border-slate-400 dark:border-slate-600 pt-1">
        <span>L.M.T. Pass</span>
        <span>{fmtTime(result.lmtPass)}</span>
      </div>
      <div class="flex justify-between max-w-sm">
        <span>Long (Time)</span>
        <span>{result.lon2_DR >= 0 ? '(-)' : '(+)'} {Math.floor(Math.abs(result.lon2_DR) / 15)}h {Math.round((Math.abs(result.lon2_DR) / 15 % 1) * 60)}m</span>
      </div>
      <div class="flex justify-between max-w-sm border-t border-slate-400 dark:border-slate-600 pt-1 font-bold">
        <span>G.M.T.</span>
        <span>{fmtTime(result.gmtPass)}</span>
      </div>
    </div>

    <div class="mt-4 border-2 border-slate-700 dark:border-slate-400 p-3 text-center">
      <div class="text-xs mb-1">正中時 (Standard Time)</div>
      <div class="font-bold text-lg">
        S.M.T. {fmtTime(result.ztPass)}
      </div>
      <div class="text-xs mt-1">Zone Offset: {result.zoneOffset > 0 ? '+' : ''}{result.zoneOffset}</div>
    </div>
  </section>

  <!-- ━━━ 3. 午前の観測 (Morning Sight) ━━━ -->
  <section>
    <div class="font-bold text-base border-b-2 border-slate-800 dark:border-slate-400 pb-1 mb-4">
      3. 午前の観測 (Morning Sight)
    </div>

    <div class="ml-4 space-y-1">
      <!-- 測高度改正 -->
      <div class="flex justify-between max-w-sm">
        <span>hs</span>
        <span>{result.morningHs.d}° {result.morningHs.m}'</span>
      </div>
      <div class="flex justify-between max-w-sm text-slate-500 dark:text-slate-400">
        <span>(Total Corr)</span>
        <span>({result.morningTotalCorrSign >= 0 ? '+' : '-'}) {result.morningTotalCorr}'</span>
      </div>
      <div class="flex justify-between max-w-sm font-bold border-t border-slate-400 dark:border-slate-600 pt-1">
        <span>Ho</span>
        <span>{formatDMS(result.ho1, 'angle')}</span>
      </div>

      <!-- GHA・LHA -->
      <div class="mt-3 flex justify-between max-w-sm">
        <span>GHA</span>
        <span>{result.morningGha.d}° {result.morningGha.m}'</span>
      </div>
      <div class="flex justify-between max-w-sm">
        <span>Long</span>
        <span>{result.lon1 >= 0 ? '(+)' : '(-)'} {formatDMS(Math.abs(result.lon1), 'angle')}</span>
      </div>
      <div class="flex justify-between max-w-sm font-bold border-t border-slate-400 dark:border-slate-600 pt-1">
        <span>LHA (t)</span>
        <span>{result.lha1.toFixed(1)}°</span>
      </div>

      <!-- 計算高度・方位角 -->
      <div class="mt-3 pt-2 border-t border-dashed border-slate-300 dark:border-slate-700">
        <div class="mb-2 text-xs text-slate-500 dark:text-slate-400">
          sin(Ac) = sin d · sin l + cos d · cos l · cos t
        </div>
        <div class="flex justify-between max-w-sm">
          <span>l (Lat)</span>
          <span>{formatDMS(result.lat1, 'lat')}</span>
        </div>
        <div class="flex justify-between max-w-sm">
          <span>d (Dec)</span>
          <span>{formatDMS(result.dec1, 'lat')}</span>
        </div>
        <div class="flex justify-between max-w-sm font-bold mt-1">
          <span>Ac</span>
          <span>{formatDMS(result.hc1, 'angle')}</span>
        </div>
      </div>

      <!-- 方位角 -->
      <div class="mt-2">
        <div class="mb-1 text-xs text-slate-500 dark:text-slate-400">
          cos(Z) = (sin d - sin l · sin Ac) / (cos l · cos Ac)
        </div>
        <div class="flex justify-between max-w-sm font-bold">
          <span>Z</span>
          <span>S {result.z1.toFixed(1)}° E</span>
        </div>
      </div>

      <!-- インターセプト -->
      <div class="mt-3">
        <div class="flex justify-between max-w-sm">
          <span>Ho</span>
          <span>{formatDMS(result.ho1, 'angle')}</span>
        </div>
        <div class="flex justify-between max-w-sm">
          <span>Ac</span>
          <span>{formatDMS(result.hc1, 'angle')}</span>
        </div>
        <div class="flex justify-between max-w-sm font-bold border-t border-slate-400 dark:border-slate-600 pt-1">
          <span>I = Ho - Ac</span>
          <span>{result.intercept1.toFixed(1)}' {result.intercept1 >= 0 ? '(T) 遠ざかる' : '(A) 近づく'}</span>
        </div>
      </div>
    </div>

    <!-- A の答 -->
    <div class="mt-4 border-2 border-slate-700 dark:border-slate-400 p-3 text-center">
      <div class="text-xs mb-1">Ⓐ</div>
      <div class="font-bold">
        I = {result.intercept1.toFixed(1)}' {result.intercept1 >= 0 ? 'T' : 'A'}　　Z = S {result.z1.toFixed(1)}° E
      </div>
    </div>
  </section>

  <!-- ━━━ 4. 正午の観測 (Noon Sight) ━━━ -->
  <section>
    <div class="font-bold text-base border-b-2 border-slate-800 dark:border-slate-400 pb-1 mb-4">
      4. 正午の観測 (Noon Sight) — 子午線高度緯度法
    </div>

    <div class="ml-4 space-y-1">
      <div class="flex justify-between max-w-sm">
        <span>hs</span>
        <span>{result.noonHs.d}° {result.noonHs.m}'</span>
      </div>
      <div class="flex justify-between max-w-sm text-slate-500 dark:text-slate-400">
        <span>(Corr)</span>
        <span>({result.noonTotalCorrSign >= 0 ? '+' : '-'}) {result.noonTotalCorr}'</span>
      </div>
      <div class="flex justify-between max-w-sm font-bold border-t border-slate-400 dark:border-slate-600 pt-1">
        <span>Ho</span>
        <span>{formatDMS(result.ho2, 'angle')}</span>
      </div>

      <div class="mt-3">
        <div class="flex justify-between max-w-sm">
          <span>90° - Ho</span>
          <span>{formatDMS(zenithDist, 'angle')} (z)</span>
        </div>
        <div class="flex justify-between max-w-sm">
          <span>d (Dec)</span>
          <span>{formatDMS(result.dec2, 'lat')}</span>
        </div>
      </div>

      <div class="mt-2 pt-2 border-t border-dashed border-slate-300 dark:border-slate-700">
        <div class="mb-1 text-xs text-slate-500 dark:text-slate-400">
          {result.dec2 >= 0 && result.lat2_DR >= 0 ? 'l = d + z (同名)' : 'l = d - z (異名)'}
          {result.dec2 >= 0 ? '' : ' → 赤緯と天頂距離の関係から'}
        </div>
        <div class="flex justify-between max-w-sm">
          <span>{formatDMS(Math.abs(result.dec2), 'angle')}</span>
        </div>
        <div class="flex justify-between max-w-sm">
          <span>{signChar(zenithDist)}{formatDMS(zenithDist, 'angle')}</span>
        </div>
        <div class="flex justify-between max-w-sm font-bold border-t border-slate-400 dark:border-slate-600 pt-1 mt-1">
          <span>観測緯度</span>
          <span>{formatDMS(result.lat2_Obs, 'lat')}</span>
        </div>
      </div>
    </div>

    <!-- B の答 -->
    <div class="mt-4 border-2 border-slate-700 dark:border-slate-400 p-3 text-center">
      <div class="text-xs mb-1">Ⓑ I (Noon)</div>
      <div class="font-bold">
        I = {(result.deltaL_miles).toFixed(1)}' {latDir(result.deltaL_miles)}
      </div>
    </div>
  </section>

  <!-- ━━━ 5. 修正経度・最終船位 ━━━ -->
  <section>
    <div class="font-bold text-base border-b-2 border-slate-800 dark:border-slate-400 pb-1 mb-4">
      5. 経度修正・船位決定
    </div>

    <div class="ml-4 space-y-2">
      <div class="text-xs text-slate-500 dark:text-slate-400 mb-2">
        ΔL = (I · csc Z − Δl · cot Z) · sec l₂
      </div>
      <div class="flex justify-between max-w-md">
        <span>I (Morning)</span>
        <span>{result.intercept1.toFixed(1)}'</span>
      </div>
      <div class="flex justify-between max-w-md">
        <span>Z (Azimuth)</span>
        <span>S {result.z1.toFixed(1)}° E</span>
      </div>
      <div class="flex justify-between max-w-md">
        <span>Δl (Lat correction)</span>
        <span>{result.deltaL_miles.toFixed(1)}'</span>
      </div>
      <div class="flex justify-between max-w-md font-bold border-t border-slate-400 dark:border-slate-600 pt-1">
        <span>D.Long 修正量</span>
        <span>{result.dLongCorr.toFixed(1)}' {lonDir(result.dLongCorr)}</span>
      </div>

      <div class="mt-3">
        <div class="flex justify-between max-w-md">
          <span>L₂ (DR)</span>
          <span>{formatDMS(result.lon2_DR, 'lon')}</span>
        </div>
        <div class="flex justify-between max-w-md">
          <span>D.L</span>
          <span>{signChar(result.dLongCorr)}{fmtMin(result.dLongCorr / 60)}' {lonDir(result.dLongCorr)}</span>
        </div>
        <div class="flex justify-between max-w-md font-bold border-t border-slate-400 dark:border-slate-600 pt-1 mt-1">
          <span>修正経度</span>
          <span>{formatDMS(result.lon2_Obs, 'lon')}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ━━━ 最終答案 ━━━ -->
  <section>
    <div class="border-4 border-double border-slate-800 dark:border-slate-400 p-5">
      <div class="text-center mb-4">
        <div class="font-bold text-base tracking-widest">Ans. 最終答案</div>
      </div>

      <div class="space-y-3">
        <div class="border border-slate-400 dark:border-slate-600 p-3 flex justify-between items-center">
          <span>① 正中時</span>
          <span class="font-bold text-lg">S.M.T. {fmtTime(result.ztPass)}</span>
        </div>

        <div class="border border-slate-400 dark:border-slate-600 p-3 flex justify-between items-center">
          <span>② 修正正午位置</span>
          <div class="text-right font-bold text-lg">
            <div>l = {formatDMS(result.lat2_Obs, 'lat')}</div>
            <div>L = {formatDMS(result.lon2_Obs, 'lon')}</div>
          </div>
        </div>

        {#if result.morningGha}
        <div class="border border-slate-400 dark:border-slate-600 p-3 flex justify-between items-center">
          <span>③ 計算方位角</span>
          <span class="font-bold text-lg">Z = S {result.z1.toFixed(1)}° E</span>
        </div>
        {/if}
      </div>
    </div>
  </section>
</div>
