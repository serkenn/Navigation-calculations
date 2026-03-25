<script lang="ts">
  import { Compass } from 'lucide-svelte';
  import DMSInput from '$lib/components/shared/DMSInput.svelte';
  import type { DMSValue } from '$lib/types/navigation';
  import { toDecimal, calculateAmplitude, calculateGyroError } from '$lib/utils/navigationMath';
  import type { GyroResult } from '$lib/types/navigation';

  interface Props {
    onResult: (r: GyroResult) => void;
  }

  let { onResult }: Props = $props();

  let lat: DMSValue = $state({ d: 35, m: 0, dir: 1 });
  let dec: DMSValue = $state({ d: 10, m: 0, dir: 1 });
  let gyroAzimuth = $state(0);
  let type: 'rise' | 'set' = $state('rise');

  function handleCalculate() {
    const latVal = toDecimal(lat.d, lat.m) * lat.dir;
    const decVal = toDecimal(dec.d, dec.m) * dec.dir;
    const Z = calculateAmplitude(latVal, decVal);
    let trueAzimuth360 = Z;
    if (type === 'set') {
      trueAzimuth360 = 360 - Z;
    }
    const gyroError = calculateGyroError(trueAzimuth360, gyroAzimuth);

    onResult({
      trueAzimuthBase: Z,
      trueAzimuth360,
      gyroError,
      direction: type === 'rise' ? 'Rise' : 'Set',
      gyroAzimuth,
    });
  }
</script>

<div class="space-y-8 pb-20">
  <header>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-emerald-600 pl-3">Gyro & Amplitude</h2>
    <p class="text-xs text-slate-400 mt-1 pl-4">出没方位角とジャイロ誤差を算出します</p>
  </header>

  <section class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 transition-colors">
    <div class="grid grid-cols-2 gap-4">
      <DMSInput label="推測緯度 (Lat)" bind:value={lat} showSign signType="NS" />
      <DMSInput label="赤緯 (Dec)" bind:value={dec} showSign signType="NS" />
    </div>

    <div>
      <label class="text-[10px] text-slate-500 dark:text-slate-400 font-bold block uppercase mb-1">Calculation Type</label>
      <div class="flex gap-2">
        <button
          onclick={() => type = 'rise'}
          class={`flex-1 py-2 px-4 rounded-lg font-bold border transition-colors ${type === 'rise' ? 'bg-orange-100 dark:bg-orange-900/40 border-orange-400 text-orange-700 dark:text-orange-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400'}`}
        >
          日出 (Sunrise)
        </button>
        <button
          onclick={() => type = 'set'}
          class={`flex-1 py-2 px-4 rounded-lg font-bold border transition-colors ${type === 'set' ? 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-400 text-indigo-700 dark:text-indigo-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400'}`}
        >
          日没 (Sunset)
        </button>
      </div>
    </div>

    <div>
      <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Gyro Azimuth</span>
      <div class="flex items-center gap-2 mt-1">
        <input
          type="number"
          class="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded font-mono text-lg font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          bind:value={gyroAzimuth}
          placeholder="000.0"
        />
        <span class="text-sm font-bold text-slate-800 dark:text-white">&deg;</span>
      </div>
    </div>

    <button onclick={handleCalculate} class="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
      <Compass size={20} /> 計算実行 (CALC)
    </button>
  </section>
</div>
