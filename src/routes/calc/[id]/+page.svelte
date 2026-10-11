<script lang="ts">
  import type { Component } from 'svelte';
  import { FileText, Info, ArrowLeft, Printer } from '@lucide/svelte';
  import { getCalculator, getCategory } from '#lib/data/calculatorRegistry.js';
  import { accentClasses, setAccent } from '#lib/theme/accent.js';

  let { data } = $props();

  // 計算機コンポーネントはレジストリの component パスから遅延読み込みする
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type AnyComponent = Component<any>;
  const modules = import.meta.glob<{ default: AnyComponent }>(
    '#lib/components/calculators/**/*.svelte',
  );
  const base = '/src/lib/components/calculators/';

  const calc = $derived(getCalculator(data.id));
  const category = $derived(calc ? getCategory(calc.category) : undefined);
  const accent = $derived(category?.accent ?? 'blue');
  setAccent(() => accent);

  async function loadPair(component: string) {
    const [c, r] = await Promise.all([
      modules[`${base}${component}Calc.svelte`](),
      modules[`${base}${component}Result.svelte`](),
    ]);
    return { Calc: c.default, Result: r.default };
  }

  const pair = $derived(calc ? loadPair(calc.component) : null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any = $state(null);
  let showMobileResult = $state(false);

  // 計算機が切り替わったら、描画前に前の結果を破棄する
  $effect.pre(() => {
    void data.id;
    result = null;
    showMobileResult = false;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleResult(r: any) {
    result = r;
    showMobileResult = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

{#key data.id}
  <!-- 左パネル（入力） -->
  <div
    class="calc-input-panel w-full lg:w-5/12 p-4 md:p-6 overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full transition-colors {showMobileResult
      ? 'hidden lg:block'
      : 'block'}"
  >
    {#if calc}
      <header class="mb-6">
        <h2
          class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 {accentClasses[
            accent
          ].bar} pl-3"
        >
          {calc.nameJa}
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-4">
          {calc.nameEn}
        </p>
        <p class="text-xs text-slate-400 mt-2 pl-4">{calc.description}</p>
      </header>

      {#await pair then loaded}
        {#if loaded}
          <loaded.Calc onResult={handleResult} />
        {/if}
      {:catch}
        <p class="text-sm text-rose-600">計算機を読み込めませんでした。</p>
      {/await}
    {/if}
  </div>

  <!-- 右パネル（Calculation Sheet） -->
  <div
    class="calc-sheet w-full lg:w-7/12 p-6 md:p-10 overflow-y-auto font-mono relative shadow-inner min-h-[50vh] lg:h-full transition-colors bg-[#fffdf5] dark:bg-[#1a1c23] text-slate-800 dark:text-slate-200 {showMobileResult
      ? 'block h-full'
      : 'hidden lg:block'}"
  >
    {#if showMobileResult}
      <button
        onclick={() => (showMobileResult = false)}
        class="print:hidden lg:hidden absolute top-4 left-4 p-2 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-300 shadow-sm z-50"
        aria-label="入力に戻る"
      >
        <ArrowLeft size={24} />
      </button>
    {/if}

    <div
      class="print:hidden absolute top-6 right-6 opacity-5 pointer-events-none text-slate-800 dark:text-white"
    >
      <FileText size={200} />
    </div>

    <div
      class="sheet-header border-b-2 border-slate-800 dark:border-slate-500 pb-4 mb-8 flex justify-between items-end mt-8 lg:mt-0"
    >
      <h2
        class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
      >
        Calculation Sheet
      </h2>
      <div class="flex items-center gap-2">
        <span class="text-xs font-sans text-slate-500 dark:text-slate-400"
          >{calc?.nameEn ?? ''}</span
        >
        <button
          onclick={() => window.print()}
          class="print:hidden ml-4 p-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          title="印刷"
          aria-label="計算シートを印刷"
        >
          <Printer size={18} />
        </button>
      </div>
    </div>

    {#if !result}
      <div
        class="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600"
      >
        <Info size={48} class="mb-4 opacity-20" />
        <p>No Data Calculated</p>
      </div>
    {:else}
      {#await pair then loaded}
        {#if loaded}
          <div class="space-y-8">
            <loaded.Result {result} />
          </div>
        {/if}
      {/await}
    {/if}
  </div>
{/key}
