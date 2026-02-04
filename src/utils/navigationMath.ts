// src/utils/navigationMath.ts

export const PI = Math.PI;
export const rad = (deg: number) => deg * (PI / 180);
export const deg = (rad: number) => rad * (180 / PI);

// 数値(10進数) -> 度分(文字列)
// 例: 35.5 -> 35°30.0'
export const formatDMS = (val: number, type: 'lat' | 'lon' | 'angle' = 'angle'): string => {
  const absVal = Math.abs(val);
  const d = Math.floor(absVal);
  const m = (absVal - d) * 60;
  // 少数第1位まで
  const mStr = m.toFixed(1).padStart(4, '0');
  
  let suffix = '';
  if (type === 'lat') suffix = val >= 0 ? 'N' : 'S';
  if (type === 'lon') suffix = val >= 0 ? 'E' : 'W';
  
  return `${d}° ${mStr}'${suffix ? ' ' + suffix : ''}`;
};

// 入力された度・分 -> 10進数
export const toDecimal = (d: number, m: number, sign: number = 1) => (d + m / 60) * sign;

// --- 航海計算ロジック ---

// 1. 高度改正 (Altitude Correction)
// hs: 器械高度, ie: 器差, dip: 眼高差, sunCorr: 太陽高度改正(Refraction, Parallax, SD)
export const calculateTrueAltitude = (hs: number, ie: number, dip: number, sunCorr: number) => {
  // sextant altitude (hs) +/- index error (ie) = observed altitude (hi)
  // hi - dip = apparent altitude (ha)
  // ha + total correction = true altitude (Ho)
  // ※ここでは試験用に入力値をそのまま足し引きする簡易フローとします
  const hi = hs + (ie / 60);
  const ha = hi - (dip / 60);
  const ho = ha + (sunCorr / 60);
  return { hi, ha, ho };
};

// 2. 航程計算 (Run - Middle Latitude Sailing)
export const calculateRun = (lat1: number, course: number, dist: number) => {
  const dLat = dist * Math.cos(rad(course)) / 60; // degrees
  const lat2 = lat1 + dLat;
  
  const meanLat = (lat1 + lat2) / 2;
  const dep = dist * Math.sin(rad(course));
  const dLong = (dep / Math.cos(rad(meanLat))) / 60; // degrees
  
  return { dLat, dep, dLong, lat2, meanLat };
};

// 3. 計算高度と方位角 (Calculated Altitude & Azimuth)
// lat: 推測緯度, dec: 赤緯, lha: 地方時角
export const calculateSightReduction = (lat: number, dec: number, lha: number) => {
  const latR = rad(lat);
  const decR = rad(dec);
  const lhaR = rad(lha);

  // sin h = sin L sin d + cos L cos d cos t
  const sinHc = Math.sin(latR) * Math.sin(decR) + Math.cos(latR) * Math.cos(decR) * Math.cos(lhaR);
  const hcR = Math.asin(sinHc);
  const hc = deg(hcR);

  // Azimuth (Z)
  // tan Z = sin t / (cos L tan d - sin L cos t) or using ABC tables
  // ここでは余弦定理の変形などで求めます
  // cos Z = (sin d - sin L sin h) / (cos L cos h)
  const cosZ = (Math.sin(decR) - Math.sin(latR) * sinHc) / (Math.cos(latR) * Math.cos(hcR));
  let Z = deg(Math.acos(cosZ));
  
  // 方位角の符号処理 (簡易版: LHAが0-180ならWest, 180-360ならEast)
  // 北半球の場合
  if (Math.sin(lhaR) > 0) {
    Z = 360 - Z; // West側 (午前など)
  }
  
  return { hc, Z };
};

// 4. 子午線高度からの緯度 (Latitude by Meridian Altitude)
// ho: 真高度, dec: 赤緯, latDR: 推測緯度(符号判定用)
export const calculateMeridianLat = (ho: number, dec: number, latDR: number) => {
  const z = 90 - ho; // 天頂距離 (Zenith Distance)
  // 同符号(Same Name)の場合: L = z + d (緯度と赤緯が同符号で、緯度の方が大きい場合)
  // 異符号(Contrary Name)の場合: L = z - d ... ケースバイケースだが、
  // 北半球・太陽南中を前提とする簡易ロジック:
  // L = Dec + z (太陽が赤道より南なら Dec - z ? いや、通常は Lat = Dec + (90 - Alt))
  
  // 簡易的に「緯度 = 赤緯 + 天頂距離」 (Lat > Dec の場合)
  const latObs = dec + z; 
  return latObs;
};

// 5. メリパス経度改正 (Meripass Logic)
export const calculateMeripass = (
  intercept: number, // I
  azimuth: number,   // Z
  deltaL_miles: number, // Δl (miles) = ObsLat - DRLat
  lat0: number       // Noon DR Lat
) => {
  const Zr = rad(azimuth);
  // ΔL = [ I / sin Z - Δl / tan Z ] / cos l0
  const term1 = intercept / Math.sin(Zr);
  const term2 = deltaL_miles / Math.tan(Zr);
  const depCorr = term1 - term2; // Departure base correction
  
  const dLongCorr = depCorr / Math.cos(rad(lat0)); // D.Long (minutes)
  
  return {
    depCorr,
    dLongCorr
  };
};