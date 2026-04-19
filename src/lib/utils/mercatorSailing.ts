import { rad, deg } from "./navigationMath";

/**
 * 子午線弧長 (Meridional Parts) - WGS84楕円体近似
 */
export function meridionalParts(lat: number): number {
  const latR = rad(Math.abs(lat));
  const e = 0.08181919; // WGS84 離心率
  const sinL = Math.sin(latR);
  const eSinL = e * sinL;
  const mp =
    7915.7045 * Math.log10(Math.tan(Math.PI / 4 + latR / 2)) -
    3437.7468 * Math.log10((1 + eSinL) / (1 - eSinL));
  return lat >= 0 ? mp : -mp;
}

/**
 * メルカトル航法: 2地点間の針路と航程
 */
export function mercatorCourseDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const dLat = (lat2 - lat1) * 60; // 分
  let dLon = (lon2 - lon1) * 60; // 分
  // 日付変更線対応
  while (dLon > 180 * 60) dLon -= 360 * 60;
  while (dLon < -180 * 60) dLon += 360 * 60;

  const dmp = meridionalParts(lat2) - meridionalParts(lat1);

  let course: number;
  let distance: number;

  if (Math.abs(dmp) < 0.001) {
    // 同緯度 (平行圏航法)
    course = dLon > 0 ? 90 : 270;
    distance = Math.abs(dLon) * Math.cos(rad(lat1));
  } else {
    course = deg(Math.atan2(dLon, dmp));
    if (course < 0) course += 360;

    if (Math.abs(Math.cos(rad(course))) < 0.0001) {
      distance = Math.abs(dLon) * Math.cos(rad(lat1));
    } else {
      distance = Math.abs(dLat / Math.cos(rad(course)));
    }
  }

  return { course, distance, dLat, dLon, dmp };
}

/**
 * メルカトル航法: 出発点、針路、航程から到着点を計算
 */
export function mercatorDeadReckoning(
  lat1: number,
  lon1: number,
  course: number,
  distance: number,
) {
  const dLat = (distance * Math.cos(rad(course))) / 60; // 度
  const lat2 = lat1 + dLat;

  const mp1 = meridionalParts(lat1);
  const mp2 = meridionalParts(lat2);
  const dmp = mp2 - mp1;

  let dLon: number;
  if (Math.abs(dmp) < 0.001) {
    // 同緯度
    dLon = (distance * Math.sin(rad(course))) / Math.cos(rad(lat1)) / 60;
  } else {
    dLon = (dmp * Math.tan(rad(course))) / 60;
  }

  let lon2 = lon1 + dLon;
  while (lon2 > 180) lon2 -= 360;
  while (lon2 <= -180) lon2 += 360;

  const dep = distance * Math.sin(rad(course));

  return { lat2, lon2, dLat, dLon, dep };
}

/**
 * 中分緯度航法: 出発点、針路、航程から到着点を計算
 */
export function middleLatDeadReckoning(
  lat1: number,
  lon1: number,
  course: number,
  distance: number,
) {
  const dLatMin = distance * Math.cos(rad(course)); // 分
  const dLat = dLatMin / 60; // 度
  const lat2 = lat1 + dLat;

  const midLat = (lat1 + lat2) / 2;
  const dep = distance * Math.sin(rad(course)); // 分
  const dLonMin = dep / Math.cos(rad(midLat)); // 分
  const dLon = dLonMin / 60; // 度

  let lon2 = lon1 + dLon;
  while (lon2 > 180) lon2 -= 360;
  while (lon2 <= -180) lon2 += 360;

  return { lat2, lon2, dLat, dLon, dep, midLat, dLatMin, dLonMin };
}

/**
 * 中分緯度航法: 2地点間の針路と航程
 */
export function middleLatCourseDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const dLatMin = (lat2 - lat1) * 60; // 分
  let dLonMin = (lon2 - lon1) * 60; // 分
  // 日付変更線対応
  while (dLonMin > 180 * 60) dLonMin -= 360 * 60;
  while (dLonMin < -180 * 60) dLonMin += 360 * 60;

  const midLat = (lat1 + lat2) / 2;
  const dep = dLonMin * Math.cos(rad(midLat)); // 分

  let course: number;
  let distance: number;

  if (Math.abs(dLatMin) < 0.001) {
    // 同緯度 (平行圏航法)
    course = dep > 0 ? 90 : 270;
    distance = Math.abs(dep);
  } else {
    course = deg(Math.atan2(dep, dLatMin));
    if (course < 0) course += 360;
    distance = Math.abs(dLatMin / Math.cos(rad(course)));
  }

  return { course, distance, dLat: dLatMin, dLon: dLonMin, dep, midLat };
}
