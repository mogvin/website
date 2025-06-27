import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import Icon from 'components/AppIcon';

const InstrumentExposureTable = ({ instruments }) => {
  const [exposureData, setExposureData] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'exposure', direction: 'desc' });

  useEffect(() => {
    const generateExposureData = () => {
      const data = instruments.map(instrument => {
        const exposure = Math.random() * 1000000 + 100000;
        const pnl = (Math.random() - 0.5) * 50000;
        const risk = Math.random() * 10;
        
        // Generate sparkline data
        const sparklineData = Array.from({ length: 20 }, (_, i) => ({
          value: pnl + (Math.random() - 0.5) * 10000
        }));

        return {
          symbol: instrument.symbol,
          name: instrument.name,
          exposure: exposure,
          pnl: pnl,
          pnlPercent: (pnl / exposure) * 100,
          risk: risk,
          position: Math.floor(Math.random() * 1000) + 100,
          avgPrice: instrument.price * (0.95 + Math.random() * 0.1),
          currentPrice: instrument.price,
          sparklineData: sparklineData,
          lastUpdate: new Date(),
        };
      });

      setExposureData(data);
    };

    generateExposureData();
    
    const interval = setInterval(() => {
      generateExposureData();
    }, 5000);

    return () => clearInterval(interval);
  }, [instruments]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...exposureData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [exposureData, sortConfig]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getRiskColor = (risk) => {
    if (risk < 3) return 'text-success';
    if (risk < 7) return 'text-warning';
    return 'text-error';
  };

  const getRiskBgColor = (risk) => {
    if (risk < 3) return 'bg-success';
    if (risk < 7) return 'bg-warning';
    return 'bg-error';
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return 'ArrowUpDown';
    }
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const totalExposure = exposureData.reduce((sum, item) => sum + item.exposure, 0);
  const totalPnL = exposureData.reduce((sum, item) => sum + item.pnl, 0);

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="PieChart" size={18} className="text-primary" />
          <h3 className="font-semibold text-text-primary">Instrument Exposure</h3>
          <div className="flex items-center space-x-4 ml-4">
            <div className="text-sm">
              <span className="text-text-secondary">Total Exposure: </span>
              <span className="text-text-primary font-medium">{formatCurrency(totalExposure)}</span>
            </div>
            <div className="text-sm">
              <span className="text-text-secondary">Total P&L: </span>
              <span className={`font-medium ${totalPnL >= 0 ? 'text-success' : 'text-error'}`}>
                {formatCurrency(totalPnL)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-text-secondary hover:text-text-primary trading-transition"
          >
            <Icon name={isCollapsed ? 'ChevronDown' : 'ChevronUp'} size={16} />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-700/50">
              <tr>
                <th className="text-left p-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('symbol')}
                    className="flex items-center space-x-1 hover:text-text-primary trading-transition"
                  >
                    <span>Instrument</span>
                    <Icon name={getSortIcon('symbol')} size={12} />
                  </button>
                </th>
                <th className="text-right p-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('position')}
                    className="flex items-center space-x-1 hover:text-text-primary trading-transition ml-auto"
                  >
                    <span>Position</span>
                    <Icon name={getSortIcon('position')} size={12} />
                  </button>
                </th>
                <th className="text-right p-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('exposure')}
                    className="flex items-center space-x-1 hover:text-text-primary trading-transition ml-auto"
                  >
                    <span>Exposure</span>
                    <Icon name={getSortIcon('exposure')} size={12} />
                  </button>
                </th>
                <th className="text-right p-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('pnl')}
                    className="flex items-center space-x-1 hover:text-text-primary trading-transition ml-auto"
                  >
                    <span>P&L</span>
                    <Icon name={getSortIcon('pnl')} size={12} />
                  </button>
                </th>
                <th className="text-right p-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('risk')}
                    className="flex items-center space-x-1 hover:text-text-primary trading-transition ml-auto"
                  >
                    <span>Risk</span>
                    <Icon name={getSortIcon('risk')} size={12} />
                  </button>
                </th>
                <th className="text-center p-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Trend
                </th>
                <th className="text-center p-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedData.map((item, index) => (
                <tr key={item.symbol} className="hover:bg-surface-700/30 trading-transition">
                  <td className="p-3">
                    <div>
                      <div className="font-medium text-text-primary">{item.symbol}</div>
                      <div className="text-xs text-text-secondary truncate">{item.name}</div>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="font-medium text-text-primary">{item.position.toLocaleString()}</div>
                    <div className="text-xs text-text-secondary">${item.avgPrice.toFixed(2)} avg</div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="font-medium text-text-primary">{formatCurrency(item.exposure)}</div>
                    <div className="text-xs text-text-secondary">
                      {((item.exposure / totalExposure) * 100).toFixed(1)}% of total
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className={`font-medium ${item.pnl >= 0 ? 'text-success' : 'text-error'}`}>
                      {formatCurrency(item.pnl)}
                    </div>
                    <div className={`text-xs ${item.pnlPercent >= 0 ? 'text-success' : 'text-error'}`}>
                      {formatPercent(item.pnlPercent)}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getRiskBgColor(item.risk)}`}></div>
                      <span className={`text-sm font-medium ${getRiskColor(item.risk)}`}>
                        {item.risk.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="w-16 h-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={item.sparklineData}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={item.pnl >= 0 ? '#10B981' : '#EF4444'}
                            strokeWidth={1.5}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        className="p-1 text-text-secondary hover:text-primary trading-transition"
                        title="View Details"
                      >
                        <Icon name="Eye" size={14} />
                      </button>
                      <button
                        className="p-1 text-text-secondary hover:text-success trading-transition"
                        title="Quick Buy"
                      >
                        <Icon name="Plus" size={14} />
                      </button>
                      <button
                        className="p-1 text-text-secondary hover:text-error trading-transition"
                        title="Quick Sell"
                      >
                        <Icon name="Minus" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-3 border-t border-border bg-surface-700/50">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>{exposureData.length} instruments</span>
          <div className="flex items-center space-x-2">
            <Icon name="RefreshCw" size={12} className="animate-spin" />
            <span>Auto-refresh: 5s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentExposureTable;