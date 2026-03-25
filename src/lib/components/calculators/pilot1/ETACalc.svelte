<script lang="ts">
  import { Timer } from 'lucide-svelte';

  let { onResult }: { onResult: (r: any) => void } = $props();

  let distance: number = $state(350);
  let speed: number = $state(14.5);
  let depH: number = $state(8);
  let depM: number = $state(0);

  function handleCalculate() {
    if (speed <= 0) return;
    const travelTimeHours = distance / speed;
    const travelH = Math.floor(travelTimeHours);
    const travelM = Math.round((travelTimeHours - travelH) * 60);

    const depTotalMin = depH * 60 + depM;
    const arrTotalMin = depTotalMin + Math.round(travelTimeHours * 60);
    const etaDays = Math.floor(arrTotalMin / (24 * 60));
    const remaining = arrTotalMin % (24 * 60);
    const etaH = Math.floor(remaining / 60);
    const etaM = remaining % 60;

    onResult({ distance, speed, travelTimeHours, travelH, travelM, depH, depM, etaH, etaM, etaDays });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-blue-600 pl-3">ETA 到着時刻</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">距離と速力から到着予定時刻を計算します</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">距離 (Distance)</span>
        <div class="flex items-center gap-2 mt-1">
          <input type="number" step="0.1" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={distance} />
          <span class="text-sm text-slate-500 dark:text-slate-400">NM</span>
        </div>
      </div>
      <div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">速力 (Speed)</span>
        <div class="flex items-center gap-2 mt-1">
          <input type="number" step="0.1" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={speed} />
          <span class="text-sm text-slate-500 dark:text-slate-400">kn</span>
        </div>
      </div>
    </div>

    <div class="border-t border-dashed border-slate-200 dark:border-slate-700 pt-4">
      <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">出発時刻 (Departure)</span>
      <div class="flex items-center gap-2 mt-1">
        <input type="number" class="w-20 p-2 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={depH} min={0} max={23} />
        <span class="text-slate-400">:</span>
        <input type="number" class="w-20 p-2 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" bind:value={depM} min={0} max={59} />
      </div>
    </div>
  </section>

  <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
    <Timer size={20} /> 計算実行 (CALC)
  </button>
</div>
