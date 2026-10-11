/**
 * 時間と弧度の換算・時分秒の計算
 * 1h = 15°, 1m = 15', 1s = 15"
 */

/** 時分秒 → 10進数時間 */
export const hmsToHours = (h: number, m: number, s: number) =>
  h + m / 60 + s / 3600;

/** 度分秒 → 10進度 */
export const dmsToDegrees = (d: number, m: number, s: number) =>
  d + m / 60 + s / 3600;

/**
 * 10進数の量（時間または度）を 60 進の 3 要素に分解
 * 最小単位で先に丸めるので「60.0 秒」にならない
 */
export function splitSexagesimal(value: number, decimals = 1) {
  const sign = value < 0 ? -1 : 1;
  const scale = 10 ** decimals;
  const totalSec = Math.round(Math.abs(value) * 3600 * scale) / scale;
  const a = Math.floor(totalSec / 3600 + 1e-9);
  const b = Math.floor((totalSec - a * 3600) / 60 + 1e-9);
  const c = Math.round((totalSec - a * 3600 - b * 60) * scale) / scale;
  return { sign, a, b, c };
}

/** 時間 → 弧度 */
export function timeToArc(hours: number) {
  const degrees = hours * 15;
  const { sign, a, b, c } = splitSexagesimal(degrees);
  return { degrees, sign, deg: a, min: b, sec: c };
}

/** 弧度 → 時間 */
export function arcToTime(degrees: number) {
  const hours = degrees / 15;
  const { sign, a, b, c } = splitSexagesimal(hours);
  return { hours, sign, h: a, m: b, s: c };
}

/** 10進数 → 時分秒 */
export function hoursToHMS(hours: number) {
  const { sign, a, b, c } = splitSexagesimal(hours);
  return { sign, h: a, m: b, s: c };
}

export type Operator = "+" | "-" | "×" | "÷";

/** 2 値の四則演算（÷0 は NaN） */
export function applyOperator(a: number, op: Operator, b: number) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
  }
}

/** 60 進数の表記 (例: "-3h 05m 20.0s" / "141° 07' 30.0\"") */
export function formatSexagesimal(
  value: number,
  units: [string, string, string],
  decimals = 1,
) {
  const { sign, a, b, c } = splitSexagesimal(value, decimals);
  const pad = (n: number) => String(n).padStart(2, "0");
  const cStr = c
    .toFixed(decimals)
    .padStart(decimals > 0 ? 3 + decimals : 2, "0");
  return `${sign < 0 ? "-" : ""}${a}${units[0]} ${pad(b)}${units[1]} ${cStr}${units[2]}`;
}

export const formatHMS = (hours: number, decimals = 1) =>
  formatSexagesimal(hours, ["h", "m", "s"], decimals);

export const formatDegMinSec = (degrees: number, decimals = 1) =>
  formatSexagesimal(degrees, ["°", "'", '"'], decimals);
