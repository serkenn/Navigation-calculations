import { useState } from 'react';
import { Star } from 'lucide-react';
import { DMSInput } from '../../shared/DMSInput';
import type { DMSValue } from '../../../types/navigation';
import { toDecimal } from '../../../utils/navigationMath';
import { starAltAz } from '../../../utils/astronomy';
import { navigationStars } from '../../../data/stars';

export interface StarFinderEntry {
  name: string; alt: number; az: number; sha: number; dec: number;
}

export interface StarFinderResult {
  lat: number; ghaAries: number;
  stars: StarFinderEntry[];
}

export const StarFinderCalc = ({ onResult }: { onResult: (r: StarFinderResult) => void }) => {
  const [lat, setLat] = useState<DMSValue>({ d: 35, m: 0, dir: 1 });
  const [ghaAries, setGhaAries] = useState(45);
  const [minAlt, setMinAlt] = useState(15);
  const [maxAlt, setMaxAlt] = useState(75);

  const handleCalculate = () => {
    const la = toDecimal(lat.d, lat.m) * lat.dir;
    const stars: StarFinderEntry[] = [];

    for (const star of navigationStars) {
      let lha = ghaAries + star.sha;
      while (lha >= 360) lha -= 360;
      while (lha < 0) lha += 360;
      const { alt, az } = starAltAz(la, star.dec, lha);
      if (alt >= minAlt && alt <= maxAlt) {
        stars.push({ name: star.name, alt, az, sha: star.sha, dec: star.dec });
      }
    }
    stars.sort((a, b) => b.alt - a.alt);

    onResult({ lat: la, ghaAries, stars });
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-amber-600 pl-3">索星</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">観測可能な恒星の高度と方位を計算します</p>
      </header>

      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="grid grid-cols-2 gap-4">
          <DMSInput label="推測緯度 (Lat)" value={lat} onChange={setLat} showSign signType="NS" />
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">GHA Aries</span>
            <div className="flex items-center gap-2 mt-1">
              <input type="number" step="0.1" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={ghaAries} onChange={e => setGhaAries(+e.target.value)} />
              <span className="text-sm text-slate-500">&deg;</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-dashed border-slate-200 dark:border-slate-700 pt-4">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">最低高度 (&deg;)</span>
            <input type="number" className="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={minAlt} onChange={e => setMinAlt(+e.target.value)} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">最高高度 (&deg;)</span>
            <input type="number" className="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={maxAlt} onChange={e => setMaxAlt(+e.target.value)} />
          </div>
        </div>
      </section>

      <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
        <Star size={20} /> 計算実行 (CALC)
      </button>
    </div>
  );
};
