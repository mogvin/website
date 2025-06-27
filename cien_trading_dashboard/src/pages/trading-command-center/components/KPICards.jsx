import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const KPICards = () => {
  const [kpiData, setKpiData] = useState({
    pnl: { value: 24567.89, change: 1234.56, changePercent: 5.28 },
    positions: { value: 12, change: 2, changePercent: 20.0 },
    volume: { value: 2847392, change: 145623, changePercent: 5.4 },
    riskOfRuin: { value: 2.3, change: -0.2, changePercent: -8.0 }
  });

  const [pulseStates, setPulseStates] = useState({
    pnl: false,
    positions: false,
    volume: false,
    riskOfRuin: false
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setKpiData(prev => ({
        pnl: {
          ...prev.pnl,
          value: prev.pnl.value + (Math.random() - 0.5) * 1000,
          change: prev.pnl.change + (Math.random() - 0.5) * 100,
        },
        positions: {
          ...prev.positions,
          value: Math.max(0, prev.positions.value + Math.floor((Math.random() - 0.5) * 3)),
        },
        volume: {
          ...prev.volume,
          value: prev.volume.value + Math.floor(Math.random() * 10000),
        },
        riskOfRuin: {
          ...prev.riskOfRuin,
          value: Math.max(0, Math.min(10, prev.riskOfRuin.value + (Math.random() - 0.5) * 0.5)),
        }
      }));

      // Trigger pulse animation for significant changes
      const shouldPulse = Math.random() > 0.7;
      if (shouldPulse) {
        const randomKpi = ['pnl', 'positions', 'volume', 'riskOfRuin'][Math.floor(Math.random() * 4)];
        setPulseStates(prev => ({ ...prev, [randomKpi]: true }));
        setTimeout(() => {
          setPulseStates(prev => ({ ...prev, [randomKpi]: false }));
        }, 1000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(Math.floor(value));
  };

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getRiskColor = (value) => {
    if (value < 1) return 'text-success';
    if (value < 3) return 'text-warning';
    return 'text-error';
  };

  const getRiskBgColor = (value) => {
    if (value < 1) return 'bg-success';
    if (value < 3) return 'bg-warning';
    return 'bg-error';
  };

  const cards = [
    {
      key: 'pnl',
      title: 'Total P&L',
      value: formatCurrency(kpiData.pnl.value),
      change: formatCurrency(kpiData.pnl.change),
      changePercent: formatPercent(kpiData.pnl.changePercent),
      icon: 'TrendingUp',
      color: kpiData.pnl.change >= 0 ? 'text-success' : 'text-error',
      bgColor: kpiData.pnl.change >= 0 ? 'bg-success' : 'bg-error',
    },
    {
      key: 'positions',
      title: 'Active Positions',
      value: kpiData.positions.value.toString(),
      change: `${kpiData.positions.change >= 0 ? '+' : ''}${kpiData.positions.change}`,
      changePercent: formatPercent(kpiData.positions.changePercent),
      icon: 'Briefcase',
      color: kpiData.positions.change >= 0 ? 'text-success' : 'text-error',
      bgColor: 'bg-primary',
    },
    {
      key: 'volume',
      title: 'Daily Volume',
      value: formatNumber(kpiData.volume.value),
      change: `+${formatNumber(kpiData.volume.change)}`,
      changePercent: formatPercent(kpiData.volume.changePercent),
      icon: 'BarChart3',
      color: 'text-success',
      bgColor: 'bg-accent',
    },
    {
      key: 'riskOfRuin',
      title: 'Risk of Ruin',
      value: `${kpiData.riskOfRuin.value.toFixed(1)}%`,
      change: `${kpiData.riskOfRuin.change >= 0 ? '+' : ''}${kpiData.riskOfRuin.change.toFixed(1)}%`,
      changePercent: formatPercent(kpiData.riskOfRuin.changePercent || 0),
      icon: 'Shield',
      color: getRiskColor(kpiData.riskOfRuin.value),
      bgColor: getRiskBgColor(kpiData.riskOfRuin.value),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`bg-surface border border-border rounded-lg p-6 trading-transition hover:border-primary/50 ${
            pulseStates[card.key] ? 'pulse-ambient' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={card.icon} size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className={`text-xs font-medium ${card.color}`}>
                {card.change}
              </div>
              <div className={`text-xs ${card.color}`}>
                {card.changePercent}
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-text-secondary text-sm font-medium">
              {card.title}
            </h3>
            <div className="text-2xl font-bold text-text-primary">
              {card.value}
            </div>
          </div>

          {card.key === 'riskOfRuin' && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-text-secondary mb-1">
                <span>Safe</span>
                <span>Critical</span>
              </div>
              <div className="w-full bg-surface-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full trading-transition ${card.bgColor}`}
                  style={{ width: `${Math.min(100, (kpiData.riskOfRuin.value / 10) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default KPICards;