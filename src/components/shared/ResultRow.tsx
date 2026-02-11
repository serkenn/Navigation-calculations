interface ResultRowProps {
  label: string;
  value: string;
  bold?: boolean;
  border?: boolean;
  small?: boolean;
}

export const ResultRow = ({ label, value, bold, border, small }: ResultRowProps) => (
  <div className={`flex justify-between ${bold ? 'font-bold' : ''} ${border ? 'border-t border-slate-300 dark:border-slate-700 pt-1 mt-1' : ''} ${small ? 'text-xs text-slate-500 dark:text-slate-400' : ''}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);
