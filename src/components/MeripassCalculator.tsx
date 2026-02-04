import React, { useState } from 'react';
import { 
  Calculator, ArrowRight, Sun, Anchor, FileText, 
  Menu, X, BookOpen, HelpCircle, Info, Clock, MapPin
} from 'lucide-react';
import { toDecimal, formatDMS, rad, calculateRun, calculateSightReduction, calculateTrueAltitude, calculateMeripass } from '../utils/navigationMath';

// --- ヘルパー: 度分秒入力用 ---
const DMSInput = ({ value, onChange, label, showSign = false, signType = 'NS' }: any) => (
  <div className="flex flex-col">
    <span className="text-[10px] text-slate-500 font-semibold uppercase">{label}</span>
    <div className="flex items-center gap-1 bg-white border border-slate-300 rounded p-1 shadow-sm">
      <input 
        type="number" 
        className="w-10 text-right outline-none font-mono text-sm" 
        value={value.d} 
        onChange={e => onChange({ ...value, d: +e.target.value })} 
        placeholder="deg"
      />
      <span className="text-slate-400 text-xs">°</span>
      <input 
        type="number" 
        className="w-12 text-right outline-none font-mono text-sm" 
        value={value.m} 
        onChange={e => onChange({ ...value, m: +e.target.value })} 
        placeholder="min"
      />
      <span className="text-slate-400 text-xs">'</span>
      {showSign && (
        <select 
          className="text-xs bg-transparent outline-none font-bold text-slate-700"
          value={value.dir}
          onChange={e => onChange({ ...value, dir: +e.target.value })}
        >
          {signType === 'NS' ? (
            <><option value={1}>N</option><option value={-1}>S</option></>
          ) : (
            <><option value={1}>E</option><option value={-1}>W</option></>
          )}
        </select>
      )}
    </div>
  </div>
);

