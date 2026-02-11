import { useState, useCallback } from 'react';
import { Anchor, HelpCircle, BookOpen, Sun, Moon } from 'lucide-react';
import { SidebarCategory } from './SidebarCategory';
import { categories, calculators } from '../../data/calculatorRegistry';
import type { CategoryId } from '../../types/calculator';

interface SidebarProps {
  isOpen: boolean;
  activeId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

function getActiveCategoryId(activeId: string): CategoryId | null {
  const calc = calculators.find(c => c.id === activeId);
  return calc ? calc.category : null;
}

export const Sidebar = ({ isOpen, activeId, onSelect, onClose, theme, onToggleTheme }: SidebarProps) => {
  const activeCatId = getActiveCategoryId(activeId);
  const [openCategories, setOpenCategories] = useState<Set<CategoryId>>(() => {
    const initial = new Set<CategoryId>();
    if (activeCatId) initial.add(activeCatId);
    return initial;
  });

  const handleSelect = useCallback((id: string) => {
    // Auto-open the category of the selected calculator
    const calc = calculators.find(c => c.id === id);
    if (calc) {
      setOpenCategories(prev => {
        const next = new Set(prev);
        next.add(calc.category);
        return next;
      });
    }
    onSelect(id);
    onClose();
  }, [onSelect, onClose]);

  const handleToggleCategory = useCallback((catId: CategoryId) => {
    setOpenCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white transform transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col shadow-2xl lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Anchor className="text-blue-600 dark:text-blue-400" /> 航法計算
          </h1>
        </div>

        {/* Categories */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {categories.map(cat => (
            <SidebarCategory
              key={cat.id}
              category={cat}
              calculators={calculators.filter(c => c.category === cat.id)}
              activeId={activeId}
              onSelect={handleSelect}
              isOpen={openCategories.has(cat.id)}
              onToggle={() => handleToggleCategory(cat.id)}
            />
          ))}

          {/* Divider */}
          <div className="border-t border-slate-200 dark:border-slate-700 my-2" />

          {/* Guide & Theory */}
          {[
            { id: 'guide', icon: HelpCircle, label: '利用ガイド' },
            { id: 'theory', icon: BookOpen, label: '理論' },
          ].map(item => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-slate-600 dark:bg-slate-700 text-white shadow-md font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <item.icon size={16} /> {item.label}
              </button>
            );
          })}
        </nav>

        {/* Theme Toggle (Desktop) */}
        <div className="hidden lg:flex p-4 border-t border-slate-200 dark:border-slate-800 justify-between items-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
          <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full flex items-center gap-2 font-bold px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            {theme === 'dark' ? <><Sun size={14} /> Light</> : <><Moon size={14} /> Dark</>}
          </button>
        </div>
      </aside>
    </>
  );
};
