export interface CandleData {
  c: number[];  // close prices
  h: number[];  // high prices
  l: number[];  // low prices
  o: number[];  // open prices
  t: number[];  // timestamps
  v: number[];  // volume
  s: string;    // status: "ok" or "no_data"
}

export interface ChartDataPoint {
  x: number;    // timestamp (milliseconds)
  y: number;    // price
}
