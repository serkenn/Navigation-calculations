// src/utils/navigationMath.ts

export const PI = Math.PI;
export const rad = (deg: number) => deg * (PI / 180);
export const deg = (rad: number) => rad * (180 / PI);

// 数値(10進数) -> 度分(文字列)
export const formatDMS = (
  val: number,
  type: "lat" | "lon" | "angle" = "angle",
): string => {
  const absVal = Math.abs(val);
  const d = Math.floor(absVal);
  const m = (absVal - d) * 60;
  // 少数第1位まで
  const mStr = m.toFixed(1).padStart(4, "0");

  let suffix = "";
  if (type === "lat") suffix = val >= 0 ? "N" : "S";
  if (type === "lon") suffix = val >= 0 ? "E" : "W";

  return `${d}° ${mStr}'${suffix ? " " + suffix : ""}`;
};

// 入力された度・分 -> 10進数
export const toDecimal = (d: number, m: number, sign: number = 1) =>
  (d + m / 60) * sign;

// 10進数 -> 度・分オブジェクト
export const toDMS = (degVal: number) => {
  const d = Math.floor(Math.abs(degVal));
  const minFloat = (Math.abs(degVal) - d) * 60;
  const m = Math.floor(minFloat);
  const s = Math.round((minFloat - m) * 60 * 10) / 10;
  return { d, m, s, sign: degVal >= 0 ? 1 : -1 };
};

// --- 航海計算ロジック ---

// 1. 真高度の計算 (True Altitude)
export const calculateTrueAltitude = (hs: number, corr: number) => {
  const ho = hs + corr / 60;
  return { ho };
};

// 2. 航程計算 (Run - Middle Latitude Sailing)
export const calculateRun = (lat1: number, course: number, dist: number) => {
  const dLat = (dist * Math.cos(rad(course))) / 60; // degrees
  const lat2 = lat1 + dLat;

  const meanLat = (lat1 + lat2) / 2;
  const dep = dist * Math.sin(rad(course));
  const div = Math.cos(rad(meanLat));
  const dLong = Math.abs(div) < 1e-6 ? 0 : dep / div / 60;

  return { dLat, dep, dLong, lat2, meanLat };
};

// 3. 計算高度と方位角 (Sight Reduction)
export const calculateSightReduction = (
  lat: number,
  dec: number,
  lha: number,
) => {
  const latR = rad(lat);
  const decR = rad(dec);
  const lhaR = rad(lha);

  // sin h = sin L sin d + cos L cos d cos t
  const sinHc =
    Math.sin(latR) * Math.sin(decR) +
    Math.cos(latR) * Math.cos(decR) * Math.cos(lhaR);
  const hcR = Math.asin(sinHc);
  const hc = deg(hcR);

  // Azimuth (Z)
  const cosZ =
    (Math.sin(decR) - Math.sin(latR) * sinHc) /
    (Math.cos(latR) * Math.cos(hcR));
  const cosZClamped = Math.max(-1, Math.min(1, cosZ));
  let Z = deg(Math.acos(cosZClamped));

  if (Math.sin(lhaR) > 0) {
    Z = 360 - Z;
  }

  return { hc, Z };
};

// 4. メリパス経度改正 (Meripass Logic)
export const calculateMeripass = (
  intercept: number,
  azimuth: number,
  deltaL_miles: number,
  lat0: number,
) => {
  const Zr = rad(azimuth);
  const tanZ = Math.tan(Zr);
  const sinZ = Math.sin(Zr);

  if (Math.abs(sinZ) < 1e-6 || Math.abs(tanZ) < 1e-6) {
    return { depCorr: 0, dLongCorr: 0 };
  }

  const term1 = intercept / sinZ;
  const term2 = deltaL_miles / tanZ;
  const depCorr = term1 - term2;
  const dLongCorr = depCorr / Math.cos(rad(lat0));

  return { depCorr, dLongCorr };
};

// 5. 出没方位角計算 (Amplitude Calculation)
export const calculateAmplitude = (lat: number, dec: number) => {
  const latR = rad(lat);
  const decR = rad(dec);

  // 公式: cos Z = sin d / cos l
  // ここでの Z は北(または南)からの角度だが、数式上は北基準(0-180)で算出される値
  const cosZ = Math.sin(decR) / Math.cos(latR);

  // 安全のための範囲制限
  const cosZClamped = Math.max(-1, Math.min(1, cosZ));
  const Z = deg(Math.acos(cosZClamped));

  return Z; // 0° 〜 180°
};

// 6. ジャイロ誤差計算
export const calculateGyroError = (
  trueAzimuth: number,
  gyroAzimuth: number,
) => {
  let diff = trueAzimuth - gyroAzimuth;
  // -180 〜 180 に正規化
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return diff;
};

// 7. 360度式を90度式（象限表記）に変換
export const toQuadrantBearing = (course: number): string => {
  // 0-360度の範囲に正規化
  let normalizedCourse = course % 360;
  if (normalizedCourse < 0) normalizedCourse += 360;

  if (normalizedCourse === 0 || normalizedCourse === 360) {
    return "N 0° E";
  } else if (normalizedCourse === 90) {
    return "N 90° E";
  } else if (normalizedCourse === 180) {
    return "S 0° E";
  } else if (normalizedCourse === 270) {
    return "N 90° W";
  } else if (normalizedCourse > 0 && normalizedCourse < 90) {
    return `N ${normalizedCourse.toFixed(1)}° E`;
  } else if (normalizedCourse > 90 && normalizedCourse < 180) {
    const angle = 180 - normalizedCourse;
    return `S ${angle.toFixed(1)}° E`;
  } else if (normalizedCourse > 180 && normalizedCourse < 270) {
    const angle = normalizedCourse - 180;
    return `S ${angle.toFixed(1)}° W`;
  } else if (normalizedCourse > 270 && normalizedCourse < 360) {
    const angle = 360 - normalizedCourse;
    return `N ${angle.toFixed(1)}° W`;
  }

  return "N 0° E"; // fallback
};
