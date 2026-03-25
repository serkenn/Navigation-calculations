<script lang="ts">
  import { Clock } from 'lucide-svelte';
  import { decimalToHMS } from '$lib/utils/timeConversion';

  let { onResult }: { onResult: (r: any) => void } = $props();
  let decimal: number = $state(9.4083);

  const handleCalculate = () => {
    const result = decimalToHMS(decimal);
    onResult({ ...result, inputDecimal: decimal });
  };
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-rose-600 pl-3">Decimal → HMS</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">10進数時間を時分秒に変換します</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div>
      <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">10進数時間 (Decimal Hours)</span>
      <input type="number" step="0.0001" class="w-full p-3 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono text-lg text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={decimal} />
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Clock size={20} /> 変換 (Convert)
  </button>
</div>
