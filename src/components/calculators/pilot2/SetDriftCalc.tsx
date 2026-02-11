import { useState } from 'react';
import { Waves } from 'lucide-react';
import { NumberInput } from '../../shared/NumberInput';
import { setAndDrift } from '../../../utils/currentVector';

export interface SetDriftResult {
  shipCourse: number; shipSpeed: number;
  cmg: number; smg: number;
  setDir: number; drift: number;
}

export const SetDriftCalc = ({ onResult }: { onResult: (r: SetDriftResult) => void }) => {
  const [shipCourse, setShipCourse] = useState(45);
  const [shipSpeed, setShipSpeed] = useState(12);
  const [cmg, setCmg] = useState(50);
  const [smg, setSmg] = useState(13);

  const handleCalculate = () => {
    const r = setAndDrift(shipCourse, shipSpeed, cmg, smg);
    onResult({ shipCourse, shipSpeed, cmg, smg, setDir: r.setDir, drift: r.drift });
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-cyan-600 pl-3">流向・流速</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">船の針路・速力とCMG/SMGから流向・流速を計算</p>
      </header>
      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">船の針路・速力</div>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput label="針路 (Course)" value={shipCourse} onChange={setShipCourse} unit="°" step={0.1} />
          <NumberInput label="速力 (Speed)" value={shipSpeed} onChange={setShipSpeed} unit="kn" step={0.1} />
        </div>
      </section>
      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">実航 (Ground Track)</div>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput label="CMG" value={cmg} onChange={setCmg} unit="°" step={0.1} />
          <NumberInput label="SMG" value={smg} onChange={setSmg} unit="kn" step={0.1} />
        </div>
      </section>
      <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
        <Waves size={20} /> 計算実行 (CALC)
      </button>
    </div>
  );
};
