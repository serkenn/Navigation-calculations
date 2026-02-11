import { useState } from 'react';
import { Compass } from 'lucide-react';
import { NumberInput } from '../../shared/NumberInput';
import { courseToSteerSMG } from '../../../utils/currentVector';

export interface CourseSteerSMGResult {
  requiredCMG: number; shipSpeed: number;
  setDir: number; driftSpeed: number;
  shipCourse: number; smg: number; possible: boolean;
}

export const CourseSteerSMGCalc = ({ onResult }: { onResult: (r: CourseSteerSMGResult) => void }) => {
  const [requiredCMG, setRequiredCMG] = useState(90);
  const [shipSpeed, setShipSpeed] = useState(12);
  const [setDir, setSetDir] = useState(180);
  const [driftSpeed, setDriftSpeed] = useState(2);

  const handleCalculate = () => {
    const r = courseToSteerSMG(requiredCMG, shipSpeed, setDir, driftSpeed);
    onResult({ requiredCMG, shipSpeed, setDir, driftSpeed, shipCourse: r.shipCourse, smg: r.smg, possible: r.possible });
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-l-4 border-cyan-600 pl-3">視針路・実航速力</h2>
        <p className="text-xs text-slate-400 mt-1 pl-4">船速固定で目標CMG方向へ進む視針路とSMGを計算</p>
      </header>
      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">条件</div>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput label="目標CMG" value={requiredCMG} onChange={setRequiredCMG} unit="°" step={0.1} />
          <NumberInput label="船速 (Ship Speed)" value={shipSpeed} onChange={setShipSpeed} unit="kn" step={0.1} />
        </div>
      </section>
      <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">潮流 (Current)</div>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput label="流向 (Set)" value={setDir} onChange={setSetDir} unit="°" step={0.1} />
          <NumberInput label="流速 (Drift)" value={driftSpeed} onChange={setDriftSpeed} unit="kn" step={0.1} />
        </div>
      </section>
      <button onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
        <Compass size={20} /> 計算実行 (CALC)
      </button>
    </div>
  );
};
