import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  accentBg?: string;
  accentText?: string;
}

export const SectionCard = ({
  icon: Icon,
  title,
  children,
  accentBg = 'bg-slate-50 dark:bg-slate-800',
  accentText = 'text-slate-700 dark:text-slate-300',
}: SectionCardProps) => (
  <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
    <div className={`${accentBg} px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 font-bold ${accentText} text-sm`}>
      <Icon size={16} /> {title}
    </div>
    <div className="p-4">
      {children}
    </div>
  </section>
);
