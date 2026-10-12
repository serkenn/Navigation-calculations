<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import Segmented from '#lib/components/shared/Segmented.svelte';
  import {
    signedPosition,
    tankTransferForTrim,
  } from '#lib/utils/exam2nOperation.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  interface Tank {
    name: string;
    distance: number;
    aft: boolean;
  }

  // 初期値は問題 7-1: 垂線間長 320 m、排水量 280000 t、GML 370 m、10 日間 75 t/日
  let length = $state(320);
  let displacement = $state(280000);
  let gml = $state(370);
  let days = $state(10);
  let fuelPerDay = $state(75);
  let ballast = $state(800);
  let initialTrim = $state(0);
  let targetTrim = $state(80);
  let targetByStern = $state(true);
  let tanks: Tank[] = $state([
    { name: '燃料油タンク', distance: 100, aft: true },
    { name: 'No.1 貨物油タンク（移送元）', distance: 110, aft: false },
    { name: 'No.5 貨物油タンク（移送先）', distance: 100, aft: true },
    { name: '船尾水倉（張水）', distance: 155, aft: true },
  ]);
  let error = $state('');

  const positions = [
    { value: false, label: '前方' },
    { value: true, label: '後方' },
  ];

  function calculate() {
    const pos = (t: Tank) => signedPosition(t.distance, t.aft);
    const r = tankTransferForTrim({
      lengthM: length,
      displacementTon: displacement,
      gmlM: gml,
      days,
      fuelPerDayTon: fuelPerDay,
      fuelTankPosM: pos(tanks[0]),
      ballastTon: ballast,
      ballastTankPosM: pos(tanks[3]),
      fromTankPosM: pos(tanks[1]),
      toTankPosM: pos(tanks[2]),
      initialTrimCm: initialTrim,
      targetTrimCm: targetByStern ? targetTrim : -targetTrim,
    });
    if (!Number.isFinite(r.transferTon)) {
      error = '移送元と移送先のタンクが同じ位置です。';
      return;
    }
    error = '';
    onResult({
      length,
      displacement,
      gml,
      days,
      fuelPerDay,
      ballast,
      initialTrim,
      targetTrim: targetByStern ? targetTrim : -targetTrim,
      tanks: tanks.map((t) => ({ ...t, pos: pos(t) })),
      ...r,
    });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="船の要目">
    <NumberInput label="垂線間長 L" bind:value={length} unit="m" />
    <NumberInput label="出港時の排水量 W" bind:value={displacement} unit="t" />
    <NumberInput label="縦メタセンタ高さ GML" bind:value={gml} unit="m" />
  </SectionCard>
  <SectionCard title="航海と通峡時のトリム">
    <NumberInput label="海峡入口までの航海日数" bind:value={days} unit="日" />
    <NumberInput
      label="1 日の燃料油消費量"
      bind:value={fuelPerDay}
      unit="t/日"
    />
    <NumberInput label="船尾水倉への張水量" bind:value={ballast} unit="t" />
    <NumberInput
      label="出港時のトリム（船尾トリム正）"
      bind:value={initialTrim}
      unit="cm"
      hint="等喫水で出港する場合は 0"
    />
    <NumberInput label="通峡時のトリム" bind:value={targetTrim} unit="cm" />
    <Segmented
      bind:value={targetByStern}
      options={[
        { value: true, label: '船尾トリム' },
        { value: false, label: '船首トリム' },
      ]}
    />
  </SectionCard>
  <SectionCard title="タンクの中心位置（船体中央からの距離）">
    {#each tanks as tank, i (i)}
      <NumberInput label={tank.name} bind:value={tank.distance} unit="m" />
      <Segmented bind:value={tank.aft} options={positions} />
    {/each}
  </SectionCard>
</CalcForm>
