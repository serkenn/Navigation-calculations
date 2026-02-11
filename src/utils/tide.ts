/**
 * 潮高計算 (Tide Height at Standard Port)
 * cos補間法: h = LW + (R/2)(1 - cos(π·t/T))
 *
 * hwHeight: 高潮の潮高 (m)
 * lwHeight: 低潮の潮高 (m)
 * hwTime: 高潮時刻 (時間の10進数)
 * lwTime: 低潮時刻 (時間の10進数)
 * targetTime: 求めたい時刻 (時間の10進数)
 * rising: true=上げ潮, false=下げ潮
 */
export function tideHeight(
  hwHeight: number,
  lwHeight: number,
  hwTime: number,
  lwTime: number,
  targetTime: number,
) {
  const range = hwHeight - lwHeight;
  let duration: number;
  let elapsed: number;

  // 上げ潮: LW → HW
  if (lwTime < hwTime) {
    duration = hwTime - lwTime;
    elapsed = targetTime - lwTime;
  } else {
    duration = lwTime - hwTime;
    elapsed = targetTime - hwTime;
  }

  if (duration <= 0) return { height: 0, range, duration, elapsed, ratio: 0 };

  const ratio = elapsed / duration;
  const height = lwHeight + (range / 2) * (1 - Math.cos(Math.PI * ratio));

  return { height, range, duration, elapsed, ratio };
}

/**
 * 指定潮高に達する時刻を逆算
 */
export function tideTimeForHeight(
  hwHeight: number,
  lwHeight: number,
  hwTime: number,
  lwTime: number,
  targetHeight: number,
) {
  const range = hwHeight - lwHeight;
  if (range === 0) return { time: lwTime };

  // h = LW + (R/2)(1-cos(π·t/T))
  // cos(π·t/T) = 1 - 2(h-LW)/R
  const cosVal = 1 - 2 * (targetHeight - lwHeight) / range;
  const clamped = Math.max(-1, Math.min(1, cosVal));
  const ratio = Math.acos(clamped) / Math.PI;

  const duration = lwTime < hwTime ? hwTime - lwTime : lwTime - hwTime;
  const time = lwTime + ratio * duration;

  return { time, ratio };
}

/**
 * 潮流計算 (Tidal Stream)
 * 2つの潮流データ間の補間
 */
export function tidalStream(
  rate1: number, dir1: number,
  rate2: number, dir2: number,
  fraction: number,
) {
  // 線形補間
  const rate = rate1 + (rate2 - rate1) * fraction;

  // 方向は角度なので短い方向で補間
  let dDir = dir2 - dir1;
  while (dDir > 180) dDir -= 360;
  while (dDir < -180) dDir += 360;
  let dir = dir1 + dDir * fraction;
  if (dir < 0) dir += 360;
  if (dir >= 360) dir -= 360;

  return { rate, dir };
}
