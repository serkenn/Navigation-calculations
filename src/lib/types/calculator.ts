export type CategoryId = 'pilot1' | 'pilot2' | 'astro' | 'sextant' | 'timeArc' | 'timeCalc' | 'exam';

export interface CategoryDefinition {
  id: CategoryId;
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
