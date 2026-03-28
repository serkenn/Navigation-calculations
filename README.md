# NavCalc — 航法計算アプリ

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](https://unlicense.org/)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2-FF3E00?logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-F38020?logo=cloudflarepages&logoColor=white)](https://pages.cloudflare.com/)

船舶の航法計算をブラウザ上で行える Web アプリケーションです。海技試験（三級海技士など）の学習支援から、実務での天文航法・航海計画まで幅広く対応します。

**公開サイト:** [https://navcalc.serken.tech/](https://navcalc.serken.tech/)

## 機能一覧

### 航海計画 (Pilot 1)
| 計算 | 説明 |
|------|------|
| 針路・航程 | メルカトル航法による針路と航程の計算 |
| 到着点 | 出発位置・針路・航程から到着点を算出 |
| 大圏航法 | 大圏航法による最短距離と初針路の計算 |
| 集成大圏航法 | 制限緯度を持つ複合大圏航路の計算 |
| 到着時刻 | 距離と速力からETA（到着予定時刻）を算出 |

### その他の航法 (Pilot 2)
| 計算 | 説明 |
|------|------|
| 実航針路・速力 | 船速と潮流から CMG / SMG を算出 |
| 視針路・対水速力 | 目標針路と潮流から操舵針路を算出 |
| 視針路・実航速力 | 目標針路と潮流から操舵針路と SMG を算出 |
| 流向・流速 | 船速・針路・実航針路から海流を推定 |
| 真風向・風速 | 相対風と船速から真風を算出 |
| 潮高計算 | cos 補間法による任意時刻の潮高計算 |
| 潮流計算 | 潮流の速度と方向の補間計算 |

### 天文航法 (Celestial Navigation)
| 計算 | 説明 |
|------|------|
| 薄明時 | 市民薄明・航海薄明の開始/終了時刻 |
| 索星 | 観測可能な恒星の高度と方位を計算 |
| 天測暦 | 太陽の GHA・赤緯の簡易計算 |
| 位置の線 | 天体観測から LOP（位置の線）を算出 |
| 船位決定 | 複数の LOP から船位を決定 |
| 出没方位角 | Amplitude からジャイロコンパス誤差を算出 |

### 六分儀 (Sextant)
| 計算 | 説明 |
|------|------|
| 測高度改正 | 器差・眼高差・大気差・視半径等の改正 |
| 物標距離 | 六分儀の角度から物標までの距離を計算 |

### 時間・弧度変換 / 四則計算
| 計算 | 説明 |
|------|------|
| 時間→弧度 | 時分秒を度分秒に変換 |
| 弧度→時間 | 度分秒を時分秒に変換 |
| 時分秒変換 | 10進数 ↔ 時分秒の相互変換 |
| 四則計算 | 時分秒形式での加減乗除 |

### 海技試験 (Exam)
| 計算 | 説明 |
|------|------|
| メリパス計算 3N | 午前観測と正中観測から正中時の船位を決定（三級海技士対応） |

## 導入方法

### Web（ブラウザ）

インストール不要。以下のURLにアクセスするだけで利用できます。

**https://navcalc.serken.tech/**

PWA対応ブラウザではホーム画面に追加してオフラインでも利用可能です。

---

### Windows（デスクトップアプリ）

[Releases](https://github.com/serkenn/Navigation-calculations/releases) ページから最新の `.exe` インストーラーをダウンロードして実行してください。

#### ソースからビルドする場合

```bash
git clone https://github.com/serkenn/Navigation-calculations.git
cd Navigation-calculations
npm install
npm run electron:build        # release/ にインストーラーが生成されます
```

> **注意:** 初回起動時に Windows Defender SmartScreen の警告が表示される場合があります。「詳細情報」→「実行」で起動できます。

---

### macOS（デスクトップアプリ）

[Releases](https://github.com/serkenn/Navigation-calculations/releases) ページから `.dmg` をダウンロードし、`NavCalc.app` を Applications フォルダにドラッグしてください。

#### ソースからビルドする場合

```bash
git clone https://github.com/serkenn/Navigation-calculations.git
cd Navigation-calculations
npm install
npm run electron:build:mac    # release/ に .dmg が生成されます
```

> **注意:** 署名なしの場合、初回起動時に「開発元が未確認」と表示されます。**システム設定 → プライバシーとセキュリティ** から「このまま開く」を選択してください。

---

### iOS / iPadOS

App Store では未公開のため、Xcode 経由でインストールします。

#### 前提条件
- macOS + Xcode（最新版推奨）
- Apple ID（無料の開発者アカウントで可）

#### 手順

```bash
git clone https://github.com/serkenn/Navigation-calculations.git
cd Navigation-calculations
npm install
npm run build
npx cap sync ios
```

1. `ios/App/App.xcodeproj` を Xcode で開く
2. Signing & Capabilities で自分の Apple ID を Team に設定
3. iPhone / iPad を接続してビルド・実行（`Cmd + R`）

> **注意:** 初回起動時に「信頼されていないデベロッパ」と表示されます。端末の **設定 → 一般 → VPN とデバイス管理** から該当の開発者証明書を信頼してください。

---

### Android

#### APK から直接インストール

[Releases](https://github.com/serkenn/Navigation-calculations/releases) ページから `.apk` をダウンロードし、端末にインストールしてください。

> **注意:** 「提供元不明のアプリ」のインストールを許可する必要があります。

#### ソースからビルドする場合

```bash
git clone https://github.com/serkenn/Navigation-calculations.git
cd Navigation-calculations
npm install
npm run cap:build    # android/app/build/outputs/apk/release/ に APK が生成されます
```

Android Studio で `android/` フォルダを開いてビルド・実行することも可能です。

---

## 技術スタック

- **フレームワーク:** SvelteKit 2 + Svelte 5 + TypeScript
- **ビルドツール:** Vite 6
- **スタイリング:** Tailwind CSS v4（ダークモード対応）
- **アイコン:** Lucide Svelte
- **ホスティング:** Cloudflare Pages（adapter-static）
- **CI/CD:** GitHub Actions（`v*` タグで自動リリース）

## ドキュメント

各計算機能の詳細な解説は [`docs/`](docs/) ディレクトリにあります。

| ドキュメント | 内容 |
|---|---|
| [航海計画 (Pilot 1)](docs/pilot1.md) | メルカトル航法・大圏航法・推測航法 |
| [その他の航法 (Pilot 2)](docs/pilot2.md) | 潮流・風向・潮汐計算 |
| [天文航法 (Celestial)](docs/celestial.md) | 薄明時・位置の線・船位決定 |
| [六分儀 (Sextant)](docs/sextant.md) | 測高度改正・物標距離 |
| [時間・弧度変換](docs/time-arc.md) | 時間⇔弧度変換・四則計算 |
| [海技試験 (Exam)](docs/exam.md) | メリパス計算 3N |

## 開発

```bash
# リポジトリのクローン
git clone https://github.com/serkenn/Navigation-calculations.git
cd Navigation-calculations

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プロダクションビルドのプレビュー
npm run preview
```

## プロジェクト構成

```
src/
├── routes/
│   ├── +layout.svelte         # アプリ全体のレイアウト
│   ├── +page.ts               # トップページ
│   ├── calc/[id]/             # 各計算ページ（動的ルート）
│   ├── guide/                 # 使い方ガイド
│   └── theory/                # 理論解説
├── lib/
│   ├── components/
│   │   ├── calculators/       # 各計算機能のコンポーネント
│   │   │   ├── pilot1/        #   航海計画系
│   │   │   ├── pilot2/        #   潮流・風向など
│   │   │   ├── astro/         #   天文航法系
│   │   │   ├── sextant/       #   六分儀系
│   │   │   ├── timeArc/       #   時間⇔弧度変換
│   │   │   ├── timeCalc/      #   四則計算
│   │   │   └── exam/          #   海技試験
│   │   ├── layout/            # Sidebar, MobileHeader
│   │   └── shared/            # 共通UI部品 (DMSInput, SectionCard, etc.)
│   ├── data/
│   │   ├── calculatorRegistry.ts   # 全計算機能の定義・ルーティング
│   │   └── stars.ts                # 恒星データ
│   ├── stores/
│   │   └── theme.svelte.ts    # ダークモード制御（Svelte 5 runes）
│   ├── types/                 # TypeScript 型定義
│   └── utils/                 # 航法計算ロジック
│       ├── navigationMath.ts  #   メリパス・高度改正・Sight Reduction
│       ├── mercatorSailing.ts #   メルカトル航法
│       ├── greatCircle.ts     #   大圏航法
│       ├── astronomy.ts       #   天文計算
│       ├── ephemeris.ts       #   天体暦
│       ├── sextant.ts         #   六分儀計算
│       ├── currentVector.ts   #   潮流ベクトル
│       ├── wind.ts            #   風向計算
│       ├── tide.ts            #   潮汐計算
│       └── timeConversion.ts  #   時間変換
├── app.css                    # Tailwind CSS エントリーポイント
└── app.html                   # HTML テンプレート
docs/                          # 各計算機能の詳細ドキュメント
```

## ライセンス

[Unlicense](LICENSE) — パブリックドメイン。自由にご利用ください。
