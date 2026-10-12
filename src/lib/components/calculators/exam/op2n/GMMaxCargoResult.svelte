<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import Step from '#lib/components/shared/Step.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import Note from '#lib/components/shared/Note.svelte';

  let { result }: { result: any } = $props();

  const f = (v: number, d = 2) => Number(v.toFixed(d)).toString();
</script>

<Sheet title="Maximum Cargo for GM Reduction">
  <Step
    title="1. 積載前の GM と積載後の KG′"
    lines={[
      `GM = KM − KG = ${result.km} − ${result.kg} = ${f(result.gmBefore)} m`,
      `KM は変わらないので GM の減少量 = KG の上昇量`,
      `KG′ = KG + GG′ = ${result.kg} + ${result.gmReduction} = ${f(result.finalKg)} m`,
      `GM′ = KM − KG′ = ${result.km} − ${f(result.finalKg)} = ${f(result.gmAfter)} m`,
    ]}
  />
  <Step
    title="2. 貨物の積載重量 w を求める"
    lines={[
      'KG′ = (W × KG + w × Kg) / (W + w)',
      `${f(result.finalKg)} = (${result.displacement} × ${result.kg} + w × ${result.cargoKg}) / (${result.displacement} + w)`,
      `${f(result.finalKg)} = (${f(result.shipMoment, 1)} + ${result.cargoKg} w) / (${result.displacement} + w)`,
      `${f(result.shipMoment, 1)} + ${result.cargoKg} w = ${f(result.rhsConstant, 1)} + ${f(result.finalKg)} w`,
      `(${result.cargoKg} − ${f(result.finalKg)}) w = ${f(result.rhsConstant, 1)} − ${f(result.shipMoment, 1)}`,
      `w = ${f(result.numerator, 1)} / ${f(result.denominator)}`,
      `  = ${result.weight.toFixed(2)} t`,
    ]}
  />
  <Highlight
    items={[
      {
        label: '積載できる最大重量',
        value: result.weight.toFixed(2),
        unit: 't',
      },
      { label: '積載後の GM′', value: f(result.gmAfter), unit: 'm' },
    ]}
  />
  {#if result.gmAfter <= 0}
    <Note tone="warn">
      積載後の GM′ が 0 以下になります。減少量の設定を見直してください。
    </Note>
  {/if}
</Sheet>
