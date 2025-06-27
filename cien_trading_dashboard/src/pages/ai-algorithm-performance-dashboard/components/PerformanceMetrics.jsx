import React from 'react';
import Icon from 'components/AppIcon';

const PerformanceMetrics = ({ algorithm, comparisonMode, selectedAlgorithms, period }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getMetricColor = (value, type) => {
    if (type === 'pnl' || type === 'return') {
      return value >= 0 ? 'text-success' : 'text-error';
    }
    if (type === 'drawdown') {
      return value <= -10 ? 'text-error' : value <= -5 ? 'text-warning' : 'text-success';
    }
    return 'text-text-primary';
  };

  const getTrendIcon = (value) => {
    if (value > 0) return 'TrendingUp';
    if (value < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (value) => {
    if (value > 0) return 'text-success';
    if (value < 0) return 'text-error';
    return 'text-text-secondary';
  };

  const benchmarkData = {
    confidence: 75.0,
    winRate: 55.0,
    sharpeRatio: 1.2,
    maxDrawdown: -12.0,
  };

  const calculateTrend = (current, benchmark) => {
    return ((current - benchmark) / benchmark) * 100;
  };

  if (comparisonMode && selectedAlgorithms.length > 1) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {selectedAlgorithms.map((algo) => (
          <div key={algo.id} className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-text-primary truncate">
                {algo.name}
              </h3>
              <div className={`w-2 h-2 rounded-full ${
                algo.status === 'active' ? 'bg-success pulse-ambient' : 
                algo.status === 'paused' ? 'bg-warning' : 'bg-error'
              }`} />
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Confidence</span>
                  <span className="text-sm font-medium text-text-primary">
                    {algo.confidence}%
                  </span>
                </div>
                <div className="w-full bg-surface-700 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-primary h-1.5 rounded-full"
                    style={{ width: `${algo.confidence}%` }}
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-xs text-text-secondary">Win Rate</span>
                <span className="text-sm font-medium text-text-primary">
                  {algo.winRate}%
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-xs text-text-secondary">Sharpe</span>
                <span className="text-sm font-medium text-text-primary">
                  {algo.sharpeRatio}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-xs text-text-secondary">Daily P&L</span>
                <span className={`text-sm font-medium ${getMetricColor(algo.dailyPnL, 'pnl')}`}>
                  {formatCurrency(algo.dailyPnL)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Algorithm Confidence */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Brain" size={20} className="text-primary" />
            <span className="text-sm font-medium text-text-secondary">
              Algorithm Confidence
            </span>
          </div>
          <Icon
            name={getTrendIcon(calculateTrend(algorithm.confidence, benchmarkData.confidence))}
            size={16}
            className={getTrendColor(calculateTrend(algorithm.confidence, benchmarkData.confidence))}
          />
        </div>
        
        <div className="mb-3">
          <div className="text-2xl font-bold text-text-primary mb-1">
            {algorithm.confidence}%
          </div>
          <div className="text-xs text-text-secondary">
            vs benchmark {benchmarkData.confidence}%
          </div>
        </div>
        
        <div className="w-full bg-surface-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
            style={{ width: `${algorithm.confidence}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-text-tertiary mt-2">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Win Rate */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Target" size={20} className="text-success" />
            <span className="text-sm font-medium text-text-secondary">
              Win Rate
            </span>
          </div>
          <Icon
            name={getTrendIcon(calculateTrend(algorithm.winRate, benchmarkData.winRate))}
            size={16}
            className={getTrendColor(calculateTrend(algorithm.winRate, benchmarkData.winRate))}
          />
        </div>
        
        <div className="mb-3">
          <div className="text-2xl font-bold text-text-primary mb-1">
            {algorithm.winRate}%
          </div>
          <div className="text-xs text-text-secondary">
            vs benchmark {benchmarkData.winRate}%
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-surface-700 rounded-full h-2">
            <div
              className="bg-success h-2 rounded-full"
              style={{ width: `${algorithm.winRate}%` }}
            />
          </div>
          <span className="text-xs text-text-tertiary">
            {algorithm.totalTrades} trades
          </span>
        </div>
      </div>

      {/* Sharpe Ratio */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={20} className="text-accent" />
            <span className="text-sm font-medium text-text-secondary">
              Sharpe Ratio
            </span>
          </div>
          <Icon
            name={getTrendIcon(calculateTrend(algorithm.sharpeRatio, benchmarkData.sharpeRatio))}
            size={16}
            className={getTrendColor(calculateTrend(algorithm.sharpeRatio, benchmarkData.sharpeRatio))}
          />
        </div>
        
        <div className="mb-3">
          <div className="text-2xl font-bold text-text-primary mb-1">
            {algorithm.sharpeRatio}
          </div>
          <div className="text-xs text-text-secondary">
            vs benchmark {benchmarkData.sharpeRatio}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-tertiary">Risk-adjusted return</span>
          <span className={`font-medium ${
            algorithm.sharpeRatio > 2 ? 'text-success' : 
            algorithm.sharpeRatio > 1 ? 'text-warning' : 'text-error'
          }`}>
            {algorithm.sharpeRatio > 2 ? 'Excellent' : 
             algorithm.sharpeRatio > 1 ? 'Good' : 'Poor'}
          </span>
        </div>
      </div>

      {/* Maximum Drawdown */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingDown" size={20} className="text-error" />
            <span className="text-sm font-medium text-text-secondary">
              Max Drawdown
            </span>
          </div>
          <Icon
            name={getTrendIcon(-calculateTrend(Math.abs(algorithm.maxDrawdown), Math.abs(benchmarkData.maxDrawdown)))}
            size={16}
            className={getTrendColor(-calculateTrend(Math.abs(algorithm.maxDrawdown), Math.abs(benchmarkData.maxDrawdown)))}
          />
        </div>
        
        <div className="mb-3">
          <div className={`text-2xl font-bold mb-1 ${getMetricColor(algorithm.maxDrawdown, 'drawdown')}`}>
            {formatPercentage(algorithm.maxDrawdown)}
          </div>
          <div className="text-xs text-text-secondary">
            vs benchmark {formatPercentage(benchmarkData.maxDrawdown)}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-tertiary">Risk exposure</span>
          <span className={`font-medium ${getMetricColor(algorithm.maxDrawdown, 'drawdown')}`}>
            {Math.abs(algorithm.maxDrawdown) <= 5 ? 'Low' : 
             Math.abs(algorithm.maxDrawdown) <= 10 ? 'Medium' : 'High'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;