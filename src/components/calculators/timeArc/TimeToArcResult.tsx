import type { TimeToArcResult } from './TimeToArcCalc';

export const TimeToArcResultView = ({ result }: { result: TimeToArcResult }) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
    <div className="relative">
      <h3 className="text-sm font-bold bg-green-700 text-white inline-block px-3 py-1 mb-3">Time → Arc Conversion</h3>
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-2">Input (Time)</p>
          <p className="text-xl font-mono font-bold text-slate-800 dark:text-white">
            {result.inputH}h {result.inputM}m {result.inputS}s
          </p>
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-2">Result (Arc)</p>
          <p className="text-3xl font-mono font-bold text-green-700 dark:text-green-400">
            {result.deg}&deg; {result.min}&apos; {result.sec}&quot;
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            = {result.totalDegrees.toFixed(4)}&deg; (10進数)
          </p>
        </div>
        <div className="text-xs text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-3 mt-3">
          <p>1h = 15&deg;, 1m = 15&apos;, 1s = 15&quot;</p>
        </div>
      </div>
    </div>
  </div>
);
