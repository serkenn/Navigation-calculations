<script lang="ts">
  /** 結果シートの 1 行（ラベル … 値） */
  let {
    label,
    value,
    bold = false,
    muted = false,
  }: {
    label: string;
    value: string;
    bold?: boolean;
    muted?: boolean;
  } = $props();
</script>

<div
  class="flex justify-between gap-4 {bold ? 'font-bold' : ''} {muted
    ? 'text-xs text-slate-500 dark:text-slate-400'
    : ''}"
>
  <span>{label}</span>
  <span class="font-mono text-right">{value}</span>
</div>
