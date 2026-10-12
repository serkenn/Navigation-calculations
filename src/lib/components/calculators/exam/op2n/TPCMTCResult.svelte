<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import Step from '#lib/components/shared/Step.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import Note from '#lib/components/shared/Note.svelte';

  let { result }: { result: any } = $props();
</script>

<Sheet title="TPC and MTC">
  <Step
    title="1. 毎 cm 排水トン数 TPC = Aw × ρ / 100"
    lines={[
      `TPC = ${result.waterplane} × ${result.density} / 100`,
      `    = ${result.tpc.toFixed(2)} t/cm`,
    ]}
  />
  <Step
    title="2. 毎 cm トリムモーメント MTC = W × GML / (100 L)"
    lines={[
      `MTC = ${result.displacement} × ${result.gml} / (100 × ${result.length})`,
      `    = ${result.mtc.toFixed(2)} t·m/cm`,
    ]}
  />
  <Step
    title="3. 浮面心上に w を積載したときの平行沈下 Δd = w / TPC"
    lines={[
      `Δd = ${result.weight} / ${result.tpc.toFixed(2)} = ${result.sinkCm.toFixed(1)} cm`,
    ]}
  />
  <Step
    title="4. w を d 移動したときのトリム変化 t = w × d / MTC"
    lines={[
      `t = ${result.weight} × ${result.shift} / ${result.mtc.toFixed(2)} = ${result.trimCm.toFixed(1)} cm`,
    ]}
  />
  <Highlight
    items={[
      { label: 'TPC', value: result.tpc.toFixed(2), unit: 't/cm' },
      { label: 'MTC', value: result.mtc.toFixed(2), unit: 't·m/cm' },
    ]}
  />
  <Note>
    浮面心（F）上に積載すると船は平行に沈下し、浮面心を支点として貨物を船首尾方向へ移動するとトリムが変化します。
  </Note>
</Sheet>
