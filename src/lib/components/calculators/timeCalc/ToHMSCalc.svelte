<script lang="ts">
  import CalcForm from '#lib/components/shared/CalcForm.svelte';
  import SectionCard from '#lib/components/shared/SectionCard.svelte';
  import NumberInput from '#lib/components/shared/NumberInput.svelte';
  import Segmented from '#lib/components/shared/Segmented.svelte';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let mode: 'convert' | 'run' = $state('convert');
  let decimal = $state(9.4083);
  let distance = $state(120);
  let speed = $state(13.5);
  let error = $state('');

  function calculate() {
    if (mode === 'run') {
      if (!(speed > 0)) {
        error = '速力は 0 より大きい値を入力してください。';
        return;
      }
      error = '';
      onResult({ mode, distance, speed, hours: distance / speed });
      return;
    }
    error = '';
    onResult({ mode, hours: decimal });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard cols={1}>
    <Segmented
      label="計算の種類"
      bind:value={mode}
      options={[
        { value: 'convert', label: '時分秒変換' },
        { value: 'run', label: '航走時間 (距離 ÷ 速力)' },
      ]}
    />
  </SectionCard>
  {#if mode === 'convert'}
    <SectionCard cols={1}>
      <NumberInput label="10 進数の時間" bind:value={decimal} unit="h" />
    </SectionCard>
  {:else}
    <SectionCard>
      <NumberInput
        label="航走距離 (Distance)"
        bind:value={distance}
        unit="NM"
      />
      <NumberInput label="速力 (Speed)" bind:value={speed} unit="kn" />
    </SectionCard>
  {/if}
</CalcForm>
