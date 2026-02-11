import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { PositionInput } from '../../shared/PositionInput';
import type { DMSValue } from '../../../types/navigation';
import { toDecimal } from '../../../utils/navigationMath';
import { mercatorDeadReckoning } from '../../../utils/mercatorSailing';

export interface DeadReckoningResult {
  lat1: number; lon1: number;
  lat2: number; lon2: number;
  course: number; distance: number;
  dLat: number; dLon: number; dep: number;
}

export const DeadReckoningCalc = ({ onResult }: { onResult: (r: DeadReckoningResult) => void }) => {
  const [lat1, setLat1] = useState<DMSValue>({ d: 35, m: 0, dir: 1 });
  const [lon1, setLon1] = useState<DMSValue>({ d: 139, m: 45, dir: 1 });
  const [course, setCourse] = useState(225);
  const [distance, setDistance] = useState(120);

  const handleCalculate = () => {
    const la1 = toDecimal(lat1.d, lat1.m) * lat1.dir;
    const lo1 = toDecimal(lon1.d, lon1.m) * lon1.dir;
    const result = mercatorDeadReckoning(la1, lo1, course, distance);
    onResult({ lat1: la1, lon1: lo1, course, distance, ...result });
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-blue-600 pl-3">到着点</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">出発位置、針路、航程から到着点を計算します</p>
      </header>

      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">出発点 (From)</div>
        <PositionInput lat={lat1} lon={lon1} onChangeLat={setLat1} onChangeLon={setLon1} />
      </section>

      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">針路・航程</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">針路 (Course)</span>
            <div className="flex items-center gap-2 mt-1">
              <input type="number" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={course} onChange={e => setCourse(+e.target.value)} />
              <span className="text-sm text-slate-500">&deg;</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">航程 (Distance)</span>
            <div className="flex items-center gap-2 mt-1">
              <input type="number" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={distance} onChange={e => setDistance(+e.target.value)} />
              <span className="text-sm text-slate-500">NM</span>
            </div>
          </div>
        </div>
      </section>

      <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
        <MapPin size={20} /> 計算実行 (CALC)
      </button>
    </div>
  );
};
