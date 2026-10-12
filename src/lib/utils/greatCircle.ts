import { rad, deg, normalize360, normalize180 } from "./navigationMath";

const clamp1 = (x: number) => Math.max(-1, Math.min(1, x));

type Vec3 = [number, number, number];

const toVec = (lat: number, lon: number): Vec3 => {
  const L = rad(lat);
  const l = rad(lon);
  return [Math.cos(L) * Math.cos(l), Math.cos(L) * Math.sin(l), Math.sin(L)];
};
const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** 大圏上の初針路（出発点での真針路） */
export function initialCourse(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const L1 = rad(lat1);
  const L2 = rad(lat2);
  const dl = rad(normalize180(lon2 - lon1));
  const y = Math.sin(dl) * Math.cos(L2);
  const x =
    Math.cos(L1) * Math.sin(L2) - Math.sin(L1) * Math.cos(L2) * Math.cos(dl);
  return normalize360(deg(Math.atan2(y, x)));
}

/** 大圏距離（海里） cos D = sin L1 sin L2 + cos L1 cos L2 cos DLo */
export function greatCircleDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const L1 = rad(lat1);
  const L2 = rad(lat2);
  const dl = rad(normalize180(lon2 - lon1));
  const cosD =
    Math.sin(L1) * Math.sin(L2) + Math.cos(L1) * Math.cos(L2) * Math.cos(dl);
  return deg(Math.acos(clamp1(cosD))) * 60;
}

/**
 * 大圏航法: 距離・初針路・終針路・頂点
 * 頂点緯度は cos Lv = cos L1 · sin C と同値（大圏面の法線から求める）
 */
export function greatCircleSailing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const distance = greatCircleDistance(lat1, lon1, lat2, lon2);
  const course = initialCourse(lat1, lon1, lat2, lon2);
  // 終針路 = 到着点から出発点への初針路の反方位
  const finalCourse = normalize360(initialCourse(lat2, lon2, lat1, lon1) + 180);
  const dLon = normalize180(lon2 - lon1);

  // 頂点: 大圏面に地軸を射影した方向
  const n = cross(toVec(lat1, lon1), toVec(lat2, lon2));
  const nn = Math.sqrt(dot(n, n));
  let vertex: { lat: number; lon: number; onRoute: boolean } | null = null;
  if (nn > 1e-12) {
    const k = n[2] / nn;
    let v: Vec3 = [-k * (n[0] / nn), -k * (n[1] / nn), 1 - k * k];
    const vn = Math.sqrt(dot(v, v));
    if (vn > 1e-12) {
      v = [v[0] / vn, v[1] / vn, v[2] / vn];
      // 航路の側（南半球航路なら南の頂点）を採用
      if (lat1 + lat2 < 0) v = [-v[0], -v[1], -v[2]];
      const vLat = deg(Math.asin(clamp1(v[2])));
      const vLon = deg(Math.atan2(v[1], v[0]));
      // 頂点が出発点〜到着点の間にあるか（経度差で判定）
      const dv = normalize180(vLon - lon1);
      const onRoute = dLon >= 0 ? dv >= 0 && dv <= dLon : dv <= 0 && dv >= dLon;
      vertex = { lat: vLat, lon: vLon, onRoute };
    }
  }

  return { distance, course, finalCourse, dLon, vertex };
}

/**
 * 集成大圏航法: 制限緯度を超えない「大圏 → 平行圏 → 大圏」
 * 出発点から制限緯度に接する大圏:
 *   sin C1 = cos Lv / cos L1, cos DLo1 = tan L1 / tan Lv, cos D1 = sin L1 / sin Lv
 */
export function compositeSailing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  limitLat: number,
) {
  const gc = greatCircleSailing(lat1, lon1, lat2, lon2);
  const lv = Math.abs(limitLat) * Math.sign(lat1 + lat2 || 1);
  const pure = {
    ...gc,
    limitLat: lv,
    isComposite: false,
    totalDistance: gc.distance,
    initialCourse: gc.course,
    gcDist1: gc.distance,
    gcDist2: 0,
    parallelDist: 0,
    dLo1: NaN,
    dLo2: NaN,
    parallelDLo: NaN,
    lonV1: NaN,
    lonV2: NaN,
  };

  // 頂点が制限緯度を超えなければ通常の大圏で良い
  if (
    !gc.vertex ||
    !gc.vertex.onRoute ||
    Math.abs(gc.vertex.lat) <= Math.abs(lv)
  ) {
    return pure;
  }
  if (Math.abs(lat1) >= Math.abs(lv) || Math.abs(lat2) >= Math.abs(lv)) {
    return { ...pure, error: "出発点または到着点が制限緯度を超えています" };
  }

  const LV = rad(lv);
  const leg = (lat: number) => {
    const L = rad(lat);
    const c = deg(Math.asin(clamp1(Math.cos(LV) / Math.cos(L))));
    const dLo = deg(Math.acos(clamp1(Math.tan(L) / Math.tan(LV))));
    const d = deg(Math.acos(clamp1(Math.sin(L) / Math.sin(LV)))) * 60;
    return { c, dLo, d };
  };
  const a = leg(lat1);
  const b = leg(lat2);

  const east = gc.dLon >= 0;
  const dir = east ? 1 : -1;
  const parallelDLo = Math.abs(gc.dLon) - a.dLo - b.dLo;
  if (parallelDLo < 0) return pure;

  const north = lv > 0;
  const initial = north
    ? east
      ? a.c
      : 360 - a.c
    : east
      ? 180 - a.c
      : 180 + a.c;

  const lonV1 = normalize180(lon1 + dir * a.dLo);
  const lonV2 = normalize180(lon2 - dir * b.dLo);
  const parallelDist = parallelDLo * 60 * Math.cos(LV);

  return {
    ...gc,
    limitLat: lv,
    isComposite: true,
    totalDistance: a.d + parallelDist + b.d,
    initialCourse: initial,
    gcDist1: a.d,
    gcDist2: b.d,
    parallelDist,
    dLo1: a.dLo,
    dLo2: b.dLo,
    parallelDLo,
    lonV1,
    lonV2,
  };
}

/**
 * 頂点が分かっている大圏と、指定した子午線との交点の緯度
 * tan l = tan lv · cos(経度 − 頂点経度)
 */
export function latitudeOnGreatCircle(
  vertexLat: number,
  vertexLon: number,
  lon: number,
) {
  const dLon = normalize180(lon - vertexLon);
  const lat = deg(Math.atan(Math.tan(rad(vertexLat)) * Math.cos(rad(dLon))));
  return { dLon, lat };
}
