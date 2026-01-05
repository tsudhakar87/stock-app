import { useState, useEffect } from 'react';
import StockTable from '../components/StockTable';
import { useStockPolling } from '../hooks/useStockPolling';

export default function Dashboard() {
  const { stocks, loading, error, lastUpdated, refresh, isRefreshing } = useStockPolling(30000);
  const [currentTime, setCurrentTime] = useState(new Date());

  // update current time every second to refresh the "X seconds ago" display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatLastUpdated = (date: Date | null): string => {
    if (!date) return 'never';

    const diffSeconds = Math.floor((currentTime.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) {
      return `${diffSeconds} second${diffSeconds !== 1 ? 's' : ''} ago`;
    } else if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleTimeString();
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Stock Price Dashboard</h1>
          </div>
          <div className="loading-spinner-wrapper">
            <div className="loading-spinner-content">
              <div className="spinner"></div>
              <p className="loading-text">Loading stock data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="loading-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Stock Price Dashboard</h1>
          </div>
          <div className="error-box">
            <h3 className="error-title">Error Loading Data</h3>
            <p className="error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="dashboard-header-main">
            <div>
              <h1 className="dashboard-title">Stock Price Dashboard</h1>
              <p className="dashboard-subtitle">
                Real-time stock prices for top {stocks.length} companies
              </p>
            </div>
            <div className="dashboard-controls">
              <button
                onClick={refresh}
                disabled={isRefreshing}
                className="refresh-button"
              >
                {isRefreshing ? (
                  <>
                    <span className="refresh-spinner"></span>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <span className="refresh-icon">↻</span>
                    Refresh
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="last-updated">
            Last updated: {formatLastUpdated(lastUpdated)}
          </p>
        </div>
        <StockTable stocks={stocks} />
      </div>
    </div>
  );
}
