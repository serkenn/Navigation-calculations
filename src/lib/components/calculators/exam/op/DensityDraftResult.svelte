<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import Step from '#lib/components/shared/Step.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';

  let { result }: { result: any } = $props();

  const m = (cm: number) => `${(cm / 100).toFixed(3)} m`;
</script>

<Sheet title="Arrival Draft">
  <Step
    title="1. 出港時の平均喫水"
    lines={[
      `(${result.fwdDraft} + ${result.aftDraft}) / 2 = ${m(result.initialMeanDraftCm)}`,
    ]}
  />
  <Step
    title="2. 消費による浮上"
    lines={[
      `消費量 ${result.fuel} + ${result.fresh} = ${result.totalConsumedTon} t`,
      `浮上量 = ${result.totalConsumedTon} / ${result.tpc} = ${(result.initialMeanDraftCm - result.meanDraftAfterConsumeCm).toFixed(1)} cm`,
      `排水量 ${result.dispAfterConsumeTon} t　平均喫水 ${m(result.meanDraftAfterConsumeCm)}`,
    ]}
  />
  <Step
    title="3. 比重差による沈下 = W / TPC × (ρ1 − ρ2) / ρ2"
    lines={[
      `${result.dispAfterConsumeTon} / ${result.tpc} × (${result.sourceDensity} − ${result.destDensity}) / ${result.destDensity} = ${result.densityChangeCm.toFixed(1)} cm`,
      `入港時の平均喫水 ${m(result.predictedMeanDraftCm)}`,
    ]}
  />
  <Step
    title="4. 消費によるトリム変化（LCF まわりのモーメント / MTC）"
    lines={[
      `モーメント = ${result.fuel} × (${result.fuelPos} − ${result.lcf}) + ${result.fresh} × (${result.freshPos} − ${result.lcf}) = ${result.trimMomentByStern.toFixed(0)} t·m`,
      `トリム変化 = ${result.trimMomentByStern.toFixed(0)} / ${result.mtc} = ${result.trimBySternCm.toFixed(1)} cm（${result.trimBySternCm >= 0 ? '船尾' : '船首'}トリム）`,
    ]}
  />
  <Highlight
    items={[
      {
        label: '入港時 船首喫水',
        value: (result.forwardDraftCm / 100).toFixed(2),
        unit: 'm',
      },
      {
        label: '入港時 平均喫水',
        value: (result.predictedMeanDraftCm / 100).toFixed(2),
        unit: 'm',
      },
      {
        label: '入港時 船尾喫水',
        value: (result.aftDraftCm / 100).toFixed(2),
        unit: 'm',
      },
    ]}
  />
</Sheet>
