import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// --- Google Analytics 初期化処理 ---
// .env からIDを取得（設定がない場合は undefined になる）
const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

if (gaId) {
  // 1. gtag.js の読み込み
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  // 2. 設定スクリプトの実行 (TypeScriptのエラー回避のために as any を使用)
  const win = window as any;
  win.dataLayer = win.dataLayer || [];
  
  // 関数定義：引数を ...args: any[] で受け取るように修正
  win.gtag = function (...args: any[]) {
    win.dataLayer.push(args);
  };

  win.gtag('js', new Date());
  win.gtag('config', gaId);
}
// ----------------------------------

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)