<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import Step from '$lib/components/shared/Step.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';

  let { result }: { result: any } = $props();
</script>

<Sheet title="Cargo from End Draft Change">
  <Step
    title="1. 平均喫水"
    lines={[
      `積荷前 (${result.fwd1} + ${result.aft1}) / 2 = ${result.initialMeanDraftM.toFixed(3)} m`,
      `積荷後 (${result.fwd2} + ${result.aft2}) / 2 = ${result.finalMeanDraftM.toFixed(3)} m`,
      `平均喫水の変化 ${result.draftChangeCm.toFixed(1)} cm`,
    ]}
  />
  <Step
    title="2. TPC = L × B × 0.01 × ρ"
    lines={[
      `${result.length} × ${result.breadth} × 0.01 × ${result.density} = ${result.tpcTonPerCm.toFixed(2)} t/cm`,
    ]}
  />
  <Step
    title="3. 積載量 = TPC × 平均喫水の変化"
    lines={[
      `${result.tpcTonPerCm.toFixed(2)} × ${result.draftChangeCm.toFixed(1)} = ${result.cargoTon.toFixed(1)} t`,
    ]}
  />
  <Highlight
    items={[
      { label: '積載重量', value: result.cargoTon.toFixed(1), unit: 't' },
    ]}
  />
</Sheet>
