import type { ReactNode } from 'react';

interface ResultSectionProps {
  title: string;
  bgColor?: string;
  children: ReactNode;
}

export const ResultSection = ({ title, bgColor = 'bg-slate-800 dark:bg-slate-700', children }: ResultSectionProps) => (
  <div className="relative">
    <h3 className={`text-sm font-bold ${bgColor} text-white inline-block px-3 py-1 mb-3`}>{title}</h3>
    {children}
  </div>
);
