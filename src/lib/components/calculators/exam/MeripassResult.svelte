<script lang="ts">
  /**
   * 天体による船位の決定（メリパス）— 海技試験の手書き答案の形式で表示する
   * 値はすべて MeripassCalc が共通関数（astronomy / mercatorSailing）で求めたもの
   */
  let { result }: { result: any } = $props();

  type Row = [string, string];
  type CRow = { l: string; v: string; op?: string; res?: boolean };

  // ── 書式ヘルパー（答案の手書き表記に合わせる） ──
  // 度分: 28°30.0'（分を先に丸めて 60.0' にならないようにする）
  const dm = (v: number) => {
    const tm = Math.round(Math.abs(v) * 600) / 10;
    const d = Math.floor(tm / 60 + 1e-9);
    const m = Math.abs(tm - d * 60);
    return `${d}°${m.toFixed(1).padStart(4, '0')}'`;
  };
  // 符号付き度分（数式内用）: −28°30.0'
  const sdm = (v: number) => (v < 0 ? '−' : '') + dm(v);
  const lat = (v: number) => `${dm(v)} ${v >= 0 ? 'N' : 'S'}`;
  const lon = (v: number) => `${dm(v)} ${v >= 0 ? 'E' : 'W'}`;
  const mins = (v: number) => `${Math.abs(v).toFixed(1)}'`;
  // 数式内の数値: 負なら括弧付き (−2.0)
  const paren = (v: number) =>
    v < 0 ? `(−${Math.abs(v).toFixed(1)})` : v.toFixed(1);
  const signed = (v: number) => `(${v >= 0 ? '+' : '−'})`;
  // 時分秒: 11ʰ 57ᵐ 57ˢ（wrap で 24 時間に正規化）
  const hms = (hours: number, wrap = true) => {
    let t = Math.round(Math.abs(hours) * 3600);
    if (wrap) t = ((Math.round(hours * 3600) % 86400) + 86400) % 86400;
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    return `${h}ʰ ${String(m).padStart(2, '0')}ᵐ ${String(s).padStart(2, '0')}ˢ`;
  };
  // 半円式方位: N 51.5° E
  const halfAz = (z: number) => {
    const n = ((z % 360) + 360) % 360;
    return n <= 180 ? `N ${n.toFixed(1)}° E` : `N ${(360 - n).toFixed(1)}° W`;
  };
  const corrStr = (v: number) => `${signed(v)} ${mins(v)}`;

  const r = $derived(result);
  const run = $derived(result.run);

  const dateStr = $derived.by(() => {
    const [, m, d] = String(result.date ?? '').split('-');
    return m && d ? `${Number(m)}/${Number(d)}` : '';
  });

  // ── 正中時 ──
  const lonT = $derived(run.lon2 / 15);
  const gat = $derived(12 - lonT);
  const zoneT = $derived(result.zoneMeridian / 15);

  // ── 午前観測の地方時角 ──
  const lhaRaw = $derived(result.gha1 + result.lon1);
  const lhaChain = $derived.by((): CRow[] => {
    const rows: CRow[] = [
      { l: 'hG', v: dm(result.gha1) },
      { l: 'L', v: lon(result.lon1), op: result.lon1 >= 0 ? '(+' : '(−' },
    ];
    if (lhaRaw >= 360 || lhaRaw < 0) {
      rows.push({ l: '', v: sdm(lhaRaw), res: true });
      rows.push({ l: '', v: '360°', op: lhaRaw >= 360 ? '(−' : '(+' });
    }
    rows.push({ l: 'hL', v: dm(result.lha1), res: true });
    return rows;
  });

  // ── 子午線高度: 推測緯度で計算した高度 ac と Ao の差 I ──
  const sameName = $derived(run.lat2 >= 0 === result.dec2 >= 0);
  const zc = $derived(Math.abs(run.lat2 - result.dec2));
  const acNoon = $derived(90 - zc);
  const noonPair = $derived.by((): Row[] => {
    const l: Row = ['l₂', lat(run.lat2)];
    const d: Row = ['d', lat(result.dec2)];
    return sameName && Math.abs(result.dec2) > Math.abs(run.lat2)
      ? [d, l]
      : [l, d];
  });
  const iNoonDir = $derived(result.deltaLat >= 0 ? 'N' : 'S');

  // ── 経度改正 ──
  const dlDir = $derived(result.dLongCorr >= 0 ? 'E' : 'W');
  const dlOp = $derived(run.lon2 >= 0 === result.dLongCorr >= 0 ? '(+' : '(−');

  const ink = 'border-slate-700 dark:border-slate-400';
  const faint = 'text-slate-500 dark:text-slate-400';
</script>

