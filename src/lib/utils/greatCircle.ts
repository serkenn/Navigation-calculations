import { rad, deg } from "./navigationMath";

/**
 * 大圏航法: 距離と初針路
 */
export function greatCircleSailing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const l1 = rad(lat1),
    l2 = rad(lat2);
  let dLon = rad(lon2 - lon1);
  while (dLon > Math.PI) dLon -= 2 * Math.PI;
  while (dLon < -Math.PI) dLon += 2 * Math.PI;

  // Distance
  const cosD =
    Math.sin(l1) * Math.sin(l2) + Math.cos(l1) * Math.cos(l2) * Math.cos(dLon);
  const d = Math.acos(Math.max(-1, Math.min(1, cosD)));
  const distNM = deg(d) * 60;

  // Initial course
  const sinC = Math.sin(dLon) * Math.cos(l2);
  const cosC =
    Math.cos(l1) * Math.sin(l2) - Math.sin(l1) * Math.cos(l2) * Math.cos(dLon);
  let course = deg(Math.atan2(sinC, cosC));
  if (course < 0) course += 360;

  // Vertex (最高緯度)
  const sinLv =
    Math.sin(l1) / Math.sin(rad(course > 180 ? 360 - course : course) || 1e-10);
  const latVertex = deg(Math.asin(Math.max(-1, Math.min(1, sinLv))));

  return { distance: distNM, course, latVertex };
}

/**
 * 集成大圏航法: 制限緯度を超えない大圏＋平行圏航行
 */
export function compositeSailing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  limitLat: number,
) {
  const l1 = rad(lat1),
    l2 = rad(lat2);
  const lv = rad(limitLat);

  // Check if great circle vertex exceeds limit
  const gc = greatCircleSailing(lat1, lon1, lat2, lon2);
  if (Math.abs(gc.latVertex) <= Math.abs(limitLat)) {
    // No need for composite, pure great circle suffices
    return {
      totalDistance: gc.distance,
      initialCourse: gc.course,
      gcDist1: gc.distance,
      gcDist2: 0,
      parallelDist: 0,
      lonV1: 0,
      lonV2: 0,
      isComposite: false,
    };
  }

  // Phase 1: GC from departure to limiting latitude
  const cosC1 = Math.tan(l1) / Math.tan(lv);
  const c1Deg = deg(Math.acos(Math.max(-1, Math.min(1, cosC1))));
  const initialCourse =
    lat1 >= 0
      ? lon2 > lon1
        ? c1Deg
        : 360 - c1Deg
      : lon2 > lon1
        ? 180 - c1Deg
        : 180 + c1Deg;

  // GC distance 1
  const cosD1 = Math.sin(l1) / Math.sin(lv);
  const d1 = Math.acos(Math.max(-1, Math.min(1, cosD1)));
  const gcDist1 = deg(d1) * 60;

  // Longitude of vertex 1
  const cosDLon1 =
    Math.cos(d1) / (Math.cos(l1) * Math.cos(lv)) - Math.tan(l1) * Math.tan(lv);
  const dLon1 = deg(Math.acos(Math.max(-1, Math.min(1, cosDLon1))));
  const lonV1 = lon1 + (lon2 > lon1 ? dLon1 : -dLon1);

  // Phase 3: GC from limiting latitude to destination

  const cosD2 = Math.sin(l2) / Math.sin(lv);
  const d2 = Math.acos(Math.max(-1, Math.min(1, cosD2)));
  const gcDist2 = deg(d2) * 60;

  const cosDLon2 =
    Math.cos(d2) / (Math.cos(l2) * Math.cos(lv)) - Math.tan(l2) * Math.tan(lv);
  const dLon2 = deg(Math.acos(Math.max(-1, Math.min(1, cosDLon2))));
  const lonV2 = lon2 + (lon2 > lon1 ? -dLon2 : dLon2);

  // Phase 2: Parallel sailing along limiting latitude
  const dLonParallel = Math.abs(lonV2 - lonV1);
  const parallelDist = dLonParallel * 60 * Math.cos(lv);

  const totalDistance = gcDist1 + parallelDist + gcDist2;

  return {
    totalDistance,
    initialCourse,
    gcDist1,
    gcDist2,
    parallelDist,
    lonV1,
    lonV2,
    isComposite: true,
  };
}
