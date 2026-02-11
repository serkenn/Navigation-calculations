import type { LucideIcon } from 'lucide-react';
import type { ComponentType } from 'react';

export type CategoryId = 'pilot1' | 'pilot2' | 'astro' | 'sextant' | 'timeArc' | 'timeCalc' | 'exam';

export interface CategoryDefinition {
  id: CategoryId;
  nameJa: string;
  nameEn: string;
  icon: LucideIcon;
  accentColor: string;
}

export interface CalculatorDefinition {
  id: string;
  category: CategoryId;
  nameJa: string;
  nameEn: string;
  icon: LucideIcon;
  seoTitle: string;
  seoDescription: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: ComponentType<{ onResult: (result: any) => void }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ResultComponent: ComponentType<{ result: any }>;
  accentColor: string;
}
