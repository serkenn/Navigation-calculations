/** 入力欄の共通クラス（枠・背景・文字）。未入力（aria-invalid）の欄は赤枠にする */
export const boxClass =
  "flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 h-10 transition-colors has-[[aria-invalid=true]]:border-rose-400 has-[[aria-invalid=true]]:bg-rose-50 dark:has-[[aria-invalid=true]]:bg-rose-900/20";

export const inputClass =
  "min-w-0 w-full bg-transparent outline-none font-mono text-sm text-right text-slate-900 dark:text-white placeholder-slate-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

export const unitClass =
  "shrink-0 text-xs text-slate-400 dark:text-slate-500 font-mono";

export const selectClass =
  "shrink-0 bg-transparent outline-none font-bold text-sm text-slate-700 dark:text-slate-200 cursor-pointer";
