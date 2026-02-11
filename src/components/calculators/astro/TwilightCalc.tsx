import { useState } from 'react';
import { Sunset } from 'lucide-react';
import { DMSInput } from '../../shared/DMSInput';
import type { DMSValue } from '../../../types/navigation';
import { toDecimal } from '../../../utils/navigationMath';
import { allTwilights } from '../../../utils/astronomy';

export interface TwilightResult {
  lat: number; dec: number; lon: number; eqTime: number;
  sunrise: { rise: number; set: number; possible: boolean };
  civil: { rise: number; set: number; possible: boolean };
  nautical: { rise: number; set: number; possible: boolean };
  astronomical: { rise: number; set: number; possible: boolean };
}

export const TwilightCalc = ({ onResult }: { onResult: (r: TwilightResult) => void }) => {
  const [lat, setLat] = useState<DMSValue>({ d: 35, m: 0, dir: 1 });
  const [dec, setDec] = useState<DMSValue>({ d: 23, m: 0, dir: 1 });
  const [lon, setLon] = useState<DMSValue>({ d: 139, m: 45, dir: 1 });
  const [eqTime, setEqTime] = useState(0);

  const handleCalculate = () => {
    const la = toDecimal(lat.d, lat.m) * lat.dir;
    const de = toDecimal(dec.d, dec.m) * dec.dir;
    const lo = toDecimal(lon.d, lon.m) * lon.dir;
    const result = allTwilights(la, de, lo, eqTime);
    onResult({ lat: la, dec: de, lon: lo, eqTime, ...result });
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-amber-600 pl-3">薄明時</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">市民薄明・航海薄明・日出没時刻を計算します</p>
      </header>

      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="grid grid-cols-2 gap-4">
          <DMSInput label="緯度 (Lat)" value={lat} onChange={setLat} showSign signType="NS" />
          <DMSInput label="経度 (Lon)" value={lon} onChange={setLon} showSign signType="EW" />
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-dashed border-slate-200 dark:border-slate-700 pt-4">
          <DMSInput label="太陽赤緯 (Dec)" value={dec} onChange={setDec} showSign signType="NS" />
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">均時差 (Eq. of Time)</span>
            <div className="flex items-center gap-2 mt-1">
              <input type="number" step="0.1" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={eqTime} onChange={e => setEqTime(+e.target.value)} />
              <span className="text-sm text-slate-500 dark:text-slate-400">min</span>
            </div>
          </div>
        </div>
      </section>

      <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
        <Sunset size={20} /> 計算実行 (CALC)
      </button>
    </div>
  );
};
