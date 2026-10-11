import type { DMSValue } from "$lib/types/navigation";

export const rad = (deg: number) => (deg * Math.PI) / 180;
export const deg = (rad: number) => (rad * 180) / Math.PI;

/** 角度を 0 ≦ x < 360 に正規化 */
export function normalize360(angle: number): number {
  const a = angle % 360;
  return a < 0 ? a + 360 : a;
}

/** 角度を -180 < x ≦ 180 に正規化（経度・経度差など） */
export function normalize180(angle: number): number {
  const a = normalize360(angle);
  return a > 180 ? a - 360 : a;
}

/** 度・分 → 10進度 */
export const toDecimal = (d: number, m: number, sign: number = 1) =>
  (Math.abs(d) + Math.abs(m) / 60) * sign;

/** 入力フォームの度分値 → 10進度（N/E が正） */
export const dmsToDecimal = (v: DMSValue) => toDecimal(v.d, v.m, v.dir);

/**
 * 10進度 → 度分表記 (例: 35° 05.3' N)
 * 分を先に丸めてから繰り上げるので「59.95'」が「60.0'」にならない
 */
export function formatDMS(
  val: number,
  type: "lat" | "lon" | "angle" = "angle",
  decimals = 1,
): string {
  const scale = 10 ** decimals;
  const totalMin = Math.round(Math.abs(val) * 60 * scale) / scale;
  const d = Math.floor(totalMin / 60 + 1e-9);
  const m = totalMin - d * 60;
  const mStr = m
    .toFixed(decimals)
    .padStart(decimals > 0 ? 3 + decimals : 2, "0");

  let suffix = "";
  if (type === "lat") suffix = val >= 0 ? " N" : " S";
  if (type === "lon") suffix = val >= 0 ? " E" : " W";
  const dStr = type === "lon" ? String(d).padStart(3, "0") : String(d);

  return `${dStr}° ${mStr}'${suffix}`;
}

export const formatLat = (val: number) => formatDMS(val, "lat");
export const formatLon = (val: number) => formatDMS(val, "lon");

/**
 * 符号付きの分値を方向記号付きで表記 (例: -90.0 → "90.0' S")
 * 変緯・変経・東西距などに使う
 */
export function formatDirected(
  minutes: number,
  positive: string,
  negative: string,
  unit = "'",
): string {
  const dir = minutes >= 0 ? positive : negative;
  return `${Math.abs(minutes).toFixed(1)}${unit} ${dir}`;
}

/** 符号付きの角度（度）を度分 + 方向記号で表記 (例: 97.83 → "97° 50.0' E") */
export function formatDirectedDMS(
  degrees: number,
  positive: string,
  negative: string,
): string {
  return `${formatDMS(Math.abs(degrees))} ${degrees >= 0 ? positive : negative}`;
}

/** 針路・方位を 3 桁表記 (例: 45.04 → "045.0°") */
export function formatBearing(value: number): string {
  const v = Math.round(normalize360(value) * 10) / 10;
  return `${(v === 360 ? 0 : v).toFixed(1).padStart(5, "0")}°`;
}

/** 360 度式 → 90 度式（象限表記）例: 245.6 → "S 65.6° W" */
export function toQuadrantBearing(course: number): string {
  const c = Math.round(normalize360(course) * 10) / 10;
  if (c === 0 || c === 360) return "N";
  if (c === 90) return "E";
  if (c === 180) return "S";
  if (c === 270) return "W";
  if (c < 90) return `N ${c.toFixed(1)}° E`;
  if (c < 180) return `S ${(180 - c).toFixed(1)}° E`;
  if (c < 270) return `S ${(c - 180).toFixed(1)}° W`;
  return `N ${(360 - c).toFixed(1)}° W`;
}

/** 10進数時間を時・分・秒に分解（秒を先に丸めて 60 秒表示を防ぐ） */
export function splitHours(hours: number, secondDecimals = 0) {
  const sign = hours < 0 ? -1 : 1;
  const scale = 10 ** secondDecimals;
  const totalSec = Math.round(Math.abs(hours) * 3600 * scale) / scale;
  const h = Math.floor(totalSec / 3600 + 1e-9);
  const m = Math.floor((totalSec - h * 3600) / 60 + 1e-9);
  const s = Math.round((totalSec - h * 3600 - m * 60) * scale) / scale;
  return { sign, h, m, s };
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/** 10進数時間 → "hh:mm"（24 時間で折り返し） */
export function formatClock(hours: number): string {
  const totalMin = Math.round(hours * 60);
  const wrapped = ((totalMin % 1440) + 1440) % 1440;
  return `${pad2(Math.floor(wrapped / 60))}:${pad2(wrapped % 60)}`;
}

/** 10進数時間 → "hh:mm:ss"（24 時間で折り返し） */
export function formatClockSeconds(hours: number): string {
  const totalSec = Math.round(hours * 3600);
  const wrapped = ((totalSec % 86400) + 86400) % 86400;
  const h = Math.floor(wrapped / 3600);
  const m = Math.floor((wrapped % 3600) / 60);
  return `${pad2(h)}:${pad2(m)}:${pad2(wrapped % 60)}`;
}

/** 10進数時間 → "3h 05m 20s"（経過時間用、折り返しなし） */
export function formatDuration(hours: number, withSeconds = true): string {
  if (!withSeconds) {
    const totalMin = Math.round(Math.abs(hours) * 60);
    const sign = hours < 0 ? "-" : "";
    return `${sign}${Math.floor(totalMin / 60)}h ${pad2(totalMin % 60)}m`;
  }
  const { sign, h, m, s } = splitHours(hours);
  return `${sign < 0 ? "-" : ""}${h}h ${pad2(m)}m ${pad2(s)}s`;
}
