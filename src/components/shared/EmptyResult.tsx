import type { LucideIcon } from 'lucide-react';

interface EmptyResultProps {
  icon: LucideIcon;
  message?: string;
}

export const EmptyResult = ({ icon: Icon, message = 'No Data Calculated' }: EmptyResultProps) => (
  <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
    <Icon size={48} className="mb-4 opacity-20" />
    <p>{message}</p>
  </div>
);
