<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import Step from '$lib/components/shared/Step.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';

  let { result }: { result: any } = $props();
</script>

<Sheet title="Geographic Light Range">
  <Step
    title="D = 2.083 (√H + √h)"
    lines={[
      `2.083 × √${result.lightHeight} = ${result.lightPart.toFixed(2)}'`,
      `2.083 × √${result.eyeHeight} = ${result.eyePart.toFixed(2)}'`,
      `D = ${result.lightPart.toFixed(2)} + ${result.eyePart.toFixed(2)} = ${result.range.toFixed(2)}'`,
    ]}
  />
  <Highlight
    items={[
      { label: '光達距離', value: result.range.toFixed(1), unit: '海里' },
    ]}
  />
</Sheet>
