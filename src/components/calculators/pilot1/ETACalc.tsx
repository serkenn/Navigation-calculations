import { useState } from 'react';
import { Timer } from 'lucide-react';

export interface ETAResult {
  distance: number;
  speed: number;
  travelTimeHours: number;
  travelH: number; travelM: number;
  depH: number; depM: number;
  etaH: number; etaM: number;
  etaDays: number;
}

export const ETACalc = ({ onResult }: { onResult: (r: ETAResult) => void }) => {
  const [distance, setDistance] = useState(350);
  const [speed, setSpeed] = useState(14.5);
  const [depH, setDepH] = useState(8);
  const [depM, setDepM] = useState(0);

  const handleCalculate = () => {
    if (speed <= 0) return;
    const travelTimeHours = distance / speed;
    const travelH = Math.floor(travelTimeHours);
    const travelM = Math.round((travelTimeHours - travelH) * 60);

    const depTotalMin = depH * 60 + depM;
    const arrTotalMin = depTotalMin + Math.round(travelTimeHours * 60);
    const etaDays = Math.floor(arrTotalMin / (24 * 60));
    const remaining = arrTotalMin % (24 * 60);
    const etaH = Math.floor(remaining / 60);
    const etaM = remaining % 60;

    onResult({ distance, speed, travelTimeHours, travelH, travelM, depH, depM, etaH, etaM, etaDays });
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-blue-600 pl-3">ETA 到着時刻</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">距離と速力から到着予定時刻を計算します</p>
      </header>

      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">距離 (Distance)</span>
            <div className="flex items-center gap-2 mt-1">
              <input type="number" step="0.1" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={distance} onChange={e => setDistance(+e.target.value)} />
              <span className="text-sm text-slate-500 dark:text-slate-400">NM</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">速力 (Speed)</span>
            <div className="flex items-center gap-2 mt-1">
              <input type="number" step="0.1" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={speed} onChange={e => setSpeed(+e.target.value)} />
              <span className="text-sm text-slate-500 dark:text-slate-400">kn</span>
            </div>
          </div>
        </div>

        <div className="border-t border-dashed border-slate-200 dark:border-slate-700 pt-4">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">出発時刻 (Departure)</span>
          <div className="flex items-center gap-2 mt-1">
            <input type="number" className="w-20 p-2 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={depH} onChange={e => setDepH(+e.target.value)} min={0} max={23} />
            <span className="text-slate-400">:</span>
            <input type="number" className="w-20 p-2 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={depM} onChange={e => setDepM(+e.target.value)} min={0} max={59} />
          </div>
        </div>
      </section>

      <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
        <Timer size={20} /> 計算実行 (CALC)
      </button>
    </div>
  );
};
