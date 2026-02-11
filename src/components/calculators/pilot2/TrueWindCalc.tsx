import { useState } from 'react';
import { Wind } from 'lucide-react';
import { NumberInput } from '../../shared/NumberInput';
import { trueWind } from '../../../utils/wind';

export interface TrueWindResult {
  relativeDir: number; relativeSpeed: number;
  shipCourse: number; shipSpeed: number;
  trueDir: number; trueSpeed: number;
}

export const TrueWindCalc = ({ onResult }: { onResult: (r: TrueWindResult) => void }) => {
  const [relativeDir, setRelativeDir] = useState(45);
  const [relativeSpeed, setRelativeSpeed] = useState(15);
  const [shipCourse, setShipCourse] = useState(0);
  const [shipSpeed, setShipSpeed] = useState(12);

  const handleCalculate = () => {
    const r = trueWind(relativeDir, relativeSpeed, shipCourse, shipSpeed);
    onResult({ relativeDir, relativeSpeed, shipCourse, shipSpeed, trueDir: r.trueDir, trueSpeed: r.trueSpeed });
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-cyan-600 pl-3">真風向・風速</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">相対風向・風速と船速から真風向・真風速を計算</p>
      </header>
      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">相対風 (Apparent Wind)</div>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput label="相対風向 (船首基準)" value={relativeDir} onChange={setRelativeDir} unit="°" step={1} />
          <NumberInput label="相対風速" value={relativeSpeed} onChange={setRelativeSpeed} unit="kn" step={0.1} />
        </div>
      </section>
      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">船の状態</div>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput label="船首方向 (Course)" value={shipCourse} onChange={setShipCourse} unit="°" step={0.1} />
          <NumberInput label="船速 (Speed)" value={shipSpeed} onChange={setShipSpeed} unit="kn" step={0.1} />
        </div>
      </section>
      <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
        <Wind size={20} /> 計算実行 (CALC)
      </button>
    </div>
  );
};
