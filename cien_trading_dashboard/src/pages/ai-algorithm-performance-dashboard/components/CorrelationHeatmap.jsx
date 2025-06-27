import React, { useState, useMemo } from 'react';
import Icon from 'components/AppIcon';

const CorrelationHeatmap = ({ algorithms, selectedAlgorithms }) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [isolatedAlgorithm, setIsolatedAlgorithm] = useState(null);

  const assets = [
    'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX',
    'SPY', 'QQQ', 'IWM', 'GLD', 'TLT', 'VIX', 'EUR/USD', 'BTC'
  ];

  const generateCorrelationMatrix = () => {
    const matrix = {};
    
    assets.forEach(asset1 => {
      matrix[asset1] = {};
      assets.forEach(asset2 => {
        if (asset1 === asset2) {
          matrix[asset1][asset2] = 1.0;
        } else {
          // Generate realistic correlation values
          const baseCorrelation = Math.random() * 2 - 1;
          matrix[asset1][asset2] = Math.round(baseCorrelation * 100) / 100;
        }
      });
    });
    
    return matrix;
  };

  const correlationMatrix = useMemo(() => generateCorrelationMatrix(), []);

  const getCorrelationColor = (value) => {
    const absValue = Math.abs(value);
    if (absValue >= 0.8) return value > 0 ? 'bg-success' : 'bg-error';
    if (absValue >= 0.6) return value > 0 ? 'bg-success/80' : 'bg-error/80';
    if (absValue >= 0.4) return value > 0 ? 'bg-success/60' : 'bg-error/60';
    if (absValue >= 0.2) return value > 0 ? 'bg-success/40' : 'bg-error/40';
    return 'bg-surface-600';
  };

  const getCorrelationIntensity = (value) => {
    const absValue = Math.abs(value);
    return Math.min(absValue, 1) * 100;
  };

  const getCorrelationLabel = (value) => {
    const absValue = Math.abs(value);
    if (absValue >= 0.8) return 'Very Strong';
    if (absValue >= 0.6) return 'Strong';
    if (absValue >= 0.4) return 'Moderate';
    if (absValue >= 0.2) return 'Weak';
    return 'Very Weak';
  };

  const handleCellClick = (asset1, asset2) => {
    if (isolatedAlgorithm === `${asset1}-${asset2}`) {
      setIsolatedAlgorithm(null);
    } else {
      setIsolatedAlgorithm(`${asset1}-${asset2}`);
    }
  };

  const filteredAssets = isolatedAlgorithm 
    ? assets.filter(asset => 
        isolatedAlgorithm.includes(asset) || 
        Math.abs(correlationMatrix[asset][isolatedAlgorithm.split('-')[0]]) > 0.5
      )
    : assets;

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            Asset Correlation Heatmap
          </h3>
          <p className="text-text-secondary text-sm">
            Cross-asset correlation analysis for portfolio optimization
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {isolatedAlgorithm && (
            <button
              onClick={() => setIsolatedAlgorithm(null)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-primary text-white rounded text-xs trading-transition"
            >
              <Icon name="X" size={14} />
              <span>Clear Filter</span>
            </button>
          )}
          
          <div className="flex items-center space-x-2 text-xs text-text-secondary">
            <span>Correlation:</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-error rounded"></div>
              <span>-1</span>
              <div className="w-3 h-3 bg-surface-600 rounded"></div>
              <span>0</span>
              <div className="w-3 h-3 bg-success rounded"></div>
              <span>+1</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <div className="min-w-max">
          {/* Header Row */}
          <div className="flex">
            <div className="w-16 h-8"></div>
            {filteredAssets.map((asset) => (
              <div
                key={asset}
                className="w-12 h-8 flex items-center justify-center text-xs font-medium text-text-primary transform -rotate-45 origin-center"
              >
                {asset}
              </div>
            ))}
          </div>
          
          {/* Matrix Rows */}
          {filteredAssets.map((asset1) => (
            <div key={asset1} className="flex">
              <div className="w-16 h-8 flex items-center justify-end pr-2 text-xs font-medium text-text-primary">
                {asset1}
              </div>
              {filteredAssets.map((asset2) => {
                const correlation = correlationMatrix[asset1][asset2];
                const isHovered = hoveredCell === `${asset1}-${asset2}`;
                const isIsolated = isolatedAlgorithm === `${asset1}-${asset2}`;
                
                return (
                  <div
                    key={asset2}
                    className={`w-12 h-8 flex items-center justify-center text-xs font-medium cursor-pointer border border-border-light trading-transition relative ${
                      isIsolated ? 'ring-2 ring-primary' : ''
                    }`}
                    style={{
                      backgroundColor: correlation > 0 
                        ? `rgba(16, 185, 129, ${getCorrelationIntensity(correlation) / 100})`
                        : `rgba(239, 68, 68, ${getCorrelationIntensity(correlation) / 100})`,
                    }}
                    onMouseEnter={() => setHoveredCell(`${asset1}-${asset2}`)}
                    onMouseLeave={() => setHoveredCell(null)}
                    onClick={() => handleCellClick(asset1, asset2)}
                  >
                    <span className={`${Math.abs(correlation) > 0.5 ? 'text-white' : 'text-text-primary'}`}>
                      {correlation.toFixed(2)}
                    </span>
                    
                    {isHovered && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-surface border border-border rounded-lg p-3 trading-shadow-lg z-50 whitespace-nowrap">
                        <div className="text-text-primary font-medium mb-1">
                          {asset1} vs {asset2}
                        </div>
                        <div className="text-text-secondary text-xs mb-1">
                          Correlation: {correlation.toFixed(3)}
                        </div>
                        <div className="text-text-secondary text-xs">
                          Strength: {getCorrelationLabel(correlation)}
                        </div>
                        <div className="text-text-tertiary text-xs mt-1">
                          Click to isolate
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-success mb-1">
              {Object.values(correlationMatrix).flat().filter(v => v > 0.7 && v < 1).length}
            </div>
            <div className="text-xs text-text-secondary">Strong Positive</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-error mb-1">
              {Object.values(correlationMatrix).flat().filter(v => v < -0.7).length}
            </div>
            <div className="text-xs text-text-secondary">Strong Negative</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-text-primary mb-1">
              {Object.values(correlationMatrix).flat().filter(v => Math.abs(v) < 0.3 && v !== 1).length}
            </div>
            <div className="text-xs text-text-secondary">Low Correlation</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-warning mb-1">
              {(Object.values(correlationMatrix).flat().reduce((sum, v) => sum + Math.abs(v), 0) / Object.values(correlationMatrix).flat().length).toFixed(2)}
            </div>
            <div className="text-xs text-text-secondary">Avg Abs Correlation</div>
          </div>
        </div>
      </div>

      {/* Algorithm Insights */}
      {selectedAlgorithms.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-text-primary mb-3">
            Algorithm Correlation Insights
          </h4>
          <div className="space-y-2">
            {selectedAlgorithms.slice(0, 2).map((algorithm) => (
              <div key={algorithm.id} className="flex items-center justify-between p-3 bg-surface-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-text-primary text-sm font-medium">
                    {algorithm.name}
                  </span>
                </div>
                <div className="text-text-secondary text-xs">
                  Diversification Score: {(Math.random() * 40 + 60).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CorrelationHeatmap;