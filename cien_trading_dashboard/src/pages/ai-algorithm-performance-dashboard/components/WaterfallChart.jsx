import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Icon from 'components/AppIcon';

const WaterfallChart = ({ algorithm, period }) => {
  const [expandedSignal, setExpandedSignal] = useState(null);
  const [viewMode, setViewMode] = useState('signals');

  const generateWaterfallData = () => {
    const signals = [
      'Momentum Entry', 'Mean Reversion', 'Breakout Signal', 'Volume Spike',
      'Technical Pattern', 'News Sentiment', 'Risk Adjustment', 'Position Sizing'
    ];
    
    let cumulativeValue = 0;
    const data = [];
    
    signals.forEach((signal, index) => {
      const contribution = (Math.random() - 0.4) * 5000;
      const startValue = cumulativeValue;
      cumulativeValue += contribution;
      
      data.push({
        name: signal,
        value: contribution,
        cumulativeValue: cumulativeValue,
        startValue: startValue,
        isPositive: contribution >= 0,
        trades: Math.floor(Math.random() * 50) + 10,
        winRate: Math.random() * 40 + 50,
        avgReturn: contribution / (Math.floor(Math.random() * 50) + 10),
        confidence: Math.random() * 30 + 70,
      });
    });
    
    return data;
  };

  const waterfallData = useMemo(() => generateWaterfallData(), [algorithm, period]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-lg p-4 trading-shadow-lg">
          <div className="text-text-primary font-medium mb-2">{label}</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text-secondary">Contribution:</span>
              <span className={`font-medium ${data.isPositive ? 'text-success' : 'text-error'}`}>
                {formatCurrency(data.value)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Cumulative:</span>
              <span className="text-text-primary font-medium">
                {formatCurrency(data.cumulativeValue)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Trades:</span>
              <span className="text-text-primary">{data.trades}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Win Rate:</span>
              <span className="text-text-primary">{data.winRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Confidence:</span>
              <span className="text-text-primary">{data.confidence.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomBar = (props) => {
    const { payload, x, y, width, height } = props;
    const isPositive = payload.isPositive;
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={isPositive ? '#10B981' : '#EF4444'}
          opacity={0.8}
          rx={2}
        />
        {/* Connector line to show cumulative effect */}
        {props.index < waterfallData.length - 1 && (
          <line
            x1={x + width}
            y1={y + (isPositive ? 0 : height)}
            x2={x + width + 10}
            y2={y + (isPositive ? 0 : height)}
            stroke="#64748B"
            strokeWidth={1}
            strokeDasharray="2,2"
          />
        )}
      </g>
    );
  };

  const toggleSignalDetails = (signalName) => {
    setExpandedSignal(expandedSignal === signalName ? null : signalName);
  };

  const totalContribution = waterfallData.reduce((sum, item) => sum + item.value, 0);
  const positiveContributions = waterfallData.filter(item => item.isPositive);
  const negativeContributions = waterfallData.filter(item => !item.isPositive);

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            P&L Attribution Analysis
          </h3>
          <p className="text-text-secondary text-sm">
            {algorithm?.name} - Signal contribution breakdown for {period}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-surface-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('signals')}
              className={`px-3 py-1.5 text-xs font-medium rounded trading-transition ${
                viewMode === 'signals' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              By Signals
            </button>
            <button
              onClick={() => setViewMode('time')}
              className={`px-3 py-1.5 text-xs font-medium rounded trading-transition ${
                viewMode === 'time' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              By Time
            </button>
          </div>
          
          <div className="text-xs text-text-secondary">
            Net P&L: <span className={`font-medium ${totalContribution >= 0 ? 'text-success' : 'text-error'}`}>
              {formatCurrency(totalContribution)}
            </span>
          </div>
        </div>
      </div>

      {/* Waterfall Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              stroke="#94A3B8"
              fontSize={11}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              stroke="#94A3B8"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" shape={<CustomBar />}>
              {waterfallData.map((entry, index) => (
                <Cell key={`cell-${index}`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Signal Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-text-primary">
            Signal Performance Details
          </h4>
          <div className="flex items-center space-x-4 text-xs text-text-secondary">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span>Positive: {positiveContributions.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-error rounded"></div>
              <span>Negative: {negativeContributions.length}</span>
            </div>
          </div>
        </div>
        
        {waterfallData.map((signal, index) => (
          <div key={signal.name} className="border border-border rounded-lg">
            <button
              onClick={() => toggleSignalDetails(signal.name)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-700 trading-transition"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${signal.isPositive ? 'bg-success' : 'bg-error'}`} />
                <div>
                  <div className="text-text-primary font-medium text-sm">
                    {signal.name}
                  </div>
                  <div className="text-text-secondary text-xs">
                    {signal.trades} trades • {signal.winRate.toFixed(1)}% win rate
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className={`text-sm font-medium ${signal.isPositive ? 'text-success' : 'text-error'}`}>
                    {formatCurrency(signal.value)}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {signal.confidence.toFixed(1)}% confidence
                  </div>
                </div>
                <Icon
                  name={expandedSignal === signal.name ? 'ChevronUp' : 'ChevronDown'}
                  size={16}
                  className="text-text-secondary"
                />
              </div>
            </button>
            
            {expandedSignal === signal.name && (
              <div className="px-4 pb-4 border-t border-border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <div className="text-text-secondary text-xs mb-1">Avg Return</div>
                    <div className="text-text-primary font-medium">
                      {formatCurrency(signal.avgReturn)}
                    </div>
                  </div>
                  <div>
                    <div className="text-text-secondary text-xs mb-1">Total Trades</div>
                    <div className="text-text-primary font-medium">
                      {signal.trades}
                    </div>
                  </div>
                  <div>
                    <div className="text-text-secondary text-xs mb-1">Win Rate</div>
                    <div className="text-text-primary font-medium">
                      {signal.winRate.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-text-secondary text-xs mb-1">Confidence</div>
                    <div className="text-text-primary font-medium">
                      {signal.confidence.toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-surface-700 rounded-lg">
                  <div className="text-xs text-text-secondary mb-2">Recent Performance Trend</div>
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-6 rounded ${
                          Math.random() > 0.4 ? 'bg-success' : 'bg-error'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-lg font-bold mb-1 ${totalContribution >= 0 ? 'text-success' : 'text-error'}`}>
              {formatCurrency(totalContribution)}
            </div>
            <div className="text-xs text-text-secondary">Total P&L</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-success mb-1">
              {formatCurrency(positiveContributions.reduce((sum, item) => sum + item.value, 0))}
            </div>
            <div className="text-xs text-text-secondary">Positive Signals</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-error mb-1">
              {formatCurrency(negativeContributions.reduce((sum, item) => sum + item.value, 0))}
            </div>
            <div className="text-xs text-text-secondary">Negative Signals</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-text-primary mb-1">
              {((positiveContributions.length / waterfallData.length) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-text-secondary">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterfallChart;