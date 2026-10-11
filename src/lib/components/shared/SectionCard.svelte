<script lang="ts">
  import type { Snippet } from 'svelte';

  /** 入力フォームのまとまり。cols で中身をグリッド配置する */
  let {
    title = '',
    cols = 2,
    children,
  }: {
    title?: string;
    cols?: 1 | 2 | 3;
    children: Snippet;
  } = $props();

  const grid = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-3',
  };
</script>

<section
  class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors"
>
  {#if title}
    <h3 class="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">
      {title}
    </h3>
  {/if}
  <div class="grid {grid[cols]} gap-3">
    {@render children()}
  </div>
</section>
