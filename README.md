# NavCalc — 航法計算アプリ

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](https://unlicense.org/)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2-FF3E00?logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-F38020?logo=cloudflarepages&logoColor=white)](https://pages.cloudflare.com/)

船舶の航法計算をブラウザ上で行える Web アプリケーションです。海技試験（三級海技士など）の学習支援から、教育での天文航法・航海計画まで幅広く対応します。

**公開サイト:** [https://navcalc.serken.tech/](https://navcalc.serken.tech/)

## 機能一覧

カテゴリ構成と名称は [TAMAYA 航法計算機 NC-2200](https://tamaya-technics.com/navigation/) の機能一覧に準拠しています。

### 航海計画 PILOT 1

| 計算                                       | 説明                                                              |
| ------------------------------------------ | ----------------------------------------------------------------- |
| 針路・航程の計算 (Course and Distance)     | 中分緯度航法・漸長緯度航法により 2 地点間の針路と航程を求めます。 |
| 到着点の計算 (Dead Reckoning)              | 出発点・針路・航程から到着点の緯度経度を求めます。                |
| 大圏航法の計算 (Great Circle)              | 大圏距離・初針路・終針路と頂点の位置を求めます。                  |
| 集成大圏航法の計算 (Composite Sailing)     | 制限緯度を超えない「大圏＋平行圏＋大圏」の航路を求めます。        |
| 到着時刻の計算 (Estimated Time of Arrival) | 航程・速力・出発日時から航海時間と到着予定日時を求めます。        |

### その他の航法 PILOT 2

| 計算                                                   | 説明                                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------------------ |
| 実航針路・実航速力 (Course and Speed Made Good)        | 船の針路・速力と潮流から実航針路 (CMG)・実航速力 (SMG) を求めます。      |
| 視針路・対水速力 (Course and Speed to Make Good)       | 目標の実航針路・実航速力と潮流から、取るべき視針路と対水速力を求めます。 |
| 視針路・実航速力 (Course to Steer and Speed Made Good) | 対水速力を一定として、目標の実航針路を進む視針路と実航速力を求めます。   |
| 潮の流向・流速 (Set and Drift)                         | 船の針路・速力と実航針路・実航速力から潮の流向・流速を求めます。         |
| 真風向・風速の計算 (Direction and Speed of True Wind)  | 視風向・視風速と船の針路・速力から真風向・真風速を求めます。             |
| 潮高計算 (Tide at Standard Port)                       | 高潮・低潮の時刻と潮高から、任意の時刻の潮高を cos 補間で求めます。      |
| 潮流計算 (Tidal Stream)                                | 転流時・最強時・最強流速から、任意の時刻の流速を正弦法で求めます。       |

### 天文航法 ASTRO. NAV

| 計算                                     | 説明                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| 薄明時の計算 (Twilight)                  | 日出没時と市民・航海・天文薄明の時刻を地方平時と標準時で求めます。       |
| 索星の計算 (Prediction & Identification) | 推測緯度と春分点の地方時角から、観測に適した恒星の高度・方位を求めます。 |
| 天測暦の計算 (Nautical Almanac)          | 日時（UT）から太陽のグリニッジ時角・赤緯・均時差を求めます（概算）。     |
| 位置の線の計算 (Line of Position)        | 推測位置と観測高度から計算高度・方位角・修正差を求めます。               |
| 船位決定の計算 (Position Fix)            | 2 本の位置の線（修正差・方位角）の交点から船位を求めます。               |
| 正中時の計算 (Meridian Passage)          | 太陽の正中時刻を求め、子午線高度から緯度を求めます。                     |

### 六分儀 SEXTANT

| 計算                                    | 説明                                                                 |
| --------------------------------------- | -------------------------------------------------------------------- |
| 測高度改正の計算 (Altitude Corrections) | 六分儀高度に眼高差・大気差・視差・視半径を改正して真高度を求めます。 |
| 物標までの距離 (Distance to Object)     | 物標の垂直角または光達距離から物標までの距離を求めます。             |

### 時間と弧度 TIME & ARC

| 計算                                  | 説明                                                     |
| ------------------------------------- | -------------------------------------------------------- |
| 時間計算と弧度換算 (Time Computation) | 時分秒の加減算を行い、結果を弧度（度分秒）に換算します。 |
| 角度計算と時間換算 (Arc Computation)  | 度分秒の加減算を行い、結果を時間（時分秒）に換算します。 |

### 四則計算と時変換 TIME Calculations

| 計算                                      | 説明                                                              |
| ----------------------------------------- | ----------------------------------------------------------------- |
| 時分秒変換・航走時間計算 (To HMS)         | 10 進数の時間を時分秒に変換し、航程と速力から航走時間を求めます。 |
| 10進数時変換・速力、航走距離計算 (To HHH) | 時分秒を 10 進数の時間に変換し、速力または航走距離を求めます。    |
| 四則計算 (Normal Computations)            | 数値または時分秒の加減乗除を行います。                            |

### 海技試験 EXAM

#### 3N

##### 航海

| 計算                                                 | 説明                                                                        |
| ---------------------------------------------------- | --------------------------------------------------------------------------- |
| 天体による船位の決定 (Position by Celestial Bodies)  | 午前の太陽観測と正午の子午線高度から正午位置を求めます（3 級海技士 航海）。 |
| 平行航法・正子午線航法 (Parallel & Meridian Sailing) | 同一緯度線上・同一子午線上を航行するときの航程を求めます。                  |
| 大圏航法 (Great Circle Sailing)                      | 大圏距離・初針路・終針路を解答形式で求めます。                              |
| 真風の計算 (True Wind)                               | 視風向（真方位）・視風速と船の針路・速力から真風を解答形式で求めます。      |
| 潮流中の針路 (Course to Steer in Current)            | 潮流がある海域で目的の針路線上を進むための視針路を解答形式で求めます。      |
| 推測位置の計算 (Dead Reckoning)                      | 針路・速力・航走時間から推測位置を中分緯度航法で求めます。                  |
| 光達距離 (Geographic Light Range)                    | 灯高と眼高から地理学的光達距離を求めます。                                  |
| 潮汐表の使用法（潮流） (Tidal Current Table)         | 潮汐表の転流時・最強時・最強流速から任意時刻の流速を解答形式で求めます。    |
| クロス方位法 (Cross Bearing Fix)                     | 位置が分かっている 2 物標の真方位から船位を求めます。                       |
| 両測方位法 (Running Fix)                             | 1 物標を 2 回測った真方位とその間の航走から船位を求めます。                 |
| 船内時計の改正 (Ship's Clock Correction)             | 経度差から船内時計を進める（遅らせる）時間を求めます。                      |
| 常用日出没時 (Sunrise & Sunset)                      | 日付と位置から日出没時を地方平時と標準時で求めます。                        |
| 出没方位角・ジャイロ誤差 (Amplitude & Gyro Error)    | 太陽の出没方位角を求め、ジャイロコンパスの誤差を求めます。                  |

##### 運用

| 計算                                                        | 説明                                                                 |
| ----------------------------------------------------------- | -------------------------------------------------------------------- |
| TPC・平均喫水 (TPC and Mean Draft)                          | 箱形船の TPC、積載後の平均喫水、喫水変化からの積載重量を求めます。   |
| トリム・前後喫水変化 (Trim and End Draft Changes)           | 貨物の積載・移動による平均沈下・トリム・船首尾喫水の変化を求めます。 |
| 横揺れ周期と GM (GM from Rolling Period)                    | 横揺れ周期の変化から GM と船幅を求めます。                           |
| 比重差と入港喫水 (Arrival Draft by Density and Consumption) | 燃料・清水の消費と海水比重の差を考慮した入港時の喫水を求めます。     |
| 見張り死角距離 (Blind Zone Distance)                        | 見張りの眼高と船首部の障害物から船首前方の死角距離を求めます。       |
| 等喫水化バラスト移送 (Ballast Transfer for Even Keel)       | 前後喫水差と MTC から等喫水にするためのバラスト移送量を求めます。    |
| 前後喫水から積載重量 (Cargo from End Draft Change)          | 積荷前後の船首・船尾喫水から積載重量を逆算します。                   |
| 比重差による平均喫水 (Mean Draft by Density)                | 排水量と海水比重の差から移動後の平均喫水を求めます。                 |

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

| ドキュメント                                      | 内容                                                           |
| ------------------------------------------------- | -------------------------------------------------------------- |
| [航海計画 PILOT 1](docs/pilot1.md)                | 中分緯度・漸長緯度航法、大圏・集成大圏航法、到着時刻           |
| [その他の航法 PILOT 2](docs/pilot2.md)            | 潮流航法（潮流三角形）、真風、潮高（cos 補間）、潮流（正弦法） |
| [天文航法 ASTRO. NAV](docs/celestial.md)          | 天測暦、薄明時、索星（予測・同定）、位置の線、船位決定、正中時 |
| [六分儀 SEXTANT](docs/sextant.md)                 | 測高度改正、垂直角による距離、光達距離                         |
| [時間と弧度 / 四則計算と時変換](docs/time-arc.md) | 時間⇔弧度、時分秒変換、航走時間・速力・距離、四則計算          |
| [海技試験 EXAM](docs/exam.md)                     | 3N 航海（メリパスほか）・3N 運用の計算                         |

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
│       ├── mercatorSailing.ts #   中分緯度航法・メルカトル航法
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
