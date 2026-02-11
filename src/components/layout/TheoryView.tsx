import { BookOpen } from 'lucide-react';

export const TheoryView = () => (
  <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 animate-in fade-in duration-500">
    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
      <BookOpen className="text-blue-600 dark:text-blue-400" /> 計算理論
    </h2>
    <div className="space-y-6 text-slate-600 dark:text-slate-300 text-sm">

      <div>
        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">メリパス計算 (経度改正)</h3>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <p className="font-serif text-lg text-slate-800 dark:text-slate-100 text-center">
            &Delta;L = ( I &middot; csc Z - &Delta;l &middot; cot Z ) sec l&#8320;
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">出没方位角 (Amplitude)</h3>
        <p className="mb-2">太陽の真の出没方位を求めます。</p>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <p className="font-serif text-lg text-slate-800 dark:text-slate-100 text-center">
            Z = cos&sup1;( sin d / cos l )
          </p>
          <p className="text-xs text-center mt-2 text-slate-500 dark:text-slate-400">
            d: 赤緯 (Dec), l: 緯度 (Lat)
          </p>
        </div>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>日出時:</strong> 計算値 Z をそのまま採用 (N Z E)</li>
          <li><strong>日没時:</strong> 計算値 Z に W の符号を付す (N Z W)</li>
          <li><strong>ジャイロ誤差:</strong> 真方位 - ジャイロ方位</li>
        </ul>
      </div>

      <div>
        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">メルカトル航法 (針路・航程)</h3>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <p className="font-serif text-lg text-slate-800 dark:text-slate-100 text-center">
            C = atan2(&Delta;Lon, dmp)
          </p>
          <p className="font-serif text-lg text-slate-800 dark:text-slate-100 text-center mt-1">
            D = &Delta;Lat / cos(C)
          </p>
          <p className="text-xs text-center mt-2 text-slate-500 dark:text-slate-400">
            dmp: 子午線弧長差 (Meridional Parts Difference)
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">大圏航法</h3>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <p className="font-serif text-lg text-slate-800 dark:text-slate-100 text-center">
            cos(d) = sin(l1)sin(l2) + cos(l1)cos(l2)cos(&Delta;Lon)
          </p>
          <p className="font-serif text-lg text-slate-800 dark:text-slate-100 text-center mt-1">
            C = acos((sin(l2) - sin(l1)cos(d)) / (cos(l1)sin(d)))
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">測高度改正</h3>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <p className="font-serif text-slate-800 dark:text-slate-100 text-center">
            Ho = hs - Dip - R + P + SD
          </p>
          <p className="text-xs text-center mt-2 text-slate-500 dark:text-slate-400">
            Dip: 眼高差, R: 大気差, P: 視差, SD: 半径改正
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">潮高計算 (cos補間)</h3>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <p className="font-serif text-lg text-slate-800 dark:text-slate-100 text-center">
            h = LW + (R/2)(1 - cos(&pi;t/T))
          </p>
          <p className="text-xs text-center mt-2 text-slate-500 dark:text-slate-400">
            R: 潮差, t: 経過時間, T: 潮汐周期
          </p>
        </div>
      </div>

    </div>
  </div>
);
