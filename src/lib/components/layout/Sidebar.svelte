<script lang="ts">
  import { Anchor, HelpCircle, BookOpen, Sun, Moon } from 'lucide-svelte';
  import { page } from '$app/state';
  import SidebarCategory from './SidebarCategory.svelte';
  import {
    getAncestorIds,
    getCalculator,
    getChildCategories,
  } from '$lib/data/calculatorRegistry';
  import type { CategoryId } from '$lib/types/calculator';

  let {
    isOpen,
    activeId,
    onClose,
    theme,
    onToggleTheme,
  }: {
    isOpen: boolean;
    activeId: string;
    onClose: () => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
  } = $props();

  /** 計算機が属するカテゴリとその祖先 */
  function categoryPath(calcId: string): CategoryId[] {
    const calc = getCalculator(calcId);
    return calc ? [calc.category, ...getAncestorIds(calc.category)] : [];
  }

  let openIds = $state(new Set<CategoryId>());

  // 表示中の計算機のカテゴリは常に開く（URL 直接アクセス・戻る操作にも追従）
  $effect(() => {
    const path = categoryPath(activeId);
    if (path.some((id) => !openIds.has(id))) {
      openIds = new Set([...openIds, ...path]);
    }
  });

  function toggle(id: CategoryId) {
    const next = new Set(openIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    openIds = next;
  }

  const links = [
    { path: '/guide/', icon: HelpCircle, label: '利用ガイド' },
    { path: '/theory/', icon: BookOpen, label: '理論' },
  ];
</script>

<!-- モバイル用オーバーレイ -->
<div
  class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity lg:hidden {isOpen
    ? 'opacity-100 pointer-events-auto'
    : 'opacity-0 pointer-events-none'}"
  onclick={onClose}
  role="presentation"
></div>

<aside
  class="fixed inset-y-0 left-0 z-[70] w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white transform transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col shadow-2xl lg:shadow-none {isOpen
    ? 'translate-x-0'
    : '-translate-x-full'}"
  style="padding-left: var(--sal); padding-top: var(--sat);"
>
  <div
    class="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors"
  >
    <a
      href="/"
      onclick={onClose}
      class="text-lg font-bold flex items-center gap-2"
    >
      <Anchor class="text-blue-600 dark:text-blue-400" /> 航法計算
    </a>
  </div>

  <nav class="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="計算機一覧">
    {#each getChildCategories(undefined) as cat (cat.id)}
      <SidebarCategory
        category={cat}
        {activeId}
        {openIds}
        onToggle={toggle}
        onSelect={onClose}
      />
    {/each}

    <div class="border-t border-slate-200 dark:border-slate-700 my-2"></div>

    {#each links as item (item.path)}
      {@const isActive = page.url.pathname === item.path}
      <a
        href={item.path}
        onclick={onClose}
        aria-current={isActive ? 'page' : undefined}
        class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors {isActive
          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}"
      >
        <item.icon size={16} />
        {item.label}
      </a>
    {/each}
  </nav>

  <div
    class="hidden lg:flex p-4 border-t border-slate-200 dark:border-slate-800 justify-between items-center text-xs text-slate-500 dark:text-slate-400 transition-colors"
  >
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
