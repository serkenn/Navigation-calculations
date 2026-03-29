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
  | "exam-3n-operation";

export interface CategoryDefinition {
  id: CategoryId;
  parentId?: CategoryId;
  nameJa: string;
  nameEn: string;
  iconName: string;
  accentColor: string;
}

export interface CalculatorDefinition {
  id: string;
  category: CategoryId;
  nameJa: string;
  nameEn: string;
  iconName: string;
  seoTitle: string;
  seoDescription: string;
  accentColor: string;
  borderColor: string;
  buttonColor: string;
}
