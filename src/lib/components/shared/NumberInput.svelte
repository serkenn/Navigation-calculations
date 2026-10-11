<script lang="ts">
  import Field from './Field.svelte';
  import { boxClass, inputClass, unitClass } from './inputStyles';
  import { useAccent } from '$lib/theme/accent';

  let {
    label,
    value = $bindable(),
    unit = '',
    hint = '',
    step = 'any',
    min,
    max,
  }: {
    label: string;
    value: number;
    unit?: string;
    hint?: string;
    step?: number | 'any';
    min?: number;
    max?: number;
  } = $props();

  const accent = useAccent();
</script>

<Field {label} {hint}>
  <div class="{boxClass} {accent().focus}">
    <input
      type="number"
      inputmode="decimal"
      class={inputClass}
      bind:value
      {step}
      {min}
      {max}
    />
    {#if unit}<span class={unitClass}>{unit}</span>{/if}
  </div>
</Field>
