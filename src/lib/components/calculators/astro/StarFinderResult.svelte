<script lang="ts">
  let { result }: { result: any } = $props();
</script>

<div class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
  <div class="relative">
    <h3 class="text-sm font-bold bg-amber-700 text-white inline-block px-3 py-1 mb-3">Star Finder</h3>
    <div class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
      <div class="text-xs text-slate-500 dark:text-slate-400 mb-2">
        GHA Aries: {result.ghaAries.toFixed(1)}° | 観測可能: {result.stars.length}星
      </div>

      {#if result.stars.length === 0}
        <p class="text-center text-slate-400 py-4">条件に該当する恒星がありません</p>
      {:else}
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b-2 border-slate-300 dark:border-slate-600 text-xs text-slate-500 dark:text-slate-400 uppercase">
                <th class="text-left py-1 pr-2">Star</th>
                <th class="text-right py-1 px-2">SHA</th>
                <th class="text-right py-1 px-2">Dec</th>
                <th class="text-right py-1 px-2">Alt</th>
                <th class="text-right py-1 pl-2">Az</th>
              </tr>
            </thead>
            <tbody>
              {#each result.stars as star}
                <tr class="border-b border-slate-100 dark:border-slate-800">
                  <td class="py-1.5 pr-2 font-bold text-amber-700 dark:text-amber-400">{star.name}</td>
                  <td class="py-1.5 px-2 text-right font-mono">{star.sha.toFixed(1)}°</td>
                  <td class="py-1.5 px-2 text-right font-mono">{star.dec.toFixed(1)}°</td>
                  <td class="py-1.5 px-2 text-right font-mono font-bold">{star.alt.toFixed(1)}°</td>
                  <td class="py-1.5 pl-2 text-right font-mono font-bold">{star.az.toFixed(1)}°</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </div>
</div>
