import { rad, deg } from './navigationMath';

/**
 * 薄明時計算 (Twilight)
 * cos(H) = (sin(alt) - sin(l)sin(d)) / (cos(l)cos(d))
 *
 * lat: 緯度 (度)
 * dec: 赤緯 (度)
 * lon: 経度 (度、東正)
 * eqTime: 均時差 (分)
 * alt: 天体の高度角 (度)
 *   市民薄明: -6°
 *   航海薄明: -12°
 *   天文薄明: -18°
 *   日出没: -0.833° (大気差補正込み)
 */
export function twilightTime(
  lat: number, dec: number, lon: number, eqTime: number,
  alt: number,
) {
  const latR = rad(lat), decR = rad(dec), altR = rad(alt);
  const cosH = (Math.sin(altR) - Math.sin(latR) * Math.sin(decR)) /
    (Math.cos(latR) * Math.cos(decR));

  if (Math.abs(cosH) > 1) {
    // 現象なし（白夜または極夜）
    return { rise: NaN, set: NaN, possible: false };
  }

  const H = deg(Math.acos(cosH)); // 時角（度）
  const hHours = H / 15; // 時角（時間）

  // LMT of transit = 12h - eqTime/60
  const transit = 12 - eqTime / 60;
  const rise = transit - hHours - lon / 15;
  const set = transit + hHours - lon / 15;

  return { rise, set, possible: true, hourAngle: H };
}

/**
 * 全薄明時刻をまとめて計算
 */
export function allTwilights(
  lat: number, dec: number, lon: number, eqTime: number,
) {
  const sunrise = twilightTime(lat, dec, lon, eqTime, -0.833);
  const civil = twilightTime(lat, dec, lon, eqTime, -6);
  const nautical = twilightTime(lat, dec, lon, eqTime, -12);
  const astronomical = twilightTime(lat, dec, lon, eqTime, -18);

  return { sunrise, civil, nautical, astronomical };
}

/**
 * 索星: 恒星の高度と方位を計算
 * Sight Reduction: sin(h) = sin(l)sin(d) + cos(l)cos(d)cos(LHA)
 */
export function starAltAz(
  lat: number, dec: number, lha: number,
) {
  const latR = rad(lat), decR = rad(dec), lhaR = rad(lha);

  const sinH = Math.sin(latR) * Math.sin(decR) + Math.cos(latR) * Math.cos(decR) * Math.cos(lhaR);
  const alt = deg(Math.asin(Math.max(-1, Math.min(1, sinH))));

  const cosAz = (Math.sin(decR) - Math.sin(latR) * sinH) / (Math.cos(latR) * Math.cos(Math.asin(sinH)));
  let az = deg(Math.acos(Math.max(-1, Math.min(1, cosAz))));
  if (Math.sin(lhaR) > 0) az = 360 - az;

  return { alt, az };
}
