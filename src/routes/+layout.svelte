<script lang="ts">
  import { page } from '$app/state';
  import { themeStore } from '$lib/stores/theme.svelte';
  import Sidebar from '$lib/components/layout/Sidebar.svelte';
  import MobileHeader from '$lib/components/layout/MobileHeader.svelte';
  import UpdateBanner from '$lib/components/layout/UpdateBanner.svelte';
  import { getCalculator } from '$lib/data/calculatorRegistry';
  import '../app.css';

  let { children } = $props();
  let isMenuOpen = $state(false);

  const calcId = $derived(page.params.id ?? '');
  const calc = $derived(getCalculator(calcId));
</script>

<!-- 計算機ページの title/description。トップ・ガイド・理論は各ページで設定する -->
<svelte:head>
  {#if calc}
    <title>{calc.nameJa} | 航法計算アプリ</title>
    <meta name="description" content={calc.description} />
  {/if}
</svelte:head>

<div class={themeStore.current}>
  <div
    class="flex flex-col lg:flex-row h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300"
    style="padding-left: var(--sal); padding-right: var(--sar); padding-bottom: var(--sab);"
  >
    <MobileHeader
      {isMenuOpen}
      onToggleMenu={() => (isMenuOpen = !isMenuOpen)}
      theme={themeStore.current}
      onToggleTheme={() => themeStore.toggle()}
    />

    <Sidebar
      isOpen={isMenuOpen}
      activeId={calcId}
      onClose={() => (isMenuOpen = false)}
      theme={themeStore.current}
      onToggleTheme={() => themeStore.toggle()}
    />

    <main class="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
      {@render children()}
    </main>

    <UpdateBanner />
  </div>
</div>
