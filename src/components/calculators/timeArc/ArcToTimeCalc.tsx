import { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { arcToTime } from '../../../utils/timeConversion';

export interface ArcToTimeResult {
  h: number; m: number; s: number; totalHours: number;
  inputDeg: number; inputMin: number; inputSec: number;
}

export const ArcToTimeCalc = ({ onResult }: { onResult: (r: ArcToTimeResult) => void }) => {
  const [deg, setDeg] = useState(141);
  const [min, setMin] = useState(7);
  const [sec, setSec] = useState(30);

  const handleCalculate = () => {
    const result = arcToTime(deg, min, sec);
    onResult({ ...result, inputDeg: deg, inputMin: min, inputSec: sec });
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-green-600 pl-3">Arc → Time</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">弧度（度分秒）を時間（時分秒）に変換します</p>
      </header>

      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-300 font-bold text-sm uppercase tracking-wider">
          <ArrowRightLeft size={16} /> 弧度入力 (Arc)
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">度 (&deg;)</span>
            <input type="number" className="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={deg} onChange={e => setDeg(+e.target.value)} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">分 (&apos;)</span>
            <input type="number" className="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={min} onChange={e => setMin(+e.target.value)} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">秒 (&quot;)</span>
            <input type="number" className="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={sec} onChange={e => setSec(+e.target.value)} />
          </div>
        </div>
      </section>

      <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
        <ArrowRightLeft size={20} /> 変換 (Convert)
      </button>
    </div>
  );
};
