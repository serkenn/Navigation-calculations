/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // ← 必ず 'class' にしてください
  theme: {
    extend: {
      padding: {
        'safe-top': 'env(safe-area-inset-top)', // モバイル用調整
      }
    },
  },
  plugins: [],
}