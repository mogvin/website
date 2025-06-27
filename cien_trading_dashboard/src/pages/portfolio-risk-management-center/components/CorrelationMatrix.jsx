import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const CorrelationMatrix = ({ portfolio }) => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [viewMode, setViewMode] = useState('correlation');

  const assets = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];
  
  const correlationData = {
    'AAPL': { 'AAPL': 1.00, 'MSFT': 0.72, 'GOOGL': 0.68, 'AMZN': 0.65, 'TSLA': 0.45, 'NVDA': 0.58, 'META': 0.62, 'NFLX': 0.48 },
    'MSFT': { 'AAPL': 0.72, 'MSFT': 1.00, 'GOOGL': 0.75, 'AMZN': 0.69, 'TSLA': 0.42, 'NVDA': 0.61, 'META': 0.58, 'NFLX': 0.44 },
    'GOOGL': { 'AAPL': 0.68, 'MSFT': 0.75, 'GOOGL': 1.00, 'AMZN': 0.71, 'TSLA': 0.48, 'NVDA': 0.64, 'META': 0.67, 'NFLX': 0.52 },
    'AMZN': { 'AAPL': 0.65, 'MSFT': 0.69, 'GOOGL': 0.71, 'AMZN': 1.00, 'TSLA': 0.51, 'NVDA': 0.59, 'META': 0.63, 'NFLX': 0.58 },
    'TSLA': { 'AAPL': 0.45, 'MSFT': 0.42, 'GOOGL': 0.48, 'AMZN': 0.51, 'TSLA': 1.00, 'NVDA': 0.56, 'META': 0.41, 'NFLX': 0.38 },
    'NVDA': { 'AAPL': 0.58, 'MSFT': 0.61, 'GOOGL': 0.64, 'AMZN': 0.59, 'TSLA': 0.56, 'NVDA': 1.00, 'META': 0.55, 'NFLX': 0.47 },
    'META': { 'AAPL': 0.62, 'MSFT': 0.58, 'GOOGL': 0.67, 'AMZN': 0.63, 'TSLA': 0.41, 'NVDA': 0.55, 'META': 1.00, 'NFLX': 0.54 },
    'NFLX': { 'AAPL': 0.48, 'MSFT': 0.44, 'GOOGL': 0.52, 'AMZN': 0.58, 'TSLA': 0.38, 'NVDA': 0.47, 'META': 0.54, 'NFLX': 1.00 }
  };

  const riskContribution = {
    'AAPL': 18.5, 'MSFT': 16.2, 'GOOGL': 14.8, 'AMZN': 13.1, 
    'TSLA': 12.4, 'NVDA': 11.7, 'META': 8.9, 'NFLX': 4.4
  };

  const getCorrelationColor = (value) => {
    if (value >= 0.8) return 'bg-error text-white';
    if (value >= 0.6) return 'bg-warning text-white';
    if (value >= 0.4) return 'bg-accent text-white';
    if (value >= 0.2) return 'bg-success text-white';
    return 'bg-surface-600 text-text-primary';
  };

  const getRiskContributionColor = (value) => {
    if (value >= 15) return 'bg-error text-white';
    if (value >= 10) return 'bg-warning text-white';
    if (value >= 5) return 'bg-accent text-white';
    return 'bg-success text-white';
  };

  const handleAssetClick = (asset) => {
    setSelectedAsset(selectedAsset === asset ? null : asset);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-1">
            Asset Correlation Matrix
          </h2>
          <p className="text-sm text-text-secondary">
            30-day rolling correlation • {portfolio}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-surface-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('correlation')}
              className={`px-3 py-1 text-xs font-medium rounded trading-transition ${
                viewMode === 'correlation' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              Correlation
            </button>
            <button
              onClick={() => setViewMode('risk')}
              className={`px-3 py-1 text-xs font-medium rounded trading-transition ${
                viewMode === 'risk' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              Risk Contribution
            </button>
          </div>
          
          <button className="text-text-secondary hover:text-text-primary">
            <Icon name="Download" size={16} />
          </button>
        </div>
      </div>

      {viewMode === 'correlation' ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-text-secondary p-2"></th>
                {assets.map((asset) => (
                  <th key={asset} className="text-center text-xs font-medium text-text-secondary p-2">
                    {asset}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assets.map((rowAsset) => (
                <tr key={rowAsset}>
                  <td className="text-xs font-medium text-text-primary p-2">
                    {rowAsset}
                  </td>
                  {assets.map((colAsset) => {
                    const correlation = correlationData[rowAsset][colAsset];
                    return (
                      <td key={colAsset} className="p-1">
                        <div
                          className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded cursor-pointer trading-transition hover:scale-110 ${getCorrelationColor(correlation)}`}
                          onClick={() => handleAssetClick(`${rowAsset}-${colAsset}`)}
                          title={`${rowAsset} vs ${colAsset}: ${correlation.toFixed(2)}`}
                        >
                          {correlation.toFixed(2)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(riskContribution).map(([asset, contribution]) => (
            <div
              key={asset}
              className="bg-surface-700 border border-border rounded-lg p-3 cursor-pointer trading-transition hover:bg-surface-600"
              onClick={() => handleAssetClick(asset)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">{asset}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${getRiskContributionColor(contribution)}`}>
                  {contribution}%
                </span>
              </div>
              
              <div className="w-full bg-surface-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full trading-transition ${
                    contribution >= 15 ? 'bg-error' :
                    contribution >= 10 ? 'bg-warning' :
                    contribution >= 5 ? 'bg-accent' : 'bg-success'
                  }`}
                  style={{ width: `${Math.min(contribution * 5, 100)}%` }}
                />
              </div>
              
              <p className="text-xs text-text-tertiary mt-1">
                Risk Contribution
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-xs text-text-tertiary">Correlation Scale:</span>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-success rounded"></div>
                <span className="text-xs text-text-secondary">Low (&lt;0.4)</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-accent rounded"></div>
                <span className="text-xs text-text-secondary">Medium (0.4-0.6)</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-warning rounded"></div>
                <span className="text-xs text-text-secondary">High (0.6-0.8)</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-error rounded"></div>
                <span className="text-xs text-text-secondary">Very High (&gt;0.8)</span>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-text-tertiary">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Selected Asset Details */}
      {selectedAsset && (
        <div className="mt-4 bg-surface-700 border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-text-primary">
              Asset Details: {selectedAsset}
            </h4>
            <button
              onClick={() => setSelectedAsset(null)}
              className="text-text-secondary hover:text-text-primary"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-text-tertiary">Average Correlation:</span>
              <span className="ml-2 font-medium text-text-primary">0.58</span>
            </div>
            <div>
              <span className="text-text-tertiary">Risk Contribution:</span>
              <span className="ml-2 font-medium text-text-primary">
                {riskContribution[selectedAsset.split('-')[0]] || 'N/A'}%
              </span>
            </div>
            <div>
              <span className="text-text-tertiary">Volatility:</span>
              <span className="ml-2 font-medium text-text-primary">24.5%</span>
            </div>
            <div>
              <span className="text-text-tertiary">Beta:</span>
              <span className="ml-2 font-medium text-text-primary">1.23</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorrelationMatrix;