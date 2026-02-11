import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { NumberInput } from '../../shared/NumberInput';
import { tideHeight } from '../../../utils/tide';

export interface TideHeightResult {
  hwHeight: number; lwHeight: number;
  hwTime: number; lwTime: number;
  targetTime: number;
  height: number; range: number; duration: number; elapsed: number; ratio: number;
}

export const TideHeightCalc = ({ onResult }: { onResult: (r: TideHeightResult) => void }) => {
  const [hwHeight, setHwHeight] = useState(3.5);
  const [lwHeight, setLwHeight] = useState(0.8);
  const [hwTime, setHwTime] = useState(14.5);
  const [lwTime, setLwTime] = useState(8.0);
  const [targetTime, setTargetTime] = useState(11.0);

  const handleCalculate = () => {
    const r = tideHeight(hwHeight, lwHeight, hwTime, lwTime, targetTime);
    onResult({ hwHeight, lwHeight, hwTime, lwTime, targetTime, ...r });
  };

  const fmt = (h: number) => `${Math.floor(h).toString().padStart(2, '0')}:${Math.round((h % 1) * 60).toString().padStart(2, '0')}`;

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-cyan-600 pl-3">潮高計算</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">cos補間法により任意時刻の潮高を計算します</p>
      </header>
      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">高潮 (HW)</div>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput label="潮高 (Height)" value={hwHeight} onChange={setHwHeight} unit="m" step={0.1} />
          <div>
            <NumberInput label="時刻 (10進)" value={hwTime} onChange={setHwTime} unit="h" step={0.1} />
            <p className="text-xs text-slate-400 mt-0.5 pl-1">{fmt(hwTime)}</p>
          </div>
        </div>
      </section>
      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">低潮 (LW)</div>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput label="潮高 (Height)" value={lwHeight} onChange={setLwHeight} unit="m" step={0.1} />
          <div>
            <NumberInput label="時刻 (10進)" value={lwTime} onChange={setLwTime} unit="h" step={0.1} />
            <p className="text-xs text-slate-400 mt-0.5 pl-1">{fmt(lwTime)}</p>
          </div>
        </div>
      </section>
      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div>
          <NumberInput label="求めたい時刻 (Target Time)" value={targetTime} onChange={setTargetTime} unit="h" step={0.1} />
          <p className="text-xs text-slate-400 mt-0.5 pl-1">{fmt(targetTime)}</p>
        </div>
      </section>
      <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
        <ArrowUpDown size={20} /> 計算実行 (CALC)
      </button>
    </div>
  );
};
