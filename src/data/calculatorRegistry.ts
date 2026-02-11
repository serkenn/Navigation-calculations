import {
  Navigation, Ship, Globe, Compass, Star, Telescope,
  Clock, Calculator, ArrowRightLeft, Timer,
  MapPin, Anchor as AnchorIcon, Wind, Waves,
  Crosshair, Eye, Sunset, MoveRight, Route,
  ArrowUpDown, RotateCcw, GraduationCap
} from 'lucide-react';
import type { CategoryDefinition, CalculatorDefinition } from '../types/calculator';

// --- Pilot 1 ---
import { CourseDistanceCalc } from '../components/calculators/pilot1/CourseDistanceCalc';
import { CourseDistanceResultView } from '../components/calculators/pilot1/CourseDistanceResult';
import { DeadReckoningCalc } from '../components/calculators/pilot1/DeadReckoningCalc';
import { DeadReckoningResultView } from '../components/calculators/pilot1/DeadReckoningResult';
import { GreatCircleCalc } from '../components/calculators/pilot1/GreatCircleCalc';
import { GreatCircleResultView } from '../components/calculators/pilot1/GreatCircleResult';
import { CompositeSailingCalc } from '../components/calculators/pilot1/CompositeSailingCalc';
import { CompositeSailingResultView } from '../components/calculators/pilot1/CompositeSailingResult';
import { ETACalc } from '../components/calculators/pilot1/ETACalc';
import { ETAResultView } from '../components/calculators/pilot1/ETAResult';

// --- Pilot 2 ---
import { CMGSMGCalc } from '../components/calculators/pilot2/CMGSMGCalc';
import { CMGSMGResultView } from '../components/calculators/pilot2/CMGSMGResult';
import { CourseToSteerCalc } from '../components/calculators/pilot2/CourseToSteerCalc';
import { CourseToSteerResultView } from '../components/calculators/pilot2/CourseToSteerResult';
import { CourseSteerSMGCalc } from '../components/calculators/pilot2/CourseSteerSMGCalc';
import { CourseSteerSMGResultView } from '../components/calculators/pilot2/CourseSteerSMGResult';
import { SetDriftCalc } from '../components/calculators/pilot2/SetDriftCalc';
import { SetDriftResultView } from '../components/calculators/pilot2/SetDriftResult';
import { TrueWindCalc } from '../components/calculators/pilot2/TrueWindCalc';
import { TrueWindResultView } from '../components/calculators/pilot2/TrueWindResult';
import { TideHeightCalc } from '../components/calculators/pilot2/TideHeightCalc';
import { TideHeightResultView } from '../components/calculators/pilot2/TideHeightResult';
import { TidalStreamCalc } from '../components/calculators/pilot2/TidalStreamCalc';
import { TidalStreamResultView } from '../components/calculators/pilot2/TidalStreamResult';

// --- Astro ---
import { TwilightCalc } from '../components/calculators/astro/TwilightCalc';
import { TwilightResultView } from '../components/calculators/astro/TwilightResult';
import { StarFinderCalc } from '../components/calculators/astro/StarFinderCalc';
import { StarFinderResultView } from '../components/calculators/astro/StarFinderResult';
import { NauticalAlmanacCalc } from '../components/calculators/astro/NauticalAlmanacCalc';
import { NauticalAlmanacResultView } from '../components/calculators/astro/NauticalAlmanacResult';
import { LOPCalc } from '../components/calculators/astro/LOPCalc';
import { LOPResultView } from '../components/calculators/astro/LOPResult';
import { PositionFixCalc } from '../components/calculators/astro/PositionFixCalc';
import { PositionFixResultView } from '../components/calculators/astro/PositionFixResult';
import { MeripassCalc } from '../components/calculators/exam/MeripassCalc';
import { MeripassResultView } from '../components/calculators/exam/MeripassResult';
import { GyroAmplitudeCalc } from '../components/calculators/astro/GyroAmplitudeCalc';
import { GyroAmplitudeResultView } from '../components/calculators/astro/GyroAmplitudeResult';

// --- Sextant ---
import { AltitudeCorrCalc } from '../components/calculators/sextant/AltitudeCorrCalc';
import { AltitudeCorrResultView } from '../components/calculators/sextant/AltitudeCorrResult';
import { DistanceToObjectCalc } from '../components/calculators/sextant/DistanceToObjectCalc';
import { DistanceToObjectResultView } from '../components/calculators/sextant/DistanceToObjectResult';

// --- Time & Arc ---
import { TimeToArcCalc } from '../components/calculators/timeArc/TimeToArcCalc';
import { TimeToArcResultView } from '../components/calculators/timeArc/TimeToArcResult';
import { ArcToTimeCalc } from '../components/calculators/timeArc/ArcToTimeCalc';
import { ArcToTimeResultView } from '../components/calculators/timeArc/ArcToTimeResult';

