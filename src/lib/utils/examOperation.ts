export function calculateTPC(
  lengthM: number,
  breadthM: number,
  waterDensity: number,
) {
  return lengthM * breadthM * 0.01 * waterDensity;
}

export function calculateDraftAfterCargo(
  initialDraftM: number,
  cargoTon: number,
  tpcTonPerCm: number,
) {
  const draftIncreaseCm = tpcTonPerCm === 0 ? 0 : cargoTon / tpcTonPerCm;
  const finalDraftM = initialDraftM + draftIncreaseCm / 100;
  return { draftIncreaseCm, finalDraftM };
}

export function calculateCargoFromDraftChange(
  lengthM: number,
  breadthM: number,
  waterDensity: number,
  initialDraftM: number,
  finalDraftM: number,
) {
  const tpc = calculateTPC(lengthM, breadthM, waterDensity);
  const draftChangeCm = (finalDraftM - initialDraftM) * 100;
  const cargoTon = tpc * draftChangeCm;
  return { tpc, draftChangeCm, cargoTon };
}

export function calculateTrimFromShift(
  weightTon: number,
  shiftDistanceM: number,
  mtcTonMPerCm: number,
) {
  const trimCm =
    mtcTonMPerCm === 0 ? 0 : (weightTon * shiftDistanceM) / mtcTonMPerCm;
  return { trimCm };
}

export function calculateDraftChangesByLoadingAtPosition(
  shipLengthM: number,
  lcfFromMidshipM: number,
  tpcTonPerCm: number,
  mtcTonMPerCm: number,
  addedWeightTon: number,
  cargoPosFromLcfM: number,
) {
  const meanSinkCm = tpcTonPerCm === 0 ? 0 : addedWeightTon / tpcTonPerCm;
  const trimBySternCm =
    mtcTonMPerCm === 0
      ? 0
      : -(addedWeightTon * cargoPosFromLcfM) / mtcTonMPerCm;

  const distFwd = shipLengthM / 2 - lcfFromMidshipM;
  const distAft = shipLengthM / 2 + lcfFromMidshipM;

  const forwardChangeCm = meanSinkCm - trimBySternCm * (distFwd / shipLengthM);
  const aftChangeCm = meanSinkCm + trimBySternCm * (distAft / shipLengthM);

  return {
    meanSinkCm,
    trimBySternCm,
    forwardChangeCm,
    aftChangeCm,
    distFwd,
    distAft,
  };
}

export function calculateBeamFromPeriodAndGM(periodSec: number, gmM: number) {
  if (periodSec <= 0 || gmM <= 0) return { beamM: 0 };
  const beamM = (periodSec * Math.sqrt(gmM)) / 0.8;
  return { beamM };
}

export function calculateGMFromPeriodChange(
  gmAtPortA: number,
  periodA: number,
  periodB: number,
) {
  if (gmAtPortA <= 0 || periodA <= 0 || periodB <= 0) return { gmAtPortB: 0 };
  const gmAtPortB = gmAtPortA * (periodA / periodB) ** 2;
  return { gmAtPortB };
}

export function calculateBlindZoneDistance(
  eyeHeightFromKeelM: number,
  obstacleTopFromKeelM: number,
  draftM: number,
  eyeToObstacleM: number,
) {
  const eyeAboveSeaM = eyeHeightFromKeelM - draftM;
  const obstacleAboveSeaM = obstacleTopFromKeelM - draftM;
  const eyeToTopM = eyeAboveSeaM - obstacleAboveSeaM;

  if (eyeToTopM <= 0 || obstacleAboveSeaM <= 0) {
    return {
      eyeAboveSeaM,
      obstacleAboveSeaM,
      blindFromObstacleM: Infinity,
      blindFromEyeM: Infinity,
    };
  }
  const blindFromObstacleM = (eyeToObstacleM * obstacleAboveSeaM) / eyeToTopM;
  const blindFromEyeM = eyeToObstacleM + blindFromObstacleM;
  return {
    eyeAboveSeaM,
    obstacleAboveSeaM,
    blindFromObstacleM,
    blindFromEyeM,
  };
}

