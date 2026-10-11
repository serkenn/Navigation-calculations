import { getContext, setContext } from "svelte";

export type Accent =
  "blue" | "cyan" | "amber" | "purple" | "emerald" | "rose" | "indigo";

export interface AccentClasses {
  /** カテゴリ名・アイコンなどの文字色 */
  text: string;
  /** 見出しの左ボーダー */
  bar: string;
  /** 計算ボタン */
  button: string;
  /** 結果シートのセクション見出し */
  badge: string;
  /** 結果の強調ボックス */
  highlight: string;
  /** 強調ボックス内の値 */
  highlightText: string;
  /** 選択中のセグメント */
  selected: string;
  /** 入力フォーカス時の枠 */
  focus: string;
}

// Tailwind はクラス名を静的に検出するため、色ごとにリテラルで列挙する
export const accentClasses: Record<Accent, AccentClasses> = {
  blue: {
    text: "text-blue-600 dark:text-blue-400",
    bar: "border-blue-600",
    button: "from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600",
    badge: "bg-blue-700",
    highlight:
      "bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800",
    highlightText: "text-blue-700 dark:text-blue-300",
    selected:
      "bg-blue-100 dark:bg-blue-900/40 border-blue-400 text-blue-700 dark:text-blue-300",
    focus: "focus-within:border-blue-500",
  },
  cyan: {
    text: "text-cyan-600 dark:text-cyan-400",
    bar: "border-cyan-600",
    button: "from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600",
    badge: "bg-cyan-700",
    highlight:
      "bg-cyan-50 dark:bg-cyan-900/40 border-cyan-200 dark:border-cyan-800",
    highlightText: "text-cyan-700 dark:text-cyan-300",
    selected:
      "bg-cyan-100 dark:bg-cyan-900/40 border-cyan-400 text-cyan-700 dark:text-cyan-300",
    focus: "focus-within:border-cyan-500",
  },
  amber: {
    text: "text-amber-600 dark:text-amber-400",
    bar: "border-amber-600",
    button:
      "from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600",
    badge: "bg-amber-700",
    highlight:
      "bg-amber-50 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800",
    highlightText: "text-amber-700 dark:text-amber-300",
    selected:
      "bg-amber-100 dark:bg-amber-900/40 border-amber-400 text-amber-700 dark:text-amber-300",
    focus: "focus-within:border-amber-500",
  },
  purple: {
    text: "text-purple-600 dark:text-purple-400",
    bar: "border-purple-600",
    button:
      "from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600",
    badge: "bg-purple-700",
    highlight:
      "bg-purple-50 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800",
    highlightText: "text-purple-700 dark:text-purple-300",
    selected:
      "bg-purple-100 dark:bg-purple-900/40 border-purple-400 text-purple-700 dark:text-purple-300",
    focus: "focus-within:border-purple-500",
  },
  emerald: {
    text: "text-emerald-600 dark:text-emerald-400",
    bar: "border-emerald-600",
    button:
      "from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600",
    badge: "bg-emerald-700",
    highlight:
      "bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800",
    highlightText: "text-emerald-700 dark:text-emerald-300",
    selected:
      "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 text-emerald-700 dark:text-emerald-300",
    focus: "focus-within:border-emerald-500",
  },
  rose: {
    text: "text-rose-600 dark:text-rose-400",
    bar: "border-rose-600",
    button: "from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600",
    badge: "bg-rose-700",
    highlight:
      "bg-rose-50 dark:bg-rose-900/40 border-rose-200 dark:border-rose-800",
    highlightText: "text-rose-700 dark:text-rose-300",
    selected:
      "bg-rose-100 dark:bg-rose-900/40 border-rose-400 text-rose-700 dark:text-rose-300",
    focus: "focus-within:border-rose-500",
  },
  indigo: {
    text: "text-indigo-600 dark:text-indigo-400",
    bar: "border-indigo-600",
    button:
      "from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600",
    badge: "bg-indigo-700",
    highlight:
      "bg-indigo-50 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800",
    highlightText: "text-indigo-700 dark:text-indigo-300",
    selected:
      "bg-indigo-100 dark:bg-indigo-900/40 border-indigo-400 text-indigo-700 dark:text-indigo-300",
    focus: "focus-within:border-indigo-500",
  },
};

const KEY = Symbol("accent");

/** 計算機ページで現在のカテゴリ色を子コンポーネントへ渡す */
export function setAccent(get: () => Accent) {
  setContext(KEY, get);
}

/** 共通コンポーネントから現在のカテゴリ色を取得する */
export function useAccent(): () => AccentClasses {
  const get = getContext<(() => Accent) | undefined>(KEY);
  return () => accentClasses[get?.() ?? "blue"];
}
