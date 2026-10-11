<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import { calculateBallastTransferForEvenKeel } from '$lib/utils/examOperation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let fwdDraft = $state(10.3);
  let aftDraft = $state(11.5);
  let distance = $state(125);
  let mtc = $state(1103);
  let error = $state('');

  function calculate() {
    if (!(distance > 0)) {
      error = '移送距離は 0 より大きい値を入力してください。';
      return;
    }
    error = '';
    onResult({
      fwdDraft,
      aftDraft,
      distance,
      mtc,
      ...calculateBallastTransferForEvenKeel(fwdDraft, aftDraft, distance, mtc),
    });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="喫水">
    <NumberInput label="船首喫水" bind:value={fwdDraft} unit="m" />
    <NumberInput label="船尾喫水" bind:value={aftDraft} unit="m" />
  </SectionCard>
  <SectionCard title="移送条件">
    <NumberInput label="タンク間の距離" bind:value={distance} unit="m" />
    <NumberInput label="MTC" bind:value={mtc} unit="t·m/cm" />
  </SectionCard>
</CalcForm>