export function calculateDraftByDensityAndConsumption(
  displacementTon: number,
  tpcTonPerCm: number,
  initialForwardDraftM: number,
  initialAftDraftM: number,
  sourceDensity: number,
  destinationDensity: number,
  fuelConsumedTon: number,
  fuelPosFromMidshipM: number,
  freshWaterConsumedTon: number,
  freshPosFromMidshipM: number,
  mtcTonMPerCm: number,
  lcfFromMidshipM: number,
  shipLengthM: number,
) {
  const initialMeanDraftCm =
    ((initialForwardDraftM + initialAftDraftM) / 2) * 100;

  const totalConsumedTon = fuelConsumedTon + freshWaterConsumedTon;
  const dispAfterConsumeTon = displacementTon - totalConsumedTon;

  const meanDraftAfterConsumeCm =
    initialMeanDraftCm -
    (tpcTonPerCm === 0 ? 0 : totalConsumedTon / tpcTonPerCm);

  const densityChangeCm =
    destinationDensity === 0 || tpcTonPerCm === 0
      ? 0
      : (dispAfterConsumeTon / tpcTonPerCm) *
        ((sourceDensity - destinationDensity) / destinationDensity);

  const predictedMeanDraftCm = meanDraftAfterConsumeCm + densityChangeCm;

  const trimMomentByStern =
    fuelConsumedTon * fuelPosFromMidshipM +
    freshWaterConsumedTon * freshPosFromMidshipM;
  const trimBySternCm =
    mtcTonMPerCm === 0 ? 0 : trimMomentByStern / mtcTonMPerCm;

  const distFwd = shipLengthM / 2 - lcfFromMidshipM;
  const distAft = shipLengthM / 2 + lcfFromMidshipM;

  const forwardDraftCm =
    predictedMeanDraftCm - trimBySternCm * (distFwd / shipLengthM);
  const aftDraftCm =
    predictedMeanDraftCm + trimBySternCm * (distAft / shipLengthM);

  return {
    initialMeanDraftCm,
    totalConsumedTon,
    dispAfterConsumeTon,
    meanDraftAfterConsumeCm,
    densityChangeCm,
    predictedMeanDraftCm,
    trimMomentByStern,
    trimBySternCm,
    forwardDraftCm,
    aftDraftCm,
  };
}

export function calculateBallastTransferForEvenKeel(
  forwardDraftM: number,
  aftDraftM: number,
  transferDistanceM: number,
  mtcTonMPerCm: number,
) {
  const trimBySternCm = (aftDraftM - forwardDraftM) * 100;
  const requiredMoment = Math.abs(trimBySternCm) * mtcTonMPerCm;
  const transferTon =
    transferDistanceM === 0 ? 0 : requiredMoment / transferDistanceM;

  let direction = "none";
  if (trimBySternCm > 0) direction = "aft-to-forward";
  if (trimBySternCm < 0) direction = "forward-to-aft";

  return {
    trimBySternCm,
    requiredMoment,
    transferTon,
    direction,
  };
}

export function calculateCargoFromForeAftDraftChange(
  lengthM: number,
  breadthM: number,
  waterDensity: number,
  initialForwardDraftM: number,
  initialAftDraftM: number,
  finalForwardDraftM: number,
  finalAftDraftM: number,
) {
  const initialMeanDraftM = (initialForwardDraftM + initialAftDraftM) / 2;
  const finalMeanDraftM = (finalForwardDraftM + finalAftDraftM) / 2;
  const draftChangeCm = (finalMeanDraftM - initialMeanDraftM) * 100;
  const tpcTonPerCm = calculateTPC(lengthM, breadthM, waterDensity);
  const cargoTon = tpcTonPerCm * draftChangeCm;

  return {
    initialMeanDraftM,
    finalMeanDraftM,
    draftChangeCm,
    tpcTonPerCm,
    cargoTon,
  };
}

export function calculateMeanDraftByDensity(
  displacementTon: number,
  tpcTonPerCm: number,
  sourceDensity: number,
  destinationDensity: number,
  initialForwardDraftM: number,
  initialAftDraftM: number,
) {
  const initialMeanDraftCm =
    ((initialForwardDraftM + initialAftDraftM) / 2) * 100;
  const draftChangeCm =
    destinationDensity === 0 || tpcTonPerCm === 0
      ? 0
      : (displacementTon / tpcTonPerCm) *
        ((sourceDensity - destinationDensity) / destinationDensity);

  const predictedMeanDraftCm = initialMeanDraftCm + draftChangeCm;

  return {
    initialMeanDraftCm,
    draftChangeCm,
    predictedMeanDraftCm,
  };
}
