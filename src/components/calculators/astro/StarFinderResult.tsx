import type { StarFinderResult } from './StarFinderCalc';

export const StarFinderResultView = ({ result }: { result: StarFinderResult }) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
    <div className="relative">
      <h3 className="text-sm font-bold bg-amber-700 text-white inline-block px-3 py-1 mb-3">Star Finder</h3>
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-4">
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          GHA Aries: {result.ghaAries.toFixed(1)}&deg; | 観測可能: {result.stars.length}星
        </div>

        {result.stars.length === 0 ? (
          <p className="text-center text-slate-400 py-4">条件に該当する恒星がありません</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-300 dark:border-slate-600 text-xs text-slate-500 dark:text-slate-400 uppercase">
                  <th className="text-left py-1 pr-2">Star</th>
                  <th className="text-right py-1 px-2">SHA</th>
                  <th className="text-right py-1 px-2">Dec</th>
                  <th className="text-right py-1 px-2">Alt</th>
                  <th className="text-right py-1 pl-2">Az</th>
                </tr>
              </thead>
              <tbody>
                {result.stars.map(star => (
                  <tr key={star.name} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-1.5 pr-2 font-bold text-amber-700 dark:text-amber-400">{star.name}</td>
                    <td className="py-1.5 px-2 text-right font-mono">{star.sha.toFixed(1)}&deg;</td>
                    <td className="py-1.5 px-2 text-right font-mono">{star.dec.toFixed(1)}&deg;</td>
                    <td className="py-1.5 px-2 text-right font-mono font-bold">{star.alt.toFixed(1)}&deg;</td>
                    <td className="py-1.5 pl-2 text-right font-mono font-bold">{star.az.toFixed(1)}&deg;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </div>
);