// --- メインコンポーネント ---
const MeripassCalculator = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'calculator' | 'guide' | 'theory'>('calculator');

  // --- State: 入力データ ---
  const [meta, setMeta] = useState({ month: 8, day: 19, zone: -9 });

  // 1. Morning Sight
  const [morning, setMorning] = useState({
    drLat: { d: 37, m: 20, dir: 1 },
    drLong: { d: 146, m: 15, dir: 1 },
    hs: { d: 48, m: 10.2 },
    totalCorr: 9.6,      // 改正総数 (Corr)
    totalCorrSign: 1,    // 符号 (+1 or -1)
    gha: { d: 315, m: 10.5 },
    dec: { d: 13, m: 2.8, dir: 1 } 
  });

  // 2. Run
  const [run, setRun] = useState({ course: 64, dist: 45 });

  // 3. Noon Sight
  const [noon, setNoon] = useState({
    hs: { d: 65, m: 8.3 },
    totalCorr: 9.8,      // 改正総数 (Corr)
    totalCorrSign: 1,    // 符号
    dec: { d: 13, m: 0.8, dir: 1 },
    eqTime: { m: 3, s: 47, sign: -1 } 
  });

  const [result, setResult] = useState<any>(null);

  // --- 計算処理 ---
  const handleCalculate = () => {
    // 1. Morning Sight
    const lat1 = toDecimal(morning.drLat.d, morning.drLat.m) * morning.drLat.dir;
    const lon1 = toDecimal(morning.drLong.d, morning.drLong.m) * morning.drLong.dir;
    
    // 真高度 (Ho) = hs + Corr
    const { ho: ho1 } = calculateTrueAltitude(
      toDecimal(morning.hs.d, morning.hs.m), 
      morning.totalCorr * morning.totalCorrSign
    );
    
    // LHA
    const gha1 = toDecimal(morning.gha.d, morning.gha.m);
    let lha1 = gha1 + lon1;
    while (lha1 >= 360) lha1 -= 360;
    while (lha1 < 0) lha1 += 360;

    // Sight Reduction
    const dec1 = toDecimal(morning.dec.d, morning.dec.m) * morning.dec.dir;
    const { hc: hc1, Z: z1 } = calculateSightReduction(lat1, dec1, lha1);
    const intercept1 = (ho1 - hc1) * 60; 

    // 2. Run
    const { dLat, dep, dLong, lat2: lat2_DR } = calculateRun(lat1, run.course, run.dist);
    const lon2_DR = lon1 + dLong;

    // 3. Noon Sight
    const { ho: ho2 } = calculateTrueAltitude(
      toDecimal(noon.hs.d, noon.hs.m), 
      noon.totalCorr * noon.totalCorrSign
    );
    const dec2 = toDecimal(noon.dec.d, noon.dec.m) * noon.dec.dir;
    
    // Meridian Altitude Logic (Same Name assumption for exam)
    // Lat = Dec + (90 - Ho)
    const zenithDist = 90 - ho2;
    const lat2_Obs = dec2 + zenithDist;

    // 4. Fix (Meripass)
    const deltaL_miles = (lat2_Obs - lat2_DR) * 60;
    const { dLongCorr } = calculateMeripass(intercept1, z1, deltaL_miles, lat2_DR);
    const lon2_Obs = lon2_DR + (dLongCorr / 60);

    // 5. Time
    const eqtHours = (noon.eqTime.m + noon.eqTime.s/60) / 60 * noon.eqTime.sign;
    const lmtPass = 12 - eqtHours;
    const gmtPass = lmtPass - (lon2_DR / 15);
    const ztPass = gmtPass + meta.zone;

    setResult({
      lat1, lon1, gha1, lha1, dec1, ho1, hc1, z1, intercept1,
      dLat, dep, dLong, lat2_DR, lon2_DR,
      ho2, dec2, lat2_Obs,
      deltaL_miles, dLongCorr, lon2_Obs,
      lmtPass, gmtPass, ztPass
    });

    if(window.innerWidth < 1024) setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const changeView = (view: any) => {
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-100 text-slate-800 font-sans overflow-hidden">
      
      {/* Mobile Header */}
      <div className="lg:hidden bg-white p-4 shadow-sm flex items-center justify-between z-20 border-b border-slate-200">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Anchor className="text-blue-700" size={20} />
          メリパス計算 (3N)
        </div>
        <button onClick={toggleMenu} className="p-2 text-slate-600">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Menu */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col shadow-2xl
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-700 bg-slate-950">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Anchor className="text-blue-400" />
            3N 天測計算
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => changeView('calculator')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${currentView === 'calculator' ? 'bg-blue-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Calculator size={18} /> 計算シート
          </button>
          <button onClick={() => changeView('guide')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${currentView === 'guide' ? 'bg-blue-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <HelpCircle size={18} /> 利用ガイド
          </button>
          <button onClick={() => changeView('theory')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${currentView === 'theory' ? 'bg-blue-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <BookOpen size={18} /> 理論
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* --- Left Panel: Input Forms --- */}
        <div className="w-full lg:w-5/12 p-4 md:p-6 overflow-y-auto border-r border-slate-200 bg-white h-full scrollbar-thin">
          {currentView !== 'calculator' ? (
             <div className="prose prose-sm text-slate-600 p-4">
               {currentView === 'guide' ? <p>利用ガイド: 左側のフォームに問題の数値を入力し、「計算実行」を押してください。</p> : <p>理論: メリパス計算の公式 $\Delta L = \dots$</p>}
             </div>
          ) : (
          <div className="space-y-8 pb-20">
            <header>
              <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-blue-600 pl-3">Input Data</h2>
              <p className="text-xs text-slate-400 mt-1 pl-4">海技試験問題の値を入力してください</p>
            </header>

            {/* 0. General Info */}
            <section className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold text-sm uppercase tracking-wider">
                <Clock size={16} /> Date & Zone
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 block">月</span>
                  <input type="number" className="w-full p-2 border rounded text-center font-bold" value={meta.month} onChange={e => setMeta({...meta, month: +e.target.value})} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">日</span>
                  <input type="number" className="w-full p-2 border rounded text-center font-bold" value={meta.day} onChange={e => setMeta({...meta, day: +e.target.value})} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Timezone</span>
                  <div className="flex items-center">
                     <span className="text-xs mr-1">UT</span>
                     <input type="number" className="w-full p-2 border rounded text-center font-bold" value={meta.zone} onChange={e => setMeta({...meta, zone: +e.target.value})} />
                  </div>
                </div>
              </div>
            </section>

            {/* 1. Morning Sight */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-blue-50/50 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-blue-800 text-sm">
                  <MapPin size={16} /> 1. 第1観測 (Morning)
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <DMSInput label="推測緯度 (Lat1)" value={morning.drLat} onChange={(v:any) => setMorning({...morning, drLat: v})} showSign={true} signType="NS" />
                   <DMSInput label="推測経度 (Long1)" value={morning.drLong} onChange={(v:any) => setMorning({...morning, drLong: v})} showSign={true} signType="EW" />
                </div>
                
                {/* Altitude & Correction */}
                <div className="pt-2 border-t border-dashed border-slate-200">
                    <div className="grid grid-cols-2 gap-4 items-end">
                       <DMSInput label="器械高度 (hs)" value={morning.hs} onChange={(v:any) => setMorning({...morning, hs: v})} />
                       <div>
                          <label className="text-[10px] text-slate-500 font-bold block">改正総数 (Corr)</label>
                          <div className="flex items-center gap-1 mt-1">
                            <select className="bg-slate-50 border rounded p-1.5 text-sm font-bold" value={morning.totalCorrSign} onChange={e => setMorning({...morning, totalCorrSign: +e.target.value})}>
                                <option value={1}>+</option><option value={-1}>-</option>
                            </select>
                            <input type="number" className="w-full p-1.5 border rounded text-right text-sm" value={morning.totalCorr} onChange={e => setMorning({...morning, totalCorr: +e.target.value})} placeholder="0.0" />
                            <span className="text-xs">'</span>
                          </div>
                       </div>
                    </div>
                </div>
                
                {/* Almanac */}
                <div className="pt-2 border-t border-dashed border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 block mb-2">航海暦データ</span>
                    <div className="grid grid-cols-2 gap-4">
                        <DMSInput label="GHA (Sun)" value={morning.gha} onChange={(v:any) => setMorning({...morning, gha: v})} />
                        <DMSInput label="赤緯 (Dec)" value={morning.dec} onChange={(v:any) => setMorning({...morning, dec: v})} showSign={true} signType="NS" />
                    </div>
                </div>
              </div>
            </section>

            {/* 2. Run */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center gap-2 font-bold text-slate-700 text-sm">
                <ArrowRight size={16} /> 2. 航走 (Run)
              </div>
              <div className="p-4 grid grid-cols-2 gap-6">
                <div>
                    <span className="text-[10px] text-slate-500 font-bold">真針路 (Course)</span>
                    <div className="flex items-center gap-2 mt-1">
                        <input type="number" className="w-full p-2 border rounded font-mono" value={run.course} onChange={e => setRun({...run, course: +e.target.value})} />
                        <span className="text-sm">°</span>
                    </div>
                </div>
                <div>
                    <span className="text-[10px] text-slate-500 font-bold">航程 (Dist)</span>
                    <div className="flex items-center gap-2 mt-1">
                        <input type="number" className="w-full p-2 border rounded font-mono" value={run.dist} onChange={e => setRun({...run, dist: +e.target.value})} />
                        <span className="text-sm">miles</span>
                    </div>
                </div>
              </div>
            </section>

            {/* 3. Noon Sight */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-orange-50/50 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-orange-800 text-sm">
                  <Sun size={16} /> 3. 正中観測 (Noon)
                </div>
              </div>
              <div className="p-4 space-y-4">
                 <div className="grid grid-cols-2 gap-4 pb-2 border-b border-dashed border-slate-200">
                    <DMSInput label="赤緯 (Dec)" value={noon.dec} onChange={(v:any) => setNoon({...noon, dec: v})} showSign={true} signType="NS" />
                    <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Eq. of Time</span>
                        <div className="flex items-center gap-1 mt-1">
                            <select className="bg-white border rounded p-1 text-sm" value={noon.eqTime.sign} onChange={e => setNoon({...noon, eqTime: {...noon.eqTime, sign: +e.target.value}})}>
                                <option value={1}>+</option><option value={-1}>-</option>
                            </select>
                            <input type="number" className="w-12 p-1 border rounded text-right text-sm" value={noon.eqTime.m} onChange={e => setNoon({...noon, eqTime: {...noon.eqTime, m: +e.target.value}})} placeholder="m" />
                            <span className="text-xs">m</span>
                            <input type="number" className="w-12 p-1 border rounded text-right text-sm" value={noon.eqTime.s} onChange={e => setNoon({...noon, eqTime: {...noon.eqTime, s: +e.target.value}})} placeholder="s" />
                            <span className="text-xs">s</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-end">
                   <DMSInput label="子午線高度 (hs)" value={noon.hs} onChange={(v:any) => setNoon({...noon, hs: v})} />
                   <div>
                      <label className="text-[10px] text-slate-500 font-bold block">改正総数 (Corr)</label>
                      <div className="flex items-center gap-1 mt-1">
                        <select className="bg-slate-50 border rounded p-1.5 text-sm font-bold" value={noon.totalCorrSign} onChange={e => setNoon({...noon, totalCorrSign: +e.target.value})}>
                            <option value={1}>+</option><option value={-1}>-</option>
                        </select>
                        <input type="number" className="w-full p-1.5 border rounded text-right text-sm" value={noon.totalCorr} onChange={e => setNoon({...noon, totalCorr: +e.target.value})} placeholder="0.0" />
                        <span className="text-xs">'</span>
                      </div>
                   </div>
                </div>
              </div>
            </section>

            <button 
              onClick={handleCalculate}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 flex justify-center items-center gap-2"
            >
              <Calculator size={20} /> 計算実行 (RUN)
            </button>
          </div>
          )}
        </div>

        {/* --- Right Panel: Calculation Sheet --- */}
        <div className="w-full lg:w-7/12 bg-[#fffdf5] p-8 md:p-10 border-l border-slate-200 overflow-y-auto font-mono text-slate-800 relative shadow-inner min-h-[50vh] lg:h-full">
            <div className="absolute top-6 right-6 opacity-5 pointer-events-none">
                <FileText size={200} />
            </div>
            
            <div className="border-b-2 border-slate-800 pb-4 mb-8 flex justify-between items-end">
                <h2 className="text-2xl font-bold tracking-tight">Calculation Sheet</h2>
                <span className="text-xs font-sans text-slate-500">3N Navigation Form</span>
            </div>

            {!result ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                    <p className="mb-2">No Data Calculated</p>
                    <p className="text-xs">左側のフォームに入力して計算を実行してください</p>
                </div>
            ) : (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    
                    {/* 1. Run Calculation */}
                    <div className="relative">
                        <h3 className="text-sm font-bold bg-slate-800 text-white inline-block px-3 py-1 mb-3">1. D.R.P at Noon (中分緯度航法)</h3>
                        <div className="grid grid-cols-2 gap-8 text-sm border-l-2 border-slate-300 pl-4">
                            <div className="space-y-1">
                                <div className="flex justify-between"><span>Course</span> <span>{run.course}°</span></div>
                                <div className="flex justify-between"><span>Dist</span> <span>{run.dist}'</span></div>
                                <div className="flex justify-between border-t border-slate-300 pt-1 mt-1"><span>Dep</span> <span>{result.dep.toFixed(1)}'</span></div>
                                <div className="flex justify-between"><span>D.Lat</span> <span>{result.dLat >= 0 ? 'N' : 'S'} {(Math.abs(result.dLat)*60).toFixed(1)}'</span></div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between"><span>Lat1</span> <span>{formatDMS(result.lat1, 'lat')}</span></div>
                                <div className="flex justify-between"><span>D.Lat</span> <span>{result.dLat>=0?'+':'-'}{(Math.abs(result.dLat)*60).toFixed(1)}'</span></div>
                                <div className="flex justify-between font-bold border-t border-slate-800 pt-1"><span>Lat2 (DR)</span> <span>{formatDMS(result.lat2_DR, 'lat')}</span></div>
                                <div className="flex justify-between text-xs text-slate-500 mt-2"><span>(Mean Lat)</span> <span>{formatDMS((result.lat1+result.lat2_DR)/2, 'lat')}</span></div>
                            </div>
                        </div>
                        <div className="mt-2 text-right text-sm border-t border-slate-200 pt-2">
                            <span className="mr-4">Long1: {formatDMS(result.lon1, 'lon')}</span>
                            <span className="mr-4">D.Long: {result.dLong>=0?'+':'-'}{(Math.abs(result.dLong)*60).toFixed(1)}'</span>
                            <span className="font-bold">Long2 (DR): {formatDMS(result.lon2_DR, 'lon')}</span>
                        </div>
                    </div>

                    {/* 2. Time of Passage */}
                    <div className="relative">
                        <h3 className="text-sm font-bold bg-slate-800 text-white inline-block px-3 py-1 mb-3">2. Time of Mer. Pass</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-l-2 border-slate-300 pl-4 text-sm">
                            <div className="space-y-1">
                                <div className="flex justify-between"><span>L.A.T. Noon</span> <span>12-00-00</span></div>
                                <div className="flex justify-between"><span>Eq. of T.</span> <span>{noon.eqTime.sign<0?'+':'-'} {String(noon.eqTime.m).padStart(2,'0')}-{String(noon.eqTime.s).padStart(2,'0')}</span></div>
                                <div className="flex justify-between border-t border-slate-400"><span>L.M.T. Pass</span> <span>{Math.floor(result.lmtPass)}h {Math.floor((result.lmtPass%1)*60)}m</span></div>
                                <div className="flex justify-between"><span>Long (Time)</span> <span>{result.lon2_DR>=0?'-':'+'} {Math.floor(Math.abs(result.lon2_DR)/15)}h {Math.floor((Math.abs(result.lon2_DR)/15%1)*60)}m</span></div>
                                <div className="flex justify-between border-t border-slate-400 font-bold"><span>G.M.T.</span> <span>{Math.floor(result.gmtPass)}h {Math.floor((result.gmtPass%1)*60)}m {Math.floor((result.gmtPass*3600)%60)}s</span></div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="text-center p-4 border-2 border-double border-slate-400">
                                    <div className="text-xs text-slate-500 mb-1">Standard Time (ZT)</div>
                                    <div className="text-xl font-bold">{Math.floor(result.ztPass)}h {Math.floor((result.ztPass%1)*60)}m {Math.floor((result.ztPass*3600)%60)}s</div>
                                    <div className="text-xs text-slate-500 mt-1">Zone: {meta.zone}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Sights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Morning */}
                        <div>
                            <h3 className="text-sm font-bold bg-blue-700 text-white inline-block px-3 py-1 mb-3">3. Morning Sight</h3>
                            <div className="bg-white border border-slate-300 p-4 text-sm space-y-1 shadow-sm">
                                <div className="flex justify-between"><span>hs</span> <span>{morning.hs.d}-{morning.hs.m}</span></div>
                                <div className="flex justify-between text-xs text-slate-500"><span>(Corr)</span> <span>{morning.totalCorrSign>=0?'+':''}{morning.totalCorr}'</span></div>
                                <div className="flex justify-between font-bold border-b border-slate-300 pb-1 mb-1"><span>Ho</span> <span>{formatDMS(result.ho1, 'angle')}</span></div>
                                
                                <div className="flex justify-between"><span>GHA</span> <span>{morning.gha.d}° {morning.gha.m}'</span></div>
                                <div className="flex justify-between"><span>Long</span> <span>{result.lon1>=0?'+':'-'}{formatDMS(Math.abs(result.lon1), 'angle')}</span></div>
                                <div className="flex justify-between font-bold"><span>LHA (t)</span> <span>{result.lha1.toFixed(1)}°</span></div>
                                <div className="mt-2 pt-2 border-t border-slate-200">
                                    <div className="flex justify-between"><span>Lat</span> <span>{formatDMS(result.lat1, 'lat')}</span></div>
                                    <div className="flex justify-between"><span>Dec</span> <span>{formatDMS(result.dec1, 'lat')}</span></div>
                                    <div className="flex justify-between mt-1 font-bold"><span>Hc</span> <span>{formatDMS(result.hc1, 'angle')}</span></div>
                                    <div className="flex justify-between font-bold"><span>Az (Z)</span> <span>{result.z1.toFixed(1)}°</span></div>
                                </div>
                                <div className="mt-3 bg-blue-50 p-2 text-center border border-blue-200 font-bold text-blue-900">
                                    Intercept: {result.intercept.toFixed(1)}' {result.intercept>=0?'T':'A'}
                                </div>
                            </div>
                        </div>

                        {/* Noon */}
                        <div>
                            <h3 className="text-sm font-bold bg-orange-700 text-white inline-block px-3 py-1 mb-3">4. Noon Sight</h3>
                            <div className="bg-white border border-slate-300 p-4 text-sm space-y-1 shadow-sm">
                                <div className="flex justify-between"><span>hs</span> <span>{noon.hs.d}-{noon.hs.m}</span></div>
                                <div className="flex justify-between text-xs text-slate-500"><span>(Corr)</span> <span>{noon.totalCorrSign>=0?'+':''}{noon.totalCorr}'</span></div>
                                <div className="flex justify-between font-bold border-b border-slate-300 pb-1 mb-1"><span>Ho</span> <span>{formatDMS(result.ho2, 'angle')}</span></div>
                                
                                <div className="flex justify-between"><span>90° - Ho</span> <span>{formatDMS(90 - result.ho2, 'angle')} (z)</span></div>
                                <div className="flex justify-between"><span>Dec</span> <span>{formatDMS(result.dec2, 'lat')}</span></div>
                                <div className="flex justify-between font-bold border-t border-slate-300 pt-1 mt-1">
                                    <span>Obs Lat</span> <span>{formatDMS(result.lat2_Obs, 'lat')}</span>
                                </div>
                                <div className="mt-3 p-2 text-center text-xs text-slate-500">
                                    Formula: Lat = Dec ± z<br/>(Same Name assumed)
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. Fix */}
                    <div className="relative">
                        <h3 className="text-sm font-bold bg-slate-800 text-white inline-block px-3 py-1 mb-3">5. Fix (Meripass)</h3>
                        <div className="bg-slate-100 border-2 border-slate-400 p-6">
                            <div className="flex justify-around items-center mb-4 text-sm">
                                <div>
                                    <p className="font-bold">Δl (Lat Diff)</p>
                                    <p>{(result.lat2_Obs - result.lat2_DR)*60 >= 0 ? '+' : ''}{((result.lat2_Obs - result.lat2_DR)*60).toFixed(1)}'</p>
                                </div>
                                <div>
                                    <p className="font-bold">Intercept (I)</p>
                                    <p>{result.intercept.toFixed(1)}'</p>
                                </div>
                                <div>
                                    <p className="font-bold">Azimuth (Z)</p>
                                    <p>{result.z1.toFixed(1)}°</p>
                                </div>
                            </div>
                            
                            <div className="text-center mb-4">
                                <p className="text-xs text-slate-500 mb-1">Calculation Formula</p>
                                <p className="font-serif italic text-lg">ΔL = ( I · csc Z - Δl · cot Z ) sec l₀</p>
                                <p className="font-bold text-red-600 text-xl mt-2">D.Long Correction: {result.dLongCorr.toFixed(1)}'</p>
                            </div>

                            <div className="bg-white border-4 border-double border-slate-800 p-4 text-center shadow-lg">
                                <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">FIX AT NOON</p>
                                <div className="flex justify-center gap-8 text-2xl font-bold text-slate-900">
                                    <span>{formatDMS(result.lat2_Obs, 'lat')}</span>
                                    <span>{formatDMS(result.lon2_Obs, 'lon')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>

      </main>
    </div>
  );
};

export default MeripassCalculator;