/**
 * 簡易太陽暦 (Simplified Solar Ephemeris)
 * Meeus簡略法: 黄経→赤経赤緯→GHA
 */

const PI = Math.PI;
const radF = (d: number) => (d * PI) / 180;
const degF = (r: number) => (r * 180) / PI;

/**
 * 太陽のGHAとDecを計算 (簡易法)
 * year, month, day: 日付
 * utcHours: UTC時刻 (10進数)
 */
export function solarPosition(
  year: number,
  month: number,
  day: number,
  utcHours: number,
) {
  // Julian Day Number
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  const jd = jdn + (utcHours - 12) / 24;

  // Julian century from J2000.0
  const T = (jd - 2451545.0) / 36525;

  // Sun's mean longitude
  const L0 = (280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360;
  // Sun's mean anomaly
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) % 360;
  const Mr = radF(M);

  // Equation of center
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mr) +
    0.000289 * Math.sin(3 * Mr);

  // Sun's true longitude
  const sunLon = L0 + C;
  // Sun's true anomaly
  const sunLonR = radF(sunLon);

  // Obliquity of the ecliptic
  const epsilon = 23.439291 - 0.0130042 * T;
  const epsilonR = radF(epsilon);

  // Right ascension
  const ra = degF(
    Math.atan2(Math.cos(epsilonR) * Math.sin(sunLonR), Math.cos(sunLonR)),
  );

  // Declination
  const dec = degF(Math.asin(Math.sin(epsilonR) * Math.sin(sunLonR)));

  // GMST (Greenwich Mean Sidereal Time) in degrees
  const gmst =
    (280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T) %
    360;

  // GHA = GMST - RA
  let gha = gmst - ra;
  while (gha < 0) gha += 360;
  while (gha >= 360) gha -= 360;

  // Equation of Time (minutes)
  const eqTime = 4 * (L0 - ra); // approximate, in minutes

  return { gha, dec, ra, eqTime, gmst };
}
