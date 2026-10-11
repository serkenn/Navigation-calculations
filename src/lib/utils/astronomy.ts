import { rad, deg, normalize360 } from "./navigationMath";
import { solarPosition } from "./ephemeris";

const clamp1 = (x: number) => Math.max(-1, Math.min(1, x));

/**
 * 計算高度と方位角 (Sight Reduction)
 * sin h = sin L sin d + cos L cos d cos LHA
 * 方位角は北から時計回り (0〜360°)
 */
export function sightReduction(lat: number, dec: number, lha: number) {
  const L = rad(lat);
  const d = rad(dec);
  const t = rad(lha);

  const sinH = clamp1(
    Math.sin(L) * Math.sin(d) + Math.cos(L) * Math.cos(d) * Math.cos(t),
  );
  const h = Math.asin(sinH);
  const denom = Math.cos(L) * Math.cos(h);
  const cosZ =
    denom === 0 ? 1 : clamp1((Math.sin(d) - Math.sin(L) * sinH) / denom);
  let z = deg(Math.acos(cosZ));
  // LHA が 0〜180° なら天体は西側
  if (Math.sin(t) > 0) z = 360 - z;

  return { hc: deg(h), z };
}

/** GHA と経度（東経正）から LHA を求める */
export const localHourAngle = (gha: number, lon: number) =>
  normalize360(gha + lon);

/**
 * 修正差 (Intercept) を分で返す。正: Toward / 負: Away
 */
export const intercept = (ho: number, hc: number) => (ho - hc) * 60;

/**
 * 薄明・日出没時刻 (地方平時 LMT)
 * cos t = (sin h − sin L sin d) / (cos L cos d)
 * eqTime: 均時差（分、視太陽時 − 平均太陽時）
 */
export function phenomenonTime(
  lat: number,
  dec: number,
  eqTime: number,
  alt: number,
) {
  const L = rad(lat);
  const d = rad(dec);
  const cosT =
    (Math.sin(rad(alt)) - Math.sin(L) * Math.sin(d)) /
    (Math.cos(L) * Math.cos(d));

  if (Math.abs(cosT) > 1) {
    return { rise: NaN, set: NaN, possible: false, hourAngle: NaN };
  }
  const t = deg(Math.acos(cosT));
  const transit = 12 - eqTime / 60;
  return {
    rise: transit - t / 15,
    set: transit + t / 15,
    possible: true,
    hourAngle: t,
  };
}

/**
 * 出没方位角 (Amplitude)
 * cos Z = sin d / cos L （Z は北から測った真方位）
 */
export function amplitude(lat: number, dec: number, rising: boolean) {
  const cosZ = clamp1(Math.sin(rad(dec)) / Math.cos(rad(lat)));
  const z = deg(Math.acos(cosZ));
  const trueBearing = rising ? z : 360 - z;
  // 東西から測った出没方位角
  const amp = Math.abs(90 - z);
  const label = `${rising ? "E" : "W"} ${amp.toFixed(1)}° ${z <= 90 ? "N" : "S"}`;
  return { trueBearing, amplitude: amp, label };
}

/**
 * コンパス誤差 = 真方位 − コンパス方位（-180〜180）
 * 正: 偏東 (E'ly) / 負: 偏西 (W'ly)
 */
export function compassError(trueBearing: number, compassBearing: number) {
  let e = normalize360(trueBearing - compassBearing);
  if (e > 180) e -= 360;
  return e;
}

/**
 * 子午線高度緯度法
 * 天体が南中（北面）していれば L = d ± (90° − Ho)
 * bodyBearing: 正中時の天体の方向 'S' or 'N'
 */
export function latitudeByMeridianAltitude(
  ho: number,
  dec: number,
  bodyBearing: "N" | "S",
) {
  const zenith = 90 - ho;
  // 天体が南にあれば観測者は天体より北 → L = d + z
  const lat = bodyBearing === "S" ? dec + zenith : dec - zenith;
  return { lat, zenith };
}

/**
 * 2 本の位置の線の交点（修正差法）
 * 推測位置を原点とし、各 LOP を (a, Z) で与えて平面近似で解く
 * a: 修正差（分、Toward 正）、z: 方位角（度）
 */
export function intersectLOPs(
  drLat: number,
  drLon: number,
  lop1: { a: number; z: number },
  lop2: { a: number; z: number },
) {
  const z1 = rad(lop1.z);
  const z2 = rad(lop2.z);
  // 各 LOP: dLat·cos Z + dep·sin Z = a
  const det = Math.cos(z1) * Math.sin(z2) - Math.sin(z1) * Math.cos(z2);
  if (Math.abs(det) < 1e-3) {
    return { lat: NaN, lon: NaN, dLat: NaN, dep: NaN, possible: false };
  }
  const dLat = (lop1.a * Math.sin(z2) - lop2.a * Math.sin(z1)) / det;
  const dep = (Math.cos(z1) * lop2.a - Math.cos(z2) * lop1.a) / det;
  const lat = drLat + dLat / 60;
  const midLat = (drLat + lat) / 2;
  const lon = drLon + dep / (60 * Math.cos(rad(midLat)));
  return { lat, lon, dLat, dep, possible: true };
}

