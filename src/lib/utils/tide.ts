import { normalize360 } from "./navigationMath";

/** 基準時刻から 12 時間以内に収まるよう日付またぎを補正（単位: 時間） */
function nearTo(base: number, t: number) {
  let x = t;
  while (x - base > 12) x -= 24;
  while (x - base < -12) x += 24;
  return x;
}

/**
 * 潮高計算 (Tide at Standard Port) — cos 補間法
 * h = LW + (R/2)(1 − cos(π · t / T))
 * t: 低潮からの経過時間、T: 低潮〜高潮の間隔（上げ潮・下げ潮どちらも同じ式）
 * 時刻はすべて 10 進数時間
 */
export function tideHeight(
  hwHeight: number,
  lwHeight: number,
  hwTime: number,
  lwTime: number,
  targetTime: number,
) {
  const range = hwHeight - lwHeight;
  const hw = nearTo(lwTime, hwTime);
  const target = nearTo(lwTime, targetTime);
  const duration = Math.abs(hw - lwTime);
  const rising = hw > lwTime;
  const elapsed = Math.abs(target - lwTime);
  const ratio = duration === 0 ? 0 : (target - lwTime) / (hw - lwTime);
  const inRange = ratio >= 0 && ratio <= 1;
  const height = lwHeight + (range / 2) * (1 - Math.cos(Math.PI * ratio));

  return { height, range, duration, elapsed, ratio, rising, inRange };
}

/**
 * 潮流計算 (Tidal Stream) — 正弦法
 * v = Vmax · sin(90° × t / T)
 * t: 転流時からの経過時間、T: 転流時〜最強時の間隔
 */
export function tidalStream(
  slackTime: number,
  maxTime: number,
  maxRate: number,
  floodDir: number,
  targetTime: number,
) {
  const max = nearTo(slackTime, maxTime);
  const target = nearTo(slackTime, targetTime);
  const interval = max - slackTime;
  const elapsed = target - slackTime;
  const ratio = interval === 0 ? 0 : elapsed / interval;
  // 転流時から次の転流時（最強時の 2 倍）までが有効範囲
  const inRange = ratio >= 0 && ratio <= 2;
  const angle = 90 * ratio;
  const rate = Math.abs(maxRate) * Math.sin((angle * Math.PI) / 180);

  return {
    interval,
    elapsed,
    ratio,
    angle,
    rate,
    dir: normalize360(floodDir),
    inRange,
  };
}
