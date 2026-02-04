import React, { useState } from 'react';
import { 
  Calculator, ArrowRight, Sun, Anchor, FileText, 
  Menu, X, BookOpen, HelpCircle, Info 
} from 'lucide-react';
import { toDecimal, formatDMS, rad, calculateRun, calculateMeripass } from '../utils/navigationMath';

// --- サブ画面: 使い方 (Guide) ---
const GuideView = () => (
  <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 animate-in fade-in duration-500">
    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
      <HelpCircle className="text-blue-600" /> 使い方 (User Guide)
    </h2>
    <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
      <p>このアプリは、海技試験の「メリパス計算（Meridian Passage）」および実務での視正午船位決定を支援します。</p>
      
      <h3 className="font-bold text-slate-800 border-b pb-1 mt-4">手順</h3>
      <ol className="list-decimal pl-5 space-y-2">
        <li>
          <strong>Morning Sight (AM):</strong> 午前中の太陽観測データを入力します。推測位置(DR)、方位角(Azimuth)、Interceptを入力してください。
        </li>
        <li>
          <strong>Run to Noon:</strong> 午前観測時から正中時までの針路(Course)と航程(Dist)を入力します。これにより正中時の推測位置(l₀, L₀)が計算されます。
        </li>
        <li>
          <strong>Noon Sight:</strong> 正中時の観測高度と赤緯を入力します。これにより正中時の実測緯度(l_obs)が計算されます。
        </li>
        <li>
          <strong>計算実行:</strong> ボタンを押すと、経度改正量(ΔL)が計算され、最終的な視正午船位が表示されます。
        </li>
      </ol>
    </div>
  </div>
);

// --- サブ画面: 計算理論 (Theory) ---
const TheoryView = () => (
  <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 animate-in fade-in duration-500">
    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
      <BookOpen className="text-blue-600" /> 計算理論 (Theory)
    </h2>
    <div className="space-y-4 text-slate-600 text-sm">
      <p>メリパス計算は、午前の位置の線と、正中時の緯度位置の線を組み合わせて船位を決定する方法です。</p>
      
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 my-4 text-xs md:text-sm overflow-x-auto">
        <p className="font-bold text-slate-800 mb-2">経度改正公式 (ΔL):</p>
        <div className="p-4 bg-white border rounded text-center font-serif text-lg text-slate-800">
          ΔL = ( I · csc Z - Δl · cot Z ) sec l₀
        </div>
        <p className="mt-3 text-slate-500 text-xs font-mono">
          プログラム上の計算式:<br/>
          ( I / sin(Z) - Δl / tan(Z) ) / cos(l0)
        </p>
      </div>

      <ul className="list-disc pl-5 space-y-2">
        <li><strong>I:</strong> Intercept (修正差)</li>
        <li><strong>Z:</strong> Sun's Azimuth (太陽方位角)</li>
        <li><strong>Δl:</strong> Diff between Obs Lat & DR Lat (l_obs - l₀)</li>
        <li><strong>l₀:</strong> DR Latitude at Noon (正中時推測緯度)</li>
      </ul>
    </div>
  </div>
);

