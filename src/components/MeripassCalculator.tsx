import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Calculator, ArrowRight, Sun, Anchor, FileText, 
  Menu, X, BookOpen, HelpCircle, Info, Clock, MapPin, Compass
} from 'lucide-react';
import { 
  toDecimal, formatDMS, 
  calculateRun, calculateSightReduction, calculateTrueAltitude, calculateMeripass, 
  calculateAmplitude, calculateGyroError 
} from '../utils/navigationMath';

// --- Types ---
interface DMSValue {
  d: number;
  m: number;
  dir: number; // 1 or -1
}

interface DMSInputProps {
  value: DMSValue;
  onChange: (val: DMSValue) => void;
  label: string;
  showSign?: boolean;
  signType?: 'NS' | 'EW';
}

interface CalculationResult {
  lat1: number; lon1: number;
  gha1: number;
  lha1: number; hc1: number; z1: number; intercept1: number;
  dLat: number; dep: number; dLong: number; lat2_DR: number; lon2_DR: number;
  ho1: number; ho2: number;
  lat2_Obs: number;
  deltaL_miles: number; dLongCorr: number; lon2_Obs: number;
  lmtPass: number; gmtPass: number; ztPass: number;
  dec1: number; dec2: number;
  zoneOffset: number;
}

interface GyroResult {
  trueAzimuthBase: number; // 計算されたZ
  trueAzimuth360: number;  // 360度表記の真方位
  gyroError: number;       // 誤差
  direction: 'Rise' | 'Set';
}

