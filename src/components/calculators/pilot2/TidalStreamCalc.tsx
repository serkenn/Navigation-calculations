import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { NumberInput } from '../../shared/NumberInput';
import { tidalStream } from '../../../utils/tide';

export interface TidalStreamResult {
  rate1: number; dir1: number;
  rate2: number; dir2: number;
  fraction: number;
  rate: number; dir: number;
}

export const TidalStreamCalc = ({ onResult }: { onResult: (r: TidalStreamResult) => void }) => {
  const [rate1, setRate1] = useState(1.5);
  const [dir1, setDir1] = useState(90);
  const [rate2, setRate2] = useState(2.5);
  const [dir2, setDir2] = useState(120);
  const [fraction, setFraction] = useState(0.5);

  const handleCalculate = () => {
    const r = tidalStream(rate1, dir1, rate2, dir2, fraction);
    onResult({ rate1, dir1, rate2, dir2, fraction, rate: r.rate, dir: r.dir });
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-cyan-600 pl-3">潮流計算</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">2つの潮流データ間の補間計算を行います</p>
      </header>
      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">データ 1</div>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput label="流速 (Rate)" value={rate1} onChange={setRate1} unit="kn" step={0.1} />
          <NumberInput label="流向 (Dir)" value={dir1} onChange={setDir1} unit="°" step={1} />
        </div>
      </section>
      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">データ 2</div>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput label="流速 (Rate)" value={rate2} onChange={setRate2} unit="kn" step={0.1} />
          <NumberInput label="流向 (Dir)" value={dir2} onChange={setDir2} unit="°" step={1} />
        </div>
      </section>
      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <NumberInput label="補間比率 (0.0〜1.0)" value={fraction} onChange={setFraction} unit="" step={0.1} />
      </section>
      <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
        <RotateCcw size={20} /> 計算実行 (CALC)
      </button>
    </div>
  );
};