// --- メインコンポーネント ---
const MeripassCalculator = () => {
  // UI State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'calculator' | 'guide' | 'theory'>('calculator');

  // Calculation State
  const [morning, setMorning] = useState({
    time: "09:00",
    lat: { d: 37, m: 20, s: 0, dir: 1 },
    lon: { d: 146, m: 15, s: 0, dir: 1 },
    obsAlt: { d: 48, m: 10.2 },
    intercept: 3.5,
    azimuth: 115.4,
  });

  const [run, setRun] = useState({
    course: 64,
    distance: 45,
  });

  const [noon, setNoon] = useState({
    obsAlt: { d: 65, m: 8.3 },
    dec: { d: 13, m: 0.8, dir: 1 },
  });

  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    // 1. Data Prep
    const lat1 = toDecimal(morning.lat.d, morning.lat.m, morning.lat.s) * morning.lat.dir;
    const lon1 = toDecimal(morning.lon.d, morning.lon.m, morning.lon.s) * morning.lon.dir;

    // 2. Run
    const { dLat, dep } = calculateRun(run.course, run.distance);
    const lat2_DR = lat1 + dLat;
    const mLat = (lat1 + lat2_DR) / 2;
    const dLong = (dep / Math.cos(rad(mLat))) / 60;
    const lon2_DR = lon1 + dLong;

    // 3. Noon Sight
    const altNoonVal = toDecimal(noon.obsAlt.d, noon.obsAlt.m);
    const decNoonVal = toDecimal(noon.dec.d, noon.dec.m) * noon.dec.dir;
    const zDist = 90 - altNoonVal;
    const lat2_Obs = (lat2_DR >= 0) ? (decNoonVal + zDist) : (decNoonVal - zDist);

    // 4. Meripass Logic
    const meripassRes = calculateMeripass(
      lat2_DR, lat2_Obs, morning.intercept, morning.azimuth, lon2_DR
    );

    setResult({
      lat1, lon1, dLat, dep, dLong, lat2_DR, lon2_DR, lat2_Obs, ...meripassRes
    });
    
    // スマホなら計算後にメニューを閉じる
    if(window.innerWidth < 1024) {
        setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const changeView = (view: 'calculator' | 'guide' | 'theory') => {
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 text-slate-800 font-sans overflow-hidden">
      
      {/* モバイル用ヘッダー & メニューボタン */}
      <div className="lg:hidden bg-white p-4 shadow-sm flex items-center justify-between z-20 relative border-b border-gray-200">
        <div className="flex items-center gap-2 font-bold text-slate-900">
            <Anchor className="text-blue-600" size={20} />
            Meripass Calc
        </div>
        <button onClick={toggleMenu} className="p-2 rounded-md hover:bg-gray-100 text-slate-600">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* サイドメニュー (オーバーレイ背景) */}
      <div className={`
        fixed inset-0 z-30 bg-black/50 transition-opacity lg:hidden
        ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `} onClick={() => setIsMenuOpen(false)} />

      {/* サイドメニュー本体 */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col shadow-xl
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-700 bg-slate-950">
            <h1 className="text-xl font-bold flex items-center gap-2">
                <Anchor className="text-blue-400" />
                Navigation
            </h1>
            <p className="text-xs text-slate-400 mt-1">Meridian Passage Calculation</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            <button 
                onClick={() => changeView('calculator')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'calculator' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
            >
                <Calculator size={18} /> 計算機 (Calculator)
            </button>
            <button 
                onClick={() => changeView('guide')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'guide' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
            >
                <HelpCircle size={18} /> 使い方 (Guide)
            </button>
            <button 
                onClick={() => changeView('theory')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'theory' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
            >
                <BookOpen size={18} /> 理論 (Theory)
            </button>
        </nav>
        <div className="p-4 border-t border-slate-700 text-xs text-slate-500 text-center">
            Ver 1.0.0
        </div>
      </aside>

      {/* メインエリア */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* 左パネル: 入力フォーム or 情報ビュー */}
        <div className="w-full lg:w-1/2 p-6 overflow-y-auto border-r border-gray-200 bg-gray-50 h-full scrollbar-thin">
            
            {/* 画面切り替え */}
            {currentView === 'guide' && <GuideView />}
            {currentView === 'theory' && <TheoryView />}
            
            {currentView === 'calculator' && (
                <div className="space-y-6 pb-20 animate-in fade-in duration-300">
                    <header className="hidden lg:block mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Input Data</h2>
                        <p className="text-sm text-slate-500">観測データと航走データを入力してください</p>
                    </header>

                    {/* 1. 午前観測 */}
                    <section className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Sun size={16} /> 1. Morning Sight (AM)
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                            <label className="block text-slate-500 mb-1 font-medium">推測緯度 (DR Lat)</label>
                            <div className="flex gap-2 items-center">
                                <input type="number" className="w-16 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={morning.lat.d} onChange={e=>setMorning({...morning, lat:{...morning.lat, d:+e.target.value}})} />
                                <span className="text-slate-600">°</span>
                                <input type="number" className="w-16 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={morning.lat.m} onChange={e=>setMorning({...morning, lat:{...morning.lat, m:+e.target.value}})} />
                                <span className="text-slate-600">' N</span>
                            </div>
                            </div>
                            <div>
                            <label className="block text-slate-500 mb-1 font-medium">方位角 (Azimuth)</label>
                            <div className="flex items-center gap-2">
                                <input type="number" className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={morning.azimuth} onChange={e=>setMorning({...morning, azimuth:+e.target.value})} />
                                <span className="text-slate-600">°</span>
                            </div>
                            </div>
                            <div>
                            <label className="block text-slate-500 mb-1 font-medium">Intercept (I)</label>
                            <div className="flex items-center gap-2">
                                <input type="number" className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={morning.intercept} onChange={e=>setMorning({...morning, intercept:+e.target.value})} />
                                <span className="text-slate-600">'</span>
                            </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. 航走 (Run) */}
                    <section className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <ArrowRight size={16} /> 2. Run to Noon
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                            <label className="block text-slate-500 mb-1 font-medium">針路 (Course)</label>
                            <div className="flex items-center gap-2">
                                <input type="number" className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={run.course} onChange={e=>setRun({...run, course:+e.target.value})} />
                                <span className="text-slate-600">°</span>
                            </div>
                            </div>
                            <div>
                            <label className="block text-slate-500 mb-1 font-medium">航程 (Dist)</label>
                            <div className="flex items-center gap-2">
                                <input type="number" className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={run.distance} onChange={e=>setRun({...run, distance:+e.target.value})} />
                                <span className="text-slate-600">nm</span>
                            </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. 正中観測 (Noon) */}
                    <section className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Sun size={16} /> 3. Noon Sight (Mer Alt)
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                            <label className="block text-slate-500 mb-1 font-medium">正中高度 (Obs Alt)</label>
                            <div className="flex gap-2 items-center">
                                <input type="number" className="w-16 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={noon.obsAlt.d} onChange={e=>setNoon({...noon, obsAlt:{...noon.obsAlt, d:+e.target.value}})} />
                                <span className="text-slate-600">°</span>
                                <input type="number" className="w-16 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={noon.obsAlt.m} onChange={e=>setNoon({...noon, obsAlt:{...noon.obsAlt, m:+e.target.value}})} />
                                <span className="text-slate-600">'</span>
                            </div>
                            </div>
                            <div>
                            <label className="block text-slate-500 mb-1 font-medium">赤緯 (Dec)</label>
                            <div className="flex gap-2 items-center">
                                <input type="number" className="w-16 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={noon.dec.d} onChange={e=>setNoon({...noon, dec:{...noon.dec, d:+e.target.value}})} />
                                <span className="text-slate-600">°</span>
                                <input type="number" className="w-16 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={noon.dec.m} onChange={e=>setNoon({...noon, dec:{...noon.dec, m:+e.target.value}})} />
                                <span className="text-slate-600">' N</span>
                            </div>
                            </div>
                        </div>
                    </section>

                    <button 
                        onClick={handleCalculate}
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg active:scale-95 duration-200 cursor-pointer flex justify-center items-center gap-2"
                    >
                        <Calculator size={20} /> 計算実行 (Calculate)
                    </button>
                </div>
            )}
        </div>

        {/* 右パネル: 計算結果シート */}
        {currentView === 'calculator' && (
            <div className="w-full lg:w-1/2 bg-yellow-50 p-8 border-l border-yellow-200 overflow-y-auto font-mono text-slate-700 relative shadow-inner h-full min-h-[50vh] lg:min-h-auto">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <FileText size={120} />
                </div>
                
                <h2 className="text-lg font-bold border-b-2 border-slate-800 pb-2 mb-6 flex items-center justify-between">
                    <span>Calculation Sheet</span>
                    <span className="text-xs font-normal bg-yellow-200 px-2 py-1 rounded text-yellow-800 font-sans">Exam Mode</span>
                </h2>

                {!result ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-center">
                    <Info size={48} className="mb-4 opacity-20" />
                    <p>左側のフォームに数値を入力し、<br/>「計算実行」を押してください。</p>
                </div>
                ) : (
                <div className="space-y-8 text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                    
                    {/* 1. Run Calculation */}
                    <div className="relative">
                        <div className="absolute -left-6 top-0 text-slate-400 font-sans font-bold opacity-50 select-none">01</div>
                        <h3 className="font-bold mb-2 text-slate-800 border-b border-slate-300 inline-block pr-4">Run to Noon</h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
                            <div>Course: {run.course}°</div>
                            <div>Dist: {run.distance} miles</div>
                            <div className="col-span-2 mt-2 pl-4 border-l-2 border-slate-300 space-y-1">
                                <p>D.Lat = {run.distance} × cos({run.course}°) = {Math.round(result.dLat * 60 * 10)/10}'</p>
                                <p>Dep = {run.distance} × sin({run.course}°) = {Math.round(result.dep * 10)/10}'</p>
                                <p>D.Long = {Math.round(result.dep * 10)/10} / cos({Math.round(result.lat1)}°) = {Math.round(result.dLong * 60 * 10)/10}'</p>
                            </div>
                            <div className="col-span-2 mt-3 p-2 bg-yellow-100/50 rounded border border-yellow-200">
                                <p className="font-bold text-blue-900">Noon DR Lat (l₀) = {formatDMS(result.lat2_DR, 'lat')}</p>
                                <p className="font-bold text-blue-900">Noon DR Long (L₀) = {formatDMS(result.lon2_DR, 'lon')}</p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Noon Sight */}
                    <div className="relative">
                        <div className="absolute -left-6 top-0 text-slate-400 font-sans font-bold opacity-50 select-none">02</div>
                        <h3 className="font-bold mb-2 text-slate-800 border-b border-slate-300 inline-block pr-4">Noon Sight</h3>
                        <div className="pl-4 border-l-2 border-slate-300 mt-2 space-y-1">
                            <p>Obs Alt (a) = {noon.obsAlt.d}° {noon.obsAlt.m}'</p>
                            <p>Zenith Dist (z) = 90° - a = {formatDMS(90 - toDecimal(noon.obsAlt.d, noon.obsAlt.m), 'angle')}</p>
                            <p>Dec (d) = {noon.dec.d}° {noon.dec.m}' N</p>
                            <p className="text-xs text-slate-500 mt-1 mb-1">Lat = z + d (Same Name)</p>
                            <p className="font-bold text-blue-900">Obs Lat (l) = {formatDMS(result.lat2_Obs, 'lat')}</p>
                        </div>
                    </div>

                    {/* 3. Meripass Logic */}
                    <div className="relative">
                        <div className="absolute -left-6 top-0 text-slate-400 font-sans font-bold opacity-50 select-none">03</div>
                        <h3 className="font-bold mb-2 text-slate-800 border-b border-slate-300 inline-block pr-4">Longitude Correction</h3>
                        <div className="pl-4 border-l-2 border-slate-300 mt-2 space-y-1">
                            <p>Δl (Obs - DR) = {Math.round(result.delta_l * 10)/10}' {result.delta_l >= 0 ? 'N' : 'S'}</p>
                            <p>Intercept (I) = {morning.intercept}'</p>
                            <p>Azimuth (Z) = {morning.azimuth}°</p>
                            
                            <div className="my-3 p-3 bg-white border border-slate-200 rounded text-xs">
                                <p className="text-slate-500 mb-1">Formula:</p>
                                <p className="font-serif italic text-center text-sm text-slate-800">
                                    ΔL = [ I cosec Z - Δl cot Z ] sec l₀
                                </p>
                            </div>

                            <p className="font-bold text-lg text-red-600">ΔL = {Math.round(result.delta_L_minutes * 10)/10}'</p>
                        </div>
                    </div>

                    {/* 4. Final Answer */}
                    <div className="mt-8 p-6 bg-white border-4 border-double border-blue-600 rounded shadow-md relative">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full shadow-sm">
                            Final Fix
                        </div>
                        <div className="grid grid-cols-1 gap-4 text-center">
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide">Latitude</div>
                                <div className="text-2xl font-bold text-slate-900">{formatDMS(result.lat2_Obs, 'lat')}</div>
                            </div>
                            <div className="w-full h-px bg-slate-200"></div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide">Longitude</div>
                                <div className="text-2xl font-bold text-slate-900">{formatDMS(result.lonObs, 'lon')}</div>
                            </div>
                        </div>
                    </div>

                </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default MeripassCalculator;