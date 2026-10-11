import { rad } from "./navigationMath";

/**
 * 測高度改正 (Altitude Correction)
 * hs: 六分儀測高度 (度)
 * heightOfEye: 眼高 (m)
 * bodyType: 'sun_lower' | 'sun_upper' | 'star' | 'moon' | 'planet'
 * temp: 気温 (℃), default 10
 * pressure: 気圧 (hPa), default 1010
 * HP: 水平視差 (分) - 月の場合のみ
 * SD: 半径 (分) - 太陽/月の場合
 */
export function altitudeCorrection(
  hs: number,
  heightOfEye: number,
  bodyType:
    "sun_lower" | "sun_upper" | "star" | "moon" | "planet" = "sun_lower",
  temp: number = 10,
  pressure: number = 1010,
  HP: number = 0,
  SD: number = 16.0,
) {
  // 1. Dip (眼高差) in minutes
  const dip = 1.76 * Math.sqrt(heightOfEye);

  // 2. Apparent altitude
  const ha = hs - dip / 60;

  // 3. Refraction (大気差) in minutes - standard formula
  const haR = rad(ha);
  let refraction = 0;
  if (ha > 0) {
    refraction = 1 / Math.tan(haR + rad(7.31 / (ha + 4.4)));
    // Temperature-pressure correction
    const factor = (pressure / 1010) * (283 / (273 + temp));
    refraction *= factor;
  }

  // 4. Parallax (視差) in minutes
  let parallax = 0;
  if (bodyType === "sun_lower" || bodyType === "sun_upper") {
    parallax = 0.15 * Math.cos(haR); // 太陽の視差(約0.15')
  } else if (bodyType === "moon") {
    parallax = HP * Math.cos(haR);
  }

  // 5. Semi-diameter
  let sdCorr = 0;
  if (bodyType === "sun_lower" || bodyType === "moon") {
    sdCorr = SD; // 下辺: +SD
  } else if (bodyType === "sun_upper") {
    sdCorr = -SD; // 上辺: -SD
  }

  // Final: Ho = hs - Dip - Refraction + Parallax ± SD
  const totalCorr = -dip - refraction + parallax + sdCorr;
  const ho = hs + totalCorr / 60;

  return {
    hs,
    ho,
    dip,
    refraction,
    parallax,
    sdCorr,
    totalCorr,
    ha,
    heightOfEye,
    bodyType,
  };
}

/**
 * 垂直角による物標距離 (Distance by Vertical Angle)
 * 物標の頂部と水際（基部）との垂直角 α を測ったとき、
 * 頂部の仰角と水際の俯角の和が α になるので D ≈ H / tan α
 * angle: 垂直角 (度)、height: 物標の高さ (m)
 */
export function distanceByVerticalAngle(angle: number, height: number) {
  if (angle <= 0 || height <= 0) return { distanceM: NaN, distanceNM: NaN };
  const distanceM = height / Math.tan(rad(angle));
  return { distanceM, distanceNM: distanceM / 1852 };
}

/**
 * 地理学的光達距離 (Geographical Range)
 * D = 2.083 (√H + √h) 海里（H: 灯高 m、h: 眼高 m）
 */
export function geographicalRange(height: number, heightOfEye: number) {
  const lightPart = 2.083 * Math.sqrt(height);
  const eyePart = 2.083 * Math.sqrt(heightOfEye);
  return { lightPart, eyePart, range: lightPart + eyePart };
}
