/** 日付入力（YYYY-MM-DD 文字列）まわりの小さなヘルパー */

/** 端末のローカル日付を YYYY-MM-DD で返す（toISOString は UTC になるので使わない） */
export function todayLocal(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** YYYY-MM-DD として妥当か（空欄・不正な日付は false） */
export function isValidDateString(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

export const INVALID_DATE_MESSAGE = "日付を正しく入力してください。";
