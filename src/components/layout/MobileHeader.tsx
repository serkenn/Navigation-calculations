import { Anchor, Sun, Moon, Menu, X } from 'lucide-react';

interface MobileHeaderProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const MobileHeader = ({ isMenuOpen, onToggleMenu, theme, onToggleTheme }: MobileHeaderProps) => (
  <div className="lg:hidden bg-white dark:bg-slate-900 p-4 shadow-sm flex items-center justify-between z-20 border-b border-slate-200 dark:border-slate-800 flex-shrink-0 transition-colors">
    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
      <Anchor className="text-blue-700 dark:text-blue-500" size={20} />
      航法計算アプリ
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleTheme}
        className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
      <button onClick={onToggleMenu} className="p-2 text-slate-600 dark:text-slate-400">
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  </div>
);
