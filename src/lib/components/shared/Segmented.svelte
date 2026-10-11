<script lang="ts" generics="T extends string | number | boolean">
  import { useAccent } from '#lib/theme/accent.js';

  /** ボタン型の択一選択 */
  let {
    label = '',
    options,
    value = $bindable(),
    hint = '',
  }: {
    label?: string;
    options: { value: T; label: string }[];
    value: T;
    hint?: string;
  } = $props();

  const accent = useAccent();
</script>

<div role="radiogroup" aria-label={label || undefined}>
  {#if label}
    <span
      class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1"
      >{label}</span
    >
  {/if}
  <div class="flex flex-wrap gap-2">
    {#each options as opt (opt.value)}
      <button
        type="button"
        role="radio"
        aria-checked={value === opt.value}
        onclick={() => (value = opt.value)}
        class="flex-1 min-w-fit py-2 px-3 rounded-lg text-sm font-bold border transition-colors {value ===
        opt.value
          ? accent().selected
          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}"
      >
        {opt.label}
      </button>
    {/each}
  </div>
  {#if hint}
    <p class="text-[10px] text-slate-400 mt-1">{hint}</p>
  {/if}
</div>
