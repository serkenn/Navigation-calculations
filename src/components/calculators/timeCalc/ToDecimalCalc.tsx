import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { hmsToDecimal } from '../../../utils/timeConversion';

export interface ToDecimalResult {
  decimal: number;
  inputH: number; inputM: number; inputS: number;
}

export const ToDecimalCalc = ({ onResult }: { onResult: (r: ToDecimalResult) => void }) => {
  const [h, setH] = useState(9);
  const [m, setM] = useState(24);
  const [s, setS] = useState(30);

  const handleCalculate = () => {
    onResult({ decimal: hmsToDecimal(h, m, s), inputH: h, inputM: m, inputS: s });
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-rose-600 pl-3">HMS → Decimal</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">時分秒を10進数時間に変換します</p>
      </header>

      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">時 (h)</span>
            <input type="number" className="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={h} onChange={e => setH(+e.target.value)} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">分 (m)</span>
            <input type="number" className="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={m} onChange={e => setM(+e.target.value)} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">秒 (s)</span>
            <input type="number" className="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={s} onChange={e => setS(+e.target.value)} />
          </div>
        </div>
      </section>

      <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
        <Calculator size={20} /> 変換 (Convert)
      </button>
    </div>
  );
};
