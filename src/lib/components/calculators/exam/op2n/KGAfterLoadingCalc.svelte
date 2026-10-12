<script lang="ts">
  import { Plus, X } from '@lucide/svelte';
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import Segmented from '#lib/components/shared/Segmented.svelte';
  import { kgAfterLoading } from '#lib/utils/exam2nOperation.js';

  let { onResult }: { onResult: (r: any) => void } = $props();

  interface Row {
    load: boolean;
    weight: number;
    kg: number;
  }

  let displacement = $state(8000);
  let km = $state(7.4);
  let kg = $state(6.3);
  let rows: Row[] = $state([
    { load: true, weight: 500, kg: 12.0 },
    { load: true, weight: 300, kg: 4.5 },
    { load: false, weight: 200, kg: 2.0 },
  ]);
  let error = $state('');

  function add() {
    rows.push({ load: true, weight: 100, kg: 5 });
  }
  function remove(i: number) {
    rows.splice(i, 1);
  }

  function calculate() {
    if (rows.length === 0) {
      error = '貨物を 1 件以上入力してください。';
      return;
    }
    const items = rows.map((r) => ({
      weight: r.load ? r.weight : -r.weight,
      kg: r.kg,
    }));
    const r = kgAfterLoading(displacement, kg, items, km);
    if (!(r.finalDisplacement > 0)) {
      error = '揚荷の合計が排水量を超えています。';
      return;
    }
    error = '';
    onResult({ displacement, km, kg, items, ...r });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="積載前の船">
    <NumberInput label="排水量 W" bind:value={displacement} unit="t" />
    <NumberInput label="基線上メタセンタ高さ KM" bind:value={km} unit="m" />
    <NumberInput label="基線上重心高さ KG" bind:value={kg} unit="m" />
  </SectionCard>
  {#each rows as row, i (i)}
    <SectionCard title="貨物 {i + 1}">
      <Segmented
        bind:value={row.load}
        options={[
          { value: true, label: '積荷 (+)' },
          { value: false, label: '揚荷 (−)' },
        ]}
      />
      <NumberInput label="重量 w" bind:value={row.weight} unit="t" min={0} />
      <NumberInput label="基線上の重心高さ Kg" bind:value={row.kg} unit="m" />
      {#if rows.length > 1}
        <button
          type="button"
          onclick={() => remove(i)}
          class="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
        >
          <X size={14} /> この貨物を削除
        </button>
      {/if}
    </SectionCard>
  {/each}
  <button
    type="button"
    onclick={add}
    class="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
  >
    <Plus size={16} /> 貨物を追加
  </button>
</CalcForm>
