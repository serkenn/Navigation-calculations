<script lang="ts">
  let { result }: { result: any } = $props();

  function trimLabel(trimBySternCm: number) {
    if (Math.abs(trimBySternCm) < 1e-9) return 'トリムなし';
    return trimBySternCm > 0 ? '船尾トリム' : '船首トリム';
  }
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <h3 class="font-bold mb-3">1. ケースA: 積載位置による前後喫水変化</h3>
    <div class="flex justify-between"><span>平均沈下量</span><span>{result.meanSinkCm.toFixed(2)} cm</span></div>
    <div class="flex justify-between"><span>トリム変化</span><span>{Math.abs(result.trimBySternCm).toFixed(2)} cm ({trimLabel(result.trimBySternCm)})</span></div>
    <div class="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700"></div>
    <div class="flex justify-between"><span>船首喫水変化</span><span class="font-bold">{result.forwardChangeCm >= 0 ? '+' : ''}{result.forwardChangeCm.toFixed(2)} cm</span></div>
    <div class="flex justify-between"><span>船尾喫水変化</span><span class="font-bold">{result.aftChangeCm >= 0 ? '+' : ''}{result.aftChangeCm.toFixed(2)} cm</span></div>
  </div>

  <div class="border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <h3 class="font-bold mb-3">2. ケースB: 貨物移動によるトリム変化</h3>
    <div class="flex justify-between"><span>トリム変化量</span><span class="font-bold">{result.trimShiftCm.toFixed(2)} cm</span></div>
    <div class="text-xs text-slate-500 mt-2">式: W × d ÷ MTC</div>
  </div>
</div>
