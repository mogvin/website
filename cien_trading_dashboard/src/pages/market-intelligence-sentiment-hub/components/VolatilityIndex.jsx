import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const VolatilityIndex = ({ market }) => {
  const [volatilityData, setVolatilityData] = useState({
    current: 18.45,
    change: -2.34,
    changePercent: -11.25,
    level: 'moderate',
    historical: [15.2, 16.8, 19.1, 22.3, 18.45],
  });

  const mockVolatilityData = {
    US_EQUITY: { current: 18.45, change: -2.34, changePercent: -11.25, level: 'moderate' },
    FOREX: { current: 12.67, change: 1.23, changePercent: 10.75, level: 'low' },
    CRYPTO: { current: 45.89, change: 8.92, changePercent: 24.15, level: 'high' },
    COMMODITIES: { current: 28.34, change: -1.56, changePercent: -5.22, level: 'moderate' },
  };

  useEffect(() => {
    const data = mockVolatilityData[market] || mockVolatilityData.US_EQUITY;
    setVolatilityData({
      ...data,
      historical: [
        data.current - 5,
        data.current - 2,
        data.current + 3,
        data.current + 1,
        data.current
      ],
    });
  }, [market]);

  const getVolatilityColor = (level) => {
    switch (level) {
      case 'low': return 'text-success';
      case 'moderate': return 'text-warning';
      case 'high': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getVolatilityIcon = (level) => {
    switch (level) {
      case 'low': return 'TrendingDown';
      case 'moderate': return 'Activity';
      case 'high': return 'Zap';
      default: return 'Activity';
    }
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-success' : 'text-error';
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary">Volatility Index</h3>
        <Icon 
          name={getVolatilityIcon(volatilityData.level)} 
          size={16} 
          className={getVolatilityColor(volatilityData.level)} 
        />
      </div>

      {/* Current Volatility */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-text-primary mb-1">
          {volatilityData.current.toFixed(2)}
        </div>
        <div className="flex items-center justify-center space-x-2">
          <span className={`text-sm font-medium ${getChangeColor(volatilityData.change)}`}>
            {volatilityData.change > 0 ? '+' : ''}{volatilityData.change.toFixed(2)}
          </span>
          <span className={`text-xs ${getChangeColor(volatilityData.change)}`}>
            ({volatilityData.changePercent > 0 ? '+' : ''}{volatilityData.changePercent.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Volatility Level Indicator */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-secondary">Level</span>
          <span className={`text-xs font-medium capitalize ${getVolatilityColor(volatilityData.level)}`}>
            {volatilityData.level}
          </span>
        </div>
        
        <div className="relative h-2 bg-surface-700 rounded-full overflow-hidden">
          <div 
            className={`absolute left-0 top-0 h-full rounded-full trading-transition ${
              volatilityData.level === 'low' ? 'bg-success w-1/3' :
              volatilityData.level === 'moderate'? 'bg-warning w-2/3' : 'bg-error w-full'
            }`}
          />
        </div>
        
        <div className="flex justify-between text-xs text-text-tertiary mt-1">
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
        </div>
      </div>

      {/* Mini Sparkline */}
      <div className="relative h-8">
        <svg className="w-full h-full" viewBox="0 0 100 20">
          <polyline
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            points={volatilityData.historical.map((value, index) => 
              `${(index / (volatilityData.historical.length - 1)) * 100},${20 - (value / Math.max(...volatilityData.historical)) * 15}`
            ).join(' ')}
          />
          {volatilityData.historical.map((value, index) => (
            <circle
              key={index}
              cx={(index / (volatilityData.historical.length - 1)) * 100}
              cy={20 - (value / Math.max(...volatilityData.historical)) * 15}
              r="1.5"
              fill="var(--color-accent)"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default VolatilityIndex;