<!-- 縦書きの連続筆算（答案の形式）: res 行の上に線を引く -->
{#snippet chain(rows: CRow[])}
  <div
    class="inline-grid grid-cols-[auto_auto_1.75rem] gap-x-3 items-baseline tabular-nums"
  >
    {#each rows as row, i (i)}
      <span
        class="{row.res
          ? `font-bold border-t ${ink} pt-0.5`
          : faint} whitespace-nowrap">{row.l}</span
      >
      <span
        class="text-right whitespace-nowrap {row.res
          ? `font-bold border-t ${ink} pt-0.5`
          : ''}">{row.v}</span
      >
      <span class="text-xs {faint}">{row.op ?? ''}</span>
    {/each}
  </div>
{/snippet}

<!-- 2 項の加減算 -->
{#snippet stack(rows: Row[], total: Row, op: string)}
  {@render chain([
    ...rows.map((row, i) => ({
      l: row[0],
      v: row[1],
      op: i === rows.length - 1 ? op : '',
    })),
    { l: total[0], v: total[1], res: true },
  ])}
{/snippet}

{#snippet heading(text: string)}
  <div class="font-bold underline underline-offset-4 decoration-1 mb-2">
    {text}
  </div>
{/snippet}

<div
  class="exam-sheet @container space-y-7 font-mono text-[13px] leading-relaxed tabular-nums"
>
  <!-- ━━━ 問題の整理: 航走図 ━━━ -->
  <section class="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1">
    <div class="space-y-0.5">
      <div class="font-bold underline underline-offset-4 decoration-1">
        {dateStr} 午前観測
      </div>
      <div><span class={faint}>l₁</span> {lat(r.lat1)}</div>
      <div><span class={faint}>L₁</span> {lon(r.lon1)}</div>
      <div><span class={faint}>⊙</span> {dm(r.hs1)}</div>
    </div>
    <div class="text-center min-w-0">
      <div>Co. {r.course}°</div>
      <div class="flex items-center">
        <span class="flex-1 border-t-[1.5px] {ink}"></span>
        <span class="-ml-1 leading-none">▶</span>
      </div>
      <div>Dist. {r.distance}'</div>
    </div>
    <div class="space-y-0.5">
      <div class="font-bold underline underline-offset-4 decoration-1">
        Noon
      </div>
      <div><span class={faint}>l₂</span> {lat(run.lat2)}</div>
      <div><span class={faint}>L₂</span> {lon(run.lon2)}</div>
      <div><span class={faint}>⊙</span> {dm(r.hs2)}</div>
    </div>
  </section>

  <!-- ━━━ 天測暦からの値 ━━━ -->
  <section class="overflow-x-auto">
    <table class="mx-auto text-center border-collapse">
      <thead>
        <tr class="{faint} text-xs">
          <th class="px-3 font-normal">観測</th>
          <th class="px-3 font-normal border-l {ink}">hG</th>
          <th class="px-3 font-normal border-l {ink}">Eq. of T</th>
          <th class="px-3 font-normal border-l {ink}">d</th>
          <th class="px-3 font-normal border-l {ink}">Corr</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="px-3">午前</td>
          <td class="px-3 border-l {ink}">{dm(r.gha1)}</td>
          <td class="px-3 border-l {ink}">—</td>
          <td class="px-3 border-l {ink}">{lat(r.dec1)}</td>
          <td class="px-3 border-l {ink}">{corrStr(r.corr1)}</td>
        </tr>
        <tr>
          <td class="px-3">Noon</td>
          <td class="px-3 border-l {ink}">—</td>
          <td class="px-3 border-l {ink} whitespace-nowrap">
            {signed(r.eqt)}
            {hms(Math.abs(r.eqt), false).replace(/^0ʰ /, '')}
          </td>
          <td class="px-3 border-l {ink}">{lat(r.dec2)}</td>
          <td class="px-3 border-l {ink}">{corrStr(r.corr2)}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <!-- ━━━ (1) 正午推測位置 ━━━ -->
  <section>
    <div class="grid gap-x-6 gap-y-4 @lg:grid-cols-3">
      <div>
        {@render heading('D.Lat.')}
        <div class="whitespace-nowrap">
          {r.distance}·cos({r.course}°) = {run.dLatMin < 0 ? '−' : ''}{mins(
            run.dLatMin,
          )}
        </div>
        <div class="mt-2">
          {@render stack(
            [
              ['l₁', lat(r.lat1)],
              ['l₂', lat(run.lat2)],
            ],
            ['Mid.l', lat(run.midLat)],
            '(+)÷2',
          )}
        </div>
      </div>
      <div>
        {@render heading('Dep.')}
        <div class="whitespace-nowrap">
          {r.distance}·sin({r.course}°) = {run.dep < 0 ? '−' : ''}{Math.abs(
            run.dep,
          ).toFixed(3)}
        </div>
        <div
          class="mt-3 inline-block border-[1.5px] {ink} px-3 py-1.5 space-y-0.5"
        >
          <div class="text-xs {faint}">D.R.P</div>
          <div class="font-bold">l₂ {lat(run.lat2)}</div>
          <div class="font-bold">L₂ {lon(run.lon2)}</div>
        </div>
      </div>
      <div>
        {@render heading('D.Long.')}
        <div class="inline-flex items-center gap-2 whitespace-nowrap">
          <span class="inline-flex flex-col items-center">
            <span class="px-1"
              >{run.dep < 0 ? '−' : ''}{Math.abs(run.dep).toFixed(3)}</span
            >
            <span class="px-1 border-t {ink}">cos({sdm(run.midLat)})</span>
          </span>
          <span>= {run.dLonMin < 0 ? '−' : ''}{mins(run.dLonMin)}</span>
        </div>
        <div class="mt-2">
          {@render stack(
            [
              ['L₁', lon(r.lon1)],
              ['D.L', `${mins(run.dLonMin)} ${run.dLonMin >= 0 ? 'E' : 'W'}`],
            ],
            ['L₂', lon(run.lon2)],
            r.lon1 >= 0 === run.dLonMin >= 0 ? '(+' : '(−',
          )}
        </div>
      </div>
    </div>
  </section>

  <!-- ━━━ (2) 正中時 / 正午緯度 ━━━ -->
  <section class="grid gap-x-8 gap-y-5 @md:grid-cols-2">
    <div>
      {@render heading('Noon 正中時')}
      {@render chain([
        { l: 'L.A.T', v: `${dateStr} 12ʰ 00ᵐ 00ˢ` },
        { l: 'L.in.T', v: hms(lonT, false), op: lonT >= 0 ? '(−' : '(+' },
        { l: 'G.A.T', v: hms(gat), res: true },
        {
          l: 'Eq.of.T',
          v: hms(Math.abs(r.eqt), false),
          op: r.eqt >= 0 ? '(−' : '(+',
        },
        { l: 'G.M.T', v: hms(r.ut), res: true },
        { l: 'Z.in.T', v: hms(zoneT, false), op: zoneT >= 0 ? '(+' : '(−' },
        { l: 'S.M.T', v: `${dateStr} ${hms(r.zt)}`, res: true },
      ])}
      <div class="mt-3 inline-block border-[1.5px] {ink} px-3 py-1.5">
        <span class="text-xs {faint}">Ans 正中時</span>
        <div class="font-bold">
          S.M.T {dateStr}
          {hms(r.zt)} //
        </div>
      </div>
    </div>

    <div>
      {@render heading('Noon 子午線高度緯度')}
      {@render chain([
        ...noonPair.map((row, i) => ({
          l: row[0],
          v: row[1],
          op: i === 1 ? (sameName ? '(−' : '(+') : '',
        })),
        { l: 'z', v: dm(zc), res: true },
        { l: '', v: "90°00.0'", op: '(~' },
        { l: 'ac', v: dm(acNoon), res: true },
        { l: 'Ao', v: dm(r.ho2), op: '(~' },
        { l: 'I', v: `${mins(r.deltaLat)} ${iNoonDir}`, res: true },
        { l: 'l₂', v: lat(run.lat2) },
        {
          l: 'I',
          v: `${mins(r.deltaLat)} ${iNoonDir}`,
          op: run.lat2 >= 0 === r.deltaLat >= 0 ? '(+' : '(−',
        },
        { l: 'lat', v: lat(r.noonLat), res: true },
      ])}
      <div class="mt-3">
        <div class="text-xs {faint} mb-0.5">Ao の算出</div>
        {@render stack(
          [
            ['hs', dm(r.hs2)],
            ['Corr', mins(r.corr2)],
          ],
          ['Ao', dm(r.ho2)],
          r.corr2 >= 0 ? '(+' : '(−',
        )}
      </div>
    </div>
  </section>

  <!-- ━━━ (3) 午前観測: 計算高度・方位角 ━━━ -->
  <section class="grid gap-x-8 gap-y-5 @md:grid-cols-2">
    <div>
      {@render heading('午前観測 hL')}
      {@render chain(lhaChain)}
      <table class="exam-left mt-3 border-collapse border-[1.5px] {ink}">
        <tbody>
          <tr>
            <td class="px-2 border-r {ink} {faint}">hL</td>
            <td class="px-3 text-right">{dm(r.lha1)}</td>
            <td class="px-2 border-l {ink} {faint} text-xs">C</td>
          </tr>
          <tr class="border-t {ink}">
            <td class="px-2 border-r {ink} {faint}">lat</td>
            <td class="px-3 text-right">{lat(r.lat1)}</td>
            <td class="px-2 border-l {ink} {faint} text-xs">B</td>
          </tr>
          <tr class="border-t {ink}">
            <td class="px-2 border-r {ink} {faint}">d</td>
            <td class="px-3 text-right">{lat(r.dec1)}</td>
            <td class="px-2 border-l {ink} {faint} text-xs">A</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      {@render heading('Ac / I')}
      {@render stack(
        [
          ['hs', dm(r.hs1)],
          ['Corr', mins(r.corr1)],
        ],
        ['Ao', dm(r.ho1)],
        r.corr1 >= 0 ? '(+' : '(−',
      )}
      <div class="mt-1">
        {@render stack(
          [
            ['Ao', dm(r.ho1)],
            ['Ac', dm(r.hc1)],
          ],
          ['I', `${signed(r.a1)} ${mins(r.a1)}`],
          '(−',
        )}
      </div>
      <div class="text-xs {faint} mt-1">
        {r.a1 >= 0
          ? 'Ao > Ac → 天体に向かう (Toward)'
          : 'Ao < Ac → 天体から離れる (Away)'}
      </div>
    </div>

    <!-- 計算式（全幅） -->
    <div class="@md:col-span-2 border-l-[1.5px] {ink} pl-3 space-y-2">
      <div class="whitespace-nowrap overflow-x-auto">
        sin Ac = sin({sdm(r.dec1)})·sin({sdm(r.lat1)})
        <br />
        <span class="pl-[4.5em] inline-block"
          >+ cos({sdm(r.dec1)})·cos({sdm(r.lat1)})·cos({dm(r.lha1)})</span
        >
      </div>
      <div class="pl-[2.5em] font-bold">Ac = {dm(r.hc1)}</div>
      <div class="flex items-center gap-2 whitespace-nowrap overflow-x-auto">
        <span>cos Z =</span>
        <span class="inline-flex flex-col items-center">
          <span class="px-1"
            >sin({sdm(r.dec1)}) − sin({sdm(r.lat1)})·sin({dm(r.hc1)})</span
          >
          <span class="px-1 border-t {ink}"
            >cos({sdm(r.lat1)})·cos({dm(r.hc1)})</span
          >
        </span>
      </div>
      <div class="pl-[2.5em] font-bold">Z = {halfAz(r.z1)}</div>
    </div>
  </section>

  <!-- ━━━ Ⓐ Ⓑ ━━━ -->
  <section class="flex flex-wrap gap-x-10 gap-y-3 items-center">
    <div class="flex items-center gap-2">
      <span class="text-lg">Ⓐ</span>
      <span class="text-4xl font-light leading-none {faint}">{'{'}</span>
      <div class="font-bold space-y-0.5">
        <div>I = {signed(r.a1)} {mins(r.a1)}</div>
        <div>Z = {halfAz(r.z1)}</div>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-lg">Ⓑ</span>
      <span class="text-4xl font-light leading-none {faint}">{'{'}</span>
      <div class="font-bold">I = {mins(r.deltaLat)} {iNoonDir}</div>
    </div>
  </section>

  <!-- ━━━ (4) 経度改正・答 ━━━ -->
  <section class="grid gap-x-8 gap-y-5 @md:grid-cols-2">
    <div class="min-w-0">
      {@render heading('経度改正')}
      <div class="text-xs {faint} mb-1">
        D.L = (I·cosec Z − Δl·cot Z)·sec l₂
      </div>
      <div class="text-xs mb-2 pl-[2.5em] -indent-[1em]">
        = ({paren(r.a1)}·cosec {r.z1.toFixed(1)}° − {paren(r.deltaLat)}·cot {r.z1.toFixed(
          1,
        )}°)·sec {dm(run.lat2)}
      </div>
      {@render stack(
        [
          ['L₂', lon(run.lon2)],
          ['D.L', `${mins(r.dLongCorr)} ${dlDir}`],
        ],
        ['L', lon(r.noonLon)],
        dlOp,
      )}
    </div>

    <div class="self-end">
      <div class="border-[1.5px] {ink} px-4 py-3 space-y-1">
        <div class="font-bold text-base">Ans</div>
        <div class="flex gap-4 flex-wrap">
          <span>正中時</span>
          <span class="font-bold">{dateStr} {hms(r.zt)}</span>
        </div>
        <div>視正午船位</div>
        <div class="pl-6 font-bold">lat {lat(r.noonLat)}</div>
        <div class="pl-6 font-bold">Long {lon(r.noonLon)}</div>
        <div class="text-right font-bold -mt-1">//</div>
      </div>
    </div>
  </section>
</div>
