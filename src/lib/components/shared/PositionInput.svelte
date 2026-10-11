<script lang="ts">
  import DMSInput from './DMSInput.svelte';
  import type { DMSValue } from '$lib/types/navigation';

  let {
    lat = $bindable(),
    lon = $bindable(),
    latLabel = '緯度 (Lat)',
    lonLabel = '経度 (Long)',
  }: {
    lat: DMSValue;
    lon: DMSValue;
    latLabel?: string;
    lonLabel?: string;
  } = $props();
</script>

<DMSInput label={latLabel} bind:value={lat} sign="NS" />
<DMSInput label={lonLabel} bind:value={lon} sign="EW" />
