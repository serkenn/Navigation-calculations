<script lang="ts">
  import CalcForm from '$lib/components/shared/CalcForm.svelte';
  import SectionCard from '$lib/components/shared/SectionCard.svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import { calculateBlindZoneDistance } from '$lib/utils/examOperation';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let draft = $state(5.5);
  let eyeFromKeel = $state(20.5);
  let obstacleFromKeel = $state(11.0);
  let eyeToObstacle = $state(85.5);
  let error = $state('');

  function calculate() {
    const r = calculateBlindZoneDistance(
      eyeFromKeel,
      obstacleFromKeel,
      draft,
      eyeToObstacle,
    );
    if (!Number.isFinite(r.blindFromObstacleM)) {
      error =
        '眼高が障害物の上端より高く、障害物の上端が水面より上になるよう入力してください。';
      return;
    }
    error = '';
    onResult({ draft, eyeFromKeel, obstacleFromKeel, eyeToObstacle, ...r });
  }
</script>

<CalcForm onsubmit={calculate} {error}>
  <SectionCard title="高さ（キールから）">
    <NumberInput label="見張りの眼の高さ" bind:value={eyeFromKeel} unit="m" />
    <NumberInput
      label="船首部の障害物の上端"
      bind:value={obstacleFromKeel}
      unit="m"
    />
  </SectionCard>
  <SectionCard>
    <NumberInput label="喫水" bind:value={draft} unit="m" />
    <NumberInput
      label="眼から障害物までの水平距離"
      bind:value={eyeToObstacle}
      unit="m"
    />
  </SectionCard>
</CalcForm>
