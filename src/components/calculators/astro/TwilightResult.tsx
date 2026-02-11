import type { TwilightResult } from './TwilightCalc';

function formatGMT(hours: number): string {
  if (isNaN(hours)) return '---';
  let h = hours;
  while (h < 0) h += 24;
  while (h >= 24) h -= 24;
  const hh = Math.floor(h);
  const mm = Math.floor((h - hh) * 60);
  const ss = Math.round(((h - hh) * 60 - mm) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

export const TwilightResultView = ({ result }: { result: TwilightResult }) => {
  const rows = [
    { label: '天文薄明 (Astronomical)', data: result.astronomical, alt: '-18°' },
    { label: '航海薄明 (Nautical)', data: result.nautical, alt: '-12°' },
    { label: '市民薄明 (Civil)', data: result.civil, alt: '-6°' },
    { label: '日出没 (Sunrise/Sunset)', data: result.sunrise, alt: '-0°50\'' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="relative">
        <h3 className="text-sm font-bold bg-amber-700 text-white inline-block px-3 py-1 mb-3">Twilight Times (GMT)</h3>
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-6 text-sm shadow-sm space-y-1">
          <div className="grid grid-cols-4 gap-2 font-bold text-xs text-slate-500 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-700 pb-2 mb-2">
            <span>現象</span>
            <span className="text-center">高度角</span>
            <span className="text-center">Morning</span>
            <span className="text-center">Evening</span>
          </div>
          {rows.map(row => (
            <div key={row.label} className="grid grid-cols-4 gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{row.label}</span>
              <span className="text-center font-mono text-xs">{row.alt}</span>
              <span className="text-center font-mono font-bold">
                {row.data.possible ? formatGMT(row.data.rise) : 'N/A'}
              </span>
              <span className="text-center font-mono font-bold">
                {row.data.possible ? formatGMT(row.data.set) : 'N/A'}
              </span>
            </div>
          ))}

          {!result.sunrise.possible && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-center text-amber-800 dark:text-amber-300 text-sm font-bold">
              白夜または極夜のため日出没なし
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
