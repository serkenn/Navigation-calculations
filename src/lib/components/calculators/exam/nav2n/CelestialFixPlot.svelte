<script lang="ts">
  import PositionPlot from '#lib/components/shared/PositionPlot.svelte';
  import { rad } from '#lib/utils/navigationMath.js';
  import type { CelestialFixResult } from '#lib/utils/exam2nNavigation.js';

  /** 天測位置決定用図（2 天体・高度差法）: 推測位置を中心に先測・後測の位置の線を描く */
  let { result }: { result: CelestialFixResult } = $props();

  // 先測の位置の線は航走分だけ転位した点を基点にする
  const runEnd = $derived({
    east: result.run * Math.sin(rad(result.course)),
    north: result.run * Math.cos(rad(result.course)),
  });
</script>

<PositionPlot
  run={{ course: result.course, distance: result.run }}
  azimuths={[
    { z: result.second.azimuth, label: `★ ${result.second.name}` },
    { from: runEnd, z: result.first.azimuth, label: `★ ${result.first.name}` },
  ]}
  lops={[
    { z: result.second.azimuth, a: result.second.intercept, color: '#2563eb' },
    {
      from: runEnd,
      z: result.first.azimuth,
      a: result.first.intercept,
      color: '#e11d48',
    },
  ]}
  fix={{ east: result.dep, north: result.dLat }}
>
  <p>
    <span class="inline-block w-3 h-0.5 align-middle bg-[#e11d48]"></span>
    {result.first.name} の位置の線（航走 {result.run.toFixed(1)}' 転位）
  </p>
  <p>
    <span class="inline-block w-3 h-0.5 align-middle bg-[#2563eb]"></span>
    {result.second.name} の位置の線
  </p>
  <p>◎ 後測時の船位　円の中心 = 推測位置</p>
</PositionPlot>
