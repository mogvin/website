import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const LiveTickerTape = ({ instruments }) => {
  const [tickerData, setTickerData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  const generateExtendedTickerData = () => {
    const baseInstruments = [
      { symbol: 'SPY', name: 'SPDR S&P 500', price: 445.67, change: 2.34, volume: 45678900 },
      { symbol: 'QQQ', name: 'Invesco QQQ', price: 378.92, change: -1.45, volume: 32145600 },
      { symbol: 'AAPL', name: 'Apple Inc.', price: 189.43, change: 3.21, volume: 67890123 },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -5.67, volume: 89012345 },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 12.45, volume: 23456789 },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 412.85, change: 4.67, volume: 34567890 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.73, change: -2.18, volume: 45678901 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 155.89, change: 1.92, volume: 56789012 },
      { symbol: 'META', name: 'Meta Platforms', price: 487.33, change: -3.45, volume: 67890123 },
      { symbol: 'BTC-USD', name: 'Bitcoin', price: 67234.56, change: 1234.78, volume: 12345678 },
      { symbol: 'ETH-USD', name: 'Ethereum', price: 3456.78, change: -89.12, volume: 23456789 },
      { symbol: 'GLD', name: 'SPDR Gold Trust', price: 198.45, change: 0.78, volume: 8901234 },
      { symbol: 'TLT', name: '20+ Year Treasury', price: 89.67, change: -0.45, volume: 12345678 },
      { symbol: 'VIX', name: 'CBOE Volatility', price: 18.45, change: -2.34, volume: 0 },
      { symbol: 'DXY', name: 'US Dollar Index', price: 103.45, change: 0.23, volume: 0 },
    ];

    return baseInstruments.map(instrument => ({
      ...instrument,
      changePercent: ((instrument.change / (instrument.price - instrument.change)) * 100),
      isVolumeSurge: Math.random() > 0.8,
      isNewHigh: Math.random() > 0.9,
      isNewLow: Math.random() > 0.95,
    }));
  };

  useEffect(() => {
    setTickerData(generateExtendedTickerData());
    
    const interval = setInterval(() => {
      setTickerData(prev => prev.map(item => ({
        ...item,
        price: item.price + (Math.random() - 0.5) * 2,
        change: item.change + (Math.random() - 0.5) * 0.5,
        volume: item.volume + Math.floor((Math.random() - 0.5) * 100000),
        isVolumeSurge: Math.random() > 0.85,
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-success' : 'text-error';
  };

  const formatVolume = (volume) => {
    if (volume === 0) return 'N/A';
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(0)}K`;
    return volume.toString();
  };

  const formatPrice = (price, symbol) => {
    if (symbol.includes('BTC') || symbol.includes('ETH')) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toFixed(2);
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Ticker Controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-700">
        <div className="flex items-center space-x-4">
          <h3 className="text-sm font-medium text-text-primary">Live Market Data</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full pulse-ambient"></div>
            <span className="text-xs text-text-secondary">Real-time</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 bg-surface-600 hover:bg-surface-500 rounded trading-transition"
          >
            <Icon name={isPlaying ? 'Pause' : 'Play'} size={14} className="text-text-primary" />
          </button>
          
          <select
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="bg-surface-600 text-text-primary border border-border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={3}>3x</option>
          </select>
        </div>
      </div>

      {/* Scrolling Ticker */}
      <div className="relative h-12 overflow-hidden bg-background">
        <div 
          className={`flex items-center h-full whitespace-nowrap ${
            isPlaying ? 'animate-scroll' : ''
          }`}
          style={{ 
            animationDuration: `${60 / speed}s`,
            animationPlayState: isPlaying ? 'running' : 'paused'
          }}
        >
          {tickerData.concat(tickerData).map((item, index) => (
            <div
              key={`${item.symbol}-${index}`}
              className="flex items-center space-x-2 px-6 border-r border-border-light"
            >
              {/* Symbol */}
              <span className="text-text-primary font-medium text-sm">
                {item.symbol}
              </span>

              {/* Price */}
              <span className="text-text-primary font-data text-sm">
                ${formatPrice(item.price, item.symbol)}
              </span>

              {/* Change */}
              <div className="flex items-center space-x-1">
                <Icon 
                  name={item.change >= 0 ? 'TrendingUp' : 'TrendingDown'} 
                  size={12} 
                  className={getChangeColor(item.change)} 
                />
                <span className={`text-xs font-medium ${getChangeColor(item.change)}`}>
                  {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}
                </span>
                <span className={`text-xs ${getChangeColor(item.change)}`}>
                  ({item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
                </span>
              </div>

              {/* Volume */}
              <div className="flex items-center space-x-1">
                <Icon name="BarChart3" size={10} className="text-text-tertiary" />
                <span className={`text-xs ${item.isVolumeSurge ? 'text-warning font-medium' : 'text-text-tertiary'}`}>
                  {formatVolume(item.volume)}
                </span>
              </div>

              {/* Special Indicators */}
              {item.isNewHigh && (
                <span className="text-xs bg-success text-white px-1 py-0.5 rounded font-medium">
                  HIGH
                </span>
              )}
              {item.isNewLow && (
                <span className="text-xs bg-error text-white px-1 py-0.5 rounded font-medium">
                  LOW
                </span>
              )}
              {item.isVolumeSurge && (
                <Icon name="Zap" size={12} className="text-warning" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Market Summary Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface-700 border-t border-border">
        <div className="flex items-center space-x-6 text-xs">
          <div className="flex items-center space-x-1">
            <span className="text-text-secondary">Market:</span>
            <span className="text-success font-medium">OPEN</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-text-secondary">Session:</span>
            <span className="text-text-primary font-medium">US Regular</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-text-secondary">Next Close:</span>
            <span className="text-text-primary font-medium">4:00 PM EST</span>
          </div>
        </div>
        
        <div className="text-xs text-text-tertiary">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LiveTickerTape;