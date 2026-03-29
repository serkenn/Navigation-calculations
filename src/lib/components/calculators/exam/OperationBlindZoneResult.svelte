<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-sm">
  <div class="border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
    <h3 class="font-bold mb-3">死角距離</h3>
    <div class="flex justify-between"><span>眼高 (海面基準)</span><span>{Number.isFinite(result.eyeAboveSeaM) ? result.eyeAboveSeaM.toFixed(1) : '計算不可'} m</span></div>
    <div class="flex justify-between"><span>部材高さ (海面基準)</span><span>{Number.isFinite(result.obstacleAboveSeaM) ? result.obstacleAboveSeaM.toFixed(1) : '計算不可'} m</span></div>
    <div class="mt-2 mb-2 border-t border-slate-200 dark:border-slate-700"></div>
    <div class="flex justify-between"><span>部材から死角先端まで</span><span class="font-bold">{Number.isFinite(result.blindFromObstacleM) ? result.blindFromObstacleM.toFixed(1) : '計算不可'} m</span></div>
    <div class="flex justify-between"><span>眼位置から死角先端まで</span><span>{Number.isFinite(result.blindFromEyeM) ? result.blindFromEyeM.toFixed(1) : '計算不可'} m</span></div>
  </div>
</div>
