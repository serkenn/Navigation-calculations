<script lang="ts">
  import { ChevronDown } from 'lucide-svelte';
  import type { CategoryDefinition, CalculatorDefinition } from '$lib/types/calculator';
  import * as icons from 'lucide-svelte';

  let { category, calculators, activeId, onSelect, isOpen, onToggle }: {
    category: CategoryDefinition;
    calculators: CalculatorDefinition[];
    activeId: string;
    onSelect: (id: string) => void;
    isOpen: boolean;
    onToggle: () => void;
  } = $props();

  function getIcon(name: string) {
    const pascalName = name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
    return (icons as any)[pascalName] ?? icons.Circle;
  }

  const CategoryIcon = $derived(getIcon(category.iconName));
</script>

<div>
  <button
    onclick={onToggle}
    class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
  >
    <span class="flex items-center gap-2 font-bold {category.accentColor}">
      <svelte:component this={CategoryIcon} size={16} />
      {category.nameJa}
    </span>
    <ChevronDown size={14} class="text-slate-400 transition-transform {isOpen ? 'rotate-180' : ''}" />
  </button>

  {#if isOpen}
    <div class="ml-4 mt-1 space-y-0.5">
      {#each calculators as calc}
        {@const CalcIcon = getIcon(calc.iconName)}
        {@const isActive = activeId === calc.id}
        <a
          href="/calc/{calc.id}/"
          onclick={(e) => { e.preventDefault(); onSelect(calc.id); }}
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors {isActive
            ? 'bg-slate-600 dark:bg-slate-700 text-white shadow-md font-bold'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}"
        >
          <svelte:component this={CalcIcon} size={14} />
          {calc.nameJa}
        </a>
      {/each}
    </div>
  {/if}
</div>
