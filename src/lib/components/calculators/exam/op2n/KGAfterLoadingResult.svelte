<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import Step from '#lib/components/shared/Step.svelte';
  import ResultRows from '#lib/components/shared/ResultRows.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import Note from '#lib/components/shared/Note.svelte';

  let { result }: { result: any } = $props();

  const sign = (v: number) => (v >= 0 ? '+' : '−');
  const momentRows = $derived(
    result.items.map((it: { weight: number; kg: number }, i: number) => ({
      label: `w${i + 1} × Kg${i + 1} = ${sign(it.weight)}${Math.abs(it.weight)} × ${it.kg}`,
      value: `${sign(result.moments[i])}${Math.abs(result.moments[i]).toFixed(1)} t·m`,
    })),
  );
  const gmChangeLabel = $derived(
    result.gmChange >= 0
      ? `GM は ${result.gmChange.toFixed(2)} m 増加`
      : `GM は ${Math.abs(result.gmChange).toFixed(2)} m 減少`,
  );
</script>

<Sheet title="KG and GM after Loading">
  <Step
    title="1. 積載前の GM = KM − KG"
    lines={[
      `GM = ${result.km} − ${result.kg} = ${result.gmBefore.toFixed(2)} m`,
    ]}
  />
  <Step
    title="2. 基線まわりのモーメント"
    lines={[
      `W × KG = ${result.displacement} × ${result.kg} = ${result.shipMoment.toFixed(1)} t·m`,
    ]}
  />
  <ResultRows
    rows={[
      ...momentRows,
      {
        label: 'Σ w',
        value: `${sign(result.totalWeight)}${Math.abs(result.totalWeight).toFixed(1)} t`,
        bold: true,
      },
      {
        label: 'Σ w × Kg',
        value: `${sign(result.totalMoment)}${Math.abs(result.totalMoment).toFixed(1)} t·m`,
        bold: true,
      },
    ]}
  />
  <Step
    title="3. 積載後の重心高さ KG′ = (W × KG + Σ w × Kg) / (W + Σ w)"
    lines={[
      `KG′ = (${result.shipMoment.toFixed(1)} ${sign(result.totalMoment)} ${Math.abs(result.totalMoment).toFixed(1)}) / (${result.displacement} ${sign(result.totalWeight)} ${Math.abs(result.totalWeight).toFixed(1)})`,
      `    = ${(result.shipMoment + result.totalMoment).toFixed(1)} / ${result.finalDisplacement.toFixed(1)}`,
      `    = ${result.finalKg.toFixed(3)} m`,
    ]}
  />
  <Step
    title="4. 積載後の GM′ = KM − KG′（KM は変わらないものとする）"
    lines={[
      `GM′ = ${result.km} − ${result.finalKg.toFixed(3)} = ${result.gmAfter.toFixed(3)} m`,
      gmChangeLabel,
    ]}
  />
  <Highlight
    items={[
      { label: '積載後の KG′', value: result.finalKg.toFixed(2), unit: 'm' },
      { label: '積載後の GM′', value: result.gmAfter.toFixed(2), unit: 'm' },
      {
        label: '積載後の排水量',
        value: result.finalDisplacement.toFixed(0),
        unit: 't',
      },
    ]}
  />
  {#if result.gmAfter <= 0}
    <Note tone="warn">GM′ が 0 以下です。積載後の船は不安定になります。</Note>
  {/if}
</Sheet>
