import { formatDMS } from '../../../utils/navigationMath';
import type { MeripassResult } from './MeripassCalc';

export const MeripassResultView = ({ result }: { result: MeripassResult }) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
    {/* 1. Run Calculation */}
    <div className="relative">
      <h3 className="text-sm font-bold bg-slate-800 dark:bg-slate-700 text-white inline-block px-3 py-1 mb-3">1. D.R.P at Noon</h3>
      <div className="grid grid-cols-2 gap-8 text-sm border-l-2 border-slate-300 dark:border-slate-700 pl-4">
        <div className="space-y-1">
          <div className="flex justify-between"><span>Course</span> <span>{result.course}&deg;</span></div>
          <div className="flex justify-between"><span>Dist</span> <span>{result.dist}&apos;</span></div>
          <div className="flex justify-between border-t border-slate-300 dark:border-slate-700 pt-1 mt-1"><span>Dep</span> <span>{result.dep.toFixed(1)}&apos;</span></div>
          <div className="flex justify-between"><span>D.Lat</span> <span>{result.dLat >= 0 ? 'N' : 'S'} {(Math.abs(result.dLat) * 60).toFixed(1)}&apos;</span></div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between"><span>Lat1</span> <span>{formatDMS(result.lat1, 'lat')}</span></div>
          <div className="flex justify-between"><span>D.Lat</span> <span>{result.dLat >= 0 ? '+' : '-'}{(Math.abs(result.dLat) * 60).toFixed(1)}&apos;</span></div>
          <div className="flex justify-between font-bold border-t border-slate-800 dark:border-slate-500 pt-1"><span>Lat2 (DR)</span> <span>{formatDMS(result.lat2_DR, 'lat')}</span></div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2"><span>(Mean Lat)</span> <span>{formatDMS((result.lat1 + result.lat2_DR) / 2, 'lat')}</span></div>
        </div>
      </div>
      <div className="mt-2 text-right text-sm border-t border-slate-200 dark:border-slate-800 pt-2">
        <span className="mr-4">Long1: {formatDMS(result.lon1, 'lon')}</span>
        <span className="mr-4">D.Long: {result.dLong >= 0 ? '+' : '-'}{(Math.abs(result.dLong) * 60).toFixed(1)}&apos;</span>
        <span className="font-bold">Long2 (DR): {formatDMS(result.lon2_DR, 'lon')}</span>
      </div>
    </div>

    {/* 2. Time of Passage */}
    <div className="relative">
      <h3 className="text-sm font-bold bg-slate-800 dark:bg-slate-700 text-white inline-block px-3 py-1 mb-3">2. Time of Mer. Pass</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-l-2 border-slate-300 dark:border-slate-700 pl-4 text-sm">
        <div className="space-y-1">
          <div className="flex justify-between"><span>L.A.T. Noon</span> <span>12-00-00</span></div>
          <div className="flex justify-between"><span>Eq. of T.</span> <span>{result.noonEqTime.sign < 0 ? '+' : '-'} {String(result.noonEqTime.m).padStart(2, '0')}-{String(result.noonEqTime.s).padStart(2, '0')}</span></div>
          <div className="flex justify-between border-t border-slate-400 dark:border-slate-600"><span>L.M.T. Pass</span> <span>{Math.floor(result.lmtPass)}h {Math.floor((result.lmtPass % 1) * 60)}m</span></div>
          <div className="flex justify-between"><span>Long (Time)</span> <span>{result.lon2_DR >= 0 ? '-' : '+'} {Math.floor(Math.abs(result.lon2_DR) / 15)}h {Math.floor((Math.abs(result.lon2_DR) / 15 % 1) * 60)}m</span></div>
          <div className="flex justify-between border-t border-slate-400 dark:border-slate-600 font-bold"><span>G.M.T.</span> <span>{Math.floor(result.gmtPass)}h {Math.floor((result.gmtPass % 1) * 60)}m {Math.floor((result.gmtPass * 3600) % 60)}s</span></div>
        </div>
        <div className="flex items-center justify-center">
          <div className="text-center p-4 border-2 border-double border-slate-400 dark:border-slate-600 rounded">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Standard Time (ZT)</div>
            <div className="text-xl font-bold">{Math.floor(result.ztPass)}h {Math.floor((result.ztPass % 1) * 60)}m {Math.floor((result.ztPass * 3600) % 60)}s</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Zone Offset: {result.zoneOffset > 0 ? '+' : ''}{result.zoneOffset}</div>
          </div>
        </div>
      </div>
    </div>

    {/* 3. Sights */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-sm font-bold bg-blue-700 text-white inline-block px-3 py-1 mb-3">3. Morning Sight</h3>
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-4 text-sm space-y-1 shadow-sm">
          <div className="flex justify-between"><span>hs</span> <span>{result.morningHs.d}-{result.morningHs.m}</span></div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span>(Total Corr)</span> <span>{result.morningTotalCorrSign >= 0 ? '+' : '-'}{result.morningTotalCorr}&apos;</span></div>
          <div className="flex justify-between font-bold border-b border-slate-300 dark:border-slate-700 pb-1 mb-1"><span>Ho</span> <span>{formatDMS(result.ho1, 'angle')}</span></div>
          <div className="flex justify-between"><span>GHA</span> <span>{result.morningGha.d}&deg; {result.morningGha.m}&apos;</span></div>
          <div className="flex justify-between"><span>Long</span> <span>{result.lon1 >= 0 ? '+' : '-'}{formatDMS(Math.abs(result.lon1), 'angle')}</span></div>
          <div className="flex justify-between font-bold"><span>LHA (t)</span> <span>{result.lha1.toFixed(1)}&deg;</span></div>
          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="flex justify-between"><span>Lat</span> <span>{formatDMS(result.lat1, 'lat')}</span></div>
            <div className="flex justify-between"><span>Dec</span> <span>{formatDMS(result.dec1, 'lat')}</span></div>
            <div className="flex justify-between mt-1 font-bold"><span>Hc</span> <span>{formatDMS(result.hc1, 'angle')}</span></div>
            <div className="flex justify-between font-bold"><span>Az (Z)</span> <span>{result.z1.toFixed(1)}&deg;</span></div>
          </div>
          <div className="mt-3 bg-blue-50 dark:bg-blue-900/40 p-2 text-center border border-blue-200 dark:border-blue-800 font-bold text-blue-900 dark:text-blue-200">
            Intercept: {result.intercept1.toFixed(1)}&apos; {result.intercept1 >= 0 ? 'T' : 'A'}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold bg-orange-700 text-white inline-block px-3 py-1 mb-3">4. Noon Sight</h3>
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-4 text-sm space-y-1 shadow-sm">
          <div className="flex justify-between"><span>hs</span> <span>{result.noonHs.d}-{result.noonHs.m}</span></div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span>(Corr)</span> <span>{result.noonTotalCorrSign >= 0 ? '+' : '-'}{result.noonTotalCorr}&apos;</span></div>
          <div className="flex justify-between font-bold border-b border-slate-300 dark:border-slate-700 pb-1 mb-1"><span>Ho</span> <span>{formatDMS(result.ho2, 'angle')}</span></div>
          <div className="flex justify-between"><span>90&deg; - Ho</span> <span>{formatDMS(90 - result.ho2, 'angle')} (z)</span></div>
          <div className="flex justify-between"><span>Dec</span> <span>{formatDMS(result.dec2, 'lat')}</span></div>
          <div className="flex justify-between font-bold border-t border-slate-300 dark:border-slate-700 pt-1 mt-1"><span>Obs Lat</span> <span>{formatDMS(result.lat2_Obs, 'lat')}</span></div>
        </div>
      </div>
    </div>

    {/* 5. Fix */}
    <div className="relative">
      <h3 className="text-sm font-bold bg-slate-800 dark:bg-slate-700 text-white inline-block px-3 py-1 mb-3">5. Fix (Meripass)</h3>
      <div className="bg-slate-100 dark:bg-slate-800/60 border-2 border-slate-400 dark:border-slate-600 p-6">
        <div className="flex justify-around items-center mb-4 text-sm">
          <div><p className="font-bold">&Delta;l (Lat Diff)</p><p>{(result.lat2_Obs - result.lat2_DR) * 60 >= 0 ? '+' : ''}{((result.lat2_Obs - result.lat2_DR) * 60).toFixed(1)}&apos;</p></div>
          <div><p className="font-bold">Intercept (I)</p><p>{result.intercept1.toFixed(1)}&apos;</p></div>
          <div><p className="font-bold">Azimuth (Z)</p><p>{result.z1.toFixed(1)}&deg;</p></div>
        </div>
        <div className="text-center mb-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Calculation Formula</p>
          <p className="font-serif italic text-lg">&Delta;L = ( I &middot; csc Z - &Delta;l &middot; cot Z ) sec l&#8320;</p>
          <p className="font-bold text-red-600 dark:text-red-400 text-xl mt-2">D.Long Correction: {result.dLongCorr.toFixed(1)}&apos;</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border-4 border-double border-slate-800 dark:border-slate-400 p-4 text-center shadow-lg">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">FIX AT NOON</p>
          <div className="flex justify-center gap-8 text-2xl font-bold text-slate-900 dark:text-white">
            <span>{formatDMS(result.lat2_Obs, 'lat')}</span>
            <span>{formatDMS(result.lon2_Obs, 'lon')}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
