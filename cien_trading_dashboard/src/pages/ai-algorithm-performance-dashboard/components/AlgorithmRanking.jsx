import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const AlgorithmRanking = ({ algorithms, selectedAlgorithm, onAlgorithmSelect }) => {
  const [sortBy, setSortBy] = useState('confidence');
  const [sortOrder, setSortOrder] = useState('desc');

  const sortedAlgorithms = [...algorithms].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'maxDrawdown') {
      aValue = Math.abs(aValue);
      bValue = Math.abs(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue - bValue;
    }
    return bValue - aValue;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'paused':
        return 'text-warning';
      case 'stopped':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'Play';
      case 'paused':
        return 'Pause';
      case 'stopped':
        return 'Square';
      default:
        return 'Circle';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const generateSparklineData = (algorithm) => {
    const points = [];
    for (let i = 0; i < 20; i++) {
      points.push(Math.random() * 100);
    }
    return points;
  };

  const Sparkline = ({ data, color = '#2563EB', width = 60, height = 20 }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width={width} height={height} className="inline-block">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return 'ArrowUpDown';
    return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            Algorithm Ranking
          </h3>
          <p className="text-text-secondary text-sm">
            Performance leaderboard with live metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="Trophy" size={20} className="text-warning" />
          <span className="text-xs text-text-secondary">
            {algorithms.filter(a => a.status === 'active').length} active
          </span>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-border">
        <span className="text-xs text-text-secondary">Sort by:</span>
        {[
          { key: 'confidence', label: 'Confidence' },
          { key: 'winRate', label: 'Win Rate' },
          { key: 'sharpeRatio', label: 'Sharpe' },
          { key: 'dailyPnL', label: 'P&L' },
        ].map((option) => (
          <button
            key={option.key}
            onClick={() => handleSort(option.key)}
            className={`flex items-center space-x-1 px-2 py-1 text-xs rounded trading-transition ${
              sortBy === option.key
                ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-surface-700'
            }`}
          >
            <span>{option.label}</span>
            <Icon name={getSortIcon(option.key)} size={12} />
          </button>
        ))}
      </div>

      {/* Algorithm List */}
      <div className="space-y-3">
        {sortedAlgorithms.map((algorithm, index) => (
          <div
            key={algorithm.id}
            onClick={() => onAlgorithmSelect(algorithm.id)}
            className={`p-4 rounded-lg border cursor-pointer trading-transition ${
              selectedAlgorithm === algorithm.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-border-medium hover:bg-surface-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-text-tertiary">
                    #{index + 1}
                  </span>
                  <Icon
                    name={getStatusIcon(algorithm.status)}
                    size={16}
                    className={getStatusColor(algorithm.status)}
                  />
                </div>
                
                <div>
                  <h4 className="font-medium text-text-primary text-sm">
                    {algorithm.name}
                  </h4>
                  <p className="text-xs text-text-secondary">
                    {algorithm.description}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-text-primary">
                  {algorithm.confidence}%
                </div>
                <div className="text-xs text-text-secondary">
                  confidence
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Win Rate</span>
                  <span className="text-xs font-medium text-text-primary">
                    {algorithm.winRate}%
                  </span>
                </div>
                <div className="w-full bg-surface-700 rounded-full h-1 mt-1">
                  <div
                    className="bg-success h-1 rounded-full"
                    style={{ width: `${algorithm.winRate}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Sharpe</span>
                  <span className="text-xs font-medium text-text-primary">
                    {algorithm.sharpeRatio}
                  </span>
                </div>
                <div className="flex items-center justify-end mt-1">
                  <Sparkline
                    data={generateSparklineData(algorithm)}
                    color={algorithm.sharpeRatio > 2 ? '#10B981' : algorithm.sharpeRatio > 1 ? '#F59E0B' : '#EF4444'}
                    width={40}
                    height={12}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-4">
                <span className="text-text-secondary">
                  Daily P&L: <span className={`font-medium ${
                    algorithm.dailyPnL >= 0 ? 'text-success' : 'text-error'
                  }`}>
                    {formatCurrency(algorithm.dailyPnL)}
                  </span>
                </span>
                <span className="text-text-secondary">
                  Trades: <span className="font-medium text-text-primary">
                    {algorithm.totalTrades}
                  </span>
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-text-tertiary">
                  {algorithm.lastSignal.toLocaleTimeString()}
                </span>
                {algorithm.status === 'active' && (
                  <div className="w-2 h-2 bg-success rounded-full pulse-ambient" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-text-secondary">Total Active:</span>
            <span className="ml-2 font-medium text-success">
              {algorithms.filter(a => a.status === 'active').length}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Avg Confidence:</span>
            <span className="ml-2 font-medium text-text-primary">
              {(algorithms.reduce((sum, a) => sum + a.confidence, 0) / algorithms.length).toFixed(1)}%
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Total P&L:</span>
            <span className={`ml-2 font-medium ${
              algorithms.reduce((sum, a) => sum + a.dailyPnL, 0) >= 0 ? 'text-success' : 'text-error'
            }`}>
              {formatCurrency(algorithms.reduce((sum, a) => sum + a.dailyPnL, 0))}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Total Trades:</span>
            <span className="ml-2 font-medium text-text-primary">
              {algorithms.reduce((sum, a) => sum + a.totalTrades, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmRanking;