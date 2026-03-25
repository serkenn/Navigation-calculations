<script lang="ts">
  import type { Snippet } from 'svelte';
  let { title, bgColor = 'bg-slate-800 dark:bg-slate-700', children }: {
    title: string;
    bgColor?: string;
    children: Snippet;
  } = $props();
</script>

<div class="relative">
  <h3 class="text-sm font-bold {bgColor} text-white inline-block px-3 py-1 mb-3">{title}</h3>
  {@render children()}
</div>
