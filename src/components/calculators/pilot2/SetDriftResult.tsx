import type { SetDriftResult } from './SetDriftCalc';

export const SetDriftResultView = ({ result }: { result: SetDriftResult }) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
    <div className="relative">
      <h3 className="text-sm font-bold bg-cyan-700 text-white inline-block px-3 py-1 mb-3">Set & Drift</h3>
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Ship</p>
            <p className="font-mono">Co: {result.shipCourse.toFixed(1)}&deg;</p>
            <p className="font-mono">Spd: {result.shipSpeed.toFixed(1)} kn</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Ground Track</p>
            <p className="font-mono">CMG: {result.cmg.toFixed(1)}&deg;</p>
            <p className="font-mono">SMG: {result.smg.toFixed(1)} kn</p>
          </div>
        </div>
        <div className="bg-cyan-50 dark:bg-cyan-900/40 p-4 text-center border border-cyan-200 dark:border-cyan-800">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Set (流向)</p>
              <p className="text-3xl font-mono font-bold text-cyan-700 dark:text-cyan-400">{result.setDir.toFixed(1)}&deg;</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Drift (流速)</p>
              <p className="text-3xl font-mono font-bold text-cyan-700 dark:text-cyan-400">{result.drift.toFixed(1)}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">kn</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
