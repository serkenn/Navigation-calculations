import { useState } from 'react';
import { Compass } from 'lucide-react';
import { DMSInput } from '../../shared/DMSInput';
import type { DMSValue } from '../../../types/navigation';
import { toDecimal, calculateAmplitude, calculateGyroError } from '../../../utils/navigationMath';

export interface GyroResult {
  trueAzimuthBase: number;
  trueAzimuth360: number;
  gyroError: number;
  direction: 'Rise' | 'Set';
  gyroAzimuth: number;
}

export const GyroAmplitudeCalc = ({ onResult }: { onResult: (r: GyroResult) => void }) => {
  const [gyroInput, setGyroInput] = useState({
    lat: { d: 35, m: 0, dir: 1 } as DMSValue,
    dec: { d: 10, m: 0, dir: 1 } as DMSValue,
    gyroAzimuth: 0,
    type: 'rise' as 'rise' | 'set',
  });

  const handleCalculate = () => {
    const lat = toDecimal(gyroInput.lat.d, gyroInput.lat.m) * gyroInput.lat.dir;
    const dec = toDecimal(gyroInput.dec.d, gyroInput.dec.m) * gyroInput.dec.dir;
    const Z = calculateAmplitude(lat, dec);
    let trueAzimuth360 = Z;
    if (gyroInput.type === 'set') {
      trueAzimuth360 = 360 - Z;
    }
    const gyroError = calculateGyroError(trueAzimuth360, gyroInput.gyroAzimuth);

    onResult({
      trueAzimuthBase: Z,
      trueAzimuth360,
      gyroError,
      direction: gyroInput.type === 'rise' ? 'Rise' : 'Set',
      gyroAzimuth: gyroInput.gyroAzimuth,
    });
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-emerald-600 pl-3">Gyro & Amplitude</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">出没方位角とジャイロ誤差を算出します</p>
      </header>

      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 transition-colors">
        <div className="grid grid-cols-2 gap-4">
          <DMSInput label="推測緯度 (Lat)" value={gyroInput.lat} onChange={v => setGyroInput({ ...gyroInput, lat: v })} showSign signType="NS" />
          <DMSInput label="赤緯 (Dec)" value={gyroInput.dec} onChange={v => setGyroInput({ ...gyroInput, dec: v })} showSign signType="NS" />
        </div>

        <div>
          <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block uppercase mb-1">Calculation Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => setGyroInput({ ...gyroInput, type: 'rise' })}
              className={`flex-1 py-2 px-4 rounded-lg font-bold border transition-colors ${gyroInput.type === 'rise' ? 'bg-orange-100 dark:bg-orange-900/40 border-orange-400 text-orange-700 dark:text-orange-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400'}`}
            >
              日出 (Sunrise)
            </button>
            <button
              onClick={() => setGyroInput({ ...gyroInput, type: 'set' })}
              className={`flex-1 py-2 px-4 rounded-lg font-bold border transition-colors ${gyroInput.type === 'set' ? 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-400 text-indigo-700 dark:text-indigo-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400'}`}
            >
              日没 (Sunset)
            </button>
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Gyro Azimuth</span>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="number"
              className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded font-mono text-lg font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              value={gyroInput.gyroAzimuth}
              onChange={e => setGyroInput({ ...gyroInput, gyroAzimuth: +e.target.value })}
              placeholder="000.0"
            />
            <span className="text-sm font-bold text-slate-800 dark:text-white">&deg;</span>
          </div>
        </div>

        <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
          <Compass size={20} /> 計算実行 (CALC)
        </button>
      </section>
    </div>
  );
};
