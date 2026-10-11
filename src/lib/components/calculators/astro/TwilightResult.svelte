<script lang="ts">
  import Sheet from '#lib/components/shared/Sheet.svelte';
  import InfoGrid from '#lib/components/shared/InfoGrid.svelte';
  import Note from '#lib/components/shared/Note.svelte';
  import {
    formatLat,
    formatLon,
    formatClock,
  } from '#lib/utils/navigationMath.js';

  let { result }: { result: any } = $props();

  const fmt = (ev: any, key: 'riseLMT' | 'setLMT' | 'riseZT' | 'setZT') =>
    ev.possible ? formatClock(ev[key]) : '—';

  const rows = $derived([
    { name: '天文薄明 (−18°)', ev: result.astronomical },
    { name: '航海薄明 (−12°)', ev: result.nautical },
    { name: '市民薄明 (−6°)', ev: result.civil },
    { name: '日出没', ev: result.sunrise },
  ]);
</script>

<Sheet title="Twilight">
  <InfoGrid
    items={[
      { label: '日付 Date', lines: [result.date] },
      {
        label: '位置 Position',
        lines: [formatLat(result.lat), formatLon(result.lon)],
      },
    ]}
  />
  <table class="w-full text-sm font-mono">
    <thead>
      <tr
        class="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800"
      >
        <th class="text-left font-sans py-1"></th>
        <th class="text-right py-1">朝 LMT</th>
        <th class="text-right py-1">朝 ZT</th>
        <th class="text-right py-1">夕 LMT</th>
        <th class="text-right py-1">夕 ZT</th>
      </tr>
    </thead>
    <tbody>
      {#each rows as row (row.name)}
        <tr class="border-b border-slate-100 dark:border-slate-800">
          <td class="font-sans py-1.5">{row.name}</td>
          <td class="text-right">{fmt(row.ev, 'riseLMT')}</td>
          <td class="text-right font-bold">{fmt(row.ev, 'riseZT')}</td>
          <td class="text-right">{fmt(row.ev, 'setLMT')}</td>
          <td class="text-right font-bold">{fmt(row.ev, 'setZT')}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  <Note>
    朝の列は薄明の始まりと日出、夕の列は日没と薄明の終わりです。ZT は標準子午線 {formatLon(
      result.zone,
    )} の標準時です。赤緯 {formatLat(result.sunrise.dec)}、均時差 {result.sunrise.eqTime.toFixed(
      1,
    )}
    分（簡易暦による概算）。「—」はその現象が起こらない（白夜・極夜）ことを示します。
  </Note>
</Sheet>
