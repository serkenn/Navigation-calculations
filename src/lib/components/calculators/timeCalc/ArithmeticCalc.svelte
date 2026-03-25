<script lang="ts">
  import { Calculator } from 'lucide-svelte';
  import { hmsArithmetic } from '$lib/utils/timeConversion';

  let { onResult }: { onResult: (r: any) => void } = $props();
  let h1: number = $state(12);
  let m1: number = $state(30);
  let s1: number = $state(0);
  let op: '+' | '-' | '*' | '/' = $state('+');
  let h2: number = $state(3);
  let m2: number = $state(15);
  let s2: number = $state(0);

  const handleCalculate = () => {
    const result = hmsArithmetic(h1, m1, s1, op, h2, m2, s2);
    onResult({ ...result, h1, m1, s1, op, h2, m2, s2 });
  };

  const inputClass = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none";

  const operators = ['+', '-', '*', '/'] as const;
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-rose-600 pl-3">時間の四則計算</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">時分秒形式の加減乗除</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div>
      <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1 block">値 A</span>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <span class="text-[10px] text-slate-400">h</span>
          <input type="number" class={inputClass} bind:value={h1} />
        </div>
        <div>
          <span class="text-[10px] text-slate-400">m</span>
          <input type="number" class={inputClass} bind:value={m1} />
        </div>
        <div>
          <span class="text-[10px] text-slate-400">s</span>
          <input type="number" class={inputClass} bind:value={s1} />
        </div>
      </div>
    </div>

    <div>
      <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1 block">演算子</span>
      <div class="flex gap-2">
        {#each operators as o}
          <button
            onclick={() => op = o}
            class="flex-1 py-2 rounded-lg font-bold text-lg border transition-colors {op === o
              ? 'bg-rose-100 dark:bg-rose-900/40 border-rose-400 text-rose-700 dark:text-rose-300'
              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400'}"
          >
            {o}
          </button>
        {/each}
      </div>
    </div>

    <div>
      <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1 block">値 B</span>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <span class="text-[10px] text-slate-400">h</span>
          <input type="number" class={inputClass} bind:value={h2} />
        </div>
        <div>
          <span class="text-[10px] text-slate-400">m</span>
          <input type="number" class={inputClass} bind:value={m2} />
        </div>
        <div>
          <span class="text-[10px] text-slate-400">s</span>
          <input type="number" class={inputClass} bind:value={s2} />
        </div>
      </div>
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Calculator size={20} /> 計算実行 (CALC)
  </button>
</div>
