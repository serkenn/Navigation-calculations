import { useState } from 'react';
import { Globe } from 'lucide-react';
import { PositionInput } from '../../shared/PositionInput';
import type { DMSValue } from '../../../types/navigation';
import { toDecimal } from '../../../utils/navigationMath';
import { greatCircleSailing } from '../../../utils/greatCircle';

export interface GreatCircleResult {
  lat1: number; lon1: number;
  lat2: number; lon2: number;
  distance: number; course: number; latVertex: number;
}

export const GreatCircleCalc = ({ onResult }: { onResult: (r: GreatCircleResult) => void }) => {
  const [lat1, setLat1] = useState<DMSValue>({ d: 35, m: 0, dir: 1 });
  const [lon1, setLon1] = useState<DMSValue>({ d: 139, m: 45, dir: 1 });
  const [lat2, setLat2] = useState<DMSValue>({ d: 37, m: 47, dir: 1 });
  const [lon2, setLon2] = useState<DMSValue>({ d: 122, m: 25, dir: -1 });

  const handleCalculate = () => {
    const la1 = toDecimal(lat1.d, lat1.m) * lat1.dir;
    const lo1 = toDecimal(lon1.d, lon1.m) * lon1.dir;
    const la2 = toDecimal(lat2.d, lat2.m) * lat2.dir;
    const lo2 = toDecimal(lon2.d, lon2.m) * lon2.dir;
    const r = greatCircleSailing(la1, lo1, la2, lo2);
    onResult({ lat1: la1, lon1: lo1, lat2: la2, lon2: lo2, distance: r.distance, course: r.course, latVertex: r.latVertex });
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-blue-600 pl-3">大圏航法</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">2地点間の大圏距離と初針路を計算します</p>
      </header>
      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">出発点 (From)</div>
        <PositionInput lat={lat1} lon={lon1} onChangeLat={setLat1} onChangeLon={setLon1} />
      </section>
      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">到着点 (To)</div>
        <PositionInput lat={lat2} lon={lon2} onChangeLat={setLat2} onChangeLon={setLon2} />
      </section>
      <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
        <Globe size={20} /> 計算実行 (CALC)
      </button>
    </div>
  );
};
