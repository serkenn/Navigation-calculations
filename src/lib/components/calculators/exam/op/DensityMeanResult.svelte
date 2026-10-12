<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import Step from '#lib/components/shared/Step.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';

  let { result }: { result: any } = $props();
</script>

<Sheet title="Mean Draft by Density">
  <Step
    title="1. 移動前の平均喫水"
    lines={[
      `(${result.fwdDraft} + ${result.aftDraft}) / 2 = ${(result.initialMeanDraftCm / 100).toFixed(3)} m`,
    ]}
  />
  <Step
    title="2. 比重差による喫水変化 = W / TPC × (ρ1 − ρ2) / ρ2"
    lines={[
      `${result.displacement} / ${result.tpc} × (${result.sourceDensity} − ${result.destDensity}) / ${result.destDensity} = ${result.draftChangeCm.toFixed(1)} cm`,
    ]}
  />
  <Highlight
    items={[
      {
        label: '喫水の変化',
        value: `${result.draftChangeCm >= 0 ? '+' : '−'}${Math.abs(result.draftChangeCm).toFixed(1)}`,
        unit: 'cm',
      },
      {
        label: '移動後の平均喫水',
        value: (result.predictedMeanDraftCm / 100).toFixed(2),
        unit: 'm',
      },
    ]}
  />
</Sheet>
