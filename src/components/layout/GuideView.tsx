import { HelpCircle } from 'lucide-react';

export const GuideView = () => (
  <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 animate-in fade-in duration-500">
    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
      <HelpCircle className="text-blue-600 dark:text-blue-400" /> 使い方
    </h2>
    <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
      <p>このアプリは航海に関する各種計算モードを提供します。左のメニューからカテゴリを選択してください。</p>

      <h3 className="font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-700 pb-1 mt-4">カテゴリ一覧</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>航海計画 PILOT 1:</strong> 針路・航程、到着点、大圏航法、集成大圏航法、到着時刻</li>
        <li><strong>その他の航法 PILOT 2:</strong> 実航針路・速力、視針路、流向・流速、真風向・風速、潮高・潮流計算</li>
        <li><strong>天文航法 ASTRO. NAV:</strong> 薄明時、索星、天測暦、位置の線、船位決定、正中時、出没方位角</li>
        <li><strong>六分儀 SEXTANT:</strong> 測高度改正、物標距離</li>
        <li><strong>時間と弧度 TIME & ARC:</strong> 時間⇔弧度変換</li>
        <li><strong>四則計算 TIME Calc:</strong> 時分秒変換、10進数変換、四則計算</li>
      </ul>

      <h3 className="font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-700 pb-1 mt-4">基本操作</h3>
      <ol className="list-decimal pl-5 space-y-2">
        <li>左メニューからカテゴリを展開し、計算機を選択します。</li>
        <li>左パネルに値を入力します。</li>
        <li>「計算実行」ボタンを押すと、右パネルに結果が表示されます。</li>
      </ol>

      <h3 className="font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-700 pb-1 mt-4">開発・フィードバック</h3>
      <p>ソースコード: <a href="https://github.com/serkenn/Navigation-calculations" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub</a></p>
    </div>
  </div>
);
