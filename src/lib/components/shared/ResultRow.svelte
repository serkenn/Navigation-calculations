<script lang="ts">
  let { label, value, bold = false, border = false, small = false }: {
    label: string;
    value: string;
    bold?: boolean;
    border?: boolean;
    small?: boolean;
  } = $props();
</script>

<div class="flex justify-between {bold ? 'font-bold' : ''} {border ? 'border-t border-slate-300 dark:border-slate-700 pt-1 mt-1' : ''} {small ? 'text-xs text-slate-500 dark:text-slate-400' : ''}">
  <span>{label}</span>
  <span>{value}</span>
</div>
