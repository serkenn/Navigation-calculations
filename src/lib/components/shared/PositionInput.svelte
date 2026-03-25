<script lang="ts">
  import DMSInput from './DMSInput.svelte';
  import type { DMSValue } from '$lib/types/navigation';

  let { lat = $bindable(), lon = $bindable(), latLabel = '緯度 (Lat)', lonLabel = '経度 (Lon)' }: {
    lat: DMSValue;
    lon: DMSValue;
    latLabel?: string;
    lonLabel?: string;
  } = $props();
</script>

<div class="grid grid-cols-2 gap-4">
  <DMSInput label={latLabel} bind:value={lat} showSign signType="NS" />
  <DMSInput label={lonLabel} bind:value={lon} showSign signType="EW" />
</div>
