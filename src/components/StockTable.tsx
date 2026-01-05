import type { StockTableRow } from '../types/quote.ts';
import '../App.css';

interface StockTableProps {
  stocks: StockTableRow[];
}

export default function StockTable({ stocks }: StockTableProps) {
  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number): string => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  const formatPercentChange = (changePercent: number): string => {
    const sign = changePercent >= 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  };

  const getChangeClass = (value: number): string => {
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
  };

  return (
    <div className="stock-table-container">
      <table className="stock-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th className="text-right">Price</th>
            <th className="text-right">Change</th>
            <th className="text-right">% Change</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.symbol}>
              <td>
                <div className="stock-symbol">{stock.symbol}</div>
              </td>
              <td>
                <div className="stock-price">{formatPrice(stock.price)}</div>
              </td>
              <td>
                <div className={`stock-change ${getChangeClass(stock.change)}`}>
                  {formatChange(stock.change)}
                </div>
              </td>
              <td>
                <div className={`stock-change ${getChangeClass(stock.changePercent)}`}>
                  {formatPercentChange(stock.changePercent)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
