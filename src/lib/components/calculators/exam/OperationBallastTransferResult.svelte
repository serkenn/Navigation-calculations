<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import Step from '$lib/components/shared/Step.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';

  let { result }: { result: any } = $props();

  const directionLabel: Record<string, string> = {
    'aft-to-forward': '船尾 → 船首',
    'forward-to-aft': '船首 → 船尾',
    none: '移送不要',
  };
</script>

<Sheet title="Ballast Transfer for Even Keel">
  <Step
    title="1. トリム"
    lines={[
      `(${result.aftDraft} − ${result.fwdDraft}) × 100 = ${result.trimBySternCm.toFixed(1)} cm（${result.trimBySternCm >= 0 ? '船尾' : '船首'}トリム）`,
    ]}
  />
  <Step
    title="2. 必要なトリムモーメント = トリム × MTC"
    lines={[
      `${Math.abs(result.trimBySternCm).toFixed(1)} × ${result.mtc} = ${result.requiredMoment.toFixed(0)} t·m`,
    ]}
  />
  <Step
    title="3. 移送量 = モーメント / 距離"
    lines={[
      `${result.requiredMoment.toFixed(0)} / ${result.distance} = ${result.transferTon.toFixed(1)} t`,
    ]}
  />
  <Highlight
    items={[
      { label: '移送量', value: result.transferTon.toFixed(1), unit: 't' },
      { label: '移送方向', value: directionLabel[result.direction] },
    ]}
  />
</Sheet>
