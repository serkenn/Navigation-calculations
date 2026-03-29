<script lang="ts">
  let { result }: { result: any } = $props();

  function directionText(direction: string) {
    if (direction === 'aft-to-forward') return '後方タンク → 前方タンク';
    if (direction === 'forward-to-aft') return '前方タンク → 後方タンク';
    return '移送不要';
  }
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <h3 class="font-bold mb-3">等喫水化の移送量</h3>
    <div class="flex justify-between"><span>現在トリム</span><span>{result.trimBySternCm.toFixed(1)} cm (船尾+)</span></div>
    <div class="flex justify-between"><span>必要モーメント</span><span>{result.requiredMoment.toFixed(1)} ton-m</span></div>
    <div class="flex justify-between"><span>移送方向</span><span>{directionText(result.direction)}</span></div>
    <div class="flex justify-between font-bold"><span>必要移送量</span><span>{result.transferTon.toFixed(1)} ton</span></div>
  </div>
</div>
