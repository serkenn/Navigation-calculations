import { formatDMS } from '../../../utils/navigationMath';
import type { LOPResult } from './LOPCalc';

export const LOPResultView = ({ result }: { result: LOPResult }) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
    <div className="relative">
      <h3 className="text-sm font-bold bg-amber-700 text-white inline-block px-3 py-1 mb-3">Line of Position</h3>
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-3">
        <div className="grid grid-cols-2 gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">DR Position</p>
            <p className="font-mono">{formatDMS(result.lat, 'lat')}</p>
            <p className="font-mono">{formatDMS(result.lon, 'lon')}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Celestial Data</p>
            <p className="font-mono">GHA: {formatDMS(result.gha, 'angle')}</p>
            <p className="font-mono">Dec: {formatDMS(result.dec, 'lat')}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between"><span>LHA</span> <span className="font-mono font-bold">{result.lha.toFixed(1)}&deg;</span></div>
          <div className="flex justify-between"><span>Ho (観測高度)</span> <span className="font-mono font-bold">{formatDMS(result.ho, 'angle')}</span></div>
          <div className="flex justify-between"><span>Hc (計算高度)</span> <span className="font-mono font-bold">{formatDMS(result.hc, 'angle')}</span></div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/40 p-4 text-center border border-amber-200 dark:border-amber-800 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Intercept</p>
              <p className="text-3xl font-mono font-bold text-amber-700 dark:text-amber-400">
                {Math.abs(result.intercept).toFixed(1)}&apos; {result.intercept >= 0 ? 'T' : 'A'}
              </p>
              <p className="text-xs text-slate-500 mt-1">{result.intercept >= 0 ? 'Towards' : 'Away'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Azimuth</p>
              <p className="text-3xl font-mono font-bold text-amber-700 dark:text-amber-400">
                {result.azimuth.toFixed(1)}&deg;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
