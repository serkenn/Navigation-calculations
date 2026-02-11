import type { ReactNode } from 'react';

interface ResultBoxProps {
  label: string;
  children: ReactNode;
}

export const ResultBox = ({ label, children }: ResultBoxProps) => (
  <div className="bg-white dark:bg-slate-900 border-4 border-double border-slate-800 dark:border-slate-400 p-4 text-center shadow-lg">
    <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">{label}</p>
    {children}
  </div>
);
