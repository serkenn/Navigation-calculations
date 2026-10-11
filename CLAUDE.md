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
npm run check            # 型生成 (svelte-kit sync) + 全 Svelte/TS ファイルの型チェック
```

## コード完成後の作業

コードを書き終えたら、必ず以下の順番で実行する:

1. **フォーマット**

   ```bash
   npx prettier --write .
   ```

2. **コミット & プッシュ**

   ```bash
   git add <変更ファイル>
   git commit -m "コミットメッセージ"
   git push origin main
   ```

3. **タグを切る**（最新タグを確認してインクリメント）
   ```bash
   git tag --sort=-version:refname | head -5   # 現在のタグ確認
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```
   タグを push すると CI が自動起動し、web zip + Windows インストーラー + GitHub Release が作成される。

## アーキテクチャ

**NavCalc** は船舶の航法計算 Web アプリ。静的 SvelteKit Web アプリ・Electron デスクトップアプリ（Windows/Mac）・Android アプリ（Capacitor）の3ターゲットが `src/` を共有し、`npm run build` → `dist/` で全ターゲット向けにビルドされる。

### スタック

- **SvelteKit 3 + Svelte 5 + Vite 8** — `adapter-static`（完全プリレンダリング SPA、`index.html` フォールバック）。SvelteKit の設定は `svelte.config.js` ではなく `vite.config.ts` の `sveltekit({...})` に書く
- `src/lib` は `$lib` ではなく `#lib/...`（package.json の `imports`）で import する。`.ts` モジュールは `#lib/utils/foo.js` のように `.js` 拡張子を付ける
- **Tailwind CSS v4** — Vite プラグイン経由、`src/app.css` でインポート
- **TypeScript 6**（SvelteKit 3 が `^6` を要求するため TS 7 には上げない）
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

`calc/[id]/+page.svelte` がコア。レジストリの `component` パスから `import.meta.glob` で `*Calc.svelte` / `*Result.svelte` を遅延読み込みし、見出し（名称・説明）もレジストリから描画する。カテゴリ色は `setAccent()` でコンテキストに流し、共通コンポーネントが `useAccent()` で参照する。**新しい計算機を追加する手順**: ① `calculatorRegistry.ts` に登録（`component: "カテゴリ/Name"`）→ ② `src/lib/components/calculators/カテゴリ/` に `NameCalc.svelte` + `NameResult.svelte` を作成。ルート側の変更は不要。

### 計算機コンポーネントの規約

全計算機は同じ2コンポーネント構成:

- **`*Calc.svelte`** — 左パネル（入力フォーム）。`onResult` コールバック prop を受け取り、計算実行時に結果オブジェクトを渡す。`CalcForm`（送信ボタン・エラー表示込み。空欄の数値・日付入力があれば計算せずに未入力エラーを出す）の中に `SectionCard` と入力部品を並べる。見出しはページ側で出すので書かない。
- **`*Result.svelte`** — 右パネル（"Calculation Sheet"）。`result` prop を受け取り、`Sheet` の中に `InfoGrid` / `ResultRows` / `Step`（試験の解答手順）/ `Highlight`（最終答案）/ `Note` で表示する。

共通部品（`src/lib/components/shared/`）:

- 入力: `CalcForm`, `SectionCard`, `NumberInput`, `DMSInput`（度・分 + N/S/E/W/±）, `PositionInput`, `TimeInput`（時・分・秒）, `DateInput`, `Segmented`
- 結果: `Sheet`, `InfoGrid`, `ResultRow(s)`, `Highlight`, `Step`, `Note`

表記は `navigationMath.ts` の `formatLat` / `formatLon` / `formatBearing` / `formatDirected` / `formatClock` などを使い、各コンポーネントで独自に整形しない。

カテゴリ構成・名称は TAMAYA 航法計算機 NC-2200（https://tamaya-technics.com/navigation/）の機能一覧に準拠させる。

### 計算ロジック

`src/lib/utils/` に純粋関数として実装（副作用なし）:

| ファイル             | 内容                                                                    |
| -------------------- | ----------------------------------------------------------------------- |
| `navigationMath.ts`  | 基本ヘルパー: `rad/deg`、角度正規化、度分・時刻・方位の表記フォーマット |
| `mercatorSailing.ts` | 中分緯度航法・漸長緯度航法（漸長緯度は WGS84）                          |
| `greatCircle.ts`     | 大圏航法（頂点含む）・集成大圏航法                                      |
| `astronomy.ts`       | 高度方位角、薄明・日出没、出没方位角、正中時、LOP の交点、天体の同定    |
| `ephemeris.ts`       | 太陽 GHA・赤緯・均時差の簡易計算                                        |
| `tide.ts`            | 潮高（cos 補間法）、潮流（正弦法）                                      |
| `wind.ts`            | 真風向・風速ベクトル                                                    |
| `currentVector.ts`   | CMG/SMG、視針路、流向・流速                                             |
| `sextant.ts`         | 測高度改正、垂直角による距離、光達距離                                  |
| `timeConversion.ts`  | 時間⇔弧度、時分秒の分解・表記、四則演算                                 |
| `examNavigation.ts`  | 海技試験 3N 航海の試験固有計算（クロス方位・両測方位・時計改正など）    |
| `examOperation.ts`   | 海技試験 3N 運用の計算                                                  |

PILOT/ASTRO と同じ計算は試験側でも同じ関数を使う（試験用に再実装しない）。

### 計算機レジストリ

`src/lib/data/calculatorRegistry.ts` が全計算機・カテゴリのメタデータ（id・カテゴリ・日英名・説明・アイコン・コンポーネントパス、カテゴリ色）の唯一の正。サイドバー・トップページ・利用ガイド・SEO はここから生成する。`CategoryId` 型は `src/lib/types/calculator.ts` で定義。

### 印刷スタイル

`src/app.css` に `@media print` ルールを一括管理。印刷時は左パネルとサイドバーを非表示にし、右パネルを A4 全幅で展開、全スペーシング・フォントサイズを圧縮して1ページに収める。印刷 CSS は `.calc-input-panel` / `.calc-sheet` / `.sheet-header` / `.sheet-section` / `.sheet-highlight` などのクラスを対象にしている。

### アプリバージョン

`__APP_VERSION__` は `vite.config.ts` でビルド時に最新 git タグから注入される（タグがなければ `package.json` の version にフォールバック）。バージョン表示が必要な箇所はこの定数を使う。
