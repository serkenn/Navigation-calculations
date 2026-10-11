<script lang="ts">
  import { Compass, ArrowRight } from 'lucide-svelte';
  import {
    firstCalculatorIn,
    getChildCategories,
  } from '$lib/data/calculatorRegistry';
  import { accentClasses } from '$lib/theme/accent';

  const topCategories = getChildCategories(undefined);
</script>

<svelte:head>
  <title>NavCalc - 航法計算アプリ</title>
  <meta name="description" content="航海に関する各種計算ツール" />
</svelte:head>

<div
  class="w-full lg:w-5/12 p-4 md:p-6 overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full transition-colors"
>
  <div class="max-w-md mx-auto py-8">
    <div class="flex items-center gap-3 mb-2">
      <Compass size={32} class="text-blue-600 dark:text-blue-400" />
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white">NavCalc</h1>
    </div>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
      航海に関する各種計算ツール
    </p>

    <h2
      class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3"
    >
      カテゴリ
    </h2>
    <div class="space-y-2">
      {#each topCategories as cat (cat.id)}
        {@const first = firstCalculatorIn(cat.id)}
        {#if first}
          <a
            href="/calc/{first.id}/"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
          >
            <cat.icon
              size={18}
              class="shrink-0 {accentClasses[cat.accent].text}"
            />
            <div class="flex-1">
              <div class="text-sm font-bold text-slate-700 dark:text-slate-200">
                {cat.nameJa}
              </div>
              <div class="text-xs text-slate-400 dark:text-slate-500">
                {cat.summary}
              </div>
            </div>
            <ArrowRight
              size={14}
              class="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors"
            />
          </a>
        {/if}
      {/each}
    </div>

    <p class="text-xs text-slate-400 dark:text-slate-600 mt-8 text-center">
      カテゴリ構成は TAMAYA 航法計算機 NC-2200 の機能一覧に準拠しています
    </p>
  </div>
</div>

<div
  class="hidden lg:flex w-full lg:w-7/12 p-8 md:p-10 overflow-y-auto font-mono relative shadow-inner lg:h-full transition-colors bg-[#fffdf5] dark:bg-[#1a1c23] items-center justify-center"
>
  <div class="text-center">
    <Compass
      size={64}
      class="mb-6 opacity-10 mx-auto text-slate-800 dark:text-white"
    />
    <h2 class="text-xl font-bold text-slate-300 dark:text-slate-600 mb-2">
      NavCalc
    </h2>
    <p class="text-sm text-slate-300 dark:text-slate-600">
      カテゴリを選択して計算を開始
    </p>
  </div>
</div>
