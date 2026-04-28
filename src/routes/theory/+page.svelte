<script lang="ts">
  import { BookOpen } from 'lucide-svelte';
</script>

<svelte:head>
  <title>計算理論・公式 | 航法計算アプリ</title>
  <meta
    name="description"
    content="メリパス計算や出没方位角計算に使用している数理モデルと公式の紹介です。"
  />
</svelte:head>

<div class="w-full p-6 overflow-y-auto bg-white dark:bg-slate-900 h-full transition-colors">
  <div
    class="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-300 p-4 max-w-3xl mx-auto"
  >
    <div class="flex items-center gap-3 mb-6">
      <BookOpen size={28} class="text-indigo-500" />
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white m-0">計算理論・公式</h1>
    </div>

    <section class="mb-8">
      <h2 class="text-lg font-bold">メルカトル航法 (Mercator Sailing)</h2>
      <p>メルカトル図法上の2点間の針路（Course）と航程（Distance）を求めます。</p>
      <div
        class="bg-slate-50 dark:bg-slate-800 p-4 rounded font-serif text-center text-lg italic my-4"
      >
        Course = arctan(D.Lon / DMP)
      </div>
      <p class="text-sm">DMP = 子午線弧長差 (Difference of Meridional Parts)</p>
    </section>

    <section class="mb-8">
      <h2 class="text-lg font-bold">計算精度と手計算との差異</h2>
      <p>本アプリでは高精度なデジタル計算を行っており、従来の手計算との間で以下の差異が生じる場合があります：</p>

      <h3 class="text-base font-semibold mt-4 mb-2">1. 楕円体モデルの違い</h3>
      <p class="text-sm mb-3">
        <strong>アプリ：</strong> WGS84楕円体（離心率 e = 0.0818191908426）による精密計算<br>
        <strong>手計算：</strong> 球体近似または簡略化された楕円体モデル
      </p>

      <h3 class="text-base font-semibold mt-4 mb-2">2. 三角関数の精度</h3>
      <p class="text-sm mb-3">
        <strong>アプリ：</strong> 浮動小数点演算による高精度計算<br>
        <strong>手計算：</strong> 三角関数表からの読み取り（通常4桁精度）
      </p>

      <h3 class="text-base font-semibold mt-4 mb-2">3. 中間値の丸め処理</h3>
      <p class="text-sm mb-3">
        <strong>アプリ：</strong> 最終段階まで精密計算を継続<br>
        <strong>手計算：</strong> 計算過程で適宜丸め処理を実行
      </p>

      <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800 mt-4">
        <p class="text-sm"><strong>実際の差異：</strong></p>
        <ul class="text-sm list-disc list-inside mt-2 space-y-1">
          <li>短距離（30海里以下）：±0.1海里程度</li>
          <li>中距離（100海里程度）：±0.2海里程度</li>
          <li>長距離（200海里以上）：±0.5海里程度</li>
        </ul>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-lg font-bold">大圏航法 (Great Circle Sailing)</h2>
      <p>地球上の2点間の最短距離を大円に沿って計算します。</p>
      <div
        class="bg-slate-50 dark:bg-slate-800 p-4 rounded font-serif text-center text-lg italic my-4"
      >
        cos D = sin l&#8321; sin l&#8322; + cos l&#8321; cos l&#8322; cos(&#955;&#8322; -
        &#955;&#8321;)
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-lg font-bold">天体高度計算 (Sight Reduction)</h2>
      <p>天体の計算高度と方位角を求めるための基本公式です。</p>
      <div
        class="bg-slate-50 dark:bg-slate-800 p-4 rounded font-serif text-center text-lg italic my-4"
      >
        sin h = sin L sin d + cos L cos d cos t
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-lg font-bold">メリパス (Meridian Passage)</h2>
      <p>午前観測の位置の線と正中観測の緯度から船位を決定する手法です。</p>
      <div
        class="bg-slate-50 dark:bg-slate-800 p-4 rounded font-serif text-center text-lg italic my-4"
      >
        &#916;L = (I &middot; csc Z - &#916;l &middot; cot Z) &middot; sec l&#8320;
      </div>
    </section>

    <section>
      <h2 class="text-lg font-bold">出没方位角 (Amplitude)</h2>
      <p>太陽の出没時の方位角からジャイロコンパスの誤差を算出します。</p>
      <div
        class="bg-slate-50 dark:bg-slate-800 p-4 rounded font-serif text-center text-lg italic my-4"
      >
        cos Z = sin d / cos l
      </div>
    </section>
  </div>
</div>

<div
  class="hidden lg:flex w-full lg:w-7/12 p-8 md:p-10 border-l border-slate-200 dark:border-slate-800 overflow-y-auto font-mono relative shadow-inner min-h-[50vh] lg:h-full transition-colors bg-[#fffdf5] dark:bg-[#1a1c23] text-slate-800 dark:text-slate-200 items-center justify-center"
>
  <div class="text-center text-slate-400 dark:text-slate-600">
    <BookOpen size={48} class="mb-4 opacity-20 mx-auto" />
    <p>左パネルの内容をご覧ください</p>
  </div>
</div>
