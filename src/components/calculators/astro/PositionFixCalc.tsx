import { useState } from 'react';
import { Anchor } from 'lucide-react';
import { DMSInput } from '../../shared/DMSInput';
import type { DMSValue } from '../../../types/navigation';
import { toDecimal, rad } from '../../../utils/navigationMath';

export interface PositionFixResult {
  drLat: number; drLon: number;
  fixLat: number; fixLon: number;
  lops: { intercept: number; azimuth: number }[];
}

export const PositionFixCalc = ({ onResult }: { onResult: (r: PositionFixResult) => void }) => {
  const [drLat, setDrLat] = useState<DMSValue>({ d: 35, m: 0, dir: 1 });
  const [drLon, setDrLon] = useState<DMSValue>({ d: 139, m: 45, dir: 1 });
  const [i1, setI1] = useState(5.2);
  const [z1, setZ1] = useState(45);
  const [i2, setI2] = useState(-3.1);
  const [z2, setZ2] = useState(135);

  const handleCalculate = () => {
    const la = toDecimal(drLat.d, drLat.m) * drLat.dir;
    const lo = toDecimal(drLon.d, drLon.m) * drLon.dir;

    // 2 LOP intersection using intercept & azimuth
    const z1R = rad(z1), z2R = rad(z2);
    // dLat from each LOP: intercept * cos(Z), dLon contribution: intercept * sin(Z)
    // Least squares for 2 LOPs:
    // A matrix: [[cos(Z1), sin(Z1)], [cos(Z2), sin(Z2)]] * [dLat, dLon] = [I1, I2]
    const a11 = Math.cos(z1R), a12 = Math.sin(z1R);
    const a21 = Math.cos(z2R), a22 = Math.sin(z2R);
    const det = a11 * a22 - a12 * a21;

    let dLatMin = 0, dLonMin = 0;
    if (Math.abs(det) > 0.001) {
      dLatMin = (i1 * a22 - i2 * a12) / det;
      dLonMin = (a11 * i2 - a21 * i1) / det;
    }

    const fixLat = la + dLatMin / 60;
    const fixLon = lo + dLonMin / (60 * Math.cos(rad(la)));

    onResult({
      drLat: la, drLon: lo, fixLat, fixLon,
      lops: [{ intercept: i1, azimuth: z1 }, { intercept: i2, azimuth: z2 }],
    });
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-amber-600 pl-3">船位決定</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">2本のLOPから船位を決定します</p>
      </header>

      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">推測位置 (DR)</div>
        <div className="grid grid-cols-2 gap-4">
          <DMSInput label="緯度 (Lat)" value={drLat} onChange={setDrLat} showSign signType="NS" />
          <DMSInput label="経度 (Lon)" value={drLon} onChange={setDrLon} showSign signType="EW" />
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">LOP 1</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Intercept (&apos;)</span>
            <input type="number" step="0.1" className="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={i1} onChange={e => setI1(+e.target.value)} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Azimuth (&deg;)</span>
            <input type="number" step="0.1" className="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={z1} onChange={e => setZ1(+e.target.value)} />
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">LOP 2</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Intercept (&apos;)</span>
            <input type="number" step="0.1" className="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={i2} onChange={e => setI2(+e.target.value)} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Azimuth (&deg;)</span>
            <input type="number" step="0.1" className="w-full p-2 mt-1 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={z2} onChange={e => setZ2(+e.target.value)} />
          </div>
        </div>
      </section>

      <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
        <Anchor size={20} /> 計算実行 (CALC)
      </button>
    </div>
  );
};