/**
 * LOP を航走分だけ転位したときの経度改正（メリパス法）
 * 正午緯度の差 ΔL（マイル）と第 1 LOP（修正差 a、方位 Z）から
 * 東西距 = a / sin Z − ΔL / tan Z、経度改正 = 東西距 / cos L
 */
export function meripassLongitudeCorrection(
  a: number,
  z: number,
  deltaLatMiles: number,
  lat: number,
) {
  const sinZ = Math.sin(rad(z));
  const tanZ = Math.tan(rad(z));
  if (Math.abs(sinZ) < 1e-6 || Math.abs(tanZ) < 1e-6) {
    return { depCorr: 0, dLongCorr: 0 };
  }
  const depCorr = a / sinZ - deltaLatMiles / tanZ;
  return { depCorr, dLongCorr: depCorr / Math.cos(rad(lat)) };
}

/**
 * 天体の同定: 推測緯度と観測した高度・方位から赤緯と地方時角を求める
 * sin d = sin L sin h + cos L cos h cos Z
 */
export function identifyBody(lat: number, alt: number, az: number) {
  const L = rad(lat);
  const h = rad(alt);
  const Z = rad(az);
  const sinD = clamp1(
    Math.sin(L) * Math.sin(h) + Math.cos(L) * Math.cos(h) * Math.cos(Z),
  );
  const d = Math.asin(sinD);
  const denom = Math.cos(L) * Math.cos(d);
  const cosT =
    denom === 0 ? 1 : clamp1((Math.sin(h) - Math.sin(L) * sinD) / denom);
  const t = deg(Math.acos(cosT));
  // 方位が東側 (0〜180°) なら天体は子午線の東 → LHA = 360° − t
  const lha = Math.sin(Z) > 0 ? 360 - t : t;
  return { dec: deg(d), lha };
}

/** 日付文字列 (YYYY-MM-DD) を年月日に分解 */
export function parseDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return { year: y, month: m, day: d };
}

/**
 * 太陽の出没・薄明時刻（日付から赤緯・均時差を求め、現象時刻で 1 回反復）
 * 返す時刻は地方平時 LMT と標準時 ZT（zoneMeridian: 標準子午線、東経正）
 */
export function sunEvent(
  date: string,
  lat: number,
  lon: number,
  zoneMeridian: number,
  alt: number,
) {
  const { year, month, day } = parseDate(date);
  const at = (lmt: number) => {
    const sun = solarPosition(year, month, day, lmt - lon / 15);
    return { sun, ph: phenomenonTime(lat, sun.dec, sun.eqTime, alt) };
  };
  const noon = at(12);
  if (!noon.ph.possible) {
    return {
      possible: false as const,
      dec: noon.sun.dec,
      eqTime: noon.sun.eqTime,
    };
  }
  const rise = at(noon.ph.rise).ph.rise;
  const set = at(noon.ph.set).ph.set;
  const toZT = (lmt: number) => lmt - (lon - zoneMeridian) / 15;
  return {
    possible: true as const,
    dec: noon.sun.dec,
    eqTime: noon.sun.eqTime,
    riseLMT: rise,
    setLMT: set,
    riseZT: toZT(rise),
    setZT: toZT(set),
  };
}

/** 日出没と各薄明をまとめて計算 */
export function sunEvents(
  date: string,
  lat: number,
  lon: number,
  zoneMeridian: number,
) {
  return {
    sunrise: sunEvent(date, lat, lon, zoneMeridian, -50 / 60),
    civil: sunEvent(date, lat, lon, zoneMeridian, -6),
    nautical: sunEvent(date, lat, lon, zoneMeridian, -12),
    astronomical: sunEvent(date, lat, lon, zoneMeridian, -18),
  };
}

/**
 * 太陽の正中時（日付・経度から均時差を求めて反復）と、その時刻の赤緯
 */
export function sunMeridianPassage(
  date: string,
  lon: number,
  zoneMeridian: number,
) {
  const { year, month, day } = parseDate(date);
  let ut = 12 - lon / 15;
  let sun = solarPosition(year, month, day, ut);
  for (let i = 0; i < 2; i++) {
    ut = 12 - sun.eqTime / 60 - lon / 15;
    sun = solarPosition(year, month, day, ut);
  }
  const lmt = 12 - sun.eqTime / 60;
  return {
    lmt,
    ut,
    zt: ut + zoneMeridian / 15,
    longitudeTime: lon / 15,
    eqTime: sun.eqTime,
    dec: sun.dec,
  };
}
