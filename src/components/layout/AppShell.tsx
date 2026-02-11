import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, ArrowLeft, Info } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { GuideView } from './GuideView';
import { TheoryView } from './TheoryView';
import { getCalculator, calculators } from '../../data/calculatorRegistry';

const defaultCalcId = 'meripass';

const seoFallback: Record<string, { title: string; desc: string }> = {
  guide: { title: '利用ガイド | 航法計算アプリ', desc: '航法計算アプリの使い方と操作手順について解説します。' },
  theory: { title: '計算理論・公式 | 航法計算アプリ', desc: 'メリパス計算や出没方位角計算に使用している数理モデルと公式の紹介です。' },
};

export const AppShell = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentId, setCurrentId] = useState(defaultCalcId);
  const [showMobileResult, setShowMobileResult] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);

  const isSpecialView = currentId === 'guide' || currentId === 'theory';
  const calc = getCalculator(currentId);

  const handleSelect = (id: string) => {
    setCurrentId(id);
    setResult(null);
    setShowMobileResult(false);
    setIsMenuOpen(false);
  };

  const handleResult = (r: unknown) => {
    setResult(r);
    setShowMobileResult(true);
    if (window.innerWidth < 1024) setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SEO
  const seo = calc
    ? { title: calc.seoTitle, desc: calc.seoDescription }
    : seoFallback[currentId] ?? { title: '航法計算アプリ', desc: '航海に関する各種計算ツール' };

  // Calc Sheet subtitle
  const sheetSubtitle = calc ? calc.nameEn : 'Navigation Form';

  // Find correct result component - we need the actual calculator's result component
  const currentCalc = calculators.find(c => c.id === currentId);

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.desc} />
      </Helmet>

      <div className={theme}>
        <div className="flex flex-col lg:flex-row h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">

          {/* Mobile Header */}
          <MobileHeader
            isMenuOpen={isMenuOpen}
            onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
            theme={theme}
            onToggleTheme={toggleTheme}
          />

          {/* Sidebar */}
          <Sidebar
            isOpen={isMenuOpen}
            activeId={currentId}
            onSelect={handleSelect}
            onClose={() => setIsMenuOpen(false)}
            theme={theme}
            onToggleTheme={toggleTheme}
          />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

            {/* --- Left Panel (Input) --- */}
            <div className={`w-full lg:w-5/12 p-4 md:p-6 overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full scrollbar-thin transition-colors ${showMobileResult ? 'hidden lg:block' : 'block'}`}>

              {isSpecialView && (
                <div className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-300 p-4">
                  {currentId === 'guide' ? <GuideView /> : <TheoryView />}
                </div>
              )}

              {!isSpecialView && calc && (
                <calc.Component onResult={handleResult} />
              )}
            </div>

            {/* --- Right Panel (Output / Calculation Sheet) --- */}
            <div className={`w-full lg:w-7/12 p-8 md:p-10 border-l border-slate-200 dark:border-slate-800 overflow-y-auto font-mono relative shadow-inner min-h-[50vh] lg:h-full transition-colors bg-[#fffdf5] dark:bg-[#1a1c23] text-slate-800 dark:text-slate-200
              ${showMobileResult ? 'block h-full fixed inset-0 z-50 overflow-auto pt-safe-top' : 'hidden lg:block'}`}>

              {showMobileResult && (
                <button
                  onClick={() => setShowMobileResult(false)}
                  className="lg:hidden absolute top-4 left-4 p-2 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-300 shadow-sm z-50"
                >
                  <ArrowLeft size={24} />
                </button>
              )}

              <div className="absolute top-6 right-6 opacity-5 pointer-events-none text-slate-800 dark:text-white"><FileText size={200} /></div>
              <div className="border-b-2 border-slate-800 dark:border-slate-500 pb-4 mb-8 flex justify-between items-end mt-8 lg:mt-0">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Calculation Sheet</h2>
                <span className="text-xs font-sans text-slate-500 dark:text-slate-400">{sheetSubtitle}</span>
              </div>

              {/* Special views (guide/theory) get a plain message */}
              {isSpecialView && (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                  <Info size={48} className="mb-4 opacity-20" />
                  <p>左パネルの内容をご覧ください</p>
                </div>
              )}

              {/* Calculator result */}
              {!isSpecialView && !result && (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                  <Info size={48} className="mb-4 opacity-20" />
                  <p>No Data Calculated</p>
                </div>
              )}

              {!isSpecialView && result && currentCalc && (
                <currentCalc.ResultComponent result={result} />
              )}
            </div>

          </main>
        </div>
      </div>
    </>
  );
};
