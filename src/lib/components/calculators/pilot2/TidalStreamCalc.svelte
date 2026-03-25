<script lang="ts">
  import { RotateCcw } from 'lucide-svelte';
  import NumberInput from '$lib/components/shared/NumberInput.svelte';
  import { tidalStream } from '$lib/utils/tide';

  export interface TidalStreamResult {
    rate1: number; dir1: number;
    rate2: number; dir2: number;
    fraction: number;
    rate: number; dir: number;
  }

  let { onResult }: { onResult: (r: TidalStreamResult) => void } = $props();

  let rate1 = $state(1.5);
  let dir1 = $state(90);
  let rate2 = $state(2.5);
  let dir2 = $state(120);
  let fraction = $state(0.5);

  function handleCalculate() {
    const r = tidalStream(rate1, dir1, rate2, dir2, fraction);
    onResult({ rate1, dir1, rate2, dir2, fraction, rate: r.rate, dir: r.dir });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-cyan-600 pl-3">潮流計算</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">2つの潮流データ間の補間計算を行います</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">データ 1</div>
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="流速 (Rate)" bind:value={rate1} unit="kn" step={0.1} />
      <NumberInput label="流向 (Dir)" bind:value={dir1} unit="°" step={1} />
    </div>
  </section>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">データ 2</div>
    <div class="grid grid-cols-2 gap-4">
      <NumberInput label="流速 (Rate)" bind:value={rate2} unit="kn" step={0.1} />
      <NumberInput label="流向 (Dir)" bind:value={dir2} unit="°" step={1} />
    </div>
  </section>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <NumberInput label="補間比率 (0.0〜1.0)" bind:value={fraction} unit="" step={0.1} />
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <RotateCcw size={20} /> 計算実行 (CALC)
  </button>
</div>
