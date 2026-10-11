<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import Step from '#lib/components/shared/Step.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import { formatBearing } from '#lib/utils/navigationMath.js';

  let { result }: { result: any } = $props();

  const r = (deg: number) => (deg * Math.PI) / 180;
  // 風が「吹いてくる方向」を正とした成分（東・北）
  const ax = $derived(result.appSpeed * Math.sin(r(result.appDir)));
  const ay = $derived(result.appSpeed * Math.cos(r(result.appDir)));
  const sx = $derived(result.shipSpeed * Math.sin(r(result.heading)));
  const sy = $derived(result.shipSpeed * Math.cos(r(result.heading)));
  const f = (v: number) => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2);
</script>

<Sheet title="True Wind">
  <Step
    title="1. 視風を東西・南北成分に分解（吹いてくる方向を正）"
    lines={[
      `視風 ${formatBearing(result.appDir)} ${result.appSpeed.toFixed(1)} kn`,
      `東西 ${f(ax)}　南北 ${f(ay)}`,
    ]}
  />
  <Step
    title="2. 船の進行による風（船首方向から吹く）を差し引く"
    lines={[
      `船 ${formatBearing(result.heading)} ${result.shipSpeed.toFixed(1)} kn → 東西 ${f(sx)}　南北 ${f(sy)}`,
      `真風 = 視風 − 船速風 → 東西 ${f(ax - sx)}　南北 ${f(ay - sy)}`,
    ]}
  />
  <Highlight
    items={[
      { label: '真風向', value: formatBearing(result.trueDir) },
      { label: '真風速', value: result.trueSpeed.toFixed(1), unit: 'kn' },
    ]}
  />
</Sheet>
