<script lang="ts">
  import {
    HelpCircle,
    Navigation,
    Ship,
    Star,
    Telescope,
    Clock,
    Calculator,
  } from 'lucide-svelte';
</script>

<svelte:head>
  <title>利用ガイド | 航法計算アプリ</title>
  <meta
    name="description"
    content="航法計算アプリの使い方と操作手順について解説します。"
  />
</svelte:head>

<div class="w-full p-6 overflow-y-auto bg-white dark:bg-slate-900 h-full transition-colors">
  <div
    class="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-300 p-4 max-w-3xl mx-auto"
  >
    <div class="flex items-center gap-3 mb-6">
      <HelpCircle size={28} class="text-blue-500" />
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white m-0">利用ガイド</h1>
    </div>

    <section class="mb-8">
      <h2 class="text-lg font-bold">カテゴリ一覧</h2>
      <ul class="space-y-2">
        <li class="flex items-center gap-2">
          <Navigation size={16} class="text-blue-500" />
          <strong>航海計画 PILOT 1</strong>: 針路・航程、大圏航法など
        </li>
        <li class="flex items-center gap-2">
          <Ship size={16} class="text-cyan-500" />
          <strong>その他の航法 PILOT 2</strong>: 潮流計算、風向計算など
        </li>
        <li class="flex items-center gap-2">
          <Star size={16} class="text-amber-500" />
          <strong>天文航法 ASTRO</strong>: 薄明時、索星、位置の線など
        </li>
        <li class="flex items-center gap-2">
          <Telescope size={16} class="text-purple-500" />
          <strong>六分儀 SEXTANT</strong>: 測高度改正、物標距離
        </li>
        <li class="flex items-center gap-2">
          <Clock size={16} class="text-green-500" />
          <strong>時間と弧度 TIME & ARC</strong>: 時間⇔弧度変換
        </li>
        <li class="flex items-center gap-2">
          <Calculator size={16} class="text-rose-500" />
          <strong>四則計算 TIME Calc</strong>: 時分秒の四則演算
        </li>
      </ul>
    </section>

    <section class="mb-8">
      <h2 class="text-lg font-bold">基本操作</h2>
      <ol class="space-y-1">
        <li>左のサイドバーからカテゴリを展開し、計算ツールを選択</li>
        <li>入力欄に数値を入力</li>
        <li>「計算実行」ボタンを押す</li>
        <li>右パネル（Calculation Sheet）に結果が表示されます</li>
      </ol>
    </section>

    <section>
      <h2 class="text-lg font-bold">角度の入力</h2>
      <p>
        緯度・経度は「度 分」形式で入力し、方向（N/S/E/W）をプルダウンで選択してください。
      </p>
    </section>
  </div>
</div>

<div
  class="hidden lg:flex w-full lg:w-7/12 p-8 md:p-10 border-l border-slate-200 dark:border-slate-800 overflow-y-auto font-mono relative shadow-inner min-h-[50vh] lg:h-full transition-colors bg-[#fffdf5] dark:bg-[#1a1c23] text-slate-800 dark:text-slate-200 items-center justify-center"
>
  <div class="text-center text-slate-400 dark:text-slate-600">
    <HelpCircle size={48} class="mb-4 opacity-20 mx-auto" />
    <p>左パネルの内容をご覧ください</p>
  </div>
</div>
