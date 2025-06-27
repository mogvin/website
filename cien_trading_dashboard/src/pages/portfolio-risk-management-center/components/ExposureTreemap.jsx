import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ExposureTreemap = ({ portfolio, period }) => {
  const [selectedSector, setSelectedSector] = useState(null);
  const [hoveredPosition, setHoveredPosition] = useState(null);

  const exposureData = [
    {
      sector: 'Technology',
      exposure: 28.5,
      riskWeight: 'High',
      positions: [
        { symbol: 'AAPL', name: 'Apple Inc.', weight: 8.2, risk: 'Medium', pnl: '+2.4%' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', weight: 7.1, risk: 'Low', pnl: '+1.8%' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', weight: 6.8, risk: 'Medium', pnl: '+3.2%' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', weight: 6.4, risk: 'High', pnl: '+5.7%' }
      ]
    },
    {
      sector: 'Healthcare',
      exposure: 18.3,
      riskWeight: 'Medium',
      positions: [
        { symbol: 'JNJ', name: 'Johnson & Johnson', weight: 5.2, risk: 'Low', pnl: '+0.8%' },
        { symbol: 'PFE', name: 'Pfizer Inc.', weight: 4.8, risk: 'Medium', pnl: '-1.2%' },
        { symbol: 'UNH', name: 'UnitedHealth Group', weight: 4.5, risk: 'Low', pnl: '+2.1%' },
        { symbol: 'ABBV', name: 'AbbVie Inc.', weight: 3.8, risk: 'Medium', pnl: '+1.5%' }
      ]
    },
    {
      sector: 'Financial Services',
      exposure: 16.7,
      riskWeight: 'High',
      positions: [
        { symbol: 'JPM', name: 'JPMorgan Chase', weight: 4.9, risk: 'Medium', pnl: '+1.9%' },
        { symbol: 'BAC', name: 'Bank of America', weight: 4.2, risk: 'High', pnl: '+0.6%' },
        { symbol: 'WFC', name: 'Wells Fargo', weight: 3.8, risk: 'High', pnl: '-0.8%' },
        { symbol: 'GS', name: 'Goldman Sachs', weight: 3.8, risk: 'High', pnl: '+2.8%' }
      ]
    },
    {
      sector: 'Consumer Discretionary',
      exposure: 14.2,
      riskWeight: 'Medium',
      positions: [
        { symbol: 'AMZN', name: 'Amazon.com Inc.', weight: 6.1, risk: 'Medium', pnl: '+4.2%' },
        { symbol: 'TSLA', name: 'Tesla Inc.', weight: 4.8, risk: 'High', pnl: '+7.3%' },
        { symbol: 'HD', name: 'Home Depot', weight: 3.3, risk: 'Low', pnl: '+1.1%' }
      ]
    },
    {
      sector: 'Energy',
      exposure: 12.8,
      riskWeight: 'High',
      positions: [
        { symbol: 'XOM', name: 'Exxon Mobil', weight: 4.2, risk: 'High', pnl: '+3.8%' },
        { symbol: 'CVX', name: 'Chevron Corp.', weight: 3.9, risk: 'High', pnl: '+2.9%' },
        { symbol: 'COP', name: 'ConocoPhillips', weight: 2.8, risk: 'High', pnl: '+4.1%' },
        { symbol: 'SLB', name: 'Schlumberger', weight: 1.9, risk: 'High', pnl: '+1.7%' }
      ]
    },
    {
      sector: 'Other',
      exposure: 9.5,
      riskWeight: 'Low',
      positions: [
        { symbol: 'BRK.B', name: 'Berkshire Hathaway', weight: 3.2, risk: 'Low', pnl: '+1.4%' },
        { symbol: 'VTI', name: 'Vanguard Total Stock', weight: 2.8, risk: 'Low', pnl: '+1.8%' },
        { symbol: 'SPY', name: 'SPDR S&P 500 ETF', weight: 2.1, risk: 'Low', pnl: '+1.6%' },
        { symbol: 'QQQ', name: 'Invesco QQQ Trust', weight: 1.4, risk: 'Medium', pnl: '+2.3%' }
      ]
    }
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low':
        return 'bg-success text-white';
      case 'Medium':
        return 'bg-warning text-white';
      case 'High':
        return 'bg-error text-white';
      default:
        return 'bg-surface-600 text-text-primary';
    }
  };

  const getPnLColor = (pnl) => {
    return pnl.startsWith('+') ? 'text-success' : 'text-error';
  };

  const getSectorColor = (sector, index) => {
    const colors = [
      'bg-primary',
      'bg-secondary',
      'bg-accent',
      'bg-success',
      'bg-warning',
      'bg-error'
    ];
    return colors[index % colors.length];
  };

  const handleSectorClick = (sector) => {
    setSelectedSector(selectedSector === sector ? null : sector);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-1">
            Portfolio Exposure Analysis
          </h2>
          <p className="text-sm text-text-secondary">
            Risk-weighted position sizing • {portfolio} • {period} period
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="text-xs bg-surface-700 hover:bg-surface-600 text-text-primary px-3 py-1.5 rounded trading-transition">
            <Icon name="Filter" size={14} className="mr-1" />
            Filter
          </button>
          <button className="text-xs bg-surface-700 hover:bg-surface-600 text-text-primary px-3 py-1.5 rounded trading-transition">
            <Icon name="Download" size={14} className="mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Treemap Visualization */}
      <div className="grid grid-cols-12 gap-2 mb-6" style={{ height: '400px' }}>
        {exposureData.map((sector, sectorIndex) => (
          <div
            key={sector.sector}
            className={`relative cursor-pointer rounded-lg p-3 trading-transition hover:opacity-80 ${getSectorColor(sector.sector, sectorIndex)}`}
            style={{
              gridColumn: `span ${Math.max(2, Math.floor((sector.exposure / 100) * 12))}`,
              minHeight: `${Math.max(80, (sector.exposure / 30) * 100)}px`
            }}
            onClick={() => handleSectorClick(sector.sector)}
            onMouseEnter={() => setHoveredPosition(sector)}
            onMouseLeave={() => setHoveredPosition(null)}
          >
            <div className="text-white">
              <h3 className="font-semibold text-sm mb-1">{sector.sector}</h3>
              <p className="text-xs opacity-90">{sector.exposure}% exposure</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-75">
                  {sector.positions.length} positions
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  sector.riskWeight === 'High' ? 'bg-error-600' :
                  sector.riskWeight === 'Medium' ? 'bg-warning-600' : 'bg-success-600'
                }`}>
                  {sector.riskWeight}
                </span>
              </div>
            </div>

            {/* Hover Tooltip */}
            {hoveredPosition === sector && (
              <div className="absolute top-full left-0 mt-2 bg-surface border border-border rounded-lg p-3 z-10 min-w-64 trading-shadow-lg">
                <h4 className="font-medium text-text-primary mb-2">{sector.sector} Breakdown</h4>
                <div className="space-y-1">
                  {sector.positions.slice(0, 3).map((position) => (
                    <div key={position.symbol} className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">{position.symbol}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-text-primary">{position.weight}%</span>
                        <span className={getPnLColor(position.pnl)}>{position.pnl}</span>
                      </div>
                    </div>
                  ))}
                  {sector.positions.length > 3 && (
                    <div className="text-xs text-text-tertiary">
                      +{sector.positions.length - 3} more positions
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Position Details */}
      {selectedSector && (
        <div className="border-t border-border pt-4">
          <h3 className="text-md font-semibold text-text-primary mb-3">
            {selectedSector} Positions
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-text-secondary py-2">Symbol</th>
                  <th className="text-left text-xs font-medium text-text-secondary py-2">Company</th>
                  <th className="text-right text-xs font-medium text-text-secondary py-2">Weight</th>
                  <th className="text-center text-xs font-medium text-text-secondary py-2">Risk</th>
                  <th className="text-right text-xs font-medium text-text-secondary py-2">P&L</th>
                  <th className="text-center text-xs font-medium text-text-secondary py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exposureData
                  .find(s => s.sector === selectedSector)
                  ?.positions.map((position) => (
                    <tr key={position.symbol} className="border-b border-border hover:bg-surface-700 trading-transition">
                      <td className="py-3">
                        <span className="text-sm font-medium text-text-primary">
                          {position.symbol}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-text-secondary">
                          {position.name}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-sm font-medium text-text-primary">
                          {position.weight}%
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`text-xs px-2 py-1 rounded ${getRiskColor(position.risk)}`}>
                          {position.risk}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`text-sm font-medium ${getPnLColor(position.pnl)}`}>
                          {position.pnl}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <button className="text-text-secondary hover:text-text-primary">
                          <Icon name="MoreHorizontal" size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExposureTreemap;