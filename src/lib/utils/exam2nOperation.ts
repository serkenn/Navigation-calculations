/**
 * 海技試験 2N 運用（航海力学）カテゴリ専用の計算
 * 3N 運用と共通の式（w / TPC、w × d / MTC など）は examOperation.ts の関数を使う
 */

/** 毎 cm 排水トン数 TPC = Aw × ρ / 100（Aw: 水線面積 m²、ρ: 水の密度 t/m³） */
export function tpcFromWaterplane(waterplaneAreaM2: number, density: number) {
  return (waterplaneAreaM2 * density) / 100;
}

/** 毎 cm トリムモーメント MTC = W × GML / (100 L)（W: 排水量 t、GML: 縦メタセンタ高さ m、L: 垂線間長 m） */
export function mtcFromGML(
  displacementTon: number,
  gmlM: number,
  lengthM: number,
) {
  return lengthM === 0 ? 0 : (displacementTon * gmlM) / (100 * lengthM);
}

export interface CargoItem {
  /** 重量（積荷 +、揚荷 −） */
  weight: number;
  /** 基線上の重心高さ Kg (m) */
  kg: number;
}

/**
 * 積載後の重心高さ KG′ = (W·KG + Σ w·Kg) / (W + Σ w)
 * KM が与えられれば積載前後の GM も求める（KM は変わらないものとする）
 */
export function kgAfterLoading(
  displacementTon: number,
  kgM: number,
  items: CargoItem[],
  kmM?: number,
) {
  const moments = items.map((i) => i.weight * i.kg);
  const totalWeight = items.reduce((s, i) => s + i.weight, 0);
  const totalMoment = moments.reduce((s, m) => s + m, 0);
  const shipMoment = displacementTon * kgM;
  const finalDisplacement = displacementTon + totalWeight;
  const finalKg =
    finalDisplacement === 0
      ? NaN
      : (shipMoment + totalMoment) / finalDisplacement;
  const gmBefore = kmM === undefined ? NaN : kmM - kgM;
  const gmAfter = kmM === undefined ? NaN : kmM - finalKg;
  return {
    moments,
    totalWeight,
    totalMoment,
    shipMoment,
    finalDisplacement,
    finalKg,
    gmBefore,
    gmAfter,
    gmChange: gmAfter - gmBefore,
  };
}

/**
 * GM の減少量を ΔGM 以内に抑えて積載できる最大重量
 * KM 一定なので KG′ = KG + ΔGM、KG′ = (W·KG + w·Kg) / (W + w) を w について解く
 *   w = W (KG′ − KG) / (Kg − KG′)
 */
export function maxCargoForGMReduction(
  displacementTon: number,
  kmM: number,
  kgM: number,
  gmReductionM: number,
  cargoKgM: number,
) {
  const gmBefore = kmM - kgM;
  const finalKg = kgM + gmReductionM;
  const gmAfter = kmM - finalKg;
  const denominator = cargoKgM - finalKg;
  const possible = denominator > 0 && gmReductionM > 0;
  const weight = possible
    ? (displacementTon * (finalKg - kgM)) / denominator
    : NaN;
  return {
    gmBefore,
    finalKg,
    gmAfter,
    // 展開した 1 次方程式の各項（答案の途中式用）
    shipMoment: displacementTon * kgM,
    rhsConstant: finalKg * displacementTon,
    numerator: displacementTon * (finalKg - kgM),
    denominator,
    possible,
    weight,
  };
}

/** 船体中央からの距離（後方を正とする） */
export const signedPosition = (distanceM: number, aft: boolean) =>
  aft ? distanceM : -distanceM;

/**
 * 海峡通過時のタンク間移送量
 * 船尾トリムを正、船体中央からの距離は後方を正とし、浮面心は船体中央にあるものとする。
 *   必要トリムモーメント = (目標トリム − 出港時トリム) × MTC
 *   燃料消費のモーメント = −消費量 × 燃料タンク位置（後方のタンクから減ると船首トリム）
 *   張水のモーメント = 張水量 × 船尾水倉位置
 *   移送量 w = (必要 − 張水 − 燃料消費) / (移送先位置 − 移送元位置)
 */
export function tankTransferForTrim(params: {
  lengthM: number;
  displacementTon: number;
  gmlM: number;
  days: number;
  fuelPerDayTon: number;
  fuelTankPosM: number;
  ballastTon: number;
  ballastTankPosM: number;
  fromTankPosM: number;
  toTankPosM: number;
  initialTrimCm: number;
  targetTrimCm: number;
}) {
  const mtc = mtcFromGML(params.displacementTon, params.gmlM, params.lengthM);
  const fuelConsumedTon = params.days * params.fuelPerDayTon;
  const fuelMoment = -fuelConsumedTon * params.fuelTankPosM;
  const ballastMoment = params.ballastTon * params.ballastTankPosM;
  const trimChangeCm = params.targetTrimCm - params.initialTrimCm;
  const requiredMoment = trimChangeCm * mtc;
  const transferMoment = requiredMoment - ballastMoment - fuelMoment;
  const transferDistanceM = params.toTankPosM - params.fromTankPosM;
  const transferTon =
    transferDistanceM === 0 ? NaN : transferMoment / transferDistanceM;
  return {
    mtc,
    fuelConsumedTon,
    fuelMoment,
    ballastMoment,
    trimChangeCm,
    requiredMoment,
    transferMoment,
    transferDistanceM,
    transferTon,
  };
}
