<script lang="ts">
  import { Calculator } from 'lucide-svelte';
  import { hmsToDecimal } from '$lib/utils/timeConversion';

  let { onResult }: { onResult: (r: any) => void } = $props();
  let h: number = $state(9);
  let m: number = $state(24);
  let s: number = $state(30);

  const handleCalculate = () => {
    onResult({ decimal: hmsToDecimal(h, m, s), inputH: h, inputM: m, inputS: s });
  };
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-rose-600 pl-3">HMS → Decimal</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">時分秒を10進数時間に変換します</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="grid grid-cols-3 gap-4">
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">時 (h)</span>
        <input type="number" class="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={h} />
      </div>
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">分 (m)</span>
        <input type="number" class="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={m} />
      </div>
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">秒 (s)</span>
        <input type="number" class="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={s} />
      </div>
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Calculator size={20} /> 変換 (Convert)
  </button>
</div>
