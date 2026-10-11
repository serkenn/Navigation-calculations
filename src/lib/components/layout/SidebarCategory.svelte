<script lang="ts">
  import { ChevronDown } from 'lucide-svelte';
  import type {
    CategoryDefinition,
    CategoryId,
  } from '#lib/types/calculator.js';
  import {
    getCalculatorsByCategory,
    getChildCategories,
  } from '#lib/data/calculatorRegistry.js';
  import { accentClasses } from '#lib/theme/accent.js';
  import SidebarCategory from './SidebarCategory.svelte';

  /** カテゴリ 1 つ分（子カテゴリは再帰的に描画） */
  let {
    category,
    activeId,
    openIds,
    onToggle,
    onSelect,
  }: {
    category: CategoryDefinition;
    activeId: string;
    openIds: Set<CategoryId>;
    onToggle: (id: CategoryId) => void;
    onSelect: (id: string) => void;
  } = $props();

  const isOpen = $derived(openIds.has(category.id));
  const items = $derived(getCalculatorsByCategory(category.id));
  const children = $derived(getChildCategories(category.id));
</script>

<div>
  <button
    onclick={() => onToggle(category.id)}
    aria-expanded={isOpen}
    class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
  >
    <span
      class="flex items-center gap-2 font-bold text-left {accentClasses[
        category.accent
      ].text}"
    >
      <category.icon size={16} class="shrink-0" />
      {category.nameJa}
    </span>
    <ChevronDown
      size={14}
      class="shrink-0 text-slate-400 transition-transform {isOpen
        ? 'rotate-180'
        : ''}"
    />
  </button>

  {#if isOpen}
    <div class="ml-3 mt-1 space-y-0.5">
      {#each items as calc (calc.id)}
        {@const isActive = activeId === calc.id}
        <a
          href="/calc/{calc.id}/"
          onclick={() => onSelect(calc.id)}
          aria-current={isActive ? 'page' : undefined}
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors {isActive
            ? 'bg-slate-600 dark:bg-slate-700 text-white shadow-md font-bold'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}"
        >
          <calc.icon size={14} class="shrink-0" />
          {calc.nameJa}
        </a>
      {/each}
      {#each children as child (child.id)}
        <SidebarCategory
          category={child}
          {activeId}
          {openIds}
          {onToggle}
          {onSelect}
        />
      {/each}
    </div>
  {/if}
</div>
