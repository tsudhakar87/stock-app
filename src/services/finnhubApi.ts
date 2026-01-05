import type { Quote, StockData } from '../types/quote.ts';

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

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
