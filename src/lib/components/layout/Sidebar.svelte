<script lang="ts">
  import { Anchor, HelpCircle, BookOpen, Sun, Moon } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import SidebarCategory from './SidebarCategory.svelte';
  import { categories, calculators } from '$lib/data/calculatorRegistry';
  import type { CategoryId } from '$lib/types/calculator';

  let { isOpen, activeId, onSelect, onClose, theme, onToggleTheme }: {
    isOpen: boolean;
    activeId: string;
    onSelect: () => void;
    onClose: () => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
  } = $props();

  function getActiveCategoryId(): CategoryId | null {
    const calc = calculators.find(c => c.id === activeId);
    return calc ? calc.category : null;
  }

  let openCategories = $state<Set<CategoryId>>(new Set(getActiveCategoryId() ? [getActiveCategoryId()!] : []));

  function handleSelect(id: string) {
    const calc = calculators.find(c => c.id === id);
    if (calc) {
      openCategories = new Set([...openCategories, calc.category]);
    }
    goto(`/calc/${id}/`);
    onSelect();
    onClose();
  }

  function handleNavSelect(path: string) {
    goto(path);
    onSelect();
    onClose();
  }

  function toggleCategory(catId: CategoryId) {
    const next = new Set(openCategories);
    if (next.has(catId)) next.delete(catId);
    else next.add(catId);
    openCategories = next;
  }
</script>

<!-- Mobile overlay -->
<div
  class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity lg:hidden {isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}"
  onclick={onClose}
  role="presentation"
></div>

<aside class="fixed inset-y-0 left-0 z-[70] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white transform transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col shadow-2xl lg:shadow-none {isOpen ? 'translate-x-0' : '-translate-x-full'}" style="padding-left: var(--sal); padding-top: var(--sat);">
  <!-- Header -->
  <div class="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors">
    <h1 class="text-lg font-bold flex items-center gap-2">
      <Anchor class="text-blue-600 dark:text-blue-400" /> 航法計算
    </h1>
  </div>

  <!-- Categories -->
  <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
    {#each categories as cat}
      <SidebarCategory
        category={cat}
        calculators={calculators.filter(c => c.category === cat.id)}
        {activeId}
        onSelect={handleSelect}
        isOpen={openCategories.has(cat.id)}
        onToggle={() => toggleCategory(cat.id)}
      />
    {/each}

    <div class="border-t border-slate-200 dark:border-slate-700 my-2"></div>

    {#each [
      { path: '/guide/', icon: HelpCircle, label: '利用ガイド', id: 'guide' },
      { path: '/theory/', icon: BookOpen, label: '理論', id: 'theory' },
    ] as item}
      {@const isActive = false}
      <button
        onclick={() => handleNavSelect(item.path)}
        class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
      >
        <svelte:component this={item.icon} size={16} /> {item.label}
      </button>
    {/each}
  </nav>

  <!-- Theme Toggle (Desktop) -->
  <div class="hidden lg:flex p-4 border-t border-slate-200 dark:border-slate-800 justify-between items-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
    <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
    <button
      onclick={onToggleTheme}
      class="p-2 rounded-full flex items-center gap-2 font-bold px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
    >
      {#if theme === 'dark'}
        <Sun size={14} /> Light
      {:else}
        <Moon size={14} /> Dark
      {/if}
    </button>
  </div>
</aside>
