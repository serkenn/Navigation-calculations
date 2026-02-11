import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { hmsArithmetic } from '../../../utils/timeConversion';

export interface ArithmeticResult {
  h: number; m: number; s: number; sign: number; decimal: number;
  h1: number; m1: number; s1: number;
  op: string;
  h2: number; m2: number; s2: number;
}

export const ArithmeticCalc = ({ onResult }: { onResult: (r: ArithmeticResult) => void }) => {
  const [h1, setH1] = useState(12);
  const [m1, setM1] = useState(30);
  const [s1, setS1] = useState(0);
  const [op, setOp] = useState<'+' | '-' | '*' | '/'>( '+');
  const [h2, setH2] = useState(3);
  const [m2, setM2] = useState(15);
  const [s2, setS2] = useState(0);

  const handleCalculate = () => {
    const result = hmsArithmetic(h1, m1, s1, op, h2, m2, s2);
    onResult({ ...result, h1, m1, s1, op, h2, m2, s2 });
  };

  const inputClass = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded font-mono text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none";

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-rose-600 pl-3">時間の四則計算</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">時分秒形式の加減乗除</p>
      </header>

      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1 block">値 A</span>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-[10px] text-slate-400">h</span>
              <input type="number" className={inputClass} value={h1} onChange={e => setH1(+e.target.value)} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400">m</span>
              <input type="number" className={inputClass} value={m1} onChange={e => setM1(+e.target.value)} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400">s</span>
              <input type="number" className={inputClass} value={s1} onChange={e => setS1(+e.target.value)} />
            </div>
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1 block">演算子</span>
          <div className="flex gap-2">
            {(['+', '-', '*', '/'] as const).map(o => (
              <button
                key={o}
                onClick={() => setOp(o)}
                className={`flex-1 py-2 rounded-lg font-bold text-lg border transition-colors ${
                  op === o
                    ? 'bg-rose-100 dark:bg-rose-900/40 border-rose-400 text-rose-700 dark:text-rose-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1 block">値 B</span>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-[10px] text-slate-400">h</span>
              <input type="number" className={inputClass} value={h2} onChange={e => setH2(+e.target.value)} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400">m</span>
              <input type="number" className={inputClass} value={m2} onChange={e => setM2(+e.target.value)} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400">s</span>
              <input type="number" className={inputClass} value={s2} onChange={e => setS2(+e.target.value)} />
            </div>
          </div>
        </div>
      </section>

      <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
        <Calculator size={20} /> 計算実行 (CALC)
      </button>
    </div>
  );
};
