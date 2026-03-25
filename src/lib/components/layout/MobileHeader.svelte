<script lang="ts">
  import { Anchor, Menu, X, Sun, Moon } from 'lucide-svelte';

  let { isMenuOpen, onToggleMenu, theme, onToggleTheme }: {
    isMenuOpen: boolean;
    onToggleMenu: () => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
  } = $props();
</script>

<header class="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-50 transition-colors">
  <button onclick={onToggleMenu} class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
    {#if isMenuOpen}
      <X size={24} class="text-slate-700 dark:text-slate-300" />
    {:else}
      <Menu size={24} class="text-slate-700 dark:text-slate-300" />
    {/if}
  </button>
  <h1 class="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
    <Anchor class="text-blue-600 dark:text-blue-400" size={20} /> 航法計算
  </h1>
  <button onclick={onToggleTheme} class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
    {#if theme === 'dark'}
      <Sun size={20} class="text-slate-300" />
    {:else}
      <Moon size={20} class="text-slate-700" />
    {/if}
  </button>
</header>
