# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## コマンド

```bash
npm run dev          # 開発サーバー起動 (SvelteKit, http://localhost:5173)
npm run build        # 本番ビルド → dist/
npm run preview      # 本番ビルドのプレビュー

npm run electron:dev        # ビルド + Electron デスクトップアプリとして起動
npm run electron:build      # Windows NSIS インストーラーのビルド
npm run cap:sync            # ビルド + Android へ同期 (Capacitor)
```

型チェック（テストスイートは存在しない）:
```bash
npx svelte-check         # 全 Svelte/TS ファイルの型チェック
```

## コード完成後の作業

コードを書き終えたら、必ず以下の順番で実行する:

1. **コミット & プッシュ**
   ```bash
   git add <変更ファイル>
   git commit -m "コミットメッセージ"
   git push origin main
   ```

2. **タグを切る**（最新タグを確認してインクリメント）
   ```bash
   git tag --sort=-version:refname | head -5   # 現在のタグ確認
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```
   タグを push すると CI が自動起動し、web zip + Windows インストーラー + GitHub Release が作成される。

## アーキテクチャ

**NavCalc** は船舶の航法計算 Web アプリ。静的 SvelteKit Web アプリ・Electron デスクトップアプリ（Windows/Mac）・Android アプリ（Capacitor）の3ターゲットが `src/` を共有し、`npm run build` → `dist/` で全ターゲット向けにビルドされる。

### スタック
- **SvelteKit 2 + Svelte 5** — `adapter-static`（完全プリレンダリング SPA、`index.html` フォールバック）
- **Tailwind CSS v4** — Vite プラグイン経由、`src/app.css` でインポート
- **TypeScript 5.7**
- ダークモード: `<html>` に `.dark` クラスを付与（カスタム Tailwind variant `dark`）、`localStorage` に保存

### ルート構成

```
src/routes/
  +layout.svelte          # アプリシェル: サイドバー + モバイルヘッダー + <main>
  +page.svelte            # トップページ（カテゴリ一覧、計算機未選択状態）
  calc/[id]/+page.svelte  # 全計算機共通ルート。id で表示コンポーネントを切り替え
  guide/+page.svelte      # 利用ガイド
  theory/+page.svelte     # 計算理論・公式
```

`calc/[id]/+page.svelte` がコア。`componentMap`（id → `{ calc, result }` のペア）で計算機コンポーネントを管理している。**新しい計算機を追加する手順**: ① このファイルの `componentMap` に追加 → ② `calculatorRegistry.ts` に登録 → ③ 該当カテゴリフォルダに `*Calc.svelte` + `*Result.svelte` を作成。

### 計算機コンポーネントの規約

全計算機は同じ2コンポーネント構成:

- **`*Calc.svelte`** — 左パネル（入力フォーム）。`onResult` コールバック prop を受け取り、計算実行時に結果オブジェクトを渡す。
- **`*Result.svelte`** — 右パネル（"Calculation Sheet"、紙風の `bg-[#fffdf5]`）。`result` prop を受け取り整形して表示。

共通入力コンポーネント（`src/lib/components/shared/`）: `DMSInput`, `PositionInput`, `NumberInput`, `TimeInput`, `SectionCard`, `ResultBox`, `ResultRow`, `ResultSection`, `CalculateButton`, `EmptyResult`。

### 計算ロジック

`src/lib/utils/` に純粋関数として実装（副作用なし）:

| ファイル | 内容 |
|----------|------|
| `navigationMath.ts` | 基本ヘルパー: `rad/deg`, `formatDMS`, `toDecimal`, `toDMS` |
| `mercatorSailing.ts` | 針路・航程、推測航法（WGS84 子午線弧長） |
| `greatCircle.ts` | 大圏航法・集成大圏航法 |
| `astronomy.ts` | 薄明時刻、出没方位角、索星 |
| `ephemeris.ts` | 太陽 GHA・赤緯の簡易計算 |
| `tide.ts` | 潮高計算（cos 補間法） |
| `wind.ts` | 真風向・風速ベクトル |
| `currentVector.ts` | CMG/SMG、流向・流速 |
| `sextant.ts` | 測高度改正、物標距離 |
| `timeConversion.ts` | 弧度⇔時間変換、時分秒四則演算 |
| `examNavigation.ts` | 海技試験 3N 航海カテゴリの計算 |
| `examOperation.ts` | 海技試験 3N 運用カテゴリの計算 |

### 計算機レジストリ

`src/lib/data/calculatorRegistry.ts` が全計算機のメタデータ（id・カテゴリ・日英名・SEO タイトル/説明・アクセントカラー）の唯一の正。`CategoryId` 型は `src/lib/types/calculator.ts` で定義。

### 印刷スタイル

`src/app.css` に `@media print` ルールを一括管理。印刷時は左パネルとサイドバーを非表示にし、右パネルを A4 全幅で展開、全スペーシング・フォントサイズを圧縮して1ページに収める。Result コンポーネントのレイアウトを変更する際は、印刷 CSS のセレクター（`main > div:last-child`、`div.border-b-2` 等）との整合性を確認すること。

### アプリバージョン

`__APP_VERSION__` は `vite.config.ts` でビルド時に最新 git タグから注入される（タグがなければ `package.json` の version にフォールバック）。バージョン表示が必要な箇所はこの定数を使う。
