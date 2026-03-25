/**
 * 時間 (h, m, s) → 弧度 (度, 分, 秒)
 * 1h = 15°, 1m = 15', 1s = 15"
 */
export function timeToArc(h: number, m: number, s: number) {
  const totalSeconds = h * 3600 + m * 60 + s;
  const arcSeconds = totalSeconds * 15; // 1s of time = 15" of arc
  const deg = Math.floor(arcSeconds / 3600);
  const arcMin = Math.floor((arcSeconds % 3600) / 60);
  const arcSec = Math.round((arcSeconds % 60) * 10) / 10;
  return { deg, min: arcMin, sec: arcSec, totalDegrees: arcSeconds / 3600 };
}

/**
 * 弧度 (度, 分, 秒) → 時間 (h, m, s)
 * 15° = 1h, 15' = 1m, 15" = 1s
 */
export function arcToTime(deg: number, min: number, sec: number) {
  const totalArcSeconds = deg * 3600 + min * 60 + sec;
  const timeSeconds = totalArcSeconds / 15; // 15" of arc = 1s of time
  const h = Math.floor(timeSeconds / 3600);
  const m = Math.floor((timeSeconds % 3600) / 60);
  const s = Math.round((timeSeconds % 60) * 10) / 10;
  return { h, m, s, totalHours: timeSeconds / 3600 };
}

/**
 * 10進数時間 → 時分秒
 */
export function decimalToHMS(decimal: number) {
  const sign = decimal < 0 ? -1 : 1;
  const abs = Math.abs(decimal);
  const h = Math.floor(abs);
  const m = Math.floor((abs - h) * 60);
  const s = Math.round(((abs - h) * 60 - m) * 60 * 10) / 10;
  return { h, m, s, sign };
}

/**
 * 時分秒 → 10進数時間
 */
export function hmsToDecimal(h: number, m: number, s: number) {
  return h + m / 60 + s / 3600;
}

/**
 * 時分秒形式の四則計算
 */
export function hmsArithmetic(
  h1: number, m1: number, s1: number,
  op: '+' | '-' | '*' | '/',
  h2: number, m2: number, s2: number,
  multiplier?: number
) {
  const dec1 = hmsToDecimal(h1, m1, s1);
  const dec2 = hmsToDecimal(h2, m2, s2);

  let resultDec: number;
  switch (op) {
    case '+': resultDec = dec1 + dec2; break;
    case '-': resultDec = dec1 - dec2; break;
    case '*': resultDec = dec1 * (multiplier ?? dec2); break;
    case '/': resultDec = dec2 !== 0 ? dec1 / (multiplier ?? dec2) : 0; break;
  }

  return { ...decimalToHMS(resultDec), decimal: resultDec };
}
