<script lang="ts">
  import { rad } from '#lib/utils/navigationMath.js';
  import type { CelestialFixResult } from '#lib/utils/exam2nNavigation.js';

  /** 天測位置決定用図（推測位置を中心とした作図）の簡易表示 */
  let { result }: { result: CelestialFixResult } = $props();

  // 東西距・南北距（海里）→ SVG 座標（半径 1 の円に収める）
  const scale = $derived(
    1 /
      (1.4 *
        Math.max(
          1,
          result.run,
          Math.abs(result.second.intercept),
          Math.abs(result.transferredIntercept),
          Math.hypot(result.dLat, result.dep),
        )),
  );
  const pt = (east: number, north: number) => ({
    x: east * scale,
    y: -north * scale,
  });
  const dir = (bearing: number) => ({
    x: Math.sin(rad(bearing)),
    y: -Math.cos(rad(bearing)),
  });

  const runEnd = $derived(
    pt(
      result.run * Math.sin(rad(result.course)),
      result.run * Math.cos(rad(result.course)),
    ),
  );

  /** 基点から方位 Z に I だけ進んだ点と、そこを通る Z に垂直な線 */
  function lop(base: { x: number; y: number }, z: number, a: number) {
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

  const origin = { x: 0, y: 0 };
  const lopFirst = $derived(
    lop(runEnd, result.first.azimuth, result.first.intercept),
  );
  const lopSecond = $derived(
    lop(origin, result.second.azimuth, result.second.intercept),
  );
  const fix = $derived(pt(result.dep, result.dLat));
  const firstDir = $derived(dir(result.first.azimuth));
  const secondDir = $derived(dir(result.second.azimuth));
  const courseDir = $derived(dir(result.course));

  /** 中心から方位方向に伸ばした線が円と交わる点（基点が円内にある前提） */
  function toEdge(base: { x: number; y: number }, u: { x: number; y: number }) {
    const b = base.x * u.x + base.y * u.y;
    const c = base.x ** 2 + base.y ** 2 - 1;
    const t = -b + Math.sqrt(b * b - c);
    return { x: base.x + u.x * t, y: base.y + u.y * t };
  }
  const firstEdge = $derived(toEdge(runEnd, firstDir));
  const secondEdge = $derived(toEdge(origin, secondDir));
  const anchor = (x: number) =>
    x > 0.2 ? 'start' : x < -0.2 ? 'end' : 'middle';
</script>

<figure class="font-sans">
  <svg
    viewBox="-1.25 -1.25 2.5 2.5"
    class="w-full max-w-sm mx-auto overflow-visible text-slate-700 dark:text-slate-300"
    role="img"
    aria-label="天測位置決定用図"
  >
    <defs>
      <clipPath id="celestial-fix-clip">
        <circle r="1" />
      </clipPath>
    </defs>

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

    <!-- コースライン -->
    <line
      x1="0"
      y1="0"
      x2={courseDir.x}
      y2={courseDir.y}
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

    <!-- 方位線 -->
    <line
      x1="0"
      y1="0"
      x2={secondEdge.x}
      y2={secondEdge.y}
      stroke="currentColor"
      stroke-width="0.006"
      stroke-dasharray="0.03 0.02"
    />
    <line
      x1={runEnd.x}
      y1={runEnd.y}
      x2={firstEdge.x}
      y2={firstEdge.y}
      stroke="currentColor"
      stroke-width="0.006"
      stroke-dasharray="0.03 0.02"
    />
    <text
      x={secondEdge.x * 1.06}
      y={secondEdge.y * 1.06}
      font-size="0.075"
      text-anchor={anchor(secondEdge.x)}
      dominant-baseline="middle"
      fill="currentColor">★ {result.second.name}</text
    >
    <text
      x={firstEdge.x * 1.06}
      y={firstEdge.y * 1.06}
      font-size="0.075"
      text-anchor={anchor(firstEdge.x)}
      dominant-baseline="middle"
      fill="currentColor">★ {result.first.name}</text
    >

    <!-- 位置の線 -->
    <g clip-path="url(#celestial-fix-clip)">
      <line {...lopSecond.line} stroke="#2563eb" stroke-width="0.014" />
      <line {...lopFirst.line} stroke="#e11d48" stroke-width="0.014" />
    </g>
    <circle
      cx={lopSecond.mark.x}
      cy={lopSecond.mark.y}
      r="0.018"
      fill="#2563eb"
    />
    <circle
      cx={lopFirst.mark.x}
      cy={lopFirst.mark.y}
      r="0.018"
      fill="#e11d48"
    />

    <!-- 船位 -->
    <circle
      cx={fix.x}
      cy={fix.y}
      r="0.035"
      fill="none"
      stroke="currentColor"
      stroke-width="0.012"
    />
    <circle cx={fix.x} cy={fix.y} r="0.008" fill="currentColor" />
  </svg>
  <figcaption
    class="mt-2 text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5"
  >
    <p>
      <span class="inline-block w-3 h-0.5 align-middle bg-[#e11d48]"></span>
      {result.first.name} の位置の線（航走 {result.run.toFixed(1)}' 転位）
    </p>
    <p>
      <span class="inline-block w-3 h-0.5 align-middle bg-[#2563eb]"></span>
      {result.second.name} の位置の線
    </p>
    <p>◎ 後測時の船位　円の中心 = 推測位置</p>
  </figcaption>
</figure>
