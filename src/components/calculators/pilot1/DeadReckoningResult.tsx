import { formatDMS } from '../../../utils/navigationMath';
import type { DeadReckoningResult } from './DeadReckoningCalc';

export const DeadReckoningResultView = ({ result }: { result: DeadReckoningResult }) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
    <div className="relative">
      <h3 className="text-sm font-bold bg-blue-700 text-white inline-block px-3 py-1 mb-3">Dead Reckoning</h3>
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">Departure</p>
          <p className="font-mono">{formatDMS(result.lat1, 'lat')} / {formatDMS(result.lon1, 'lon')}</p>
          <p className="mt-1">Course: {result.course}&deg; / Distance: {result.distance} NM</p>
        </div>

        <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex justify-between"><span>D.Lat</span> <span className="font-mono">{(result.dLat * 60).toFixed(1)}&apos; {result.dLat >= 0 ? 'N' : 'S'}</span></div>
          <div className="flex justify-between"><span>Dep</span> <span className="font-mono">{result.dep.toFixed(1)}&apos;</span></div>
          <div className="flex justify-between"><span>D.Lon</span> <span className="font-mono">{(result.dLon * 60).toFixed(1)}&apos; {result.dLon >= 0 ? 'E' : 'W'}</span></div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/40 p-4 text-center border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">到着点 (Arrival Position)</p>
          <div className="flex justify-center gap-8 text-2xl font-mono font-bold text-blue-700 dark:text-blue-400">
            <span>{formatDMS(result.lat2, 'lat')}</span>
            <span>{formatDMS(result.lon2, 'lon')}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
