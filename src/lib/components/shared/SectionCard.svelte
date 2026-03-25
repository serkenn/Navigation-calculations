<script lang="ts">
  import type { Snippet, Component } from 'svelte';
  let { icon: Icon, title, children, accentBg = 'bg-slate-50 dark:bg-slate-800', accentText = 'text-slate-700 dark:text-slate-300' }: {
    icon: Component;
    title: string;
    children: Snippet;
    accentBg?: string;
    accentText?: string;
  } = $props();
</script>

<section class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
  <div class="{accentBg} px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 font-bold {accentText} text-sm">
    <Icon size={16} /> {title}
  </div>
  <div class="p-4">
    {@render children()}
  </div>
</section>
