<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import Step from '#lib/components/shared/Step.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';

  let { result }: { result: any } = $props();

  const cm = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)} cm`;
  const trimLabel = (v: number) =>
    Math.abs(v) < 0.05
      ? 'トリム変化なし'
      : v > 0
        ? `船尾トリム ${v.toFixed(1)} cm`
        : `船首トリム ${Math.abs(v).toFixed(1)} cm`;
</script>

<Sheet title="Trim and End Draft Changes">
  <Step
    title="1. 平均沈下量 = w / TPC"
    lines={[
      `${result.weight} / ${result.tpc} = ${result.meanSinkCm.toFixed(1)} cm`,
    ]}
  />
  <Step
    title="2. トリム変化 = w × d / MTC（LCF より前方に積むと船首トリム）"
    lines={[
      `${result.weight} × ${result.posFromLcf} / ${result.mtc} = ${Math.abs(result.trimBySternCm).toFixed(1)} cm`,
      trimLabel(result.trimBySternCm),
    ]}
  />
  <Step
    title="3. トリム変化の船首・船尾への配分"
    lines={[
      `LCF〜船首 ${result.distFwd.toFixed(1)} m　LCF〜船尾 ${result.distAft.toFixed(1)} m`,
      `船首 = 沈下 − トリム × ${result.distFwd.toFixed(1)}/${result.shipLength} = ${cm(result.forwardChangeCm)}`,
      `船尾 = 沈下 + トリム × ${result.distAft.toFixed(1)}/${result.shipLength} = ${cm(result.aftChangeCm)}`,
    ]}
  />
  <Highlight
    items={[
      { label: '船首喫水の変化', value: cm(result.forwardChangeCm) },
      { label: '船尾喫水の変化', value: cm(result.aftChangeCm) },
    ]}
  />
  <Step
    title="（参考）貨物移動によるトリム変化 = w × d / MTC"
    lines={[
      `${result.movedWeight} × ${result.moveDistance} / ${result.mtc} = ${result.shiftTrimCm.toFixed(1)} cm`,
    ]}
  />
</Sheet>
