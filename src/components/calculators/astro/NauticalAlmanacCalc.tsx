import { useState } from 'react';
import { Eye } from 'lucide-react';
import { solarPosition } from '../../../utils/ephemeris';

export interface NauticalAlmanacResult {
  year: number; month: number; day: number; utcHours: number;
  gha: number; dec: number; eqTime: number; ra: number;
}

export const NauticalAlmanacCalc = ({ onResult }: { onResult: (r: NauticalAlmanacResult) => void }) => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [day, setDay] = useState(now.getDate());
  const [utcH, setUtcH] = useState(12);
  const [utcM, setUtcM] = useState(0);

  const handleCalculate = () => {
    const utcHours = utcH + utcM / 60;
    const result = solarPosition(year, month, day, utcHours);
    onResult({ year, month, day, utcHours, ...result });
  };

  const inputClass = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none";

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-amber-600 pl-3">天測暦</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">太陽のGHA・赤緯を簡易計算します（概算値）</p>
      </header>

      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">年 (Year)</span>
            <input type="number" className={inputClass + ' mt-1'} value={year} onChange={e => setYear(+e.target.value)} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">月 (Month)</span>
            <input type="number" className={inputClass + ' mt-1'} value={month} onChange={e => setMonth(+e.target.value)} min={1} max={12} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">日 (Day)</span>
            <input type="number" className={inputClass + ' mt-1'} value={day} onChange={e => setDay(+e.target.value)} min={1} max={31} />
          </div>
        </div>
        <div className="border-t border-dashed border-slate-200 dark:border-slate-700 pt-4">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">UTC 時刻</span>
          <div className="flex items-center gap-2 mt-1">
            <input type="number" className="w-20 p-2 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={utcH} onChange={e => setUtcH(+e.target.value)} min={0} max={23} />
            <span className="text-slate-400">:</span>
            <input type="number" className="w-20 p-2 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={utcM} onChange={e => setUtcM(+e.target.value)} min={0} max={59} />
            <span className="text-sm text-slate-500 dark:text-slate-400">UTC</span>
          </div>
        </div>
      </section>

      <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
        <Eye size={20} /> 計算実行 (CALC)
      </button>
    </div>
  );
};
