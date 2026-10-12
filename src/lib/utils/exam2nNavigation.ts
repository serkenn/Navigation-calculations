/**
 * 海技試験 2N 航海カテゴリ専用の計算
 * 天測計算の基本式は astronomy.ts を使い、ここには試験の解答形式に合わせた処理だけを置く
 */
import { rad, normalize180 } from "./navigationMath";
import { sightReduction, localHourAngle, intersectLOPs } from "./astronomy";

export interface StarSight {
  name: string;
  /** 観測時刻 U.T.（10進数時間） */
  time: number;
  /** 測高度 as（度） */
  hs: number;
  /** 高度改正値（分、符号付き） */
  corr: number;
  /** グリニッジ時角 hG（度） */
  gha: number;
  /** 赤緯 d（度、N 正） */
  dec: number;
}

/** 1 天体の位置の線の要素（h, ac, Z, I） */
export function reduceSight(sight: StarSight, drLat: number, drLon: number) {
  const lha = localHourAngle(sight.gha, drLon);
  const { hc, z } = sightReduction(drLat, sight.dec, lha);
  // 試験の解答形式: Z = cos⁻¹(…) を 0〜180° で求め、h が 180° 超なら E、未満なら W
  const side: "E" | "W" = lha > 180 ? "E" : "W";
  const zHalf = side === "E" ? z : 360 - z;
  const ht = sight.hs + sight.corr / 60;
  return {
    ...sight,
    lha,
    hc,
    ht,
    zHalf,
    side,
    azimuth: z,
    intercept: (ht - hc) * 60,
  };
}

export type ReducedSight = ReturnType<typeof reduceSight>;

/**
 * 天体による船位の測定（2 天体・高度差法）
 * 先測天体の位置の線を、観測時間差の航走分だけ針路方向へ転位して後測天体の線と交わらせる。
 * 推測位置を原点とした平面近似で、後測時の船位を求める。
 */
export function celestialFix(
  drLat: number,
  drLon: number,
  course: number,
  speed: number,
  sightA: StarSight,
  sightB: StarSight,
) {
  const reduced = [sightA, sightB].map((s) => reduceSight(s, drLat, drLon));
  const [first, second] =
    reduced[0].time <= reduced[1].time ? reduced : [reduced[1], reduced[0]];

  const interval = second.time - first.time;
  const run = speed * interval;
  // 転位: 航走ベクトルの天体方向成分だけ修正差が増える
  const transferShift = run * Math.cos(rad(first.azimuth - course));
  const transferredIntercept = first.intercept + transferShift;

  const fix = intersectLOPs(
    drLat,
    drLon,
    { a: transferredIntercept, z: first.azimuth },
    { a: second.intercept, z: second.azimuth },
  );

  return {
    course,
    speed,
    first,
    second,
    interval,
    run,
    transferShift,
    transferredIntercept,
    possible: fix.possible,
    lat: fix.lat,
    lon: normalize180(fix.lon),
    dLat: fix.dLat,
    dep: fix.dep,
    dLon: normalize180(fix.lon - drLon) * 60,
    cutAngle: Math.abs(normalize180(second.azimuth - first.azimuth)),
  };
}

export type CelestialFixResult = ReturnType<typeof celestialFix>;
