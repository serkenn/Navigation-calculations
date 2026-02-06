import { defineConfig, loadEnv } from 'vite' // ← loadEnv を追加
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

// export default defineConfig({ ... }) の書き方を変更して mode を受け取れるようにします
export default defineConfig(({ mode }) => {
  // 環境変数を読み込む (.envファイルの中身を取得)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      Sitemap({
        hostname: 'https://navcalc.serken.tech/',
        dynamicRoutes: [
          '/',
          '/gyro',
          '/guide',
          '/theory'
        ]
      }),
      // ↓↓↓↓↓ ここから追加 ↓↓↓↓↓
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          // 環境変数に確認コードがある場合のみ、HTMLの<head>内にタグを注入する
          if (env.VITE_GOOGLE_SITE_VERIFICATION) {
            return html.replace(
              '<head>',
              `<head>\n    <meta name="google-site-verification" content="${env.VITE_GOOGLE_SITE_VERIFICATION}" />`
            )
          }
          return html
        }
      }
      // ↑↑↑↑↑ ここまで追加 ↑↑↑↑↑
    ],
    base: './',
  }
})