<script lang="ts">
  import Sheet from '$lib/components/shared/Sheet.svelte';
  import InfoGrid from '$lib/components/shared/InfoGrid.svelte';
  import ResultRows from '$lib/components/shared/ResultRows.svelte';
  import Highlight from '$lib/components/shared/Highlight.svelte';
  import Note from '$lib/components/shared/Note.svelte';
  import {
    formatDMS,
    formatLat,
    formatBearing,
  } from '$lib/utils/navigationMath';

  let { result }: { result: any } = $props();
</script>

{#if result.mode === 'predict'}
  <Sheet title="Prediction">
    <InfoGrid
      items={[
        { label: '推測緯度', lines: [formatLat(result.lat)] },
        { label: 'LHA ♈', lines: [formatDMS(result.lhaAries)] },
      ]}
    />
    {#if result.stars.length === 0}
      <Note tone="warn">指定した高度範囲に観測できる恒星はありません。</Note>
    {:else}
      <table class="w-full text-sm font-mono">
        <thead>
          <tr
            class="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800"
          >
            <th class="text-left font-sans py-1">恒星</th>
            <th class="text-right py-1">高度 Hc</th>
            <th class="text-right py-1">方位 Zn</th>
          </tr>
        </thead>
        <tbody>
          {#each result.stars as s (s.name)}
            <tr class="border-b border-slate-100 dark:border-slate-800">
              <td class="font-sans py-1">{s.name}</td>
              <td class="text-right">{formatDMS(s.hc)}</td>
              <td class="text-right">{formatBearing(s.z)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
      <Note
        >方位順に {result.stars.length} 個表示しています（{result.minAlt}°〜{result.maxAlt}°）。</Note
      >
    {/if}
  </Sheet>
{:else}
  <Sheet title="Identification">
    <InfoGrid
      items={[
        {
          label: '推測緯度 / LHA ♈',
          lines: [formatLat(result.lat), formatDMS(result.lhaAries)],
        },
        {
          label: '観測値',
          lines: [
            `h ${formatDMS(result.alt)}`,
            `Zn ${formatBearing(result.az)}`,
          ],
        },
      ]}
    />
    <ResultRows
      rows={[
        { label: '赤緯 Dec', value: formatLat(result.dec) },
        { label: '地方時角 LHA', value: formatDMS(result.lha) },
        { label: '恒星時角 SHA = LHA − LHA♈', value: formatDMS(result.sha) },
      ]}
    />
    <Highlight
      items={[
        {
          label: '該当する恒星',
          value: result.candidates[0].name,
          sub: `SHA ${formatDMS(result.candidates[0].sha)}  Dec ${formatLat(result.candidates[0].dec)}`,
        },
      ]}
    />
    {#if result.candidates[0].distance > 3}
      <Note tone="warn">
        一致する恒星との差が {result.candidates[0].distance.toFixed(1)}°
        あります。惑星の可能性や、観測値・LHA♈ の誤りを確認してください。
      </Note>
    {/if}
    <Note>
      候補: {result.candidates
        .map((c: any) => `${c.name} (差 ${c.distance.toFixed(1)}°)`)
        .join('、')}
    </Note>
  </Sheet>
{/if}
