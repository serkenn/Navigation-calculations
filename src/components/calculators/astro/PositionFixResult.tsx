import { formatDMS } from '../../../utils/navigationMath';
import type { PositionFixResult } from './PositionFixCalc';

export const PositionFixResultView = ({ result }: { result: PositionFixResult }) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
    <div className="relative">
      <h3 className="text-sm font-bold bg-amber-700 text-white inline-block px-3 py-1 mb-3">Position Fix</h3>
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">DR Position</p>
          <p className="font-mono">{formatDMS(result.drLat, 'lat')} / {formatDMS(result.drLon, 'lon')}</p>
        </div>

        <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {result.lops.map((lop, i) => (
            <div key={i} className="flex justify-between">
              <span>LOP {i + 1}</span>
              <span className="font-mono">
                I = {Math.abs(lop.intercept).toFixed(1)}&apos; {lop.intercept >= 0 ? 'T' : 'A'}, Z = {lop.azimuth.toFixed(1)}&deg;
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 border-4 border-double border-slate-800 dark:border-slate-400 p-4 text-center shadow-lg">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">FIX POSITION</p>
          <div className="flex justify-center gap-8 text-2xl font-bold text-amber-700 dark:text-amber-400 font-mono">
            <span>{formatDMS(result.fixLat, 'lat')}</span>
            <span>{formatDMS(result.fixLon, 'lon')}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
