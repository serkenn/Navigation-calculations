import type { ToHMSResult } from './ToHMSCalc';

export const ToHMSResultView = ({ result }: { result: ToHMSResult }) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
    <div className="relative">
      <h3 className="text-sm font-bold bg-rose-700 text-white inline-block px-3 py-1 mb-3">Decimal → HMS</h3>
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-2">Input (Decimal)</p>
          <p className="text-xl font-mono font-bold text-slate-800 dark:text-white">
            {result.inputDecimal} hours
          </p>
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-2">Result (HMS)</p>
          <p className="text-3xl font-mono font-bold text-rose-700 dark:text-rose-400">
            {result.sign < 0 ? '-' : ''}{result.h}h {result.m}m {result.s}s
          </p>
        </div>
      </div>
    </div>
  </div>
);
