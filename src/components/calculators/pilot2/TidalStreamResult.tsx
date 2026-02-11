import type { TidalStreamResult } from './TidalStreamCalc';

export const TidalStreamResultView = ({ result }: { result: TidalStreamResult }) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
    <div className="relative">
      <h3 className="text-sm font-bold bg-cyan-700 text-white inline-block px-3 py-1 mb-3">Tidal Stream</h3>
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Data 1</p>
            <p className="font-mono">Rate: {result.rate1.toFixed(1)} kn</p>
            <p className="font-mono">Dir: {result.dir1.toFixed(1)}&deg;</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Data 2</p>
            <p className="font-mono">Rate: {result.rate2.toFixed(1)} kn</p>
            <p className="font-mono">Dir: {result.dir2.toFixed(1)}&deg;</p>
          </div>
        </div>
        <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <span className="text-slate-500 dark:text-slate-400">補間比率</span>
          <span className="font-mono font-bold">{(result.fraction * 100).toFixed(0)}%</span>
        </div>
        <div className="bg-cyan-50 dark:bg-cyan-900/40 p-4 text-center border border-cyan-200 dark:border-cyan-800">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Direction</p>
              <p className="text-3xl font-mono font-bold text-cyan-700 dark:text-cyan-400">{result.dir.toFixed(1)}&deg;</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Rate</p>
              <p className="text-3xl font-mono font-bold text-cyan-700 dark:text-cyan-400">{result.rate.toFixed(1)}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">kn</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
