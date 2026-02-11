import { useState } from 'react';
import { Crosshair } from 'lucide-react';
import { DMSInput } from '../../shared/DMSInput';
import type { DMSValue } from '../../../types/navigation';
import { toDecimal, calculateSightReduction, calculateTrueAltitude } from '../../../utils/navigationMath';

export interface LOPResult {
  lat: number; lon: number;
  ho: number; hc: number; intercept: number;
  azimuth: number; lha: number;
  dec: number; gha: number;
}

export const LOPCalc = ({ onResult }: { onResult: (r: LOPResult) => void }) => {
  const [lat, setLat] = useState<DMSValue>({ d: 35, m: 0, dir: 1 });
  const [lon, setLon] = useState<DMSValue>({ d: 139, m: 45, dir: 1 });
  const [hs, setHs] = useState<DMSValue>({ d: 48, m: 10, dir: 1 });
  const [totalCorr, setTotalCorr] = useState(9.6);
  const [corrSign, setCorrSign] = useState(1);
  const [gha, setGha] = useState<DMSValue>({ d: 315, m: 10, dir: 1 });
  const [dec, setDec] = useState<DMSValue>({ d: 13, m: 3, dir: 1 });

  const handleCalculate = () => {
    const la = toDecimal(lat.d, lat.m) * lat.dir;
    const lo = toDecimal(lon.d, lon.m) * lon.dir;
    const { ho } = calculateTrueAltitude(toDecimal(hs.d, hs.m), totalCorr * corrSign);
    const ghaVal = toDecimal(gha.d, gha.m);
    const decVal = toDecimal(dec.d, dec.m) * dec.dir;
    let lha = ghaVal + lo;
    while (lha >= 360) lha -= 360;
    while (lha < 0) lha += 360;
    const { hc, Z } = calculateSightReduction(la, decVal, lha);
    const intercept = (ho - hc) * 60;

    onResult({ lat: la, lon: lo, ho, hc, intercept, azimuth: Z, lha, dec: decVal, gha: ghaVal });
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-amber-600 pl-3">位置の線</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">天体観測からインターセプトと方位角を求めます</p>
      </header>

      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="grid grid-cols-2 gap-4">
          <DMSInput label="推測緯度 (Lat)" value={lat} onChange={setLat} showSign signType="NS" />
          <DMSInput label="推測経度 (Lon)" value={lon} onChange={setLon} showSign signType="EW" />
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-dashed border-slate-200 dark:border-slate-700 pt-4">
          <DMSInput label="器械高度 (hs)" value={hs} onChange={setHs} />
          <div>
            <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">改正総数</label>
            <div className="flex items-center gap-1 mt-1">
              <select className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded p-1.5 text-sm font-bold text-slate-900 dark:text-white outline-none" value={corrSign} onChange={e => setCorrSign(+e.target.value)}>
                <option value={1} className="bg-white dark:bg-slate-800">+</option><option value={-1} className="bg-white dark:bg-slate-800">-</option>
              </select>
              <input type="number" className="w-full p-1.5 border border-slate-300 dark:border-slate-600 rounded text-right text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={totalCorr} onChange={e => setTotalCorr(+e.target.value)} />
              <span className="text-xs text-slate-400">&apos;</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-dashed border-slate-200 dark:border-slate-700 pt-4">
          <DMSInput label="GHA" value={gha} onChange={setGha} />
          <DMSInput label="赤緯 (Dec)" value={dec} onChange={setDec} showSign signType="NS" />
        </div>
      </section>

      <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
        <Crosshair size={20} /> 計算実行 (CALC)
      </button>
    </div>
  );
};
