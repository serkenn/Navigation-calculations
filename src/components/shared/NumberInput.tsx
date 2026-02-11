interface NumberInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
  placeholder?: string;
  step?: number;
}

export const NumberInput = ({ label, value, onChange, unit, placeholder, step }: NumberInputProps) => (
  <div>
    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{label}</span>
    <div className="flex items-center gap-2 mt-1">
      <input
        type="number"
        step={step}
        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
        value={value}
        onChange={e => onChange(+e.target.value)}
        placeholder={placeholder}
      />
      {unit && <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{unit}</span>}
    </div>
  </div>
);
