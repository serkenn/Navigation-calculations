<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import Step from '#lib/components/shared/Step.svelte';
  import ResultRows from '#lib/components/shared/ResultRows.svelte';
  import Highlight from '#lib/components/shared/Highlight.svelte';
  import Note from '#lib/components/shared/Note.svelte';

  let { result }: { result: any } = $props();

  const [fuel, from, to, ballastTank] = $derived(result.tanks);
  const side = (aft: boolean) => (aft ? '後方' : '前方');
  const momentLabel = (v: number) =>
    `${Math.abs(v).toFixed(0)} t·m（${v >= 0 ? '船尾' : '船首'}トリム）`;
  const trimLabel = (cm: number) =>
    `${Math.abs(cm).toFixed(0)} cm ${cm >= 0 ? '船尾' : '船首'}トリム`;
  const signed = (v: number) => `${v < 0 ? '−' : ''}${Math.abs(v).toFixed(0)}`;
  const reversed = $derived(result.transferTon < 0);
</script>

<Sheet title="Tank Transfer for Required Trim">
  <ResultRows
    rows={[
      { label: fuel.name, value: `${fuel.distance} m ${side(fuel.aft)}` },
      { label: from.name, value: `${from.distance} m ${side(from.aft)}` },
      { label: to.name, value: `${to.distance} m ${side(to.aft)}` },
      {
        label: ballastTank.name,
        value: `${ballastTank.distance} m ${side(ballastTank.aft)}`,
      },
    ]}
  />
  <Step
    title="1. 毎 cm トリムモーメント MTC = W × GML / (100 L)"
    lines={[
      `MTC = ${result.displacement} × ${result.gml} / (100 × ${result.length})`,
      `    = ${result.mtc.toFixed(2)} t·m/cm`,
    ]}
  />
  <Step
    title="2. 燃料油の消費によるトリムモーメント"
    lines={[
      `消費量 = ${result.fuelPerDay} × ${result.days} = ${result.fuelConsumedTon.toFixed(0)} t`,
      `${side(fuel.aft)} ${fuel.distance} m のタンクから減るので ${fuel.aft ? '船首' : '船尾'}トリムの方向`,
      `モーメント = ${result.fuelConsumedTon.toFixed(0)} × ${fuel.distance} = ${momentLabel(result.fuelMoment)}`,
    ]}
  />
  <Step
    title="3. 船尾水倉への張水によるトリムモーメント"
    lines={[
      `モーメント = ${result.ballast} × ${ballastTank.distance} = ${momentLabel(result.ballastMoment)}`,
    ]}
  />
  <Step
    title="4. 通峡時に必要なトリムモーメント"
    lines={[
      `トリム変化 = ${trimLabel(result.targetTrim)} − ${trimLabel(result.initialTrim)} = ${result.trimChangeCm.toFixed(0)} cm`,
      `必要モーメント = ${result.trimChangeCm.toFixed(0)} × ${result.mtc.toFixed(2)} = ${momentLabel(result.requiredMoment)}`,
    ]}
  />
  <Step
    title="5. 貨物油の移送量 w"
    lines={[
      `移送距離 = ${from.distance} + ${to.distance} = ${Math.abs(result.transferDistanceM).toFixed(0)} m`,
      '移送モーメント = 必要モーメント − 張水モーメント − 燃料消費モーメント',
      `             = ${signed(result.requiredMoment)} − (${signed(result.ballastMoment)}) − (${signed(result.fuelMoment)})`,
      `             = ${result.transferMoment.toFixed(0)} t·m`,
      `w = ${result.transferMoment.toFixed(0)} / ${result.transferDistanceM.toFixed(0)} = ${result.transferTon.toFixed(1)} t`,
    ]}
  />
  <Highlight
    items={[
      {
        label: reversed ? '逆方向に移送する量' : '移送量',
        value: Math.abs(result.transferTon).toFixed(1),
        unit: 't',
      },
      {
        label: '移送方向',
        value: reversed
          ? `${to.name.split('（')[0]} → ${from.name.split('（')[0]}`
          : `${from.name.split('（')[0]} → ${to.name.split('（')[0]}`,
      },
    ]}
  />
  <Note>
    船尾トリムを正、船体中央より後方の位置を正としてモーメントを合計しています。MTC
    は出港時の排水量で計算し、清水等の消費によるトリムの変化はなく、浮面心は船体中央にあるものとします。
  </Note>
</Sheet>
