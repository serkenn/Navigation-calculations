export interface DMSValue {
  d: number;
  m: number;
  dir: number;
}

export interface Position {
  lat: DMSValue;
  lon: DMSValue;
}
