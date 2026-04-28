<script lang="ts">
  import { formatDMS, toQuadrantBearing } from '$lib/utils/navigationMath';

  let { result }: { result: any } = $props();

  const isMercator = $derived(result.method === 'mercator');
  const isManual = $derived(result.precision === 'manual');
</script>

<div class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
  <div class="relative">
    <h3 class="text-sm font-bold text-white inline-block px-3 py-1 mb-3 {isMercator ? 'bg-emerald-700' : 'bg-blue-700'}">
      {isMercator ? 'Mercator Sailing' : 'Middle Latitude Sailing'}
    </h3>
    <div class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
      <div class="grid grid-cols-2 gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <p class="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">From</p>
          <p class="font-mono">{formatDMS(result.lat1, 'lat')}</p>
          <p class="font-mono">{formatDMS(result.lon1, 'lon')}</p>
        </div>
        <div>
          <p class="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">To</p>
          <p class="font-mono">{formatDMS(result.lat2, 'lat')}</p>
          <p class="font-mono">{formatDMS(result.lon2, 'lon')}</p>
        </div>
      </div>

      <div class="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div class="flex justify-between"><span>D.Lat</span> <span class="font-mono">{result.dLat.toFixed(1)}' {result.dLat >= 0 ? 'N' : 'S'}</span></div>
        <div class="flex justify-between"><span>D.Long</span> <span class="font-mono">{result.dLon.toFixed(1)}' {result.dLon >= 0 ? 'E' : 'W'}</span></div>
        {#if isMercator}
          <div class="flex justify-between"><span>DMP</span> <span class="font-mono">{result.dmp.toFixed(1)}'</span></div>
        {:else}
          <div class="flex justify-between"><span>Mid.Lat</span> <span class="font-mono">{formatDMS(result.midLat, 'lat')}</span></div>
          <div class="flex justify-between"><span>Dep</span> <span class="font-mono">{result.dep.toFixed(1)}'</span></div>
          {#if isManual && result.cosValue}
            <div class="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>cos({result.midLat.toFixed(1)}°)</span>
              <span class="font-mono">{result.cosValue.toFixed(10)}</span>
            </div>
          {/if}
        {/if}
      </div>

      <div class="bg-blue-50 dark:bg-blue-900/40 p-4 text-center border border-blue-200 dark:border-blue-800">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Course</p>
            <p class="text-3xl font-mono font-bold text-blue-700 dark:text-blue-400">{result.course.toFixed(1)}&deg;</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">({toQuadrantBearing(result.course)})</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Distance</p>
            <p class="text-3xl font-mono font-bold text-blue-700 dark:text-blue-400">{result.distance.toFixed(1)}'</p>
          </div>
        </div>
      </div>

      <!-- 計算モードについての注意書き -->
      <div class="mt-4 p-3 {isManual ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'} border rounded-lg">
        <div class="flex items-start gap-2">
          <svg class="w-4 h-4 {isManual ? 'text-orange-600 dark:text-orange-400' : 'text-amber-600 dark:text-amber-400'} mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            {#if isManual}
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            {:else}
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            {/if}
          </svg>
          <div class="text-xs {isManual ? 'text-orange-800 dark:text-orange-200' : 'text-amber-800 dark:text-amber-200'}">
            {#if isManual}
              <p class="font-semibold mb-1">手計算相当モード</p>
              <p class="leading-relaxed">
                関数電卓相当の精度（小数第1位丸め）で計算しています。各段階で小数第2位を四捨五入して丸め処理を行い、
                手計算の結果とほぼ一致する値になります。{isMercator ? '漸長緯度航法' : '中分緯度航法'}での計算結果です。
              </p>
            {:else}
              <p class="font-semibold mb-1">高精度計算モード</p>
              <p class="leading-relaxed">
                WGS84楕円体による高精度計算を行います。手計算では三角関数表の使用や中間値の丸め処理により、
                特に短距離（30海里以下）では±0.1海里程度の差異が生じる場合があります。
                {isMercator ? '漸長緯度航法' : '中分緯度航法'}での計算結果です。
              </p>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
