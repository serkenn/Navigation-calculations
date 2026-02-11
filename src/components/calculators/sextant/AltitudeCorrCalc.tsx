import { useState } from 'react';
import { Telescope } from 'lucide-react';
import { altitudeCorrection } from '../../../utils/sextant';

export interface AltitudeCorrResult {
  hs: number; ho: number; dip: number; refraction: number;
  parallax: number; sdCorr: number; totalCorr: number;
  ha: number; heightOfEye: number;
  bodyType: string;
}

type BodyType = 'sun_lower' | 'sun_upper' | 'star' | 'moon' | 'planet';

export const AltitudeCorrCalc = ({ onResult }: { onResult: (r: AltitudeCorrResult) => void }) => {
  const [hs, setHs] = useState(35.5);
  const [heightOfEye, setHeightOfEye] = useState(12);
  const [bodyType, setBodyType] = useState<BodyType>('sun_lower');
  const [temp, setTemp] = useState(10);
  const [pressure, setPressure] = useState(1010);
  const [HP, setHP] = useState(54.5);
  const [SD, setSD] = useState(16.0);

  const handleCalculate = () => {
    const result = altitudeCorrection(hs, heightOfEye, bodyType, temp, pressure, HP, SD);
    onResult(result);
  };

  const inputClass = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none";

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-purple-600 pl-3">測高度改正</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">六分儀測定値から真高度を計算します</p>
      </header>

      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">六分儀高度 (hs)</span>
            <div className="flex items-center gap-2 mt-1">
              <input type="number" step="0.1" className={inputClass} value={hs} onChange={e => setHs(+e.target.value)} />
              <span className="text-sm text-slate-500">&deg;</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">眼高 (Eye Height)</span>
            <div className="flex items-center gap-2 mt-1">
              <input type="number" step="0.1" className={inputClass} value={heightOfEye} onChange={e => setHeightOfEye(+e.target.value)} />
              <span className="text-sm text-slate-500">m</span>
            </div>
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block mb-1">天体種別</span>
          <div className="flex flex-wrap gap-2">
            {([
              ['sun_lower', '太陽下辺'],
              ['sun_upper', '太陽上辺'],
              ['star', '恒星'],
              ['planet', '惑星'],
              ['moon', '月'],
            ] as [BodyType, string][]).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setBodyType(val)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors ${
                  bodyType === val
                    ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-400 text-purple-700 dark:text-purple-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-dashed border-slate-200 dark:border-slate-700 pt-4">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">気温 (&deg;C)</span>
            <input type="number" className={inputClass + ' mt-1'} value={temp} onChange={e => setTemp(+e.target.value)} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">気圧 (hPa)</span>
            <input type="number" className={inputClass + ' mt-1'} value={pressure} onChange={e => setPressure(+e.target.value)} />
          </div>
        </div>

        {(bodyType === 'sun_lower' || bodyType === 'sun_upper' || bodyType === 'moon') && (
          <div className="grid grid-cols-2 gap-4 border-t border-dashed border-slate-200 dark:border-slate-700 pt-4">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">SD (半径) &apos;</span>
              <input type="number" step="0.1" className={inputClass + ' mt-1'} value={SD} onChange={e => setSD(+e.target.value)} />
            </div>
            {bodyType === 'moon' && (
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">HP (水平視差) &apos;</span>
                <input type="number" step="0.1" className={inputClass + ' mt-1'} value={HP} onChange={e => setHP(+e.target.value)} />
              </div>
            )}
          </div>
        )}
      </section>

      <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
        <Telescope size={20} /> 計算実行 (CALC)
      </button>
    </div>
  );
};
