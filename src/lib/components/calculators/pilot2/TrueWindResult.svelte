<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import InfoGrid from '$lib/components/shared/InfoGrid.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';
  import { formatBearing } from '$lib/utils/navigationMath';

  let { result }: { result: any } = $props();
</script>

<Sheet title="Direction and Speed of True Wind">
  <InfoGrid
    items={[
      {
        label: '視風 Apparent',
        lines: [
          `相対 ${formatBearing(result.relativeDir)}（真 ${formatBearing(result.apparentTrueDir)}）`,
          `${result.windSpeed.toFixed(1)} kn`,
        ],
      },
      {
        label: '船 Ship',
        lines: [
          `Co ${formatBearing(result.shipCourse)}`,
          `Spd ${result.shipSpeed.toFixed(1)} kn`,
        ],
      },
    ]}
  />
  <Highlight
    items={[
      {
        label: '真風向 True Wind',
        value: formatBearing(result.trueDir),
        sub: '風が吹いてくる方位',
      },
      { label: '真風速 Speed', value: result.trueSpeed.toFixed(1), unit: 'kn' },
    ]}
  />
</Sheet>
