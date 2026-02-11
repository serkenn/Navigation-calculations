interface TimeInputProps {
  label: string;
  hours: number;
  minutes: number;
  seconds: number;
  onChangeHours: (v: number) => void;
  onChangeMinutes: (v: number) => void;
  onChangeSeconds: (v: number) => void;
}

export const TimeInput = ({ label, hours, minutes, seconds, onChangeHours, onChangeMinutes, onChangeSeconds }: TimeInputProps) => (
  <div>
    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{label}</span>
    <div className="flex items-center gap-1 mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded p-1 shadow-sm transition-colors">
      <input
        type="number"
        className="w-12 text-right outline-none font-mono text-sm bg-transparent text-slate-900 dark:text-white"
        value={hours}
        onChange={e => onChangeHours(+e.target.value)}
        placeholder="h"
      />
      <span className="text-slate-400 text-xs">h</span>
      <input
        type="number"
        className="w-12 text-right outline-none font-mono text-sm bg-transparent text-slate-900 dark:text-white"
        value={minutes}
        onChange={e => onChangeMinutes(+e.target.value)}
        placeholder="m"
      />
      <span className="text-slate-400 text-xs">m</span>
      <input
        type="number"
        className="w-12 text-right outline-none font-mono text-sm bg-transparent text-slate-900 dark:text-white"
        value={seconds}
        onChange={e => onChangeSeconds(+e.target.value)}
        placeholder="s"
      />
      <span className="text-slate-400 text-xs">s</span>
    </div>
  </div>
);
