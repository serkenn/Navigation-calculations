<script lang="ts">
  import Field from './Field.svelte';
  import { boxClass } from './inputStyles';
  import { useAccent } from '$lib/theme/accent';

  /** 日付入力（YYYY-MM-DD 文字列） */
  let {
    label,
    value = $bindable(),
    hint = '',
  }: { label: string; value: string; hint?: string } = $props();

  const accent = useAccent();
</script>

<Field {label} {hint}>
  <div class="{boxClass} {accent().focus}">
    <input
      type="date"
      class="w-full bg-transparent outline-none font-mono text-sm text-slate-900 dark:text-white"
      bind:value
    />
  </div>
</Field>
