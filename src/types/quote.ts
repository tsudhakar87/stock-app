export interface Quote {
  c: number; // current price
  d: number; // change
  dp: number; // percent change
  h: number; // high price of the day
  l: number; // low price of the day
  o: number; // open price of the day
  pc: number; // previous close price
  t: number; // timestamp
}

export interface StockData {
  symbol: string;
  quote: Quote | null;
  error?: string;
}

export interface StockTableRow {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}
