<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import Step from '#lib/components/shared/Step.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';

  let { result }: { result: any } = $props();
</script>

<Sheet title="GM from Rolling Period">
  <Step
    title="1. 横揺れ周期 T = 0.8 B / √GM より船幅"
    lines={[
      `B = T √GM / 0.8 = ${result.periodA} × √${result.gmA} / 0.8 = ${result.beamM.toFixed(2)} m`,
    ]}
  />
  <Step
    title="2. 船幅は一定なので GM ∝ 1 / T²"
    lines={[
      'GM_B = GM_A × (T_A / T_B)²',
      `= ${result.gmA} × (${result.periodA} / ${result.periodB})² = ${result.gmAtPortB.toFixed(3)} m`,
    ]}
  />
  <Highlight
    items={[
      { label: '船幅 B', value: result.beamM.toFixed(2), unit: 'm' },
      { label: 'B 港の GM', value: result.gmAtPortB.toFixed(3), unit: 'm' },
    ]}
  />
</Sheet>
