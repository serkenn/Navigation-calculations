<script lang="ts">
  import Field from './Field.svelte';
  import { boxClass, inputClass, unitClass, selectClass } from './inputStyles';
  import { useAccent } from '$lib/theme/accent';
  import type { HMSValue } from '$lib/types/navigation';

  /** 時・分（・秒）の入力。signed で ± 選択を表示（均時差など） */
  let {
    label,
    value = $bindable(),
    seconds = false,
    signed = false,
    hint = '',
  }: {
    label: string;
    value: HMSValue;
    seconds?: boolean;
    signed?: boolean;
    hint?: string;
  } = $props();

  const accent = useAccent();
</script>

<Field {label} {hint}>
  <div class="{boxClass} {accent().focus}">
    {#if signed}
      <select class={selectClass} bind:value={value.sign} aria-label="符号">
        <option value={1}>+</option>
        <option value={-1}>−</option>
      </select>
    {/if}
    <input
      type="number"
      inputmode="numeric"
      class={inputClass}
      bind:value={value.h}
      min={0}
      step={1}
      aria-label="{label} 時"
    />
    <span class={unitClass}>h</span>
    <input
      type="number"
      inputmode="numeric"
      class={inputClass}
      bind:value={value.m}
      min={0}
      step={1}
      aria-label="{label} 分"
    />
    <span class={unitClass}>m</span>
    {#if seconds}
      <input
        type="number"
        inputmode="decimal"
        class={inputClass}
        bind:value={value.s}
        min={0}
        step="any"
        aria-label="{label} 秒"
      />
      <span class={unitClass}>s</span>
    {/if}
  </div>
</Field>
