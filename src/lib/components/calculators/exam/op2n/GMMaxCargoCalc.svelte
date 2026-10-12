<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import { maxCargoForGMReduction } from '#lib/utils/exam2nOperation.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  // 初期値は例題 2: 排水量 8000 t、KM 7.4 m、KG 6.3 m、GM の減少量 0.3 m、貨物の Kg 14.0 m
  let displacement = $state(8000);
  let km = $state(7.4);
  let kg = $state(6.3);
  let gmReduction = $state(0.3);
  let cargoKg = $state(14.0);
  let error = $state('');

  function calculate() {
    const r = maxCargoForGMReduction(
      displacement,
      km,
      kg,
      gmReduction,
      cargoKg,
    );
    if (!(gmReduction > 0)) {
      error = 'GM の減少量は 0 より大きい値を入力してください。';
      return;
    }
    if (!r.possible) {
      error =
        '貨物の重心高さが積載後の KG′ 以下のため、GM は減少しません（重量の制限はありません）。';
      return;
    }
    error = '';
    onResult({ displacement, km, kg, gmReduction, cargoKg, ...r });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="積載前の船">
    <NumberInput label="排水量 W" bind:value={displacement} unit="t" />
    <NumberInput label="基線上メタセンタ高さ KM" bind:value={km} unit="m" />
    <NumberInput label="基線上重心高さ KG" bind:value={kg} unit="m" />
  </SectionCard>
  <SectionCard title="積載条件">
    <NumberInput
      label="GM の減少量の上限 ΔGM"
      bind:value={gmReduction}
      unit="m"
    />
    <NumberInput
      label="貨物の重心高さ Kg（基線上）"
      bind:value={cargoKg}
      unit="m"
      hint="KM の値は変わらないものとします"
    />
  </SectionCard>
</CalcForm>
