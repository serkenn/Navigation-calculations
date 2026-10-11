/**
 * 全計算機のメタデータ（唯一の正）
 * カテゴリ構成と名称は TAMAYA 航法計算機 NC-2200 の機能一覧に準拠する
 * https://tamaya-technics.com/navigation/
 */
import {
  Activity,
  Anchor,
  ArrowLeftRight,
  ArrowRightLeft,
  ArrowUpDown,
  Briefcase,
  Calculator,
  Clock,
  Compass,
  Crosshair,
  Droplets,
  Eye,
  Gauge,
  Globe,
  GraduationCap,
  Layers,
  MapPin,
  MoveHorizontal,
  MoveRight,
  Navigation,
  Package,
  RotateCcw,
  Route,
  Ship,
  Star,
  Sun,
  Sunset,
  Telescope,
  Timer,
  View,
  Waves,
  Wind,
} from "lucide-svelte";
import type {
  CategoryDefinition,
  CategoryId,
  CalculatorDefinition,
} from "#lib/types/calculator.js";

export const categories: CategoryDefinition[] = [
  {
    id: "pilot1",
    nameJa: "航海計画 PILOT 1",
    nameEn: "Voyage Planning",
    summary: "針路・航程、到着点、大圏航法、到着時刻",
    icon: Navigation,
    accent: "blue",
  },
  {
    id: "pilot2",
    nameJa: "その他の航法 PILOT 2",
    nameEn: "Other Navigation",
    summary: "潮流航法、真風向・風速、潮高、潮流",
    icon: Ship,
    accent: "cyan",
  },
  {
    id: "astro",
    nameJa: "天文航法 ASTRO. NAV",
    nameEn: "Celestial Navigation",
    summary: "薄明時、索星、天測暦、位置の線、船位決定、正中時",
    icon: Star,
    accent: "amber",
  },
  {
    id: "sextant",
    nameJa: "六分儀 SEXTANT",
    nameEn: "Sextant",
    summary: "測高度改正、物標までの距離",
    icon: Telescope,
    accent: "purple",
  },
  {
    id: "timeArc",
    nameJa: "時間と弧度 TIME & ARC",
    nameEn: "Time & Arc",
    summary: "時間計算と弧度換算、角度計算と時間換算",
    icon: Clock,
    accent: "emerald",
  },
  {
    id: "timeCalc",
    nameJa: "四則計算と時変換 TIME Calculations",
    nameEn: "Time Calculations",
    summary: "時分秒変換・航走時間、10進数時変換・速力・航走距離、四則計算",
    icon: Calculator,
    accent: "rose",
  },
  {
    id: "exam",
    nameJa: "海技試験 EXAM",
    nameEn: "Maritime Exam",
    summary: "3級・2級海技士 航海・運用の計算問題（解答形式）",
    icon: GraduationCap,
    accent: "indigo",
  },
  {
    id: "exam-3n",
    parentId: "exam",
    nameJa: "3N",
    nameEn: "3N",
    icon: Layers,
    accent: "indigo",
  },
  {
    id: "exam-3n-navigation",
    parentId: "exam-3n",
    nameJa: "航海",
    nameEn: "Navigation",
    icon: Navigation,
    accent: "indigo",
  },
  {
    id: "exam-3n-operation",
    parentId: "exam-3n",
    nameJa: "運用",
    nameEn: "Operation",
    icon: Briefcase,
    accent: "indigo",
  },
  {
    id: "exam-2n",
    parentId: "exam",
    nameJa: "2N",
    nameEn: "2N",
    icon: Layers,
    accent: "indigo",
  },
  {
    id: "exam-2n-navigation",
    parentId: "exam-2n",
    nameJa: "航海",
    nameEn: "Navigation",
    icon: Navigation,
    accent: "indigo",
  },
];

