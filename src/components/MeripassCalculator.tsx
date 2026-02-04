import React, { useState } from 'react';
import { Calculator, Anchor, FileText, Sun, Navigation, Map } from 'lucide-react';
import { 
  toDecimal, formatDMS, rad, deg, 
  calculateTrueAltitude, calculateRun, calculateSightReduction, 
  calculateMeridianLat, calculateMeripass 
} from '../utils/navigationMath';

// --- Types ---
type DMS = { d: number, m: number, s?: number };
const dmsVal = (dms: DMS, sign: number = 1) => toDecimal(dms.d, dms.m, dms.s || 0) * sign;

const MeripassCalculator = () => {
  // --- Input State ---
  const [date, setDate] = useState({ month: 8, day: 19 });
  const [zone, setZone] = useState(-9); // JST = -9
  
  // 1. Morning Sight
  const [morning, setMorning] = useState({
    time: { h: 9, m: 0, s: 0 },
    drLat: { d: 37, m: 20, dir: 1 }, // 1=N
    drLong: { d: 146, m: 15, dir: 1 }, // 1=E
    hs: { d: 48, m: 10.2 }, // Sextant Alt
    ie: 1.5, // Index Error
    dip: 15, // Height of eye (m) -> calculates dip, or direct dip value? Let's use direct dip for simplicity or input height
    sunCorr: 14.3, // Total Sun correction (Refraction, SD, Parallax)
    // Almanac Data
    gha: { d: 315, m: 10.5 }, // GHA at observation time
    dec: { d: 13, m: 2.8, dir: 1 }, // Declination
  });

  // 2. Run
  const [run, setRun] = useState({
    course: 64, // True Course
    dist: 45,   // Distance
  });

  // 3. Noon Sight
  const [noon, setNoon] = useState({
    hs: { d: 65, m: 8.3 },
    ie: 1.5,
    dip: 15,
    sunCorr: 15.5,
    // Almanac Data
    dec: { d: 13, m: 0.8, dir: 1 },
    eqOfT: { m: 3, s: 47, sign: -1 }, // Equation of Time (Mean Time - Apparent Time)
  });

  const [result, setResult] = useState<any>(null);

  // --- Calculation Handler ---
  const handleCalculate = () => {
    // --- 1. Morning Sight Reduction ---
    // Altitude
    // Dip calculation approximation: 1.76 * sqrt(height). Let's assume input is dip directly or handle roughly.
    // User requested "correction values to input", so we use inputs directly.
    // Dip is usually negative correction, SunCorr is usually positive.
    // Let's assume 'dip' input is the value in minutes to subtract.
    const dipVal = 1.76 * Math.sqrt(morning.dip); // Calculate dip from height (m)
    const { ho: ho1 } = calculateTrueAltitude(dmsVal(morning.hs), morning.ie, dipVal, morning.sunCorr);
    
    // LHA
    const gha1 = dmsVal(morning.gha);
    const lon1 = dmsVal(morning.drLong, morning.drLong.dir);
    let lha1 = gha1 + lon1;
    while (lha1 >= 360) lha1 -= 360;
    while (lha1 < 0) lha1 += 360;

    // Calculate Hc, Z, Intercept
    const lat1 = dmsVal(morning.drLat, morning.drLat.dir);
    const dec1 = dmsVal(morning.dec, morning.dec.dir);
    const { hc: hc1, Z: z1 } = calculateSightReduction(lat1, dec1, lha1);
    const intercept = (ho1 - hc1) * 60; // in miles

    // --- 2. Run Calculation (Middle Latitude) ---
    const { dLat, dep, dLong, lat2: lat2_DR } = calculateRun(lat1, run.course, run.dist);
    const lon2_DR = lon1 + dLong;

    // --- 3. Noon Sight Reduction ---
    const dipValNoon = 1.76 * Math.sqrt(noon.dip);
    const { ho: ho2 } = calculateTrueAltitude(dmsVal(noon.hs), noon.ie, dipValNoon, noon.sunCorr);
    const dec2 = dmsVal(noon.dec, noon.dec.dir);
    
    // Latitude by Meridian Altitude
    // Lat = (90 - Ho) + Dec (Same Name, Lat > Dec)
    // Simplified assumption for 3N exam context (usually North Lat, Sun South)
    const zenithDist = 90 - ho2;
    const lat2_Obs = dec2 + zenithDist;

    // --- 4. Fix (Meripass Logic) ---
    const deltaL_miles = (lat2_Obs - lat2_DR) * 60; // Delta Lat in miles
    const { dLongCorr } = calculateMeripass(intercept, z1, deltaL_miles, lat2_DR);
    const lon2_Obs = lon2_DR + (dLongCorr / 60);

    // --- Time of Meridian Passage (Passage) ---
    // LMT = 12:00:00 - Eq.of.T (approx)
    // This is complex, but let's approximate LMT of Mer Pass as 12h - EqT
    // Then Longitude in Time
    const eqtVal = (noon.eqOfT.m + noon.eqOfT.s/60) / 60 * noon.eqOfT.sign; // hours
    const lmtPass = 12 - eqtVal;
    // GMT = LMT - Long/15
    const gmtPass = lmtPass - (lon2_DR / 15);
    // ZT = GMT + Zone
    const ztPass = gmtPass - zone; // Zone is usually like -9 for JST? Or +9?
    // Usually JST is -9 in nautical notation (GMT = ZT + Zone). So ZT = GMT - (-9).
    
    setResult({
      lat1, lon1,
      lha1, hc1, z1, intercept,
      dLat, dep, dLong,
      lat2_DR, lon2_DR,
      ho1, ho2,
      lat2_Obs,
      deltaL_miles,
      dLongCorr,
      lon2_Obs,
      ztPass,
      dipVal, dipValNoon
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-800">
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* --- Header --- */}
        <div className="lg:col-span-12 bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Anchor className="text-blue-600" />
              メリパス計算 (3N天測計算対応版)
            </h1>
            <p className="text-slate-500 text-sm mt-1">Celestial Navigation Calculator for 3rd Grade Navigator</p>
          </div>
          <div className="flex gap-4 text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400">DATE</span>
              <span className="font-bold">{date.month}月 {date.day}日</span>
            </div>
            <div className="w-px bg-slate-300"></div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400">ZONE</span>
              <span className="font-bold">UT {zone >= 0 ? '+' : ''}{zone}</span>
            </div>
          </div>
        </div>

        {/* --- Left Column: Input Forms (Examination Style) --- */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. First Observation (Morning) */}
          <section className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex items-center gap-2">
              <Sun size={18} className="text-blue-600" />
              <h2 className="font-bold text-blue-800">1. 第1観測 (Morning Sight)</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">DR Lat ($l_1$)</label>
                  <div className="flex gap-1 mt-1">
                    <input type="number" className="w-14 p-1 border rounded text-right" value={morning.drLat.d} onChange={e=>setMorning({...morning, drLat:{...morning.drLat, d:+e.target.value}})} />
                    <span className="self-center">°</span>
                    <input type="number" className="w-14 p-1 border rounded text-right" value={morning.drLat.m} onChange={e=>setMorning({...morning, drLat:{...morning.drLat, m:+e.target.value}})} />
                    <span className="self-center">'</span>
                    <select className="p-1 border rounded bg-slate-50" value={morning.drLat.dir} onChange={e=>setMorning({...morning, drLat:{...morning.drLat, dir:+e.target.value}})}>
                      <option value={1}>N</option><option value={-1}>S</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">DR Long ($\lambda_1$)</label>
                  <div className="flex gap-1 mt-1">
                    <input type="number" className="w-14 p-1 border rounded text-right" value={morning.drLong.d} onChange={e=>setMorning({...morning, drLong:{...morning.drLong, d:+e.target.value}})} />
                    <span className="self-center">°</span>
                    <input type="number" className="w-14 p-1 border rounded text-right" value={morning.drLong.m} onChange={e=>setMorning({...morning, drLong:{...morning.drLong, m:+e.target.value}})} />
                    <span className="self-center">'</span>
                    <select className="p-1 border rounded bg-slate-50" value={morning.drLong.dir} onChange={e=>setMorning({...morning, drLong:{...morning.drLong, dir:+e.target.value}})}>
                      <option value={1}>E</option><option value={-1}>W</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="col-span-2 font-bold text-slate-600 mb-1 border-b border-slate-200 pb-1">Observation Data</div>
                  <div>
                    <label className="block text-xs text-slate-500">Sextant Alt ($h_s$)</label>
                    <div className="flex gap-1">
                      <input type="number" className="w-full p-1 border rounded text-right" value={morning.hs.d} onChange={e=>setMorning({...morning, hs:{...morning.hs, d:+e.target.value}})} />
                      <span className="self-center">°</span>
                      <input type="number" className="w-full p-1 border rounded text-right" value={morning.hs.m} onChange={e=>setMorning({...morning, hs:{...morning.hs, m:+e.target.value}})} />
                      <span className="self-center">'</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500">Index Error (IC)</label>
                    <input type="number" className="w-full p-1 border rounded text-right" value={morning.ie} onChange={e=>setMorning({...morning, ie:+e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500">Height of Eye (m)</label>
                    <input type="number" className="w-full p-1 border rounded text-right" value={morning.dip} onChange={e=>setMorning({...morning, dip:+e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500">Total Corr (Sun)</label>
                    <input type="number" className="w-full p-1 border rounded text-right" value={morning.sunCorr} onChange={e=>setMorning({...morning, sunCorr:+e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="col-span-2 font-bold text-yellow-800 mb-1 border-b border-yellow-200 pb-1">Almanac Data (航海暦)</div>
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-500">GHA (Sun)</label>
                    <div className="flex gap-1">
                      <input type="number" className="w-20 p-1 border rounded text-right" value={morning.gha.d} onChange={e=>setMorning({...morning, gha:{...morning.gha, d:+e.target.value}})} />
                      <span className="self-center">°</span>
                      <input type="number" className="w-20 p-1 border rounded text-right" value={morning.gha.m} onChange={e=>setMorning({...morning, gha:{...morning.gha, m:+e.target.value}})} />
                      <span className="self-center">'</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-500">Declination (d)</label>
                    <div className="flex gap-1">
                      <input type="number" className="w-20 p-1 border rounded text-right" value={morning.dec.d} onChange={e=>setMorning({...morning, dec:{...morning.dec, d:+e.target.value}})} />
                      <span className="self-center">°</span>
                      <input type="number" className="w-20 p-1 border rounded text-right" value={morning.dec.m} onChange={e=>setMorning({...morning, dec:{...morning.dec, m:+e.target.value}})} />
                      <span className="self-center">'</span>
                      <select className="p-1 border rounded bg-white" value={morning.dec.dir} onChange={e=>setMorning({...morning, dec:{...morning.dec, dir:+e.target.value}})}>
                        <option value={1}>N</option><option value={-1}>S</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Run to Noon */}
          <section className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
              <Navigation size={18} className="text-slate-600" />
              <h2 className="font-bold text-slate-800">2. 航走 (Run to Noon)</h2>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">True Course</label>
                <div className="flex items-center gap-2">
                  <input type="number" className="w-full p-2 border rounded" value={run.course} onChange={e=>setRun({...run, course:+e.target.value})} />
                  <span>°</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Distance</label>
                <div className="flex items-center gap-2">
                  <input type="number" className="w-full p-2 border rounded" value={run.dist} onChange={e=>setRun({...run, dist:+e.target.value})} />
                  <span>nm</span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Second Observation (Noon) */}
          <section className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-orange-50 px-4 py-3 border-b border-orange-100 flex items-center gap-2">
              <Sun size={18} className="text-orange-600" />
              <h2 className="font-bold text-orange-800">3. 第2観測 (Noon Sight)</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="col-span-2 font-bold text-slate-600 mb-1">Observation Data</div>
                  <div>
                    <label className="block text-xs text-slate-500">Meridian Alt ($h_s$)</label>
                    <div className="flex gap-1">
                      <input type="number" className="w-full p-1 border rounded text-right" value={noon.hs.d} onChange={e=>setNoon({...noon, hs:{...noon.hs, d:+e.target.value}})} />
                      <span className="self-center">°</span>
                      <input type="number" className="w-full p-1 border rounded text-right" value={noon.hs.m} onChange={e=>setNoon({...noon, hs:{...noon.hs, m:+e.target.value}})} />
                      <span className="self-center">'</span>
                    </div>
                  </div>
                  {/* Reuse corrections from morning usually, but allow edit if needed. For simplicity assuming same observer/conditions mostly, but let's allow editing */}
                  <div>
                    <label className="block text-xs text-slate-500">Index Error</label>
                    <input type="number" className="w-full p-1 border rounded text-right" value={noon.ie} onChange={e=>setNoon({...noon, ie:+e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500">Height of Eye</label>
                    <input type="number" className="w-full p-1 border rounded text-right" value={noon.dip} onChange={e=>setNoon({...noon, dip:+e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500">Total Corr</label>
                    <input type="number" className="w-full p-1 border rounded text-right" value={noon.sunCorr} onChange={e=>setNoon({...noon, sunCorr:+e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="col-span-2 font-bold text-yellow-800 mb-1">Almanac Data (Noon)</div>
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-500">Declination (d)</label>
                    <div className="flex gap-1">
                      <input type="number" className="w-20 p-1 border rounded text-right" value={noon.dec.d} onChange={e=>setNoon({...noon, dec:{...noon.dec, d:+e.target.value}})} />
                      <span className="self-center">°</span>
                      <input type="number" className="w-20 p-1 border rounded text-right" value={noon.dec.m} onChange={e=>setNoon({...noon, dec:{...noon.dec, m:+e.target.value}})} />
                      <span className="self-center">'</span>
                      <select className="p-1 border rounded bg-white" value={noon.dec.dir} onChange={e=>setNoon({...noon, dec:{...noon.dec, dir:+e.target.value}})}>
                        <option value={1}>N</option><option value={-1}>S</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-500">Eq. of Time</label>
                    <div className="flex gap-1">
                      <select className="p-1 border rounded bg-white" value={noon.eqOfT.sign} onChange={e=>setNoon({...noon, eqOfT:{...noon.eqOfT, sign:+e.target.value}})}>
                        <option value={1}>+</option><option value={-1}>-</option>
                      </select>
                      <input type="number" className="w-20 p-1 border rounded text-right" value={noon.eqOfT.m} onChange={e=>setNoon({...noon, eqOfT:{...noon.eqOfT, m:+e.target.value}})} />
                      <span className="self-center">m</span>
                      <input type="number" className="w-20 p-1 border rounded text-right" value={noon.eqOfT.s} onChange={e=>setNoon({...noon, eqOfT:{...noon.eqOfT, s:+e.target.value}})} />
                      <span className="self-center">s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <button 
            onClick={handleCalculate}
            className="w-full py-4 bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:bg-blue-800 transition flex justify-center items-center gap-3 text-lg"
          >
            <Calculator size={24} /> 計算実行
          </button>

        </div>

        {/* --- Right Column: Calculation Sheet (Paper Style) --- */}
        <div className="lg:col-span-7">
          <div className="bg-white border-2 border-slate-300 rounded-sm shadow-xl min-h-[800px] p-8 font-mono text-slate-800 relative">
            {/* Watermark / BG styling */}
            <div className="absolute top-4 right-4 text-slate-200 pointer-events-none">
              <FileText size={160} />
            </div>
            
            <h2 className="text-xl font-bold border-b-4 border-double border-slate-800 pb-2 mb-8 text-center uppercase tracking-widest">
              Calculation Sheet
            </h2>

            {!result ? (
              <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                <Map size={48} className="mb-4 opacity-50" />
                <p>数値を入力して「計算実行」を押してください</p>
                <p className="text-xs mt-2">試験用紙形式で計算過程が表示されます</p>
              </div>
            ) : (
              <div className="space-y-8 text-sm">
                
                {/* --- 1. Run Calculation (Grid Layout) --- */}
                <div className="border border-slate-800 p-4 relative">
                  <span className="absolute -top-3 left-4 bg-white px-2 font-bold text-slate-600">I. D.R.P at Noon (中分緯度航法)</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p>Run: {run.course}° × {run.dist}'</p>
                      <p>DR Lat1: {formatDMS(result.lat1, 'lat')}</p>
                      <p className="pl-4">D.Lat: {result.dLat >= 0 ? '+' : ''}{(result.dLat*60).toFixed(1)}' ({result.dLat >= 0 ? 'N' : 'S'})</p>
                      <p className="border-t border-slate-400 font-bold">DR Lat2: {formatDMS(result.lat2_DR, 'lat')}</p>
                    </div>
                    <div className="space-y-1 border-l border-slate-300 pl-4">
                      <p>Mean Lat: {formatDMS((result.lat1 + result.lat2_DR)/2, 'lat')}</p>
                      <p>Dep: {(result.dep).toFixed(1)}'</p>
                      <p>D.Long: {result.dLong >= 0 ? '+' : ''}{(result.dLong*60).toFixed(1)}'</p>
                      <p>DR Long1: {formatDMS(result.lon1, 'lon')}</p>
                      <p className="border-t border-slate-400 font-bold">DR Long2: {formatDMS(result.lon2_DR, 'lon')}</p>
                    </div>
                  </div>
                </div>

                {/* --- 2. Meridian Passage Time --- */}
                <div className="border border-slate-800 p-4 relative">
                  <span className="absolute -top-3 left-4 bg-white px-2 font-bold text-slate-600">II. Time of Meridian Passage</span>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="grid grid-cols-[100px_1fr] gap-2">
                        <span>L.A.T. Noon</span> <span>12-00-00</span>
                        <span>Eq. of T.</span> <span>{noon.eqOfT.sign < 0 ? '-' : '+'}{String(noon.eqOfT.m).padStart(2,'0')}-{String(noon.eqOfT.s).padStart(2,'0')} (reverse sign)</span>
                        <span className="border-t border-slate-400">L.M.T.</span> <span className="border-t border-slate-400">{(12 - (noon.eqOfT.m*60+noon.eqOfT.s)/3600 * noon.eqOfT.sign).toFixed(4)} h</span>
                        <span>Long. (T)</span> <span>- {formatDMS(result.lon2_DR, 'lon')} ({((result.lon2_DR/15)).toFixed(4)}h)</span>
                        <span className="border-t border-slate-400">G.M.T.</span> <span className="border-t border-slate-400">{(result.ztPass + zone).toFixed(4)} h</span>
                        <span>Zone</span> <span>{zone > 0 ? '-' : '+'}{Math.abs(zone)}h</span>
                        <span className="border-t border-slate-800 font-bold">S.M.T. (ZT)</span> <span className="border-t border-slate-800 font-bold">{Math.floor(result.ztPass)}h {Math.floor((result.ztPass%1)*60)}m {Math.floor(((result.ztPass%1)*60%1)*60)}s</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* --- 3. First Observation (Morning) --- */}
                  <div className="border border-slate-800 p-4 relative">
                    <span className="absolute -top-3 left-4 bg-white px-2 font-bold text-slate-600">III. Morning Sight</span>
                    <div className="space-y-2">
                      <div className="text-right border-b pb-1 mb-2 font-bold">First Obs (0900)</div>
                      <div className="flex justify-between"><span>hs</span> <span>{morning.hs.d}-{morning.hs.m}</span></div>
                      <div className="flex justify-between text-xs text-slate-500"><span>(Corr)</span> <span>+{(morning.ie - (1.76*Math.sqrt(morning.dip)) + morning.sunCorr).toFixed(1)}'</span></div>
                      <div className="flex justify-between font-bold border-t border-dashed"><span>Ho ($a_t$)</span> <span>{formatDMS(result.ho1, 'angle')}</span></div>
                      <div className="my-2 border-t border-slate-300"></div>
                      <div className="flex justify-between"><span>GHA</span> <span>{morning.gha.d}-{morning.gha.m}</span></div>
                      <div className="flex justify-between"><span>Long</span> <span>{result.lon1 >= 0 ? '+' : '-'}{formatDMS(Math.abs(result.lon1), 'angle')}</span></div>
                      <div className="flex justify-between font-bold border-t"><span>LHA ($t$)</span> <span>{result.lha1.toFixed(1)}°</span></div>
                      <div className="flex justify-between"><span>Lat ($l$)</span> <span>{formatDMS(result.lat1, 'lat')}</span></div>
                      <div className="flex justify-between"><span>Dec ($d$)</span> <span>{formatDMS(dmsVal(morning.dec, morning.dec.dir), 'lat')}</span></div>
                      <div className="my-2 border-t border-slate-300"></div>
                      <div className="flex justify-between"><span>$h_c$</span> <span>{formatDMS(result.hc1, 'angle')}</span></div>
                      <div className="flex justify-between font-bold"><span>Azimuth ($Z$)</span> <span>{result.z1.toFixed(1)}°</span></div>
                      <div className="mt-2 bg-slate-100 p-1 text-center font-bold border border-slate-400">
                        Intercept (I): {result.intercept.toFixed(1)}' {result.intercept >= 0 ? 'T' : 'A'}
                      </div>
                    </div>
                  </div>

                  {/* --- 4. Second Observation (Noon) --- */}
                  <div className="border border-slate-800 p-4 relative">
                    <span className="absolute -top-3 left-4 bg-white px-2 font-bold text-slate-600">IV. Noon Sight</span>
                    <div className="space-y-2">
                      <div className="text-right border-b pb-1 mb-2 font-bold">Meridian Obs</div>
                      <div className="flex justify-between"><span>hs</span> <span>{noon.hs.d}-{noon.hs.m}</span></div>
                      <div className="flex justify-between"><span>IC</span> <span>{noon.ie >= 0 ? '+' : ''}{noon.ie}'</span></div>
                      <div className="flex justify-between"><span>Dip</span> <span>-{result.dipValNoon.toFixed(1)}'</span></div>
                      <div className="flex justify-between"><span>Sun Corr</span> <span>+{noon.sunCorr}'</span></div>
                      <div className="flex justify-between font-bold border-t border-dashed"><span>Ho ($a_{mer}$)</span> <span>{formatDMS(result.ho2, 'angle')}</span></div>
                      <div className="my-2 border-t border-slate-300"></div>
                      <div className="flex justify-between"><span>90° - Ho</span> <span>{formatDMS(90 - result.ho2, 'angle')} (Z.D.)</span></div>
                      <div className="flex justify-between"><span>Dec ($d$)</span> <span>{formatDMS(dmsVal(noon.dec, noon.dec.dir), 'lat')}</span></div>
                      <div className="mt-2 bg-slate-100 p-1 text-center font-bold border border-slate-400">
                        Obs Lat ($l_{obs}$): {formatDMS(result.lat2_Obs, 'lat')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- 5. Final Fix (Calculation) --- */}
                <div className="border-2 border-blue-800 p-6 relative bg-blue-50/30">
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-4 border border-blue-800 font-bold text-blue-900 shadow-sm">V. POSITION LINE & FIX</span>
                  
                  <div className="flex flex-col md:flex-row gap-8 justify-around items-center">
                    <div className="text-sm space-y-2">
                      <p><strong>Δl (Obs - DR):</strong> {(result.lat2_Obs - result.lat2_DR)*60 >= 0 ? '+' : ''}{((result.lat2_Obs - result.lat2_DR)*60).toFixed(1)}'</p>
                      <p><strong>Intercept (I):</strong> {result.intercept.toFixed(1)}'</p>
                      <p><strong>Azimuth (Z):</strong> {result.z1.toFixed(1)}°</p>
                      <div className="p-2 border border-slate-400 mt-2 bg-white text-center">
                        <p className="text-xs text-slate-500">ΔL Formula</p>
                        <p>$\Delta L = \frac{I \cdot \csc Z - \Delta l \cdot \cot Z}{\cos l_0}$</p>
                        <p className="font-bold text-lg mt-1">{result.dLongCorr.toFixed(1)}'</p>
                      </div>
                    </div>

                    <div className="text-center p-4 border-4 border-double border-slate-800 bg-white shadow-lg">
                      <h3 className="underline font-bold mb-2">NOON FIX</h3>
                      <p className="text-2xl font-bold mb-1">{formatDMS(result.lat2_Obs, 'lat')}</p>
                      <p className="text-2xl font-bold">{formatDMS(result.lon2_Obs, 'lon')}</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MeripassCalculator;