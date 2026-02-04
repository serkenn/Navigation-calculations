// src/utils/navigationMath.ts

// ラジアン・度数変換
export const rad = (deg: number) => deg * (Math.PI / 180);
export const deg = (rad: number) => rad * (180 / Math.PI);

// 度・分・秒 → 10進数度 (例: 35°30' -> 35.5)
export const toDecimal = (d: number, m: number, s: number = 0) => d + m / 60 + s / 3600;

// 10進数度 → 度・分・秒オブジェクト
export const toDMS = (degVal: number) => {
  const d = Math.floor(Math.abs(degVal));
  const minFloat = (Math.abs(degVal) - d) * 60;
  const m = Math.floor(minFloat);
  const s = Math.round((minFloat - m) * 60 * 10) / 10;
  return { d, m, s, sign: degVal >= 0 ? 1 : -1 };
};

// 表示用フォーマット関数
export const formatDMS = (val: number, type: 'lat' | 'lon' | 'angle') => {
  const { d, m, s, sign } = toDMS(val);
  let suffix = '';
  if (type === 'lat') suffix = sign >= 0 ? 'N' : 'S';
  if (type === 'lon') suffix = sign >= 0 ? 'E' : 'W';
  return `${d}° ${m.toString().padStart(2, '0')}.${Math.floor(s)}' ${suffix}`;
};

// 航程計算 (Run) のロジック
export const calculateRun = (course: number, distance: number) => {
  const dLat = distance * Math.cos(rad(course)) / 60; 
  const dep = distance * Math.sin(rad(course));
  return { dLat, dep };
};

// メリパス経度改正 (Meripass) のロジック
export const calculateMeripass = (
  latDR: number,     // 推測緯度
  latObs: number,    // 実測緯度
  intercept: number, // Intercept
  azimuth: number,   // 方位角
  lonDR: number      // 推測経度
) => {
  const Z_rad = rad(azimuth);
  const delta_l = (latObs - latDR) * 60; // 分単位
  
  // ΔL = [ I / sin(Z) - Δl / tan(Z) ] / cos(l0)
  const term1 = intercept / Math.sin(Z_rad);
  const term2 = delta_l / Math.tan(Z_rad);
  const latDR_rad = rad(latDR);
  
  const delta_L_minutes = (term1 - term2) / Math.cos(latDR_rad);
  const lonObs = lonDR + (delta_L_minutes / 60);

  return {
    delta_l,
    delta_L_minutes,
    lonObs
  };
};