/**
 * 海技試験 3N 航海カテゴリ専用の計算
 * PILOT / ASTRO と共通の計算は各モジュールの関数をそのまま使い、
 * ここには試験固有の問題形式（クロス方位・両測方位・時計改正など）だけを置く
 */
import { rad, normalize180, normalize360 } from "./navigationMath";

/** 平行航法: 東西距 = 変経 × cos L（変経は分） */
export function parallelSailing(lat: number, dLonMin: number) {
  const cosL = Math.cos(rad(lat));
  return { cosL, departure: dLonMin * cosL };
}

/** 正子午線航法: 航程 = 変緯（分） */
export function meridianSailing(lat1: number, lat2: number) {
  const dLatMin = (lat2 - lat1) * 60;
  return { dLatMin, distance: Math.abs(dLatMin) };
}

/** 光達距離は六分儀カテゴリと同じ式を使う */
export { geographicalRange as lightRange } from "./sextant";

const unit = (bearing: number): [number, number] => [
  Math.sin(rad(bearing)),
  Math.cos(rad(bearing)),
];

/** a·u + b·v = w を満たす (a, b) を求める（平面ベクトル） */
function solve2(u: [number, number], v: [number, number], w: [number, number]) {
  const det = u[0] * v[1] - u[1] * v[0];
  if (Math.abs(det) < 1e-9) return null;
  return {
    a: (w[0] * v[1] - w[1] * v[0]) / det,
    b: (u[0] * w[1] - u[1] * w[0]) / det,
  };
}

/** 基準点からの東西距・南北距（海里）を緯度経度へ戻す */
function offsetPosition(lat: number, lon: number, east: number, north: number) {
  const newLat = lat + north / 60;
  const midLat = (lat + newLat) / 2;
  return {
    lat: newLat,
    lon: normalize180(lon + east / (60 * Math.cos(rad(midLat)))),
  };
}

/**
 * クロス方位法: 位置既知の 2 物標の真方位から船位を求める（平面近似）
 * 物標 A = 船位 + r1·u1、物標 B = 船位 + r2·u2
 */
export function crossBearingFix(
  aLat: number,
  aLon: number,
  bearingA: number,
  bLat: number,
  bLon: number,
  bearingB: number,
) {
  const midLat = (aLat + bLat) / 2;
  // A を原点とした B の位置（海里）
  const bx = normalize180(bLon - aLon) * 60 * Math.cos(rad(midLat));
  const by = (bLat - aLat) * 60;
  const u1 = unit(bearingA);
  const u2 = unit(bearingB);
  // B − A = r2·u2 − r1·u1
  const sol = solve2([-u1[0], -u1[1]], u2, [bx, by]);
  if (!sol) return { possible: false as const };
  const r1 = sol.a;
  const r2 = sol.b;
  const fix = offsetPosition(aLat, aLon, -r1 * u1[0], -r1 * u1[1]);
  return {
    possible: r1 > 0 && r2 > 0,
    lat: fix.lat,
    lon: fix.lon,
    distA: r1,
    distB: r2,
    cutAngle: Math.abs(normalize180(bearingB - bearingA)),
  };
}

/**
 * 両測方位法（ランニングフィックス）: 1 物標を 2 回測った真方位と航走から船位を求める
 * 第 1 船位 P1 = O − r1·u1、第 2 船位 P2 = O − r2·u2、P2 − P1 = 航走ベクトル
 */
export function runningFix(
  objLat: number,
  objLon: number,
  bearing1: number,
  bearing2: number,
  course: number,
  runDistance: number,
) {
  const u1 = unit(bearing1);
  const u2 = unit(bearing2);
  const run = unit(course).map((c) => c * runDistance) as [number, number];
  // r1·u1 − r2·u2 = 航走ベクトル
  const sol = solve2(u1, [-u2[0], -u2[1]], run);
  if (!sol) return { possible: false as const };
  const r1 = sol.a;
  const r2 = sol.b;
  const fix = offsetPosition(objLat, objLon, -r2 * u2[0], -r2 * u2[1]);
  return {
    possible: r1 > 0 && r2 > 0,
    lat: fix.lat,
    lon: fix.lon,
    dist1: r1,
    dist2: r2,
    angle: Math.abs(normalize180(bearing2 - bearing1)),
  };
}

/**
 * 船内時計の改正: 経度差 1° につき 4 分
 * 東航すれば時計を進め、西航すれば遅らせる
 */
export function clockCorrection(depLon: number, arrLon: number) {
  const dLon = normalize180(arrLon - depLon);
  const minutes = dLon * 4;
  return {
    dLon,
    minutes,
    direction: dLon >= 0 ? ("advance" as const) : ("retard" as const),
  };
}

/** 真風: 見掛風向を真方位で与える試験形式 → 船首からの相対風向に変換 */
export const relativeFromTrue = (apparentDir: number, heading: number) =>
  normalize360(apparentDir - heading);
