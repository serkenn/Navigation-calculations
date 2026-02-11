# NavCalc — 航法計算アプリ

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](https://unlicense.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

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

## 技術スタック

- **フレームワーク:** React 19 + TypeScript
- **ビルドツール:** Vite
- **スタイリング:** Tailwind CSS v4（ダークモード対応）
- **アイコン:** Lucide React
- **SEO:** react-helmet-async
- **CI/CD:** GitHub Actions（`v*` タグで自動リリース）

## 開発

```bash
# リポジトリのクローン
git clone https://github.com/serkenn/Navigation-calculations.git
cd Navigation-calculations

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 型チェック + ビルド
npm run build

# リント
npm run lint

# プロダクションビルドのプレビュー
npm run preview
```

## プロジェクト構成

```
src/
├── components/
│   ├── calculators/       # 各計算機能のコンポーネント
│   │   ├── pilot1/        #   航海計画系
│   │   ├── pilot2/        #   潮流・風向など
│   │   ├── astro/         #   天文航法系
│   │   ├── sextant/       #   六分儀系
│   │   ├── timeArc/       #   時間⇔弧度変換
│   │   ├── timeCalc/      #   四則計算
│   │   └── exam/          #   海技試験
│   ├── layout/            # AppShell, Sidebar, Header
│   └── shared/            # 共通UI部品 (DMSInput, SectionCard, etc.)
├── data/
│   ├── calculatorRegistry.ts   # 全計算機能の定義・ルーティング
│   └── stars.ts                # 恒星データ
├── hooks/
│   └── useTheme.ts        # ダークモード制御
├── types/                 # TypeScript 型定義
├── utils/                 # 航法計算ロジック
│   ├── navigationMath.ts  #   メリパス・高度改正・Sight Reduction
│   ├── mercatorSailing.ts #   メルカトル航法
│   ├── greatCircle.ts     #   大圏航法
│   ├── astronomy.ts       #   天文計算
│   ├── ephemeris.ts       #   天体暦
│   ├── sextant.ts         #   六分儀計算
│   ├── currentVector.ts   #   潮流ベクトル
│   ├── wind.ts            #   風向計算
│   ├── tide.ts            #   潮汐計算
│   └── timeConversion.ts  #   時間変換
├── App.tsx
└── main.tsx
```

## ライセンス

[Unlicense](LICENSE) — パブリックドメイン。自由にご利用ください。
