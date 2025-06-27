import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const SentimentHeatmap = ({ market, timeframe }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);
  const [viewMode, setViewMode] = useState('sectors');

  const mockSectorData = [
    { name: 'Technology', sentiment: 78, change: 5.2, size: 25, color: 'success' },
    { name: 'Healthcare', sentiment: 65, change: -2.1, size: 18, color: 'warning' },
    { name: 'Financial', sentiment: 72, change: 3.8, size: 22, color: 'success' },
    { name: 'Energy', sentiment: 45, change: -8.5, size: 12, color: 'error' },
    { name: 'Consumer Disc.', sentiment: 68, change: 1.9, size: 15, color: 'warning' },
    { name: 'Industrials', sentiment: 58, change: -1.2, size: 14, color: 'warning' },
    { name: 'Materials', sentiment: 52, change: -4.3, size: 8, color: 'error' },
    { name: 'Utilities', sentiment: 61, change: 0.8, size: 6, color: 'warning' },
    { name: 'Real Estate', sentiment: 55, change: -2.7, size: 5, color: 'error' },
    { name: 'Telecom', sentiment: 63, change: 2.1, size: 4, color: 'warning' },
  ];

  const mockAssetData = [
    { name: 'AAPL', sentiment: 82, change: 6.1, size: 8, color: 'success' },
    { name: 'MSFT', sentiment: 79, change: 4.3, size: 7, color: 'success' },
    { name: 'GOOGL', sentiment: 75, change: 2.8, size: 6, color: 'success' },
    { name: 'AMZN', sentiment: 71, change: 1.5, size: 6, color: 'success' },
    { name: 'TSLA', sentiment: 68, change: -3.2, size: 5, color: 'warning' },
    { name: 'NVDA', sentiment: 85, change: 8.7, size: 5, color: 'success' },
    { name: 'META', sentiment: 64, change: -1.8, size: 4, color: 'warning' },
    { name: 'NFLX', sentiment: 59, change: -4.1, size: 3, color: 'error' },
    { name: 'JPM', sentiment: 73, change: 3.9, size: 4, color: 'success' },
    { name: 'JNJ', sentiment: 66, change: -0.9, size: 3, color: 'warning' },
  ];

  useEffect(() => {
    setHeatmapData(viewMode === 'sectors' ? mockSectorData : mockAssetData);
  }, [viewMode, market, timeframe]);

  const getSentimentColor = (sentiment) => {
    if (sentiment >= 70) return 'bg-success';
    if (sentiment >= 40) return 'bg-warning';
    return 'bg-error';
  };

  const getSentimentOpacity = (sentiment) => {
    const normalized = Math.max(0, Math.min(100, sentiment)) / 100;
    return 0.3 + (normalized * 0.7);
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-success' : 'text-error';
  };

  const handleCellClick = (item) => {
    setSelectedSector(selectedSector?.name === item.name ? null : item);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Cross-Asset Sentiment Heatmap</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('sectors')}
            className={`px-3 py-1 rounded text-sm trading-transition ${
              viewMode === 'sectors' ?'bg-primary text-white' :'bg-surface-700 text-text-secondary hover:text-text-primary'
            }`}
          >
            Sectors
          </button>
          <button
            onClick={() => setViewMode('assets')}
            className={`px-3 py-1 rounded text-sm trading-transition ${
              viewMode === 'assets' ?'bg-primary text-white' :'bg-surface-700 text-text-secondary hover:text-text-primary'
            }`}
          >
            Top Assets
          </button>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {heatmapData.map((item, index) => (
          <div
            key={item.name}
            onClick={() => handleCellClick(item)}
            className={`relative p-3 rounded-lg cursor-pointer trading-transition border-2 ${
              selectedSector?.name === item.name ? 'border-primary' : 'border-transparent'
            } ${getSentimentColor(item.sentiment)}`}
            style={{ 
              opacity: getSentimentOpacity(item.sentiment),
              minHeight: `${Math.max(60, item.size * 3)}px`
            }}
          >
            <div className="text-white">
              <div className="font-medium text-sm mb-1 truncate">{item.name}</div>
              <div className="text-lg font-bold">{item.sentiment}</div>
              <div className={`text-xs ${item.change >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
              </div>
            </div>
            
            {/* Size indicator */}
            <div className="absolute bottom-1 right-1">
              <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Item Details */}
      {selectedSector && (
        <div className="bg-surface-700 border border-border rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-text-primary">{selectedSector.name}</h4>
            <button
              onClick={() => setSelectedSector(null)}
              className="p-1 text-text-tertiary hover:text-text-primary trading-transition"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-text-secondary text-sm mb-1">Sentiment Score</div>
              <div className={`text-2xl font-bold ${
                selectedSector.sentiment >= 70 ? 'text-success' :
                selectedSector.sentiment >= 40 ? 'text-warning' : 'text-error'
              }`}>
                {selectedSector.sentiment}
              </div>
            </div>
            
            <div>
              <div className="text-text-secondary text-sm mb-1">24h Change</div>
              <div className={`text-2xl font-bold ${getChangeColor(selectedSector.change)}`}>
                {selectedSector.change > 0 ? '+' : ''}{selectedSector.change.toFixed(1)}%
              </div>
            </div>
            
            <div>
              <div className="text-text-secondary text-sm mb-1">Market Weight</div>
              <div className="text-2xl font-bold text-text-primary">
                {selectedSector.size}%
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button className="flex items-center space-x-1 px-3 py-1 bg-primary text-white rounded text-sm trading-transition hover:bg-primary-700">
              <Icon name="TrendingUp" size={14} />
              <span>View Details</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1 bg-surface-600 text-text-primary rounded text-sm trading-transition hover:bg-surface-500">
              <Icon name="Bell" size={14} />
              <span>Set Alert</span>
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-text-secondary">Sentiment:</span>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-error rounded"></div>
              <span className="text-xs text-text-tertiary">Bearish</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-warning rounded"></div>
              <span className="text-xs text-text-tertiary">Neutral</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-success rounded"></div>
              <span className="text-xs text-text-tertiary">Bullish</span>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-text-tertiary">
          Size represents market weight • Click cells for details
        </div>
      </div>
    </div>
  );
};

export default SentimentHeatmap;