export const calculators: CalculatorDefinition[] = [
  // ── 航海計画 PILOT 1 ──
  {
    id: "course-distance",
    category: "pilot1",
    nameJa: "針路・航程の計算",
    nameEn: "Course and Distance",
    description:
      "中分緯度航法・漸長緯度航法により 2 地点間の針路と航程を求めます。",
    icon: Route,
    component: "pilot1/CourseDistance",
  },
  {
    id: "dead-reckoning",
    category: "pilot1",
    nameJa: "到着点の計算",
    nameEn: "Dead Reckoning",
    description: "出発点・針路・航程から到着点の緯度経度を求めます。",
    icon: MapPin,
    component: "pilot1/DeadReckoning",
  },
  {
    id: "great-circle",
    category: "pilot1",
    nameJa: "大圏航法の計算",
    nameEn: "Great Circle",
    description: "大圏距離・初針路・終針路と頂点の位置を求めます。",
    icon: Globe,
    component: "pilot1/GreatCircle",
  },
  {
    id: "composite-sailing",
    category: "pilot1",
    nameJa: "集成大圏航法の計算",
    nameEn: "Composite Sailing",
    description: "制限緯度を超えない「大圏＋平行圏＋大圏」の航路を求めます。",
    icon: Globe,
    component: "pilot1/CompositeSailing",
  },
  {
    id: "eta",
    category: "pilot1",
    nameJa: "到着時刻の計算",
    nameEn: "Estimated Time of Arrival",
    description: "航程・速力・出発日時から航海時間と到着予定日時を求めます。",
    icon: Timer,
    component: "pilot1/ETA",
  },

  // ── その他の航法 PILOT 2 ──
  {
    id: "cmg-smg",
    category: "pilot2",
    nameJa: "実航針路・実航速力",
    nameEn: "Course and Speed Made Good",
    description:
      "船の針路・速力と潮流から実航針路 (CMG)・実航速力 (SMG) を求めます。",
    icon: MoveRight,
    component: "pilot2/CMGSMG",
  },
  {
    id: "course-to-steer",
    category: "pilot2",
    nameJa: "視針路・対水速力",
    nameEn: "Course and Speed to Make Good",
    description:
      "目標の実航針路・実航速力と潮流から、取るべき視針路と対水速力を求めます。",
    icon: Compass,
    component: "pilot2/CourseToSteer",
  },
  {
    id: "course-steer-smg",
    category: "pilot2",
    nameJa: "視針路・実航速力",
    nameEn: "Course to Steer and Speed Made Good",
    description:
      "対水速力を一定として、目標の実航針路を進む視針路と実航速力を求めます。",
    icon: Compass,
    component: "pilot2/CourseSteerSMG",
  },
  {
    id: "set-drift",
    category: "pilot2",
    nameJa: "潮の流向・流速",
    nameEn: "Set and Drift",
    description:
      "船の針路・速力と実航針路・実航速力から潮の流向・流速を求めます。",
    icon: Waves,
    component: "pilot2/SetDrift",
  },
  {
    id: "true-wind",
    category: "pilot2",
    nameJa: "真風向・風速の計算",
    nameEn: "Direction and Speed of True Wind",
    description: "視風向・視風速と船の針路・速力から真風向・真風速を求めます。",
    icon: Wind,
    component: "pilot2/TrueWind",
  },
  {
    id: "tide-height",
    category: "pilot2",
    nameJa: "潮高計算",
    nameEn: "Tide at Standard Port",
    description:
      "高潮・低潮の時刻と潮高から、任意の時刻の潮高を cos 補間で求めます。",
    icon: ArrowUpDown,
    component: "pilot2/TideHeight",
  },
  {
    id: "tidal-stream",
    category: "pilot2",
    nameJa: "潮流計算",
    nameEn: "Tidal Stream",
    description:
      "転流時・最強時・最強流速から、任意の時刻の流速を正弦法で求めます。",
    icon: RotateCcw,
    component: "pilot2/TidalStream",
  },

  // ── 天文航法 ASTRO. NAV ──
  {
    id: "twilight",
    category: "astro",
    nameJa: "薄明時の計算",
    nameEn: "Twilight",
    description:
      "日出没時と市民・航海・天文薄明の時刻を地方平時と標準時で求めます。",
    icon: Sunset,
    component: "astro/Twilight",
  },
  {
    id: "star-finder",
    category: "astro",
    nameJa: "索星の計算",
    nameEn: "Prediction & Identification",
    description:
      "推測緯度と春分点の地方時角から、観測に適した恒星の高度・方位を求めます。",
    icon: Star,
    component: "astro/StarFinder",
  },
  {
    id: "nautical-almanac",
    category: "astro",
    nameJa: "天測暦の計算",
    nameEn: "Nautical Almanac",
    description:
      "日時（UT）から太陽のグリニッジ時角・赤緯・均時差を求めます（概算）。",
    icon: Eye,
    component: "astro/NauticalAlmanac",
  },
  {
    id: "lop",
    category: "astro",
    nameJa: "位置の線の計算",
    nameEn: "Line of Position",
    description: "推測位置と観測高度から計算高度・方位角・修正差を求めます。",
    icon: Crosshair,
    component: "astro/LOP",
  },
  {
    id: "position-fix",
    category: "astro",
    nameJa: "船位決定の計算",
    nameEn: "Position Fix",
    description: "2 本の位置の線（修正差・方位角）の交点から船位を求めます。",
    icon: Anchor,
    component: "astro/PositionFix",
  },
  {
    id: "meridian-passage",
    category: "astro",
    nameJa: "正中時の計算",
    nameEn: "Meridian Passage",
    description: "太陽の正中時刻を求め、子午線高度から緯度を求めます。",
    icon: Sun,
    component: "astro/MeridianPassage",
  },

  // ── 六分儀 SEXTANT ──
  {
    id: "altitude-correction",
    category: "sextant",
    nameJa: "測高度改正の計算",
    nameEn: "Altitude Corrections",
    description:
      "六分儀高度に眼高差・大気差・視差・視半径を改正して真高度を求めます。",
    icon: Telescope,
    component: "sextant/AltitudeCorr",
  },
  {
    id: "distance-to-object",
    category: "sextant",
    nameJa: "物標までの距離",
    nameEn: "Distance to Object",
    description: "物標の垂直角または光達距離から物標までの距離を求めます。",
    icon: Gauge,
    component: "sextant/DistanceToObject",
  },

  // ── 時間と弧度 TIME & ARC ──
  {
    id: "time-to-arc",
    category: "timeArc",
    nameJa: "時間計算と弧度換算",
    nameEn: "Time Computation",
    description: "時分秒の加減算を行い、結果を弧度（度分秒）に換算します。",
    icon: ArrowRightLeft,
    component: "timeArc/TimeToArc",
  },
  {
    id: "arc-to-time",
    category: "timeArc",
    nameJa: "角度計算と時間換算",
    nameEn: "Arc Computation",
    description: "度分秒の加減算を行い、結果を時間（時分秒）に換算します。",
    icon: ArrowLeftRight,
    component: "timeArc/ArcToTime",
  },

  // ── 四則計算と時変換 TIME Calculations ──
  {
    id: "to-hms",
    category: "timeCalc",
    nameJa: "時分秒変換・航走時間計算",
    nameEn: "To HMS",
    description:
      "10 進数の時間を時分秒に変換し、航程と速力から航走時間を求めます。",
    icon: Clock,
    component: "timeCalc/ToHMS",
  },
  {
    id: "to-decimal",
    category: "timeCalc",
    nameJa: "10進数時変換・速力、航走距離計算",
    nameEn: "To HHH",
    description:
      "時分秒を 10 進数の時間に変換し、速力または航走距離を求めます。",
    icon: Timer,
    component: "timeCalc/ToDecimal",
  },
  {
    id: "arithmetic",
    category: "timeCalc",
    nameJa: "四則計算",
    nameEn: "Normal Computations",
    description: "数値または時分秒の加減乗除を行います。",
    icon: Calculator,
    component: "timeCalc/Arithmetic",
  },

  // ── 海技試験 3N 航海 ──
  {
    id: "meripass-3n",
    category: "exam-3n-navigation",
    nameJa: "天体による船位の決定",
    nameEn: "Position by Celestial Bodies",
    description:
      "午前の太陽観測と正午の子午線高度から正午位置を求めます（3 級海技士 航海）。",
    icon: GraduationCap,
    component: "exam/Meripass",
  },
  {
    id: "nav-parallel-meridional",
    category: "exam-3n-navigation",
    nameJa: "平行航法・正子午線航法",
    nameEn: "Parallel & Meridian Sailing",
    description: "同一緯度線上・同一子午線上を航行するときの航程を求めます。",
    icon: Navigation,
    component: "exam/nav/ParallelMeridional",
  },
  {
    id: "nav-great-circle",
    category: "exam-3n-navigation",
    nameJa: "大圏航法",
    nameEn: "Great Circle Sailing",
    description: "大圏距離・初針路・終針路を解答形式で求めます。",
    icon: Globe,
    component: "exam/nav/GreatCircle",
  },
  {
    id: "nav-true-wind",
    category: "exam-3n-navigation",
    nameJa: "真風の計算",
    nameEn: "True Wind",
    description:
      "視風向（真方位）・視風速と船の針路・速力から真風を解答形式で求めます。",
    icon: Wind,
    component: "exam/nav/TrueWind",
  },
  {
    id: "nav-course-to-steer",
    category: "exam-3n-navigation",
    nameJa: "潮流中の針路",
    nameEn: "Course to Steer in Current",
    description:
      "潮流がある海域で目的の針路線上を進むための視針路を解答形式で求めます。",
    icon: Compass,
    component: "exam/nav/CourseToSteer",
  },
  {
    id: "nav-dead-reckoning",
    category: "exam-3n-navigation",
    nameJa: "推測位置の計算",
    nameEn: "Dead Reckoning",
    description: "針路・速力・航走時間から推測位置を中分緯度航法で求めます。",
    icon: MapPin,
    component: "exam/nav/DeadReckoning",
  },
  {
    id: "nav-light-range",
    category: "exam-3n-navigation",
    nameJa: "光達距離",
    nameEn: "Geographic Light Range",
    description: "灯高と眼高から地理学的光達距離を求めます。",
    icon: Eye,
    component: "exam/nav/LightRange",
  },
  {
    id: "nav-tidal-current",
    category: "exam-3n-navigation",
    nameJa: "潮汐表の使用法（潮流）",
    nameEn: "Tidal Current Table",
    description:
      "潮汐表の転流時・最強時・最強流速から任意時刻の流速を解答形式で求めます。",
    icon: Waves,
    component: "exam/nav/TidalCurrent",
  },
  {
    id: "nav-cross-bearing",
    category: "exam-3n-navigation",
    nameJa: "クロス方位法",
    nameEn: "Cross Bearing Fix",
    description: "位置が分かっている 2 物標の真方位から船位を求めます。",
    icon: Crosshair,
    component: "exam/nav/CrossBearing",
  },
  {
    id: "nav-running-fix",
    category: "exam-3n-navigation",
    nameJa: "両測方位法",
    nameEn: "Running Fix",
    description: "1 物標を 2 回測った真方位とその間の航走から船位を求めます。",
    icon: MoveRight,
    component: "exam/nav/RunningFix",
  },
  {
    id: "nav-clock-correction",
    category: "exam-3n-navigation",
    nameJa: "船内時計の改正",
    nameEn: "Ship's Clock Correction",
    description: "経度差から船内時計を進める（遅らせる）時間を求めます。",
    icon: Clock,
    component: "exam/nav/ClockCorrection",
  },
  {
    id: "nav-sunrise-sunset",
    category: "exam-3n-navigation",
    nameJa: "常用日出没時",
    nameEn: "Sunrise & Sunset",
    description: "日付と位置から日出没時を地方平時と標準時で求めます。",
    icon: Sunset,
    component: "exam/nav/SunriseSunset",
  },
  {
    id: "nav-amplitude-gyro",
    category: "exam-3n-navigation",
    nameJa: "出没方位角・ジャイロ誤差",
    nameEn: "Amplitude & Gyro Error",
    description: "太陽の出没方位角を求め、ジャイロコンパスの誤差を求めます。",
    icon: Compass,
    component: "exam/nav/AmplitudeGyro",
  },

  // ── 海技試験 3N 運用 ──
  {
    id: "op-tpc-draft",
    category: "exam-3n-operation",
    nameJa: "TPC・平均喫水",
    nameEn: "TPC and Mean Draft",
    description:
      "箱形船の TPC、積載後の平均喫水、喫水変化からの積載重量を求めます。",
    icon: Ship,
    component: "exam/OperationTPCDraft",
  },
  {
    id: "op-trim-load",
    category: "exam-3n-operation",
    nameJa: "トリム・前後喫水変化",
    nameEn: "Trim and End Draft Changes",
    description:
      "貨物の積載・移動による平均沈下・トリム・船首尾喫水の変化を求めます。",
    icon: MoveHorizontal,
    component: "exam/OperationTrimLoad",
  },
  {
    id: "op-gm-period",
    category: "exam-3n-operation",
    nameJa: "横揺れ周期と GM",
    nameEn: "GM from Rolling Period",
    description: "横揺れ周期の変化から GM と船幅を求めます。",
    icon: Activity,
    component: "exam/OperationGMPeriod",
  },
  {
    id: "op-density-draft",
    category: "exam-3n-operation",
    nameJa: "比重差と入港喫水",
    nameEn: "Arrival Draft by Density and Consumption",
    description:
      "燃料・清水の消費と海水比重の差を考慮した入港時の喫水を求めます。",
    icon: Droplets,
    component: "exam/OperationDensityDraft",
  },
  {
    id: "op-blind-zone",
    category: "exam-3n-operation",
    nameJa: "見張り死角距離",
    nameEn: "Blind Zone Distance",
    description:
      "見張りの眼高と船首部の障害物から船首前方の死角距離を求めます。",
    icon: View,
    component: "exam/OperationBlindZone",
  },
  {
    id: "op-ballast-transfer",
    category: "exam-3n-operation",
    nameJa: "等喫水化バラスト移送",
    nameEn: "Ballast Transfer for Even Keel",
    description:
      "前後喫水差と MTC から等喫水にするためのバラスト移送量を求めます。",
    icon: ArrowLeftRight,
    component: "exam/OperationBallastTransfer",
  },
  {
    id: "op-cargo-by-draft",
    category: "exam-3n-operation",
    nameJa: "前後喫水から積載重量",
    nameEn: "Cargo from End Draft Change",
    description: "積荷前後の船首・船尾喫水から積載重量を逆算します。",
    icon: Package,
    component: "exam/OperationCargoByDraft",
  },
  {
    id: "op-density-mean",
    category: "exam-3n-operation",
    nameJa: "比重差による平均喫水",
    nameEn: "Mean Draft by Density",
    description: "排水量と海水比重の差から移動後の平均喫水を求めます。",
    icon: Waves,
    component: "exam/OperationDensityMean",
  },

  // ── 海技試験 2N 航海 ──
  {
    id: "nav2n-celestial-fix",
    category: "exam-2n-navigation",
    nameJa: "天体による船位の測定",
    nameEn: "Celestial Fix (2 Bodies)",
    description:
      "2 天体の高度測定から修正差・方位角を求め、航走を転位して後測時の船位を求めます。",
    icon: Star,
    component: "exam/nav2n/CelestialFix",
  },
];

