import type { Quote, StockData } from '../types/quote.ts';
import type { CandleData } from '../types/candle.ts';

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const ALPHA_VANTAGE_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';
const ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query';

export const fetchStockQuote = async (symbol: string): Promise<StockData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const quote: Quote = await response.json();

    return {
      symbol,
      quote,
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return {
      symbol,
      quote: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const fetchMultipleStockQuotes = async (
  symbols: string[]
): Promise<StockData[]> => {
  const promises = symbols.map((symbol) => fetchStockQuote(symbol));
  const results = await Promise.allSettled(promises);

  return results.map((result) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      // return a failed stock data object if the promise was rejected
      return {
        symbol: 'UNKNOWN',
        quote: null,
        error: result.reason?.message || 'Failed to fetch',
      };
    }
  });
};

// popular stocks to display
export const DEFAULT_STOCKS = [
  'AAPL',  // apple
  'MSFT',  // microsoft
  'GOOGL', // alphabet (google)
  'AMZN',  // amazon
  'NVDA',  // nvidia
  'META',  // meta (facebook)
  'TSLA',  // tesla
  'BRK.B', // berkshire hathaway
  'JPM',   // jpmorgan chase
  'V',     // visa
  'JNJ',   // johnson & johnson
  'WMT',   // walmart
  'PG',    // procter & gamble
  'MA',    // mastercard
  'HD',    // home depot
  'DIS',   // disney
  'NFLX',  // netflix
  'ADBE',  // adobe
  'CRM',   // salesforce
  'INTC',  // intel
];

export const fetchStockCandles = async (
  symbol: string,
  daysBack: number = 30
): Promise<CandleData> => {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`
    );

    if (!response.ok) {
      throw new Error(`http error! status: ${response.status}`);
    }

    const data = await response.json();

    // check for api errors
    if (data['Error Message']) {
      throw new Error('invalid stock symbol');
    }

    if (data['Note']) {
      throw new Error('api rate limit exceeded - please wait a moment');
    }

    const timeSeries = data['Time Series (Daily)'];
    if (!timeSeries) {
      throw new Error('no historical data available for this stock');
    }

    // transform alpha vantage format to the CandleData format
    // filter to only include dates within the last 'daysBack' calendar days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    cutoffDate.setHours(0, 0, 0, 0);

    const allDates = Object.keys(timeSeries);
    const filteredDates = allDates.filter(dateStr => {
      const date = new Date(dateStr);
      return date >= cutoffDate;
    }).reverse(); // reverse to chronological order

    const candles: CandleData = {
      c: [],
      h: [],
      l: [],
      o: [],
      t: [],
      v: [],
      s: 'ok',
    };

    filteredDates.forEach((date) => {
      const day = timeSeries[date];
      candles.c.push(parseFloat(day['4. close']));
      candles.h.push(parseFloat(day['2. high']));
      candles.l.push(parseFloat(day['3. low']));
      candles.o.push(parseFloat(day['1. open']));
      candles.t.push(new Date(date).getTime() / 1000); // convert to unix timestamp
      candles.v.push(parseInt(day['5. volume']));
    });

    return candles;
  } catch (error) {
    console.error(`error fetching candles for ${symbol}:`, error);
    throw error;
  }
};
