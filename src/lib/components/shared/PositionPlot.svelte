<script lang="ts">
  import type { Snippet } from 'svelte';
  import { rad } from '#lib/utils/navigationMath.js';

  /**
   * 天測位置決定用図（推測位置を中心に、位置の線と船位を描く）
   * 距離はすべて海里、east/north は中心（推測位置）からの東西距・南北距
   */
  export type PlotPoint = { east: number; north: number };

  let {
    azimuths = [],
    lops = [],
    latLine,
    run,
    fix,
    children,
  }: {
    /** 中心（または from）から方位 z へ伸ばす破線とそのラベル */
    azimuths?: { from?: PlotPoint; z: number; label: string }[];
    /** 位置の線: from から方位 z に修正差 a だけ進んだ点を通り z に垂直 */
    lops?: { from?: PlotPoint; z: number; a: number; color: string }[];
    /** 緯度線（子午線高度緯度法）: 中心から north だけ離れた水平線 */
    latLine?: { north: number; color: string };
    /** 航走: 中心から針路方向に distance だけ進んだ点に丸を描く */
    run?: { course: number; distance: number };
    /** 船位 */
    fix: PlotPoint;
    /** 凡例（figcaption の中身） */
    children?: Snippet;
  } = $props();

  const ORIGIN: PlotPoint = { east: 0, north: 0 };

  // 図に出てくる距離の最大値から縮尺を決め、半径 1 の円に収める
  const scale = $derived.by(() => {
    const spans = [
      1,
      Math.hypot(fix.east, fix.north),
      run?.distance ?? 0,
      Math.abs(latLine?.north ?? 0),
      ...lops.map(
        (l) =>
          Math.abs(l.a) + Math.hypot(l.from?.east ?? 0, l.from?.north ?? 0),
      ),
    ];
    return 1 / (1.4 * Math.max(...spans));
  });

  const pt = (p: PlotPoint) => ({ x: p.east * scale, y: -p.north * scale });
  const dir = (bearing: number) => ({
    x: Math.sin(rad(bearing)),
    y: -Math.cos(rad(bearing)),
  });

  /** 基点から方位方向に伸ばした線が円と交わる点（基点が円内にある前提） */
  function toEdge(base: { x: number; y: number }, u: { x: number; y: number }) {
    const b = base.x * u.x + base.y * u.y;
    const c = base.x ** 2 + base.y ** 2 - 1;
    const t = -b + Math.sqrt(Math.max(0, b * b - c));
    return { x: base.x + u.x * t, y: base.y + u.y * t };
  }

  /** 基点から方位 z に a だけ進んだ点と、そこを通る z に垂直な線 */
  function lopGeometry(from: PlotPoint, z: number, a: number) {
    const base = pt(from);
    const u = dir(z);
    const m = { x: base.x + u.x * a * scale, y: base.y + u.y * a * scale };
    const v = { x: -u.y, y: u.x };
    return {
      mark: m,
      line: {
        x1: m.x - v.x * 3,
        y1: m.y - v.y * 3,
        x2: m.x + v.x * 3,
        y2: m.y + v.y * 3,
      },
    };
  }

  const runEnd = $derived(
    run
      ? pt({
          east: run.distance * Math.sin(rad(run.course)),
          north: run.distance * Math.cos(rad(run.course)),
        })
      : null,
  );
  const azimuthLines = $derived(
    azimuths.map((az) => {
      const base = pt(az.from ?? ORIGIN);
      const edge = toEdge(base, dir(az.z));
      return { base, edge, label: az.label };
    }),
  );
  const lopLines = $derived(
    lops.map((l) => ({
      ...lopGeometry(l.from ?? ORIGIN, l.z, l.a),
      color: l.color,
    })),
  );
  const latY = $derived(latLine ? -latLine.north * scale : null);
  const fixPt = $derived(pt(fix));

  const anchor = (x: number) =>
    x > 0.2 ? 'start' : x < -0.2 ? 'end' : 'middle';
  const clipId = `position-plot-clip-${Math.random().toString(36).slice(2, 8)}`;
</script>

<figure class="position-plot font-sans">
  <svg
    viewBox="-1.25 -1.25 2.5 2.5"
    class="w-full max-w-sm mx-auto overflow-visible text-slate-700 dark:text-slate-300"
    role="img"
    aria-label="天測位置決定用図"
  >
    <defs>
      <clipPath id={clipId}>
        <circle r="1" />
      </clipPath>
    </defs>

    <!-- 方位目盛（円）と中心線 -->
    <circle r="1" fill="none" stroke="currentColor" stroke-width="0.01" />
    <line
      x1="-1"
      y1="0"
      x2="1"
      y2="0"
      stroke="currentColor"
      stroke-width="0.005"
      opacity="0.5"
    />
    <line
      x1="0"
      y1="-1"
      x2="0"
      y2="1"
      stroke="currentColor"
      stroke-width="0.005"
      opacity="0.5"
    />
    <text
      x="0"
      y="-1.06"
      font-size="0.08"
      text-anchor="middle"
      fill="currentColor">N</text
    >

    <!-- 航走 -->
    {#if runEnd && run}
      <line
        x1="0"
        y1="0"
        x2={dir(run.course).x}
        y2={dir(run.course).y}
        stroke="currentColor"
        stroke-width="0.008"
      />
      <circle
        cx={runEnd.x}
        cy={runEnd.y}
        r="0.02"
        fill="none"
        stroke="currentColor"
        stroke-width="0.008"
      />
    {/if}

    <!-- 天体の方位（破線） -->
    {#each azimuthLines as az, i (i)}
      <line
        x1={az.base.x}
        y1={az.base.y}
        x2={az.edge.x}
        y2={az.edge.y}
        stroke="currentColor"
        stroke-width="0.006"
        stroke-dasharray="0.03 0.02"
      />
      <circle cx={az.edge.x} cy={az.edge.y} r="0.02" fill="currentColor" />
      <text
        x={az.edge.x * 1.07}
        y={az.edge.y * 1.07}
        font-size="0.07"
        text-anchor={anchor(az.edge.x)}
        dominant-baseline="middle"
        fill="currentColor">{az.label}</text
      >
    {/each}

    <!-- 位置の線 -->
    <g clip-path="url(#{clipId})">
      {#if latY !== null && latLine}
        <line
          x1="-3"
          y1={latY}
          x2="3"
          y2={latY}
          stroke={latLine.color}
          stroke-width="0.014"
        />
      {/if}
      {#each lopLines as l, i (i)}
        <line {...l.line} stroke={l.color} stroke-width="0.014" />
      {/each}
    </g>
    {#each lopLines as l, i (i)}
      <circle cx={l.mark.x} cy={l.mark.y} r="0.018" fill={l.color} />
    {/each}

    <!-- 船位 -->
    <circle
      cx={fixPt.x}
      cy={fixPt.y}
      r="0.035"
      fill="none"
      stroke="currentColor"
      stroke-width="0.012"
    />
    <circle cx={fixPt.x} cy={fixPt.y} r="0.008" fill="currentColor" />
  </svg>
  {#if children}
    <figcaption
      class="mt-2 text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5"
    >
      {@render children()}
    </figcaption>
  {/if}
</figure>
