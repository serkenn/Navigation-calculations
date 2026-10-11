import type { Icon } from "lucide-svelte";
import type { Accent } from "#lib/theme/accent.js";

export type CategoryId =
  | "pilot1"
  | "pilot2"
  | "astro"
  | "sextant"
  | "timeArc"
  | "timeCalc"
  | "exam"
  | "exam-3n"
  | "exam-3n-navigation"
  | "exam-3n-operation"
  | "exam-2n"
  | "exam-2n-navigation";

// lucide-svelte のアイコンコンポーネント
export type IconComponent = typeof Icon;

export interface CategoryDefinition {
  id: CategoryId;
  parentId?: CategoryId;
  nameJa: string;
  nameEn: string;
  /** トップページに表示する内容の要約 */
  summary?: string;
  icon: IconComponent;
  accent: Accent;
}

export interface CalculatorDefinition {
  id: string;
  category: CategoryId;
  nameJa: string;
  nameEn: string;
  /** 画面見出し下の説明・meta description */
  description: string;
  icon: IconComponent;
  /**
   * components/calculators 以下のパス（拡張子・Calc/Result 接尾辞なし）
   * 例: "pilot1/CourseDistance" → CourseDistanceCalc.svelte / CourseDistanceResult.svelte
   */
  component: string;
}
