export interface DMSValue {
  d: number;
  m: number;
  dir: number; // 1 or -1
}

export interface Position {
  lat: DMSValue;
  lon: DMSValue;
}
