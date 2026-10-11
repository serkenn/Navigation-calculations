<script lang="ts">
  import Field from './Field.svelte';
  import { boxClass, inputClass, unitClass, selectClass } from './inputStyles';
  import { useAccent } from '$lib/theme/accent';
  import type { DMSValue } from '$lib/types/navigation';

  /**
   * 度・分（分は小数可）の入力
   * sign: NS/EW は方向選択、pm は ± 選択、none は符号なし
   */
  let {
    label,
    value = $bindable(),
    sign = 'none',
    hint = '',
  }: {
    label: string;
    value: DMSValue;
    sign?: 'NS' | 'EW' | 'pm' | 'none';
    hint?: string;
  } = $props();

  const dirLabels = { NS: ['N', 'S'], EW: ['E', 'W'] } as const;

  const accent = useAccent();
</script>

<Field {label} {hint}>
  <div class="{boxClass} {accent().focus}">
    {#if sign === 'pm'}
      <select class={selectClass} bind:value={value.dir} aria-label="符号">
        <option value={1}>+</option>
        <option value={-1}>−</option>
      </select>
    {/if}
    <input
      type="number"
      inputmode="numeric"
      class="{inputClass} !w-12 flex-none"
      bind:value={value.d}
      min={0}
      step={1}
      aria-label="{label} 度"
    />
    <span class={unitClass}>°</span>
    <input
      type="number"
      inputmode="decimal"
      class={inputClass}
      bind:value={value.m}
      min={0}
      step="any"
      aria-label="{label} 分"
    />
    <span class={unitClass}>'</span>
    {#if sign === 'NS' || sign === 'EW'}
      <select class={selectClass} bind:value={value.dir} aria-label="方向">
        <option value={1}>{dirLabels[sign][0]}</option>
        <option value={-1}>{dirLabels[sign][1]}</option>
      </select>
    {/if}
  </div>
</Field>
