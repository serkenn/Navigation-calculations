import { rad, deg } from "./navigationMath";

/**
 * 実航針路・実航速力 (CMG/SMG)
 * 船速+針路 と 潮流方向+速度 からベクトル加算
 */
export function cmgSmg(
  shipCourse: number,
  shipSpeed: number,
  setDir: number,
  driftSpeed: number,
) {
  const sc = rad(shipCourse),
    sd = rad(setDir);
  const vx = shipSpeed * Math.sin(sc) + driftSpeed * Math.sin(sd);
  const vy = shipSpeed * Math.cos(sc) + driftSpeed * Math.cos(sd);

  const smg = Math.sqrt(vx * vx + vy * vy);
  let cmg = deg(Math.atan2(vx, vy));
  if (cmg < 0) cmg += 360;

  return { cmg, smg };
}

/**
 * 視針路・対水速力 (Course to Steer / Speed through Water)
 * 目標CMG と 潮流 → 必要な船の針路と速力
 */
export function courseToSteer(
  requiredCMG: number,
  requiredSMG: number,
  setDir: number,
  driftSpeed: number,
) {
  // 目標 ground vector - current vector = ship vector
  const cmgR = rad(requiredCMG),
    sdR = rad(setDir);
  const gx = requiredSMG * Math.sin(cmgR);
  const gy = requiredSMG * Math.cos(cmgR);
  const cx = driftSpeed * Math.sin(sdR);
  const cy = driftSpeed * Math.cos(sdR);

  const sx = gx - cx;
  const sy = gy - cy;

  const shipSpeed = Math.sqrt(sx * sx + sy * sy);
  let shipCourse = deg(Math.atan2(sx, sy));
  if (shipCourse < 0) shipCourse += 360;

  return { shipCourse, shipSpeed };
}

/**
 * 視針路・実航速力 (Course to Steer & SMG)
 * 船速固定、目標CMG方向へ進むための視針路とSMG
 */
export function courseToSteerSMG(
  requiredCMG: number,
  shipSpeed: number,
  setDir: number,
  driftSpeed: number,
) {
  const cmgR = rad(requiredCMG),
    sdR = rad(setDir);
  // 潮流方向とCMGの角度差
  const alpha = sdR - cmgR;
  // 正弦定理で船の針路偏角を求める
  const sinBeta = (driftSpeed / shipSpeed) * Math.sin(alpha);
  if (Math.abs(sinBeta) > 1) {
    return { shipCourse: NaN, smg: NaN, possible: false };
  }
  const beta = Math.asin(sinBeta);
  let shipCourse = requiredCMG + deg(beta);
  if (shipCourse < 0) shipCourse += 360;
  if (shipCourse >= 360) shipCourse -= 360;

  // SMG = 正弦定理から
  const gamma = Math.PI - alpha - beta;
  const smg = (shipSpeed * Math.sin(gamma)) / Math.sin(alpha || 1e-10);

  return { shipCourse, smg: Math.abs(smg), possible: true };
}

/**
 * 流向・流速 (Set & Drift)
 * 船の針路・速力 と CMG/SMG → 潮流ベクトル
 */
export function setAndDrift(
  shipCourse: number,
  shipSpeed: number,
  cmg: number,
  smg: number,
) {
  const scR = rad(shipCourse),
    cmgR = rad(cmg);
  // current = ground - ship
  const cx = smg * Math.sin(cmgR) - shipSpeed * Math.sin(scR);
  const cy = smg * Math.cos(cmgR) - shipSpeed * Math.cos(scR);

  const drift = Math.sqrt(cx * cx + cy * cy);
  let setDir = deg(Math.atan2(cx, cy));
  if (setDir < 0) setDir += 360;

  return { setDir, drift };
}
