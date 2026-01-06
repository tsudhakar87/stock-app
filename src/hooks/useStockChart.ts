import { useState, useEffect } from 'react';
import type { ChartDataPoint } from '../types/candle.ts';
import { fetchStockCandles } from '../services/alphaVantageApi';

interface UseStockChartResult {
  data: ChartDataPoint[];
  loading: boolean;
  error: string | null;
}

export const useStockChart = (symbol: string | null): UseStockChartResult => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    const loadChartData = async () => {
      try {
        setLoading(true);
        setError(null);

        const candleData = await fetchStockCandles(symbol);

        // transform candle data to chart format
        const chartPoints: ChartDataPoint[] = candleData.t.map((timestamp, index) => ({
          x: timestamp * 1000, // convert to milliseconds
          y: candleData.c[index], // closing price
        }));

        setData(chartPoints);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'failed to load chart data');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, [symbol]);

  return { data, loading, error };
};
