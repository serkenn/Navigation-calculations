/** 度・分の入力値（dir: N/E/+ が 1、S/W/− が -1） */
export interface DMSValue {
  d: number;
  m: number;
  dir: number;
}

/** 時・分・秒の入力値（sign は均時差などの符号付き時間用） */
export interface HMSValue {
  h: number;
  m: number;
  s: number;
  sign: number;
}
