import { useState, useEffect, useCallback, useRef } from 'react';
import type { StockTableRow } from '../types/quote.ts';
import { fetchMultipleStockQuotes, DEFAULT_STOCKS } from '../services/finnhubApi';

interface UseStockPollingResult {
  stocks: StockTableRow[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
  isRefreshing: boolean;
}

export const useStockPolling = (pollInterval: number = 30000): UseStockPollingResult => {
  const [stocks, setStocks] = useState<StockTableRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  const loadStockData = useCallback(async (isManualRefresh: boolean = false) => {
    // prevent concurrent requests
    if (isFetchingRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;

      if (isManualRefresh) {
        setIsRefreshing(true);
      } else if (stocks.length === 0) {
        setLoading(true);
      }

      setError(null);

      const stockDataList = await fetchMultipleStockQuotes(DEFAULT_STOCKS);

      const tableData: StockTableRow[] = stockDataList
        .filter((data) => data.quote !== null)
        .map((data) => ({
          symbol: data.symbol,
          price: data.quote!.c,
          change: data.quote!.d,
          changePercent: data.quote!.dp,
        }));

      setStocks(tableData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'failed to load stock data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      isFetchingRef.current = false;
    }
  }, [stocks.length]);

  const refresh = useCallback(() => {
    loadStockData(true);
  }, [loadStockData]);

  // initial load
  useEffect(() => {
    loadStockData(false);
  }, []);

  // polling interval
  useEffect(() => {
    if (pollInterval <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      loadStockData(false);
    }, pollInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [pollInterval, loadStockData]);

  return {
    stocks,
    loading,
    error,
    lastUpdated,
    refresh,
    isRefreshing,
  };
};
