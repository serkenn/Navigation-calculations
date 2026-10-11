<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import Step from '$lib/components/shared/Step.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';
  import Note from '$lib/components/shared/Note.svelte';
  import {
    formatLat,
    formatLon,
    formatClock,
    formatDirectedDMS,
  } from '$lib/utils/navigationMath';
  import { formatHMS } from '$lib/utils/timeConversion';

  let { result }: { result: any } = $props();

  // 経度時差 = (経度 − 標準子午線) / 15。東にあれば LMT から引く
  const diff = $derived((result.lon - result.zone) / 15);
  const diffText = $derived(
    `(${diff >= 0 ? '−' : '+'}) ${formatHMS(Math.abs(diff), 0)}`,
  );
</script>

<Sheet title="Sunrise & Sunset">
  <Step
    title="1. 日付・位置"
    lines={[
      `${result.date}  ${formatLat(result.lat)}  ${formatLon(result.lon)}`,
      `赤緯 ${formatLat(result.dec)}　均時差 ${result.eqTime >= 0 ? '+' : '−'}${Math.abs(result.eqTime).toFixed(1)} 分`,
    ]}
  />
  <Step
    title="2. 地方平時 (LMT)"
    lines={[
      `日出 ${formatClock(result.riseLMT)}　日没 ${formatClock(result.setLMT)}`,
    ]}
  />
  <Step
    title="3. 経度時差で標準時へ"
    lines={[
      `経度 − 標準子午線 = ${formatDirectedDMS(result.lon - result.zone, 'E', 'W')} → ${diffText}`,
      `日出 ${formatClock(result.riseLMT)} ${diffText} = ${formatClock(result.riseZT)}`,
      `日没 ${formatClock(result.setLMT)} ${diffText} = ${formatClock(result.setZT)}`,
    ]}
  />
  <Highlight
    items={[
      { label: '日出 (標準時)', value: formatClock(result.riseZT) },
      { label: '日没 (標準時)', value: formatClock(result.setZT) },
    ]}
  />
  <Note
    >太陽の中心高度 −50′（大気差 34′ + 視半径
    16′）で計算。赤緯・均時差は簡易暦による概算です。</Note
  >
</Sheet>
