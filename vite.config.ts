import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    // サイトマップ生成の設定を追加
    Sitemap({
      hostname: 'https://navcalc.serken.tech/', // 公開URLを指定
      dynamicRoutes: [
        '/',
        '/gyro',
        '/guide',
        '/theory'
      ]
    }),
  ],
  base: './',
})