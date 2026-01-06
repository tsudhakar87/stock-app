import { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useStockChart } from '../hooks/useStockChart';

// register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface StockChartModalProps {
  symbol: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StockChartModal({ symbol, isOpen, onClose }: StockChartModalProps) {
  const { data, loading, error } = useStockChart(symbol);

  // handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const chartData = {
    datasets: [
      {
        label: `${symbol} Price`,
        data: data,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 4,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${symbol} - Last 30 Days`,
        color: '#111827',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Price: $${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
        },
        grid: {
          color: '#e5e7eb',
        },
      },
      y: {
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          callback: (value: any) => `$${value}`,
        },
      },
    },
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{symbol} Stock Chart</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>
        <div className="modal-body">
          {loading && (
            <div className="loading-spinner-wrapper">
              <div className="loading-spinner-content">
                <div className="spinner"></div>
                <p className="loading-text">loading chart data...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="error-box">
              <h3 className="error-title">error loading chart</h3>
              <p className="error-message">{error}</p>
            </div>
          )}
          {!loading && !error && data.length > 0 && (
            <div className="chart-container">
              <Line data={chartData} options={chartOptions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
