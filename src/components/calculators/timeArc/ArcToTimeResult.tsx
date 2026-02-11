import type { ArcToTimeResult } from './ArcToTimeCalc';

export const ArcToTimeResultView = ({ result }: { result: ArcToTimeResult }) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
    <div className="relative">
      <h3 className="text-sm font-bold bg-green-700 text-white inline-block px-3 py-1 mb-3">Arc → Time Conversion</h3>
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-2">Input (Arc)</p>
          <p className="text-xl font-mono font-bold text-slate-800 dark:text-white">
            {result.inputDeg}&deg; {result.inputMin}&apos; {result.inputSec}&quot;
          </p>
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-2">Result (Time)</p>
          <p className="text-3xl font-mono font-bold text-green-700 dark:text-green-400">
            {result.h}h {result.m}m {result.s}s
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            = {result.totalHours.toFixed(4)} hours (10進数)
          </p>
        </div>
        <div className="text-xs text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-3 mt-3">
          <p>15&deg; = 1h, 15&apos; = 1m, 15&quot; = 1s</p>
        </div>
      </div>
    </div>
  </div>
);
