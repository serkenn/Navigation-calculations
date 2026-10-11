<script lang="ts">
  import { HelpCircle } from 'lucide-svelte';
  import { getChildCategories } from '$lib/data/calculatorRegistry';
  import { accentClasses } from '$lib/theme/accent';

  const topCategories = getChildCategories(undefined);
</script>

<svelte:head>
  <title>利用ガイド | 航法計算アプリ</title>
  <meta
    name="description"
    content="航法計算アプリの使い方と操作手順について解説します。"
  />
</svelte:head>

<div
  class="w-full p-6 overflow-y-auto bg-white dark:bg-slate-900 h-full transition-colors"
>
  <div
    class="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-300 p-4 max-w-3xl mx-auto"
  >
    <div class="flex items-center gap-3 mb-6">
      <HelpCircle size={28} class="text-blue-500" />
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white m-0">
        利用ガイド
      </h1>
    </div>

    <section class="mb-8">
      <h2 class="text-lg font-bold">カテゴリ一覧</h2>
      <ul class="space-y-2">
        {#each topCategories as cat (cat.id)}
          <li class="flex items-center gap-2">
            <cat.icon
              size={16}
              class="shrink-0 {accentClasses[cat.accent].text}"
            />
            <span><strong>{cat.nameJa}</strong>: {cat.summary}</span>
          </li>
        {/each}
      </ul>
      <p class="text-xs">
        カテゴリ構成と名称は TAMAYA 航法計算機 NC-2200
        の機能一覧に準拠しています。
      </p>
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

    <section class="mb-8">
      <h2 class="text-lg font-bold">角度の入力</h2>
      <p>
        緯度・経度・角度は「度・分」形式で入力します（分は小数可）。緯度経度は方向（N/S/E/W）をプルダウンで選択してください。時刻は「時・分」で入力します。入力後は
        Enter キーでも計算できます。
      </p>
    </section>

    <section>
      <h2 class="text-lg font-bold">開発・フィードバック</h2>
      <p>
        ソースコード: <a
          href="https://github.com/serkenn/Navigation-calculations"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 dark:text-blue-400 hover:underline">GitHub</a
        >
      </p>
      <p>
        作者: <a
          href="https://serken.tech"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 dark:text-blue-400 hover:underline"
          >serken.tech</a
        >
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
