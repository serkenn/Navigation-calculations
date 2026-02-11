import type { ETAResult } from './ETACalc';

export const ETAResultView = ({ result }: { result: ETAResult }) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
    <div className="relative">
      <h3 className="text-sm font-bold bg-blue-700 text-white inline-block px-3 py-1 mb-3">ETA Calculation</h3>
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Distance</span> <span className="font-mono font-bold">{result.distance} NM</span></div>
          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Speed</span> <span className="font-mono font-bold">{result.speed} kn</span></div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>航海時間</span>
            <span className="font-mono font-bold">{result.travelH}h {result.travelM}m</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>(decimal)</span>
            <span>{result.travelTimeHours.toFixed(2)} hours</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t-2 border-slate-800 dark:border-slate-500">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-slate-600 dark:text-slate-300">出発時刻</span>
            <span className="font-mono text-lg">{String(result.depH).padStart(2, '0')}:{String(result.depM).padStart(2, '0')}</span>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/40 p-4 text-center border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">到着予定時刻 (ETA)</p>
            <p className="text-3xl font-mono font-bold text-blue-700 dark:text-blue-400">
              {result.etaDays > 0 && <span className="text-lg">+{result.etaDays}日 </span>}
              {String(result.etaH).padStart(2, '0')}:{String(result.etaM).padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
