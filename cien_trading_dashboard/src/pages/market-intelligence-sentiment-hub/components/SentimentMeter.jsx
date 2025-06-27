import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const SentimentMeter = ({ market, timeframe }) => {
  const [sentimentData, setSentimentData] = useState({
    overall: 72,
    bullish: 45,
    bearish: 28,
    neutral: 27,
    trend: 'bullish',
    change: 5.2,
  });

  const mockSentimentData = {
    US_EQUITY: { overall: 72, bullish: 45, bearish: 28, neutral: 27, trend: 'bullish', change: 5.2 },
    FOREX: { overall: 58, bullish: 35, bearish: 42, neutral: 23, trend: 'bearish', change: -3.1 },
    CRYPTO: { overall: 85, bullish: 62, bearish: 18, neutral: 20, trend: 'bullish', change: 12.4 },
    COMMODITIES: { overall: 64, bullish: 38, bearish: 35, neutral: 27, trend: 'neutral', change: 1.8 },
  };

  useEffect(() => {
    setSentimentData(mockSentimentData[market] || mockSentimentData.US_EQUITY);
  }, [market, timeframe]);

  const getSentimentColor = (value) => {
    if (value >= 70) return 'text-success';
    if (value >= 40) return 'text-warning';
    return 'text-error';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'bullish': return 'TrendingUp';
      case 'bearish': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'bullish': return 'text-success';
      case 'bearish': return 'text-error';
      default: return 'text-warning';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary">Market Sentiment</h3>
        <div className="flex items-center space-x-1">
          <Icon 
            name={getTrendIcon(sentimentData.trend)} 
            size={14} 
            className={getTrendColor(sentimentData.trend)} 
          />
          <span className={`text-xs font-medium ${getTrendColor(sentimentData.trend)}`}>
            {sentimentData.change > 0 ? '+' : ''}{sentimentData.change}%
          </span>
        </div>
      </div>

      {/* Circular Sentiment Gauge */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="var(--color-surface-700)"
            strokeWidth="8"
          />
          {/* Sentiment arc */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={sentimentData.overall >= 70 ? 'var(--color-success)' : 
                   sentimentData.overall >= 40 ? 'var(--color-warning)' : 'var(--color-error)'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${sentimentData.overall * 2.51} 251`}
            className="trading-transition"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${getSentimentColor(sentimentData.overall)}`}>
            {sentimentData.overall}
          </span>
          <span className="text-xs text-text-tertiary">Sentiment</span>
        </div>
      </div>

      {/* Sentiment Breakdown */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-xs text-text-secondary">Bullish</span>
          </div>
          <span className="text-xs font-medium text-text-primary">{sentimentData.bullish}%</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span className="text-xs text-text-secondary">Bearish</span>
          </div>
          <span className="text-xs font-medium text-text-primary">{sentimentData.bearish}%</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-xs text-text-secondary">Neutral</span>
          </div>
          <span className="text-xs font-medium text-text-primary">{sentimentData.neutral}%</span>
        </div>
      </div>
    </div>
  );
};

export default SentimentMeter;