// --- Time Calc ---
import { ToHMSCalc } from '../components/calculators/timeCalc/ToHMSCalc';
import { ToHMSResultView } from '../components/calculators/timeCalc/ToHMSResult';
import { ToDecimalCalc } from '../components/calculators/timeCalc/ToDecimalCalc';
import { ToDecimalResultView } from '../components/calculators/timeCalc/ToDecimalResult';
import { ArithmeticCalc } from '../components/calculators/timeCalc/ArithmeticCalc';
import { ArithmeticResultView } from '../components/calculators/timeCalc/ArithmeticResult';

export const categories: CategoryDefinition[] = [
  { id: 'pilot1', nameJa: '航海計画 PILOT 1', nameEn: 'Voyage Planning', icon: Navigation, accentColor: 'text-blue-600 dark:text-blue-400' },
  { id: 'pilot2', nameJa: 'その他の航法 PILOT 2', nameEn: 'Other Navigation', icon: Ship, accentColor: 'text-cyan-600 dark:text-cyan-400' },
  { id: 'astro', nameJa: '天文航法 ASTRO. NAV', nameEn: 'Celestial Navigation', icon: Star, accentColor: 'text-amber-600 dark:text-amber-400' },
  { id: 'sextant', nameJa: '六分儀 SEXTANT', nameEn: 'Sextant', icon: Telescope, accentColor: 'text-purple-600 dark:text-purple-400' },
  { id: 'timeArc', nameJa: '時間と弧度 TIME & ARC', nameEn: 'Time & Arc', icon: Clock, accentColor: 'text-green-600 dark:text-green-400' },
  { id: 'timeCalc', nameJa: '四則計算 TIME Calc', nameEn: 'Time Calculations', icon: Calculator, accentColor: 'text-rose-600 dark:text-rose-400' },
  { id: 'exam', nameJa: '海技試験 EXAM', nameEn: 'Maritime Exam', icon: GraduationCap, accentColor: 'text-indigo-600 dark:text-indigo-400' },
];

