import type { LucideIcon } from 'lucide-react';

interface CalculateButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  label?: string;
  color?: string;
}

export const CalculateButton = ({
  onClick,
  icon: Icon,
  label = '計算実行 (RUN)',
  color = 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600',
}: CalculateButtonProps) => (
  <button
    onClick={onClick}
    className={`w-full py-4 bg-gradient-to-r ${color} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2`}
  >
    <Icon size={20} /> {label}
  </button>
);
