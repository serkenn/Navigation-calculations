import { ChevronDown } from 'lucide-react';
import type { CategoryDefinition, CalculatorDefinition } from '../../types/calculator';

interface SidebarCategoryProps {
  category: CategoryDefinition;
  calculators: CalculatorDefinition[];
  activeId: string;
  onSelect: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const SidebarCategory = ({ category, calculators, activeId, onSelect, isOpen, onToggle }: SidebarCategoryProps) => {
  const hasActive = calculators.some(c => c.id === activeId);

  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
          hasActive
            ? 'text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }`}
      >
        <span className="flex items-center gap-2">
          <category.icon size={16} className={hasActive ? category.accentColor : ''} />
          <span className="truncate">{category.nameJa}</span>
        </span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="ml-4 mt-1 space-y-0.5">
          {calculators.map(calc => {
            const isActive = calc.id === activeId;
            return (
              <button
                key={calc.id}
                onClick={() => onSelect(calc.id)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
                  isActive
                    ? `${calc.accentColor} bg-opacity-10 font-bold`
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <calc.icon size={14} />
                <span className="truncate">{calc.nameJa}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