const calculatorById = new Map(calculators.map((c) => [c.id, c]));
const categoryById = new Map(categories.map((c) => [c.id, c]));

export function getCalculator(id: string): CalculatorDefinition | undefined {
  return calculatorById.get(id);
}

export function getCategory(id: CategoryId): CategoryDefinition | undefined {
  return categoryById.get(id);
}

export function getCalculatorsByCategory(
  categoryId: CategoryId,
): CalculatorDefinition[] {
  return calculators.filter((c) => c.category === categoryId);
}

export function getChildCategories(parentId?: CategoryId) {
  return categories.filter((c) => c.parentId === parentId);
}

/** 親カテゴリを根までたどる（自分自身は含まない） */
export function getAncestorIds(categoryId: CategoryId): CategoryId[] {
  const result: CategoryId[] = [];
  let current = categoryById.get(categoryId);
  while (current?.parentId) {
    result.push(current.parentId);
    current = categoryById.get(current.parentId);
  }
  return result;
}

/** カテゴリ配下（子孫含む）の最初の計算機 */
export function firstCalculatorIn(
  categoryId: CategoryId,
): CalculatorDefinition | undefined {
  const own = getCalculatorsByCategory(categoryId)[0];
  if (own) return own;
  for (const child of getChildCategories(categoryId)) {
    const found = firstCalculatorIn(child.id);
    if (found) return found;
  }
  return undefined;
}