export const calculators: CalculatorDefinition[] = [
  // --- PILOT 1 ---
  {
    id: 'course-distance', category: 'pilot1',
    nameJa: '針路・航程', nameEn: 'Course & Distance',
    icon: Route, accentColor: 'text-blue-600 dark:text-blue-400',
    seoTitle: '針路・航程計算 | 航法計算アプリ',
    seoDescription: 'メルカトル航法による針路と航程を計算します。',
    Component: CourseDistanceCalc, ResultComponent: CourseDistanceResultView,
  },
  {
    id: 'dead-reckoning', category: 'pilot1',
    nameJa: '到着点', nameEn: 'Dead Reckoning',
    icon: MapPin, accentColor: 'text-blue-600 dark:text-blue-400',
    seoTitle: '到着点計算 | 航法計算アプリ',
    seoDescription: '出発位置、針路、航程から到着点を計算します。',
    Component: DeadReckoningCalc, ResultComponent: DeadReckoningResultView,
  },
  {
    id: 'great-circle', category: 'pilot1',
    nameJa: '大圏航法', nameEn: 'Great Circle',
    icon: Globe, accentColor: 'text-blue-600 dark:text-blue-400',
    seoTitle: '大圏航法計算 | 航法計算アプリ',
    seoDescription: '大圏航法による距離と初針路を計算します。',
    Component: GreatCircleCalc, ResultComponent: GreatCircleResultView,
  },
  {
    id: 'composite-sailing', category: 'pilot1',
    nameJa: '集成大圏航法', nameEn: 'Composite Sailing',
    icon: Globe, accentColor: 'text-blue-600 dark:text-blue-400',
    seoTitle: '集成大圏航法計算 | 航法計算アプリ',
    seoDescription: '制限緯度を持つ集成大圏航法の計算を行います。',
    Component: CompositeSailingCalc, ResultComponent: CompositeSailingResultView,
  },
  {
    id: 'eta', category: 'pilot1',
    nameJa: '到着時刻', nameEn: 'ETA',
    icon: Timer, accentColor: 'text-blue-600 dark:text-blue-400',
    seoTitle: '到着時刻計算 | 航法計算アプリ',
    seoDescription: '距離と速力から到着予定時刻を計算します。',
    Component: ETACalc, ResultComponent: ETAResultView,
  },

  // --- PILOT 2 ---
  {
    id: 'cmg-smg', category: 'pilot2',
    nameJa: '実航針路・速力', nameEn: 'CMG / SMG',
    icon: MoveRight, accentColor: 'text-cyan-600 dark:text-cyan-400',
    seoTitle: '実航針路・速力計算 | 航法計算アプリ',
    seoDescription: '船速と潮流から実航針路と実航速力を計算します。',
    Component: CMGSMGCalc, ResultComponent: CMGSMGResultView,
  },
  {
    id: 'course-to-steer', category: 'pilot2',
    nameJa: '視針路・対水速力', nameEn: 'Course to Steer',
    icon: Compass, accentColor: 'text-cyan-600 dark:text-cyan-400',
    seoTitle: '視針路・対水速力計算 | 航法計算アプリ',
    seoDescription: '目標針路と潮流から視針路と対水速力を計算します。',
    Component: CourseToSteerCalc, ResultComponent: CourseToSteerResultView,
  },
  {
    id: 'course-steer-smg', category: 'pilot2',
    nameJa: '視針路・実航速力', nameEn: 'Course to Steer & SMG',
    icon: Compass, accentColor: 'text-cyan-600 dark:text-cyan-400',
    seoTitle: '視針路・実航速力計算 | 航法計算アプリ',
    seoDescription: '目標針路と潮流から視針路と実航速力を計算します。',
    Component: CourseSteerSMGCalc, ResultComponent: CourseSteerSMGResultView,
  },
  {
    id: 'set-drift', category: 'pilot2',
    nameJa: '流向・流速', nameEn: 'Set & Drift',
    icon: Waves, accentColor: 'text-cyan-600 dark:text-cyan-400',
    seoTitle: '流向・流速計算 | 航法計算アプリ',
    seoDescription: '船速、針路、実航針路から流向と流速を計算します。',
    Component: SetDriftCalc, ResultComponent: SetDriftResultView,
  },
  {
    id: 'true-wind', category: 'pilot2',
    nameJa: '真風向・風速', nameEn: 'True Wind',
    icon: Wind, accentColor: 'text-cyan-600 dark:text-cyan-400',
    seoTitle: '真風向・風速計算 | 航法計算アプリ',
    seoDescription: '相対風向と船速から真風向と風速を計算します。',
    Component: TrueWindCalc, ResultComponent: TrueWindResultView,
  },
  {
    id: 'tide-height', category: 'pilot2',
    nameJa: '潮高計算', nameEn: 'Tide Height',
    icon: ArrowUpDown, accentColor: 'text-cyan-600 dark:text-cyan-400',
    seoTitle: '潮高計算 | 航法計算アプリ',
    seoDescription: 'cos補間法により任意時刻の潮高を計算します。',
    Component: TideHeightCalc, ResultComponent: TideHeightResultView,
  },
  {
    id: 'tidal-stream', category: 'pilot2',
    nameJa: '潮流計算', nameEn: 'Tidal Stream',
    icon: RotateCcw, accentColor: 'text-cyan-600 dark:text-cyan-400',
    seoTitle: '潮流計算 | 航法計算アプリ',
    seoDescription: '潮流の速度と方向を補間計算します。',
    Component: TidalStreamCalc, ResultComponent: TidalStreamResultView,
  },

  // --- ASTRO ---
  {
    id: 'twilight', category: 'astro',
    nameJa: '薄明時', nameEn: 'Twilight',
    icon: Sunset, accentColor: 'text-amber-600 dark:text-amber-400',
    seoTitle: '薄明時計算 | 航法計算アプリ',
    seoDescription: '市民薄明・航海薄明の開始/終了時刻を計算します。',
    Component: TwilightCalc, ResultComponent: TwilightResultView,
  },
  {
    id: 'star-finder', category: 'astro',
    nameJa: '索星', nameEn: 'Star Finder',
    icon: Star, accentColor: 'text-amber-600 dark:text-amber-400',
    seoTitle: '索星計算 | 航法計算アプリ',
    seoDescription: '観測可能な恒星の高度と方位を計算します。',
    Component: StarFinderCalc, ResultComponent: StarFinderResultView,
  },
  {
    id: 'nautical-almanac', category: 'astro',
    nameJa: '天測暦', nameEn: 'Nautical Almanac',
    icon: Eye, accentColor: 'text-amber-600 dark:text-amber-400',
    seoTitle: '天測暦計算 | 航法計算アプリ',
    seoDescription: '太陽のGHAと赤緯を簡易計算します。',
    Component: NauticalAlmanacCalc, ResultComponent: NauticalAlmanacResultView,
  },
  {
    id: 'lop', category: 'astro',
    nameJa: '位置の線', nameEn: 'Line of Position',
    icon: Crosshair, accentColor: 'text-amber-600 dark:text-amber-400',
    seoTitle: '位置の線計算 | 航法計算アプリ',
    seoDescription: '天体観測から位置の線(LOP)を計算します。',
    Component: LOPCalc, ResultComponent: LOPResultView,
  },
  {
    id: 'position-fix', category: 'astro',
    nameJa: '船位決定', nameEn: 'Position Fix',
    icon: AnchorIcon, accentColor: 'text-amber-600 dark:text-amber-400',
    seoTitle: '船位決定計算 | 航法計算アプリ',
    seoDescription: '複数のLOPから船位を決定します。',
    Component: PositionFixCalc, ResultComponent: PositionFixResultView,
  },
  // (meripass moved to exam category below)
  {
    id: 'gyro-amplitude', category: 'astro',
    nameJa: '出没方位角', nameEn: 'Gyro & Amplitude',
    icon: Compass, accentColor: 'text-amber-600 dark:text-amber-400',
    seoTitle: '出没方位角・ジャイロ誤差計算 | 航法計算アプリ',
    seoDescription: '太陽の出没方位角(Amplitude)からジャイロコンパスの誤差を算出します。',
    Component: GyroAmplitudeCalc, ResultComponent: GyroAmplitudeResultView,
  },

  // --- SEXTANT ---
  {
    id: 'altitude-correction', category: 'sextant',
    nameJa: '測高度改正', nameEn: 'Altitude Correction',
    icon: Telescope, accentColor: 'text-purple-600 dark:text-purple-400',
    seoTitle: '測高度改正計算 | 航法計算アプリ',
    seoDescription: '六分儀による測定高度の各種改正を計算します。',
    Component: AltitudeCorrCalc, ResultComponent: AltitudeCorrResultView,
  },
  {
    id: 'distance-to-object', category: 'sextant',
    nameJa: '物標距離', nameEn: 'Distance to Object',
    icon: Eye, accentColor: 'text-purple-600 dark:text-purple-400',
    seoTitle: '物標距離計算 | 航法計算アプリ',
    seoDescription: '六分儀の角度から物標までの距離を計算します。',
    Component: DistanceToObjectCalc, ResultComponent: DistanceToObjectResultView,
  },

  // --- TIME & ARC ---
  {
    id: 'time-to-arc', category: 'timeArc',
    nameJa: '時間→弧度', nameEn: 'Time to Arc',
    icon: ArrowRightLeft, accentColor: 'text-green-600 dark:text-green-400',
    seoTitle: '時間→弧度変換 | 航法計算アプリ',
    seoDescription: '時間（時分秒）を弧度（度分秒）に変換します。',
    Component: TimeToArcCalc, ResultComponent: TimeToArcResultView,
  },
  {
    id: 'arc-to-time', category: 'timeArc',
    nameJa: '弧度→時間', nameEn: 'Arc to Time',
    icon: ArrowRightLeft, accentColor: 'text-green-600 dark:text-green-400',
    seoTitle: '弧度→時間変換 | 航法計算アプリ',
    seoDescription: '弧度（度分秒）を時間（時分秒）に変換します。',
    Component: ArcToTimeCalc, ResultComponent: ArcToTimeResultView,
  },

  // --- TIME Calc ---
  {
    id: 'to-hms', category: 'timeCalc',
    nameJa: '時分秒変換', nameEn: 'To HMS',
    icon: Clock, accentColor: 'text-rose-600 dark:text-rose-400',
    seoTitle: '時分秒変換 | 航法計算アプリ',
    seoDescription: '10進数時間を時分秒形式に変換します。',
    Component: ToHMSCalc, ResultComponent: ToHMSResultView,
  },
  {
    id: 'to-decimal', category: 'timeCalc',
    nameJa: '10進数時変換', nameEn: 'To Decimal',
    icon: Calculator, accentColor: 'text-rose-600 dark:text-rose-400',
    seoTitle: '10進数時変換 | 航法計算アプリ',
    seoDescription: '時分秒形式を10進数時間に変換します。',
    Component: ToDecimalCalc, ResultComponent: ToDecimalResultView,
  },
  {
    id: 'arithmetic', category: 'timeCalc',
    nameJa: '四則計算', nameEn: 'Arithmetic',
    icon: Calculator, accentColor: 'text-rose-600 dark:text-rose-400',
    seoTitle: '時間の四則計算 | 航法計算アプリ',
    seoDescription: '時分秒形式での加減乗除計算を行います。',
    Component: ArithmeticCalc, ResultComponent: ArithmeticResultView,
  },

  // --- EXAM (海技試験) ---
  {
    id: 'meripass-3n', category: 'exam',
    nameJa: 'メリパス計算 3N', nameEn: 'Meripass 3N',
    icon: GraduationCap, accentColor: 'text-indigo-600 dark:text-indigo-400',
    seoTitle: 'メリパス計算 (3N) | 航法計算アプリ',
    seoDescription: '午前観測と正中観測から船位を決定するメリパス計算支援ツールです。三級海技士(航海)試験対応。',
    Component: MeripassCalc, ResultComponent: MeripassResultView,
  },
];

export function getCalculator(id: string): CalculatorDefinition | undefined {
  return calculators.find(c => c.id === id);
}

export function getCategory(id: string): CategoryDefinition | undefined {
  return categories.find(c => c.id === id);
}
