<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import {
    calculateBeamFromPeriodAndGM,
    calculateGMFromPeriodChange,
  } from '$lib/utils/examOperation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let gmA = $state(0.75);
  let periodA = $state(12);
  let periodB = $state(13);
  let error = $state('');

  function calculate() {
    if (!(gmA > 0 && periodA > 0 && periodB > 0)) {
      error = 'GM と周期は 0 より大きい値を入力してください。';
      return;
    }
    error = '';
    onResult({
      gmA,
      periodA,
      periodB,
      ...calculateBeamFromPeriodAndGM(periodA, gmA),
      ...calculateGMFromPeriodChange(gmA, periodA, periodB),
    });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="A 港（基準）">
    <NumberInput label="GM" bind:value={gmA} unit="m" />
    <NumberInput label="横揺れ周期" bind:value={periodA} unit="s" />
  </SectionCard>
  <SectionCard title="B 港" cols={1}>
    <NumberInput label="横揺れ周期" bind:value={periodB} unit="s" />
  </SectionCard>
</CalcForm>
