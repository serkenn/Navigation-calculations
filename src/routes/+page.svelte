<script lang="ts">
  import {
    Navigation,
    Ship,
    Star,
    Telescope,
    Clock,
    Calculator,
    GraduationCap,
    Compass,
    ArrowRight
  } from 'lucide-svelte';
</script>

<svelte:head>
  <title>NavCalc - 航法計算アプリ</title>
  <meta name="description" content="航海に関する各種計算ツール" />
</svelte:head>

<!-- Left Panel -->
<div class="w-full lg:w-5/12 p-6 md:p-8 overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full transition-colors">
  <div class="max-w-md mx-auto">
    <div class="flex items-center gap-3 mb-2">
      <Compass size={32} class="text-blue-500" />
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white">NavCalc</h1>
    </div>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">航海に関する各種計算ツール</p>

    <h2 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">カテゴリ</h2>

    <div class="space-y-2">
      <a href="/calc/course-distance/" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
        <Navigation size={18} class="text-blue-500" />
        <div class="flex-1">
          <div class="text-sm font-bold text-slate-700 dark:text-slate-200">航海計画 PILOT 1</div>
          <div class="text-xs text-slate-400 dark:text-slate-500">針路・航程、大圏航法など</div>
        </div>
        <ArrowRight size={14} class="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors" />
      </a>

      <a href="/calc/cmg-smg/" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
        <Ship size={18} class="text-cyan-500" />
        <div class="flex-1">
          <div class="text-sm font-bold text-slate-700 dark:text-slate-200">その他の航法 PILOT 2</div>
          <div class="text-xs text-slate-400 dark:text-slate-500">潮流計算、風向計算など</div>
        </div>
        <ArrowRight size={14} class="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors" />
      </a>

      <a href="/calc/twilight/" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
        <Star size={18} class="text-amber-500" />
        <div class="flex-1">
          <div class="text-sm font-bold text-slate-700 dark:text-slate-200">天文航法 ASTRO. NAV</div>
          <div class="text-xs text-slate-400 dark:text-slate-500">薄明時、索星、位置の線など</div>
        </div>
        <ArrowRight size={14} class="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors" />
      </a>

      <a href="/calc/altitude-correction/" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
        <Telescope size={18} class="text-purple-500" />
        <div class="flex-1">
          <div class="text-sm font-bold text-slate-700 dark:text-slate-200">六分儀 SEXTANT</div>
          <div class="text-xs text-slate-400 dark:text-slate-500">測高度改正、物標距離</div>
        </div>
        <ArrowRight size={14} class="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors" />
      </a>

      <a href="/calc/time-to-arc/" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
        <Clock size={18} class="text-green-500" />
        <div class="flex-1">
          <div class="text-sm font-bold text-slate-700 dark:text-slate-200">時間と弧度 TIME & ARC</div>
          <div class="text-xs text-slate-400 dark:text-slate-500">時間⇔弧度変換</div>
        </div>
        <ArrowRight size={14} class="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors" />
      </a>

      <a href="/calc/to-hms/" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
        <Calculator size={18} class="text-rose-500" />
        <div class="flex-1">
          <div class="text-sm font-bold text-slate-700 dark:text-slate-200">四則計算 TIME Calc</div>
          <div class="text-xs text-slate-400 dark:text-slate-500">時分秒の四則演算</div>
        </div>
        <ArrowRight size={14} class="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors" />
      </a>

      <a href="/calc/meripass-3n/" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
        <GraduationCap size={18} class="text-indigo-500" />
        <div class="flex-1">
          <div class="text-sm font-bold text-slate-700 dark:text-slate-200">海技試験 EXAM</div>
          <div class="text-xs text-slate-400 dark:text-slate-500">三級海技士 航法計算</div>
        </div>
        <ArrowRight size={14} class="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors" />
      </a>
    </div>

    <p class="text-xs text-slate-400 dark:text-slate-600 mt-8 text-center">
      左のサイドバーから計算ツールを選択してください
    </p>
  </div>
</div>

<!-- Right Panel -->
<div
  class="hidden lg:flex w-full lg:w-7/12 p-8 md:p-10 border-l border-slate-200 dark:border-slate-800 overflow-y-auto font-mono relative shadow-inner min-h-[50vh] lg:h-full transition-colors bg-[#fffdf5] dark:bg-[#1a1c23] text-slate-800 dark:text-slate-200 items-center justify-center"
>
  <div class="text-center">
    <Compass size={64} class="mb-6 opacity-10 mx-auto" />
    <h2 class="text-xl font-bold text-slate-300 dark:text-slate-600 mb-2">NavCalc</h2>
    <p class="text-sm text-slate-300 dark:text-slate-600">カテゴリを選択して計算を開始</p>
  </div>
</div>
