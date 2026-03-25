<script lang="ts">
  import { ArrowRightLeft } from 'lucide-svelte';
  import { timeToArc } from '$lib/utils/timeConversion';

  let { onResult }: { onResult: (r: any) => void } = $props();
  let h: number = $state(9);
  let m: number = $state(24);
  let s: number = $state(30);

  const handleCalculate = () => {
    const result = timeToArc(h, m, s);
    onResult({ ...result, inputH: h, inputM: m, inputS: s });
  };
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-green-600 pl-3">Time → Arc</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">時間（時分秒）を弧度（度分秒）に変換します</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-300 font-bold text-sm uppercase tracking-wider">
      <ArrowRightLeft size={16} /> 時間入力 (Time)
    </div>
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

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <ArrowRightLeft size={20} /> 変換 (Convert)
  </button>
</div>
