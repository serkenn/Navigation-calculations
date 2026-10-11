<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import Step from '#lib/components/shared/Step.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';

  let { result }: { result: any } = $props();
</script>

<Sheet title="Blind Zone Distance">
  <Step
    title="1. 水面からの高さ"
    lines={[
      `眼高 = ${result.eyeFromKeel} − ${result.draft} = ${result.eyeAboveSeaM.toFixed(2)} m`,
      `障害物 = ${result.obstacleFromKeel} − ${result.draft} = ${result.obstacleAboveSeaM.toFixed(2)} m`,
    ]}
  />
  <Step
    title="2. 相似三角形より、障害物から死角の端まで"
    lines={[
      'x = 水平距離 × 障害物高 / (眼高 − 障害物高)',
      `= ${result.eyeToObstacle} × ${result.obstacleAboveSeaM.toFixed(2)} / ${(result.eyeAboveSeaM - result.obstacleAboveSeaM).toFixed(2)} = ${result.blindFromObstacleM.toFixed(1)} m`,
    ]}
  />
  <Highlight
    items={[
      {
        label: '障害物から',
        value: result.blindFromObstacleM.toFixed(1),
        unit: 'm',
      },
      {
        label: '見張り位置から',
        value: result.blindFromEyeM.toFixed(1),
        unit: 'm',
      },
    ]}
  />
</Sheet>
