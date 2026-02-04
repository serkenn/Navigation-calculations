import React, { useState } from 'react';
import { Calculator, ArrowRight, Sun, Anchor, FileText } from 'lucide-react';
import { toDecimal, formatDMS, rad, calculateRun, calculateMeripass } from '../utils/navigationMath';

const MeripassCalculator = () => {
  // 入力ステート (午前観測, 航走, 正中観測)
  const [morning, setMorning] = useState({
    time: "09:00",
    lat: { d: 37, m: 20, s: 0, dir: 1 }, // 1=N, -1=S
    lon: { d: 146, m: 15, s: 0, dir: 1 }, // 1=E, -1=W
    obsAlt: { d: 48, m: 10.2 }, // 観測高度
    intercept: 3.5, // Intercept
    azimuth: 115.4, // Azimuth (Zn)
  });

  const [run, setRun] = useState({
    course: 64,
    distance: 45,
  });

  const [noon, setNoon] = useState({
    obsAlt: { d: 65, m: 8.3 },
    dec: { d: 13, m: 0.8, dir: 1 }, // 1=N, -1=S
  });

  // 計算結果ステート
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    // 1. データ準備
    const lat1 = toDecimal(morning.lat.d, morning.lat.m, morning.lat.s) * morning.lat.dir;
    const lon1 = toDecimal(morning.lon.d, morning.lon.m, morning.lon.s) * morning.lon.dir;

    // 2. 航程計算 (ロジック呼び出し)
    const { dLat, dep } = calculateRun(run.course, run.distance);
    
    // 正午推測位置
    const lat2_DR = lat1 + dLat;
    const mLat = (lat1 + lat2_DR) / 2;
    // 中分緯度航法の変経計算: D.Long = Dep / cos(Lm)
    const dLong = (dep / Math.cos(rad(mLat))) / 60;
    const lon2_DR = lon1 + dLong;

    // 3. 正中緯度計算
    const altNoonVal = toDecimal(noon.obsAlt.d, noon.obsAlt.m);
    const decNoonVal = toDecimal(noon.dec.d, noon.dec.m) * noon.dec.dir;
    
    // 天頂距離 z = 90 - a
    const zDist = 90 - altNoonVal;
    
    // 実測緯度 l = d ± z (同符号と仮定)
    // 実際は緯度と赤緯の関係で符号が変わりますが、ここでは簡易的に「同符号(Same Name)」として処理
    const lat2_Obs = (lat2_DR >= 0) ? (decNoonVal + zDist) : (decNoonVal - zDist);

    // 4. メリパス計算 (ロジック呼び出し)
    const meripassRes = calculateMeripass(
      lat2_DR, lat2_Obs, morning.intercept, morning.azimuth, lon2_DR
    );

    setResult({
      lat1, lon1, dLat, dep, dLong, lat2_DR, lon2_DR,
      lat2_Obs,
      ...meripassRes
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 text-slate-800 font-sans">
      
      {/* 左パネル: 入力フォーム */}
      <div className="w-full lg:w-1/2 p-6 overflow-y-auto border-r border-gray-200">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Anchor className="text-blue-600" />
            Meridian Passage Calculator
          </h1>
          <p className="text-sm text-slate-500">海技試験対応・メリパス計算シート</p>
        </header>

        {/* 1. 午前観測 */}
        <section className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 mb-6">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Sun size={16} /> 1. Morning Sight (AM)
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-slate-500 mb-1">推測緯度 (DR Lat)</label>
              <div className="flex gap-2">
                <input type="number" className="w-16 p-2 border rounded" value={morning.lat.d} onChange={e=>setMorning({...morning, lat:{...morning.lat, d:+e.target.value}})} />
                <span className="py-2">°</span>
                <input type="number" className="w-16 p-2 border rounded" value={morning.lat.m} onChange={e=>setMorning({...morning, lat:{...morning.lat, m:+e.target.value}})} />
                <span className="py-2">' N</span>
              </div>
            </div>
            <div>
              <label className="block text-slate-500 mb-1">方位角 (Azimuth)</label>
              <input type="number" className="w-full p-2 border rounded" value={morning.azimuth} onChange={e=>setMorning({...morning, azimuth:+e.target.value})} />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Intercept (I)</label>
              <input type="number" className="w-full p-2 border rounded" value={morning.intercept} onChange={e=>setMorning({...morning, intercept:+e.target.value})} />
            </div>
          </div>
        </section>

        {/* 2. 航走 (Run) */}
        <section className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 mb-6">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-4 flex items-center gap-2">
            <ArrowRight size={16} /> 2. Run to Noon
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-slate-500 mb-1">針路 (Course)</label>
              <input type="number" className="w-full p-2 border rounded" value={run.course} onChange={e=>setRun({...run, course:+e.target.value})} />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">航程 (Dist)</label>
              <input type="number" className="w-full p-2 border rounded" value={run.distance} onChange={e=>setRun({...run, distance:+e.target.value})} />
            </div>
          </div>
        </section>

        {/* 3. 正中観測 (Noon) */}
        <section className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 mb-6">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Sun size={16} /> 3. Noon Sight (Mer Alt)
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-slate-500 mb-1">正中高度 (Obs Alt)</label>
              <div className="flex gap-2">
                <input type="number" className="w-16 p-2 border rounded" value={noon.obsAlt.d} onChange={e=>setNoon({...noon, obsAlt:{...noon.obsAlt, d:+e.target.value}})} />
                <span className="py-2">°</span>
                <input type="number" className="w-16 p-2 border rounded" value={noon.obsAlt.m} onChange={e=>setNoon({...noon, obsAlt:{...noon.obsAlt, m:+e.target.value}})} />
                <span className="py-2">'</span>
              </div>
            </div>
            <div>
              <label className="block text-slate-500 mb-1">赤緯 (Dec)</label>
              <div className="flex gap-2">
                <input type="number" className="w-16 p-2 border rounded" value={noon.dec.d} onChange={e=>setNoon({...noon, dec:{...noon.dec, d:+e.target.value}})} />
                <span className="py-2">°</span>
                <input type="number" className="w-16 p-2 border rounded" value={noon.dec.m} onChange={e=>setNoon({...noon, dec:{...noon.dec, m:+e.target.value}})} />
                <span className="py-2">' N</span>
              </div>
            </div>
          </div>
        </section>

        <button 
          onClick={handleCalculate}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-lg cursor-pointer"
        >
          <Calculator size={20} /> 計算実行 (Calculate)
        </button>
      </div>

      {/* 右パネル: 計算結果表示 */}
      <div className="w-full lg:w-1/2 bg-yellow-50 p-8 border-l border-yellow-200 overflow-y-auto font-mono text-slate-700 relative">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <FileText size={100} />
        </div>
        
        <h2 className="text-lg font-bold border-b-2 border-slate-800 pb-2 mb-6">Calculation Sheet</h2>

        {!result ? (
          <div className="text-center text-slate-400 mt-20">
            左側の数値を入力して「計算実行」を押してください。<br/>
            計算過程がここに表示されます。
          </div>
        ) : (
          <div className="space-y-6 text-sm leading-relaxed">
            {/* 1. Run Calculation */}
            <div className="border-b border-slate-300 pb-4">
              <h3 className="font-bold mb-2">[1] Run to Noon (推測位置の移動)</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                <div>Course: {run.course}°</div>
                <div>Dist: {run.distance} miles</div>
                <div className="col-span-2 mt-2 pl-4 border-l-2 border-slate-300">
                  <p>D.Lat = {run.distance} × cos({run.course}°) = {Math.round(result.dLat * 60 * 10)/10}'</p>
                  <p>Dep = {run.distance} × sin({run.course}°) = {Math.round(result.dep * 10)/10}'</p>
                  <p>D.Long = {Math.round(result.dep * 10)/10} / cos({Math.round(result.lat1)}°) = {Math.round(result.dLong * 60 * 10)/10}'</p>
                </div>
                <div className="col-span-2 mt-2 font-bold text-blue-800">
                  <p>Noon DR Lat (l₀) = {formatDMS(result.lat2_DR, 'lat')}</p>
                  <p>Noon DR Long (L₀) = {formatDMS(result.lon2_DR, 'lon')}</p>
                </div>
              </div>
            </div>

            {/* 2. Noon Sight */}
            <div className="border-b border-slate-300 pb-4">
              <h3 className="font-bold mb-2">[2] Noon Sight (正中緯度)</h3>
              <div className="pl-4 border-l-2 border-slate-300">
                <p>Obs Alt (a) = {noon.obsAlt.d}° {noon.obsAlt.m}'</p>
                <p>Zenith Dist (z) = 90° - a = {formatDMS(90 - toDecimal(noon.obsAlt.d, noon.obsAlt.m), 'angle')}</p>
                <p>Dec (d) = {noon.dec.d}° {noon.dec.m}' N</p>
                <p className="mt-1">Lat = z + d (Same Name)</p>
              </div>
              <div className="mt-2 font-bold text-blue-800">
                <p>Obs Lat (l) = {formatDMS(result.lat2_Obs, 'lat')}</p>
              </div>
            </div>

            {/* 3. Meripass Logic */}
            <div className="border-b-2 border-slate-800 pb-4">
              <h3 className="font-bold mb-2">[3] Longitude Correction (経度改正)</h3>
              <div className="pl-4 border-l-2 border-slate-300">
                <p>Δl (Obs - DR) = {Math.round(result.delta_l * 10)/10}' {result.delta_l >= 0 ? 'N' : 'S'}</p>
                <p>Intercept (I) = {morning.intercept}'</p>
                <p>Azimuth (Z) = {morning.azimuth}°</p>
                
                <div className="my-3 p-3 bg-white border border-slate-200 rounded">
                  <p className="text-xs text-slate-500 mb-1">Formula:</p>
                  <p className="font-serif italic">
                    ΔL = [ I cosec Z - Δl cot Z ] sec l₀
                  </p>
                  <p className="text-xs text-right mt-1 text-slate-400">= [ I/sinZ - Δl/tanZ ] / cos l₀</p>
                </div>

                <p>ΔL = {Math.round(result.delta_L_minutes * 10)/10}'</p>
              </div>
            </div>

            {/* 4. Final Answer */}
            <div className="bg-white p-4 border-2 border-blue-600 rounded shadow-md">
              <h3 className="font-bold text-center text-blue-600 text-lg mb-2">Final Fix at Noon</h3>
              <div className="grid grid-cols-1 gap-2 text-center text-xl font-bold text-slate-800">
                <div>Lat: {formatDMS(result.lat2_Obs, 'lat')}</div>
                <div>Long: {formatDMS(result.lonObs, 'lon')}</div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default MeripassCalculator;