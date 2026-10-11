<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import Step from '#lib/components/shared/Step.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import { formatLat, formatBearing } from '#lib/utils/navigationMath.js';

  let { result }: { result: any } = $props();

  const cosZ = $derived(
    Math.sin((result.dec * Math.PI) / 180) /
      Math.cos((result.lat * Math.PI) / 180),
  );
</script>

<Sheet title="Amplitude & Gyro Error">
  <Step
    title="1. 出没方位角 cos Z = sin d / cos l"
    lines={[
      `l = ${formatLat(result.lat)}　d = ${formatLat(result.dec)}`,
      `cos Z = ${cosZ.toFixed(4)} → Z = N ${(result.rising ? result.trueBearing : 360 - result.trueBearing).toFixed(1)}° ${result.rising ? 'E' : 'W'}`,
      `出没方位角 ${result.label}`,
    ]}
  />
  <Step
    title="2. ジャイロ誤差 = 真方位 − ジャイロ方位"
    lines={[
      `${formatBearing(result.trueBearing)} − ${formatBearing(result.gyroBearing)} = ${result.error >= 0 ? '+' : '−'}${Math.abs(result.error).toFixed(1)}°`,
    ]}
  />
  <Highlight
    items={[
      { label: '真方位', value: formatBearing(result.trueBearing) },
      {
        label: 'ジャイロ誤差',
        value: `${Math.abs(result.error).toFixed(1)}° ${result.error >= 0 ? 'E' : 'W'}`,
        sub:
          result.error >= 0
            ? '偏東 (ジャイロ方位が小さい)'
            : '偏西 (ジャイロ方位が大きい)',
      },
    ]}
  />
</Sheet>