// --- Helper Component ---
const DMSInput = ({ value, onChange, label, showSign = false, signType = 'NS' }: DMSInputProps) => (
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

// --- Sub Views ---
const GuideView = () => (
  <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 animate-in fade-in duration-500">
    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
      <HelpCircle className="text-blue-600" /> 使い方
    </h2>
    <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
      <p>このアプリは2つの計算モードを提供します。</p>
      
      <h3 className="font-bold text-slate-800 border-b pb-1 mt-4">1. メリパス計算 (3N)</h3>
      <ol className="list-decimal pl-5 space-y-2">
        <li><strong>Date & Zone:</strong> 日付と標準子午線を入力。</li>
        <li><strong>Morning Sight:</strong> 午前観測の推測位置、高度、GHA、赤緯等を入力。</li>
        <li><strong>Run to Noon:</strong> 正中時までの針路と航程を入力。</li>
        <li><strong>Noon Sight:</strong> 正中時の観測高度、赤緯、均時差を入力。</li>
        <li><strong>計算実行:</strong> ボタンを押すと経度改正量と船位が表示されます。</li>
      </ol>

      <h3 className="font-bold text-slate-800 border-b pb-1 mt-4">2. 出没方位角・ジャイロ誤差</h3>
      <ol className="list-decimal pl-5 space-y-2">
        <li>推測緯度と太陽の赤緯を入力します。</li>
        <li>「日出 (Sunrise)」か「日没 (Sunset)」を選択します。</li>
        <li>ジャイロコンパスの方位を入力します。</li>
        <li>計算結果に真方位とジャイロ誤差が表示されます。</li>
      </ol>
      
      <h3 className="font-bold text-slate-800 border-b pb-1 mt-4">開発・フィードバック</h3>
      <p>ソースコード: <a href="https://github.com/serkenn/Navigation-calculations" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a></p>
    </div>
  </div>
);

const TheoryView = () => (
  <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 animate-in fade-in duration-500">
    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
      <BookOpen className="text-blue-600" /> 計算理論
    </h2>
    <div className="space-y-6 text-slate-600 text-sm">
      
      <div>
        <h3 className="font-bold text-slate-800 mb-2">メリパス計算 (経度改正)</h3>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 overflow-x-auto">
          <p className="font-serif text-lg text-slate-800 text-center">
            ΔL = ( I · csc Z - Δl · cot Z ) sec l₀
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-slate-800 mb-2">出没方位角 (Amplitude)</h3>
        <p className="mb-2">太陽の真の出没方位を求めます。</p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 overflow-x-auto">
          <p className="font-serif text-lg text-slate-800 text-center">
            Z = cos⁻¹( sin d / cos l )
          </p>
          <p className="text-xs text-center mt-2 text-slate-500">
            d: 赤緯 (Dec), l: 緯度 (Lat)
          </p>
        </div>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>日出時:</strong> 計算値 Z をそのまま採用 (N Z E)</li>
          <li><strong>日没時:</strong> 計算値 Z に W の符号を付す (N Z W)</li>
          <li><strong>ジャイロ誤差:</strong> 真方位 - ジャイロ方位</li>
        </ul>
      </div>

    </div>
  </div>
);

// --- Main Component ---
const MeripassCalculator = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'calculator' | 'gyro' | 'guide' | 'theory'>('calculator');

  // SEO Content
  const seoContent = {
    calculator: { title: "メリパス計算 (3N) | 航法計算アプリ", desc: "午前観測と正中観測から船位を決定するメリパス計算支援ツールです。" },
    gyro: { title: "出没方位角・ジャイロ誤差計算 | 航法計算アプリ", desc: "太陽の出没方位角(Amplitude)からジャイロコンパスの誤差を算出します。" },
    guide: { title: "利用ガイド | 航法計算アプリ", desc: "航法計算アプリの使い方と操作手順について解説します。" },
    theory: { title: "計算理論・公式 | 航法計算アプリ", desc: "メリパス計算や出没方位角計算に使用している数理モデルと公式の紹介です。" },
  };

  // --- Meripass States ---
  const [meta, setMeta] = useState({ 
    month: 8, day: 19, zoneLong: 135, zoneDir: 1 
  });
  const [morning, setMorning] = useState({
    drLat: { d: 37, m: 20, dir: 1 },
    drLong: { d: 146, m: 15, dir: 1 },
    hs: { d: 48, m: 10.2, dir: 1 },
    totalCorr: 9.6, totalCorrSign: 1,
    gha: { d: 315, m: 10.5, dir: 1 },
    dec: { d: 13, m: 2.8, dir: 1 } 
  });
  const [run, setRun] = useState({ course: 64, dist: 45 });
  const [noon, setNoon] = useState({
    hs: { d: 65, m: 8.3, dir: 1 },
    totalCorr: 9.8, totalCorrSign: 1,
    dec: { d: 13, m: 0.8, dir: 1 },
    eqTime: { m: 3, s: 47, sign: -1 } 
  });
  const [result, setResult] = useState<CalculationResult | null>(null);

  // --- Gyro States ---
  const [gyroInput, setGyroInput] = useState({
    lat: { d: 35, m: 0, dir: 1 },
    dec: { d: 10, m: 0, dir: 1 },
    gyroAzimuth: 0,
    type: 'rise' as 'rise' | 'set'
  });
  const [gyroResult, setGyroResult] = useState<GyroResult | null>(null);

  // --- Handlers ---
  const handleCalculateMeripass = () => {
    const lat1 = toDecimal(morning.drLat.d, morning.drLat.m) * morning.drLat.dir;
    const lon1 = toDecimal(morning.drLong.d, morning.drLong.m) * morning.drLong.dir;
    
    const { ho: ho1 } = calculateTrueAltitude(toDecimal(morning.hs.d, morning.hs.m), morning.totalCorr * morning.totalCorrSign);
    
    const gha1 = toDecimal(morning.gha.d, morning.gha.m);
    let lha1 = gha1 + lon1;
    while (lha1 >= 360) lha1 -= 360;
    while (lha1 < 0) lha1 += 360;

    const dec1 = toDecimal(morning.dec.d, morning.dec.m) * morning.dec.dir;
    const { hc: hc1, Z: z1 } = calculateSightReduction(lat1, dec1, lha1);
    const intercept1 = (ho1 - hc1) * 60; 

    const { dLat, dep, dLong, lat2: lat2_DR } = calculateRun(lat1, run.course, run.dist);
    let lon2_DR = lon1 + dLong;
    while (lon2_DR > 180) lon2_DR -= 360;
    while (lon2_DR <= -180) lon2_DR += 360;

    const { ho: ho2 } = calculateTrueAltitude(toDecimal(noon.hs.d, noon.hs.m), noon.totalCorr * noon.totalCorrSign);
    const dec2 = toDecimal(noon.dec.d, noon.dec.m) * noon.dec.dir;
    
    const zenithDist = 90 - ho2; 
    const latCandidate1 = dec2 + zenithDist; 
    const latCandidate2 = dec2 - zenithDist; 
    const lat2_Obs = Math.abs(latCandidate1 - lat2_DR) < Math.abs(latCandidate2 - lat2_DR) ? latCandidate1 : latCandidate2;

    const deltaL_miles = (lat2_Obs - lat2_DR) * 60;
    const { dLongCorr } = calculateMeripass(intercept1, z1, deltaL_miles, lat2_DR);
    
    let lon2_Obs = lon2_DR + (dLongCorr / 60);
    while (lon2_Obs > 180) lon2_Obs -= 360;
    while (lon2_Obs <= -180) lon2_Obs += 360;

    const eqtHours = (noon.eqTime.m + noon.eqTime.s/60) / 60 * noon.eqTime.sign;
    const lmtPass = 12 - eqtHours;
    const gmtPass = lmtPass - (lon2_DR / 15);
    const zoneOffset = Math.round(meta.zoneLong / 15) * meta.zoneDir;
    const ztPass = gmtPass + zoneOffset;

    setResult({
      lat1, lon1, gha1, lha1, dec1, ho1, hc1, z1, intercept1,
      dLat, dep, dLong, lat2_DR, lon2_DR,
      ho2, dec2, lat2_Obs,
      deltaL_miles, dLongCorr, lon2_Obs,
      lmtPass, gmtPass, ztPass, zoneOffset
    });

    if(window.innerWidth < 1024) setIsMenuOpen(false);
  };

  const handleCalculateGyro = () => {
    const lat = toDecimal(gyroInput.lat.d, gyroInput.lat.m) * gyroInput.lat.dir;
    const dec = toDecimal(gyroInput.dec.d, gyroInput.dec.m) * gyroInput.dec.dir;
    
    const Z = calculateAmplitude(lat, dec);
    
    // 日出(Rise)の場合は Z (0-180)、日没(Set)の場合は 360 - Z 
    // ※計算されたZは北基準の角度として扱われる（cos Z = sin d / cos l）
    let trueAzimuth360 = Z;
    if (gyroInput.type === 'set') {
      trueAzimuth360 = 360 - Z;
    }

    const gyroError = calculateGyroError(trueAzimuth360, gyroInput.gyroAzimuth);

    setGyroResult({
      trueAzimuthBase: Z,
      trueAzimuth360,
      gyroError,
      direction: gyroInput.type === 'rise' ? 'Rise' : 'Set'
    });

    if(window.innerWidth < 1024) setIsMenuOpen(false);
  };

  const changeView = (view: typeof currentView) => {
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>{seoContent[currentView].title}</title>
        <meta name="description" content={seoContent[currentView].desc} />
        <meta property="og:title" content={seoContent[currentView].title} />
        <meta property="og:description" content={seoContent[currentView].desc} />
      </Helmet>

      <div className="flex flex-col lg:flex-row h-screen bg-slate-100 text-slate-800 font-sans overflow-hidden">
        
        {/* Mobile Header */}
        <div className="lg:hidden bg-white p-4 shadow-sm flex items-center justify-between z-20 border-b border-slate-200">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Anchor className="text-blue-700" size={20} />
            航法計算アプリ
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className={`fixed inset-0 z-30 bg-black/50 transition-opacity lg:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)} />
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col shadow-2xl ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 border-b border-slate-700 bg-slate-950">
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Anchor className="text-blue-400" /> 航法計算
            </h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <button onClick={() => changeView('calculator')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${currentView === 'calculator' ? 'bg-blue-700 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
              <Calculator size={18} /> メリパス計算 (3N)
            </button>
            <button onClick={() => changeView('gyro')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${currentView === 'gyro' ? 'bg-emerald-700 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
              <Compass size={18} /> 出没方位角・誤差
            </button>
            <button onClick={() => changeView('guide')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${currentView === 'guide' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
              <HelpCircle size={18} /> 利用ガイド
            </button>
            <button onClick={() => changeView('theory')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${currentView === 'theory' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
              <BookOpen size={18} /> 理論
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          <div className="w-full lg:w-5/12 p-4 md:p-6 overflow-y-auto border-r border-slate-200 bg-white h-full scrollbar-thin">
            
            {/* View: Guide / Theory */}
            {(currentView === 'guide' || currentView === 'theory') && (
              <div className="prose prose-sm text-slate-600 p-4">
                {currentView === 'guide' ? <GuideView /> : <TheoryView />}
              </div>
            )}

            {/* View: Meripass Calculator */}
            {currentView === 'calculator' && (
            <div className="space-y-8 pb-20">
              <header>
                <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-blue-600 pl-3">Meripass Input</h2>
                <p className="text-xs text-slate-400 mt-1 pl-4">海技試験問題の値を入力してください</p>
              </header>

              {/* Date & Zone */}
              <section className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold text-sm uppercase tracking-wider">
                  <Clock size={16} /> Date & Zone
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex gap-2">
                    <input type="number" className="w-full p-2 border rounded text-center" value={meta.month} onChange={e => setMeta({...meta, month: +e.target.value})} placeholder="月" />
                    <span className="self-center">/</span>
                    <input type="number" className="w-full p-2 border rounded text-center" value={meta.day} onChange={e => setMeta({...meta, day: +e.target.value})} placeholder="日" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">標準子午線 (Zone)</span>
                    <div className="flex items-center gap-1 bg-white border border-slate-300 rounded p-1">
                      <input type="number" className="w-full text-right outline-none font-bold" value={meta.zoneLong} onChange={e => setMeta({...meta, zoneLong: +e.target.value})} />
                      <span className="text-xs">°</span>
                      <select className="bg-transparent font-bold text-sm outline-none" value={meta.zoneDir} onChange={e => setMeta({...meta, zoneDir: +e.target.value})}>
                          <option value={1}>E</option>
                          <option value={-1}>W</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* 1. Morning Sight */}
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-blue-50/50 px-4 py-2 border-b border-slate-100 flex items-center gap-2 font-bold text-blue-800 text-sm">
                  <MapPin size={16} /> 1. 第1観測 (Morning)
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <DMSInput label="推測緯度" value={morning.drLat} onChange={(v:any) => setMorning({...morning, drLat: v})} showSign={true} signType="NS" />
                    <DMSInput label="推測経度" value={morning.drLong} onChange={(v:any) => setMorning({...morning, drLong: v})} showSign={true} signType="EW" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-slate-200">
                    <DMSInput label="器械高度 (hs)" value={morning.hs} onChange={(v:any) => setMorning({...morning, hs: v})} />
                    <div>
                        <label className="text-[10px] text-slate-500 font-bold block">改正総数 (Corr)</label>
                        <div className="flex items-center gap-1 mt-1">
                          <select className="bg-slate-50 border rounded p-1.5 text-sm font-bold" value={morning.totalCorrSign} onChange={e => setMorning({...morning, totalCorrSign: +e.target.value})}>
                              <option value={1}>+</option><option value={-1}>-</option>
                          </select>
                          <input type="number" className="w-full p-1.5 border rounded text-right text-sm" value={morning.totalCorr} onChange={e => setMorning({...morning, totalCorr: +e.target.value})} />
                          <span className="text-xs">'</span>
                        </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-dashed border-slate-200 grid grid-cols-2 gap-4">
                      <DMSInput label="GHA (Sun)" value={morning.gha} onChange={(v:any) => setMorning({...morning, gha: v})} />
                      <DMSInput label="赤緯 (Dec)" value={morning.dec} onChange={(v:any) => setMorning({...morning, dec: v})} showSign={true} signType="NS" />
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
                      <div className="flex items-center gap-2 mt-1"><input type="number" className="w-full p-2 border rounded font-mono" value={run.course} onChange={e => setRun({...run, course: +e.target.value})} /><span className="text-sm">°</span></div>
                  </div>
                  <div>
                      <span className="text-[10px] text-slate-500 font-bold">航程 (Dist)</span>
                      <div className="flex items-center gap-2 mt-1"><input type="number" className="w-full p-2 border rounded font-mono" value={run.dist} onChange={e => setRun({...run, dist: +e.target.value})} /><span className="text-sm">miles</span></div>
                  </div>
                </div>
              </section>

              {/* 3. Noon Sight */}
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-orange-50/50 px-4 py-2 border-b border-slate-100 flex items-center gap-2 font-bold text-orange-800 text-sm">
                  <Sun size={16} /> 3. 正中観測 (Noon)
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4 pb-2 border-b border-dashed border-slate-200">
                      <DMSInput label="赤緯 (Dec)" value={noon.dec} onChange={(v:any) => setNoon({...noon, dec: v})} showSign={true} signType="NS" />
                      <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Eq. of Time</span>
                          <div className="flex items-center gap-1 mt-1">
                              <select className="bg-white border rounded p-1 text-sm" value={noon.eqTime.sign} onChange={e => setNoon({...noon, eqTime: {...noon.eqTime, sign: +e.target.value}})}><option value={1}>+</option><option value={-1}>-</option></select>
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
                          <select className="bg-slate-50 border rounded p-1.5 text-sm font-bold" value={noon.totalCorrSign} onChange={e => setNoon({...noon, totalCorrSign: +e.target.value})}><option value={1}>+</option><option value={-1}>-</option></select>
                          <input type="number" className="w-full p-1.5 border rounded text-right text-sm" value={noon.totalCorr} onChange={e => setNoon({...noon, totalCorr: +e.target.value})} />
                          <span className="text-xs">'</span>
                        </div>
                    </div>
                  </div>
                </div>
              </section>

              <button onClick={handleCalculateMeripass} className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
                <Calculator size={20} /> 計算実行 (RUN)
              </button>
            </div>
            )}

            {/* View: Gyro Calculator */}
            {currentView === 'gyro' && (
            <div className="space-y-8 pb-20">
              <header>
                <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-emerald-600 pl-3">Gyro & Amplitude</h2>
                <p className="text-xs text-slate-400 mt-1 pl-4">出没方位角とジャイロ誤差を算出します</p>
              </header>

              <section className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <DMSInput label="推測緯度 (Lat)" value={gyroInput.lat} onChange={(v:any) => setGyroInput({...gyroInput, lat: v})} showSign={true} signType="NS" />
                  <DMSInput label="赤緯 (Dec)" value={gyroInput.dec} onChange={(v:any) => setGyroInput({...gyroInput, dec: v})} showSign={true} signType="NS" />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold block uppercase mb-1">Calculation Type</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setGyroInput({...gyroInput, type: 'rise'})}
                      className={`flex-1 py-2 px-4 rounded-lg font-bold border ${gyroInput.type === 'rise' ? 'bg-orange-100 border-orange-400 text-orange-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                    >
                      日出 (Sunrise)
                    </button>
                    <button 
                      onClick={() => setGyroInput({...gyroInput, type: 'set'})}
                      className={`flex-1 py-2 px-4 rounded-lg font-bold border ${gyroInput.type === 'set' ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                    >
                      日没 (Sunset)
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Gyro Azimuth</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input 
                      type="number" 
                      className="flex-1 p-2 border rounded font-mono text-lg font-bold" 
                      value={gyroInput.gyroAzimuth} 
                      onChange={e => setGyroInput({...gyroInput, gyroAzimuth: +e.target.value})} 
                      placeholder="000.0" 
                    />
                    <span className="text-sm font-bold">°</span>
                  </div>
                </div>

                <button onClick={handleCalculateGyro} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2">
                  <Compass size={20} /> 計算実行 (CALC)
                </button>
              </section>
            </div>
            )}
          </div>

          {/* --- Right Panel (Output) --- */}
          <div className="w-full lg:w-7/12 bg-[#fffdf5] p-8 md:p-10 border-l border-slate-200 overflow-y-auto font-mono text-slate-800 relative shadow-inner min-h-[50vh] lg:h-full">
              <div className="absolute top-6 right-6 opacity-5 pointer-events-none"><FileText size={200} /></div>
              <div className="border-b-2 border-slate-800 pb-4 mb-8 flex justify-between items-end">
                  <h2 className="text-2xl font-bold tracking-tight">Calculation Sheet</h2>
                  <span className="text-xs font-sans text-slate-500">
                    {currentView === 'gyro' ? 'Gyro Error Form' : '3N Navigation Form'}
                  </span>
              </div>

              {/* Meripass Result Display */}
              {currentView === 'calculator' && (
                !result ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                      <Info size={48} className="mb-4 opacity-20" />
                      <p>No Data Calculated</p>
                  </div>
                ) : (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {/* 1. Run Calculation */}
                      <div className="relative">
                          <h3 className="text-sm font-bold bg-slate-800 text-white inline-block px-3 py-1 mb-3">1. D.R.P at Noon</h3>
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
                                      <div className="text-xs text-slate-500 mt-1">Zone Offset: {result.zoneOffset > 0 ? '+' : ''}{result.zoneOffset}</div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* 3. Sights */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                              <h3 className="text-sm font-bold bg-blue-700 text-white inline-block px-3 py-1 mb-3">3. Morning Sight</h3>
                              <div className="bg-white border border-slate-300 p-4 text-sm space-y-1 shadow-sm">
                                  <div className="flex justify-between"><span>hs</span> <span>{morning.hs.d}-{morning.hs.m}</span></div>
                                  <div className="flex justify-between text-xs text-slate-500"><span>(Total Corr)</span> <span>{morning.totalCorrSign>=0?'+':'-'}{morning.totalCorr}'</span></div>
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
                                      Intercept: {result.intercept1.toFixed(1)}' {result.intercept1>=0?'T':'A'}
                                  </div>
                              </div>
                          </div>

                          <div>
                              <h3 className="text-sm font-bold bg-orange-700 text-white inline-block px-3 py-1 mb-3">4. Noon Sight</h3>
                              <div className="bg-white border border-slate-300 p-4 text-sm space-y-1 shadow-sm">
                                  <div className="flex justify-between"><span>hs</span> <span>{noon.hs.d}-{noon.hs.m}</span></div>
                                  <div className="flex justify-between text-xs text-slate-500"><span>(Corr)</span> <span>{noon.totalCorrSign>=0?'+':'-'}{noon.totalCorr}'</span></div>
                                  <div className="flex justify-between font-bold border-b border-slate-300 pb-1 mb-1"><span>Ho</span> <span>{formatDMS(result.ho2, 'angle')}</span></div>
                                  <div className="flex justify-between"><span>90° - Ho</span> <span>{formatDMS(90 - result.ho2, 'angle')} (z)</span></div>
                                  <div className="flex justify-between"><span>Dec</span> <span>{formatDMS(result.dec2, 'lat')}</span></div>
                                  <div className="flex justify-between font-bold border-t border-slate-300 pt-1 mt-1"><span>Obs Lat</span> <span>{formatDMS(result.lat2_Obs, 'lat')}</span></div>
                              </div>
                          </div>
                      </div>

                      {/* 5. Fix */}
                      <div className="relative">
                          <h3 className="text-sm font-bold bg-slate-800 text-white inline-block px-3 py-1 mb-3">5. Fix (Meripass)</h3>
                          <div className="bg-slate-100 border-2 border-slate-400 p-6">
                              <div className="flex justify-around items-center mb-4 text-sm">
                                  <div><p className="font-bold">Δl (Lat Diff)</p><p>{(result.lat2_Obs - result.lat2_DR)*60 >= 0 ? '+' : ''}{((result.lat2_Obs - result.lat2_DR)*60).toFixed(1)}'</p></div>
                                  <div><p className="font-bold">Intercept (I)</p><p>{result.intercept1.toFixed(1)}'</p></div>
                                  <div><p className="font-bold">Azimuth (Z)</p><p>{result.z1.toFixed(1)}°</p></div>
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
                )
              )}

              {/* Gyro Result Display */}
              {currentView === 'gyro' && (
                !gyroResult ? (
                   <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                      <Compass size={48} className="mb-4 opacity-20" />
                      <p>Enter data and press CALC</p>
                  </div>
                ) : (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                     <div className="relative">
                        <h3 className="text-sm font-bold bg-emerald-700 text-white inline-block px-3 py-1 mb-3">Amplitude Calculation</h3>
                        <div className="bg-white border border-slate-300 p-6 text-sm shadow-sm space-y-4">
                          
                          <div className="grid grid-cols-2 gap-8 border-b border-slate-200 pb-4">
                             <div>
                               <p className="text-slate-500 text-xs uppercase font-bold">Condition</p>
                               <p className="text-xl font-bold text-slate-800">{gyroResult.direction}</p>
                             </div>
                             <div className="text-right">
                               <p className="text-slate-500 text-xs uppercase font-bold">True Azimuth (Base)</p>
                               <p className="text-lg font-mono">
                                 N {gyroResult.trueAzimuthBase.toFixed(1)}° {gyroResult.direction === 'Rise' ? 'E' : 'W'}
                               </p>
                             </div>
                          </div>

                          <div>
                             <div className="flex justify-between items-center mb-2">
                               <span className="font-bold text-slate-600">True Azimuth (360°)</span>
                               <span className="font-mono text-xl font-bold">{gyroResult.trueAzimuth360.toFixed(1)}°</span>
                             </div>
                             <div className="flex justify-between items-center mb-2">
                               <span className="font-bold text-slate-600">Gyro Azimuth</span>
                               <span className="font-mono text-xl">{gyroInput.gyroAzimuth.toFixed(1)}°</span>
                             </div>
                             <div className="mt-4 pt-4 border-t-2 border-slate-800 flex justify-between items-center bg-slate-50 p-4">
                               <span className="font-bold text-emerald-800">Gyro Error</span>
                               <span className="font-mono text-3xl font-bold text-emerald-700">
                                 {Math.abs(gyroResult.gyroError).toFixed(1)}° {gyroResult.gyroError > 0 ? 'E (Low)' : gyroResult.gyroError < 0 ? 'W (High)' : ''}
                               </span>
                             </div>
                             <p className="text-xs text-right text-slate-400 mt-2">Error = True - Gyro</p>
                          </div>

                        </div>
                     </div>
                  </div>
                )
              )}
          </div>

        </main>
      </div>
    </>
  );
};

export default MeripassCalculator;