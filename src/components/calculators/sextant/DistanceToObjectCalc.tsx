import { useState } from 'react';
import { Eye } from 'lucide-react';
import { distanceByVerticalAngle, geographicalRange } from '../../../utils/sextant';

export interface DistanceToObjectResult {
  mode: 'vertical' | 'geographic';
  distance: number; distanceNM: number;
  angle?: number; height: number; heightOfEye: number;
  geoRange?: number;
}

export const DistanceToObjectCalc = ({ onResult }: { onResult: (r: DistanceToObjectResult) => void }) => {
  const [mode, setMode] = useState<'vertical' | 'geographic'>('vertical');
  const [angle, setAngle] = useState(1.5);
  const [height, setHeight] = useState(50);
  const [heightOfEye, setHeightOfEye] = useState(12);

  const handleCalculate = () => {
    if (mode === 'vertical') {
      const result = distanceByVerticalAngle(angle, height, heightOfEye);
      onResult({ mode, distance: result.distance, distanceNM: result.distanceNM, angle, height, heightOfEye });
    } else {
      const result = geographicalRange(height, heightOfEye);
      onResult({ mode, distance: 0, distanceNM: result.range, height, heightOfEye, geoRange: result.range });
    }
  };

  const inputClass = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none";

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-purple-600 pl-3">物標距離</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">六分儀の角度から物標までの距離を計算します</p>
      </header>

      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block mb-1">計算方式</span>
          <div className="flex gap-2">
            <button onClick={() => setMode('vertical')} className={`flex-1 py-2 rounded-lg font-bold border text-sm transition-colors ${mode === 'vertical' ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-400 text-purple-700 dark:text-purple-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500'}`}>
              垂直角法
            </button>
            <button onClick={() => setMode('geographic')} className={`flex-1 py-2 rounded-lg font-bold border text-sm transition-colors ${mode === 'geographic' ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-400 text-purple-700 dark:text-purple-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500'}`}>
              地理学的視距離
            </button>
          </div>
        </div>

        {mode === 'vertical' && (
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">垂直角 (&deg;)</span>
            <input type="number" step="0.01" className={inputClass + ' mt-1'} value={angle} onChange={e => setAngle(+e.target.value)} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">物標高さ (m)</span>
            <input type="number" className={inputClass + ' mt-1'} value={height} onChange={e => setHeight(+e.target.value)} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">眼高 (m)</span>
            <input type="number" className={inputClass + ' mt-1'} value={heightOfEye} onChange={e => setHeightOfEye(+e.target.value)} />
          </div>
        </div>
      </section>

      <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
        <Eye size={20} /> 計算実行 (CALC)
      </button>
    </div>
  );
};
