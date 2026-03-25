<script lang="ts">
  import type { Component } from 'svelte';
  let { icon: Icon, message = 'No Data Calculated' }: {
    icon: Component;
    message?: string;
  } = $props();
</script>

<div class="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
  <Icon size={48} class="mb-4 opacity-20" />
  <p>{message}</p>
</div>
