import { useState } from 'react';
import { Calculator, Clock, MapPin, ArrowRight, Sun } from 'lucide-react';
import { DMSInput } from '../../shared/DMSInput';
import type { DMSValue } from '../../../types/navigation';
import {
  toDecimal, calculateRun, calculateSightReduction,
  calculateTrueAltitude, calculateMeripass
} from '../../../utils/navigationMath';

export interface MeripassResult {
  lat1: number; lon1: number;
  gha1: number; lha1: number; hc1: number; z1: number; intercept1: number;
  dLat: number; dep: number; dLong: number; lat2_DR: number; lon2_DR: number;
  ho1: number; ho2: number; lat2_Obs: number;
  deltaL_miles: number; dLongCorr: number; lon2_Obs: number;
  lmtPass: number; gmtPass: number; ztPass: number;
  dec1: number; dec2: number; zoneOffset: number;
  // pass through for display
  course: number; dist: number;
  morningHs: DMSValue; morningTotalCorr: number; morningTotalCorrSign: number;
  morningGha: DMSValue; noonHs: DMSValue; noonTotalCorr: number; noonTotalCorrSign: number;
  noonEqTime: { m: number; s: number; sign: number };
}

export const MeripassCalc = ({ onResult }: { onResult: (r: MeripassResult) => void }) => {
  const [meta, setMeta] = useState({ month: 8, day: 19, zoneLong: 135, zoneDir: 1 });
  const [morning, setMorning] = useState({
    drLat: { d: 37, m: 20, dir: 1 } as DMSValue,
    drLong: { d: 146, m: 15, dir: 1 } as DMSValue,
    hs: { d: 48, m: 10.2, dir: 1 } as DMSValue,
    totalCorr: 9.6, totalCorrSign: 1,
    gha: { d: 315, m: 10.5, dir: 1 } as DMSValue,
    dec: { d: 13, m: 2.8, dir: 1 } as DMSValue,
  });
  const [run, setRun] = useState({ course: 64, dist: 45 });
  const [noon, setNoon] = useState({
    hs: { d: 65, m: 8.3, dir: 1 } as DMSValue,
    totalCorr: 9.8, totalCorrSign: 1,
    dec: { d: 13, m: 0.8, dir: 1 } as DMSValue,
    eqTime: { m: 3, s: 47, sign: -1 },
  });

  const handleCalculate = () => {
    const lat1 = toDecimal(morning.drLat.d, morning.drLat.m) * morning.drLat.dir;
    const lon1 = toDecimal(morning.drLong.d, morning.drLong.m) * morning.drLong.dir;
    const { ho: ho1 } = calculateTrueAltitude(toDecimal(morning.hs.d, morning.hs.m), morning.totalCorr * morning.totalCorrSign);
    const gha1 = toDecimal(morning.gha.d, morning.gha.m);
    let lha1 = gha1 + lon1;
    while (lha1 >= 360) lha1 -= 360;
    while (lha1 < 0) lha1 += 360;
    const dec1 = toDecimal(morning.dec.d, morning.dec.m) * morning.dec.dir;
    const { hc: hc1, Z: z1 } = calculateSightReduction(lat1, dec1, lha1);
    const intercept1 = (ho1 - hc1) * 60;
    const { dLat, dep, dLong, lat2: lat2_DR } = calculateRun(lat1, run.course, run.dist);
    let lon2_DR = lon1 + dLong;
    while (lon2_DR > 180) lon2_DR -= 360;
    while (lon2_DR <= -180) lon2_DR += 360;
    const { ho: ho2 } = calculateTrueAltitude(toDecimal(noon.hs.d, noon.hs.m), noon.totalCorr * noon.totalCorrSign);
    const dec2 = toDecimal(noon.dec.d, noon.dec.m) * noon.dec.dir;
    const zenithDist = 90 - ho2;
    const latCandidate1 = dec2 + zenithDist;
    const latCandidate2 = dec2 - zenithDist;
    const lat2_Obs = Math.abs(latCandidate1 - lat2_DR) < Math.abs(latCandidate2 - lat2_DR) ? latCandidate1 : latCandidate2;
    const deltaL_miles = (lat2_Obs - lat2_DR) * 60;
    const { dLongCorr } = calculateMeripass(intercept1, z1, deltaL_miles, lat2_DR);
    let lon2_Obs = lon2_DR + (dLongCorr / 60);
    while (lon2_Obs > 180) lon2_Obs -= 360;
    while (lon2_Obs <= -180) lon2_Obs += 360;
    const eqtHours = (noon.eqTime.m + noon.eqTime.s / 60) / 60 * noon.eqTime.sign;
    const lmtPass = 12 - eqtHours;
    const gmtPass = lmtPass - (lon2_DR / 15);
    const zoneOffset = Math.round(meta.zoneLong / 15) * meta.zoneDir;
    const ztPass = gmtPass + zoneOffset;

    onResult({
      lat1, lon1, gha1, lha1, dec1, ho1, hc1, z1, intercept1,
      dLat, dep, dLong, lat2_DR, lon2_DR, ho2, dec2, lat2_Obs,
      deltaL_miles, dLongCorr, lon2_Obs, lmtPass, gmtPass, ztPass, zoneOffset,
      course: run.course, dist: run.dist,
      morningHs: morning.hs, morningTotalCorr: morning.totalCorr, morningTotalCorrSign: morning.totalCorrSign,
      morningGha: morning.gha, noonHs: noon.hs, noonTotalCorr: noon.totalCorr, noonTotalCorrSign: noon.totalCorrSign,
      noonEqTime: noon.eqTime,
    });
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-blue-600 pl-3">Meripass Input</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">海技試験問題の値を入力してください</p>
      </header>

      {/* Date & Zone */}
      <section className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
        <div className="flex items-center gap-2 mb-3 text-slate-700 dark:text-slate-300 font-bold text-sm uppercase tracking-wider">
          <Clock size={16} /> Date & Zone
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex gap-2">
            <input type="number" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-blue-500 transition-colors" value={meta.month} onChange={e => setMeta({ ...meta, month: +e.target.value })} placeholder="月" />
            <span className="self-center text-slate-400">/</span>
            <input type="number" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-blue-500 transition-colors" value={meta.day} onChange={e => setMeta({ ...meta, day: +e.target.value })} placeholder="日" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">標準子午線 (Zone)</span>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded p-1 transition-colors">
              <input type="number" className="w-full text-right outline-none font-bold bg-transparent text-slate-900 dark:text-white" value={meta.zoneLong} onChange={e => setMeta({ ...meta, zoneLong: +e.target.value })} />
              <span className="text-xs text-slate-400">&deg;</span>
              <select className="bg-transparent font-bold text-sm outline-none text-slate-900 dark:text-white" value={meta.zoneDir} onChange={e => setMeta({ ...meta, zoneDir: +e.target.value })}>
                <option value={1} className="bg-white dark:bg-slate-800">E</option>
                <option value={-1} className="bg-white dark:bg-slate-800">W</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Morning Sight */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
        <div className="bg-blue-50/50 dark:bg-blue-900/20 px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 font-bold text-blue-800 dark:text-blue-300 text-sm">
          <MapPin size={16} /> 1. 第1観測 (Morning)
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <DMSInput label="推測緯度" value={morning.drLat} onChange={v => setMorning({ ...morning, drLat: v })} showSign signType="NS" />
            <DMSInput label="推測経度" value={morning.drLong} onChange={v => setMorning({ ...morning, drLong: v })} showSign signType="EW" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
            <DMSInput label="器械高度 (hs)" value={morning.hs} onChange={v => setMorning({ ...morning, hs: v })} />
            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">改正総数 (Corr)</label>
              <div className="flex items-center gap-1 mt-1">
                <select className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded p-1.5 text-sm font-bold text-slate-900 dark:text-white outline-none" value={morning.totalCorrSign} onChange={e => setMorning({ ...morning, totalCorrSign: +e.target.value })}>
                  <option value={1} className="bg-white dark:bg-slate-800">+</option><option value={-1} className="bg-white dark:bg-slate-800">-</option>
                </select>
                <input type="number" className="w-full p-1.5 border border-slate-300 dark:border-slate-600 rounded text-right text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={morning.totalCorr} onChange={e => setMorning({ ...morning, totalCorr: +e.target.value })} />
                <span className="text-xs text-slate-400">&apos;</span>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-4">
            <DMSInput label="GHA (Sun)" value={morning.gha} onChange={v => setMorning({ ...morning, gha: v })} />
            <DMSInput label="赤緯 (Dec)" value={morning.dec} onChange={v => setMorning({ ...morning, dec: v })} showSign signType="NS" />
          </div>
        </div>
      </section>

      {/* 2. Run */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
        <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 text-sm">
          <ArrowRight size={16} /> 2. 航走 (Run)
        </div>
        <div className="p-4 grid grid-cols-2 gap-6">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">真針路 (Course)</span>
            <div className="flex items-center gap-2 mt-1">
              <input type="number" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={run.course} onChange={e => setRun({ ...run, course: +e.target.value })} />
              <span className="text-sm text-slate-500 dark:text-slate-400">&deg;</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">航程 (Dist)</span>
            <div className="flex items-center gap-2 mt-1">
              <input type="number" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={run.dist} onChange={e => setRun({ ...run, dist: +e.target.value })} />
              <span className="text-sm text-slate-500 dark:text-slate-400">miles</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Noon Sight */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
        <div className="bg-orange-50/50 dark:bg-orange-900/20 px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 font-bold text-orange-800 dark:text-orange-300 text-sm">
          <Sun size={16} /> 3. 正中観測 (Noon)
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 pb-2 border-b border-dashed border-slate-200 dark:border-slate-700">
            <DMSInput label="赤緯 (Dec)" value={noon.dec} onChange={v => setNoon({ ...noon, dec: v })} showSign signType="NS" />
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Eq. of Time</span>
              <div className="flex items-center gap-1 mt-1">
                <select className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded p-1 text-sm text-slate-900 dark:text-white outline-none" value={noon.eqTime.sign} onChange={e => setNoon({ ...noon, eqTime: { ...noon.eqTime, sign: +e.target.value } })}>
                  <option value={1} className="bg-white dark:bg-slate-800">+</option><option value={-1} className="bg-white dark:bg-slate-800">-</option>
                </select>
                <input type="number" className="w-12 p-1 border border-slate-300 dark:border-slate-600 rounded text-right text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={noon.eqTime.m} onChange={e => setNoon({ ...noon, eqTime: { ...noon.eqTime, m: +e.target.value } })} placeholder="m" />
                <span className="text-xs text-slate-400">m</span>
                <input type="number" className="w-12 p-1 border border-slate-300 dark:border-slate-600 rounded text-right text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={noon.eqTime.s} onChange={e => setNoon({ ...noon, eqTime: { ...noon.eqTime, s: +e.target.value } })} placeholder="s" />
                <span className="text-xs text-slate-400">s</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 items-end">
            <DMSInput label="子午線高度 (hs)" value={noon.hs} onChange={v => setNoon({ ...noon, hs: v })} />
            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">改正総数 (Corr)</label>
              <div className="flex items-center gap-1 mt-1">
                <select className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded p-1.5 text-sm font-bold text-slate-900 dark:text-white outline-none" value={noon.totalCorrSign} onChange={e => setNoon({ ...noon, totalCorrSign: +e.target.value })}>
                  <option value={1} className="bg-white dark:bg-slate-800">+</option><option value={-1} className="bg-white dark:bg-slate-800">-</option>
                </select>
                <input type="number" className="w-full p-1.5 border border-slate-300 dark:border-slate-600 rounded text-right text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none" value={noon.totalCorr} onChange={e => setNoon({ ...noon, totalCorr: +e.target.value })} />
                <span className="text-xs text-slate-400">&apos;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
        <Calculator size={20} /> 計算実行 (RUN)
      </button>
    </div>
  );
};
