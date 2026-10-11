<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import Step from '$lib/components/shared/Step.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';
  import { formatBearing, normalize180 } from '$lib/utils/navigationMath';

  let { result }: { result: any } = $props();

  const alpha = $derived(normalize180(result.setDir - result.track));
  const beta = $derived(normalize180(result.shipCourse - result.track));
</script>

<Sheet title="Course to Steer in Current">
  <Step
    title="1. 針路線と潮流のなす角"
    lines={[
      `α = 流向 − 針路線 = ${formatBearing(result.setDir)} − ${formatBearing(result.track)} = ${alpha.toFixed(1)}°`,
    ]}
  />
  <Step
    title="2. 修正角（針路線に直交する流れを打ち消す）"
    lines={[
      'sin β = −(流速 / 速力) × sin α',
      `sin β = −(${result.drift} / ${result.shipSpeed}) × sin ${alpha.toFixed(1)}° → β = ${beta.toFixed(1)}°`,
      `視針路 = 針路線 + β = ${formatBearing(result.shipCourse)}`,
    ]}
  />
  <Step
    title="3. 実航速力"
    lines={[
      'SMG = 速力 × cos β + 流速 × cos α',
      `= ${result.shipSpeed} × cos ${beta.toFixed(1)}° + ${result.drift} × cos ${alpha.toFixed(1)}° = ${result.smg.toFixed(1)} kn`,
    ]}
  />
  <Highlight
    items={[
      { label: '視針路', value: formatBearing(result.shipCourse) },
      { label: '実航速力', value: result.smg.toFixed(1), unit: 'kn' },
    ]}
  />
</Sheet>
