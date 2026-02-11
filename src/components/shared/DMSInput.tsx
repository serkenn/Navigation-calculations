import type { DMSValue } from '../../types/navigation';

interface DMSInputProps {
  value: DMSValue;
  onChange: (val: DMSValue) => void;
  label: string;
  showSign?: boolean;
  signType?: 'NS' | 'EW';
}

export const DMSInput = ({ value, onChange, label, showSign = false, signType = 'NS' }: DMSInputProps) => (
  <div className="flex flex-col">
    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">{label}</span>
    <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded p-1 shadow-sm transition-colors">
      <input
        type="number"
        className="w-10 text-right outline-none font-mono text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400"
        value={value.d}
        onChange={e => onChange({ ...value, d: +e.target.value })}
        placeholder="deg"
      />
      <span className="text-slate-400 text-xs">&deg;</span>
      <input
        type="number"
        className="w-12 text-right outline-none font-mono text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400"
        value={value.m}
        onChange={e => onChange({ ...value, m: +e.target.value })}
        placeholder="min"
      />
      <span className="text-slate-400 text-xs">&apos;</span>
      {showSign && (
        <select
          className="text-xs bg-transparent outline-none font-bold text-slate-700 dark:text-slate-200"
          value={value.dir}
          onChange={e => onChange({ ...value, dir: +e.target.value })}
        >
          {signType === 'NS' ? (
            <><option value={1} className="text-slate-900 bg-white dark:bg-slate-800 dark:text-white">N</option><option value={-1} className="text-slate-900 bg-white dark:bg-slate-800 dark:text-white">S</option></>
          ) : (
            <><option value={1} className="text-slate-900 bg-white dark:bg-slate-800 dark:text-white">E</option><option value={-1} className="text-slate-900 bg-white dark:bg-slate-800 dark:text-white">W</option></>
          )}
        </select>
      )}
    </div>
  </div>
);
