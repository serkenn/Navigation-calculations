import { formatDMS } from '../../../utils/navigationMath';
import type { AltitudeCorrResult } from './AltitudeCorrCalc';

export const AltitudeCorrResultView = ({ result }: { result: AltitudeCorrResult }) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
    <div className="relative">
      <h3 className="text-sm font-bold bg-purple-700 text-white inline-block px-3 py-1 mb-3">Altitude Correction</h3>
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-3">
        <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <span>hs (六分儀高度)</span>
          <span className="font-mono font-bold">{formatDMS(result.hs, 'angle')}</span>
        </div>

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Dip (眼高差)</span>
            <span className="font-mono text-red-600 dark:text-red-400">-{result.dip.toFixed(1)}&apos;</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span>ha (視高度)</span>
            <span className="font-mono">{formatDMS(result.ha, 'angle')}</span>
          </div>
          <div className="flex justify-between">
            <span>Refraction (大気差)</span>
            <span className="font-mono text-red-600 dark:text-red-400">-{result.refraction.toFixed(1)}&apos;</span>
          </div>
          <div className="flex justify-between">
            <span>Parallax (視差)</span>
            <span className="font-mono text-green-600 dark:text-green-400">+{result.parallax.toFixed(1)}&apos;</span>
          </div>
          {result.sdCorr !== 0 && (
            <div className="flex justify-between">
              <span>SD (半径改正)</span>
              <span className={`font-mono ${result.sdCorr > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {result.sdCorr > 0 ? '+' : ''}{result.sdCorr.toFixed(1)}&apos;
              </span>
            </div>
          )}
        </div>

        <div className="border-t-2 border-slate-800 dark:border-slate-500 pt-3 mt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">Total Correction</span>
            <span className={`font-mono text-lg font-bold ${result.totalCorr >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {result.totalCorr >= 0 ? '+' : ''}{result.totalCorr.toFixed(1)}&apos;
            </span>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/40 p-4 text-center border border-purple-200 dark:border-purple-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">真高度 (Ho)</p>
          <p className="text-3xl font-mono font-bold text-purple-700 dark:text-purple-400">
            {formatDMS(result.ho, 'angle')}
          </p>
        </div>
      </div>
    </div>
  </div>
);
