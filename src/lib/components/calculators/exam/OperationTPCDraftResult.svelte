<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import Step from '$lib/components/shared/Step.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';

  let { result }: { result: any } = $props();
</script>

<Sheet title="TPC and Mean Draft">
  <Step
    title="1. TPC = L × B × 0.01 × ρ"
    lines={[
      `${result.length} × ${result.breadth} × 0.01 × ${result.density} = ${result.tpc.toFixed(2)} t/cm`,
    ]}
  />
  <Step
    title="2. 積載による沈下と平均喫水"
    lines={[
      `沈下量 = ${result.cargo} / ${result.tpc.toFixed(2)} = ${result.draftIncreaseCm.toFixed(1)} cm`,
      `平均喫水 = ${result.initialDraft.toFixed(2)} + ${(result.draftIncreaseCm / 100).toFixed(3)} = ${result.finalDraftM.toFixed(2)} m`,
    ]}
  />
  <Step
    title="3. 喫水の変化から積載量"
    lines={[
      `喫水変化 = (${result.observedDraft.toFixed(2)} − ${result.initialDraft.toFixed(2)}) × 100 = ${result.observed.draftChangeCm.toFixed(1)} cm`,
      `積載量 = ${result.tpc.toFixed(2)} × ${result.observed.draftChangeCm.toFixed(1)} = ${result.observed.cargoTon.toFixed(1)} t`,
    ]}
  />
  <Highlight
    items={[
      { label: 'TPC', value: result.tpc.toFixed(2), unit: 't/cm' },
      {
        label: '積載後の平均喫水',
        value: result.finalDraftM.toFixed(2),
        unit: 'm',
      },
      {
        label: '喫水変化からの積載量',
        value: result.observed.cargoTon.toFixed(1),
        unit: 't',
      },
    ]}
  />
</Sheet>
