// src/components/MeripassCalculator.tsx
import React, { useState } from 'react';
import { Calculator, ArrowRight, Sun, Anchor, FileText } from 'lucide-react';
// さきほど作った関数をインポート
import { toDecimal, formatDMS, rad, calculateRun, calculateMeripass } from '../utils/navigationMath';

const MeripassCalculator = () => {
  // ... (前回のコードの state 定義部分) ...
  const [morning, setMorning] = useState({ /* ... */ });
  const [run, setRun] = useState({ /* ... */ });
  const [noon, setNoon] = useState({ /* ... */ });
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
    const dLong = (dep / Math.cos(rad(mLat))) / 60;
    const lon2_DR = lon1 + dLong;

    // 3. 正中緯度計算
    const altNoon = toDecimal(noon.obsAlt.d, noon.obsAlt.m);
    const decNoon = toDecimal(noon.dec.d, noon.dec.m) * noon.dec.dir;
    const zDist = 90 - altNoon;
    const lat2_Obs = (lat2_DR >= 0) ? (decNoon + zDist) : (decNoon - zDist);

    // 4. メリパス計算 (ロジック呼び出し)
    const meripassRes = calculateMeripass(
      lat2_DR, lat2_Obs, morning.intercept, morning.azimuth, lon2_DR
    );

    setResult({
      lat1, lon1, dLat, dep, dLong, lat2_DR, lon2_DR,
      lat2_Obs,
      ...meripassRes // delta_l, delta_L_minutes, lonObs が含まれる
    });
  };

  return (
    // ... (前回のコードの JSX 部分。calculate 関数呼び出し箇所を handleCalculate に変更) ...
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50...">
      {/* ... 省略 ... */}
      <button onClick={handleCalculate} ... >計算実行</button>
      {/* ... 省略 ... */}
    </div>
  );
};

export default MeripassCalculator;