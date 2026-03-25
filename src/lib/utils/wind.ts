import { rad, deg } from './navigationMath';

/**
 * 真風向・風速 (True Wind)
 * 相対風向(船首基準)、相対風速、船の針路、船速 → 真風向、真風速
 */
export function trueWind(
  relativeDir: number,
  relativeSpeed: number,
  shipCourse: number,
  shipSpeed: number,
) {
  // 相対風のベクトル（船体座標→地球座標）
  const apparentDir = shipCourse + relativeDir;
  const appR = rad(apparentDir);
  const scR = rad(shipCourse);

  // Apparent wind vector (where wind comes FROM)
  const awx = relativeSpeed * Math.sin(appR);
  const awy = relativeSpeed * Math.cos(appR);

  // Ship motion vector
  const sx = shipSpeed * Math.sin(scR);
  const sy = shipSpeed * Math.cos(scR);

  // True wind = apparent wind - ship motion (wind FROM direction)
  const twx = awx - sx;
  const twy = awy - sy;

  const trueSpeed = Math.sqrt(twx * twx + twy * twy);
  let trueDir = deg(Math.atan2(twx, twy));
  if (trueDir < 0) trueDir += 360;

  return { trueDir, trueSpeed };
}
