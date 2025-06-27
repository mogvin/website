import React, { useState, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from 'components/AppIcon';

const PerformanceChart = ({ algorithms, period, comparisonMode }) => {
  const [chartType, setChartType] = useState('cumulative');
  const [showDrawdown, setShowDrawdown] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('pnl');

  const generateTimeSeriesData = (algorithm, days) => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    let cumulativePnL = 0;
    let maxPnL = 0;
    
    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const dailyReturn = (Math.random() - 0.45) * algorithm.sharpeRatio * 0.02;
      cumulativePnL += dailyReturn * 10000;
      maxPnL = Math.max(maxPnL, cumulativePnL);
      
      const drawdown = maxPnL > 0 ? ((cumulativePnL - maxPnL) / maxPnL) * 100 : 0;
      
      data.push({
        date: date.toISOString().split('T')[0],
        timestamp: date.getTime(),
        [`${algorithm.id}_pnl`]: cumulativePnL,
        [`${algorithm.id}_drawdown`]: drawdown,
        [`${algorithm.id}_confidence`]: algorithm.confidence + (Math.random() - 0.5) * 10,
        [`${algorithm.id}_winRate`]: algorithm.winRate + (Math.random() - 0.5) * 5,
      });
    }
    
    return data;
  };

  const getDaysFromPeriod = (period) => {
    switch (period) {
      case '1D': return 1;
      case '1W': return 7;
      case '1M': return 30;
      case '3M': return 90;
      case '6M': return 180;
      case '1Y': return 365;
      case 'YTD': return Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24));
      case 'ALL': return 730;
      default: return 30;
    }
  };

  const chartData = useMemo(() => {
    const days = getDaysFromPeriod(period);
    const allData = algorithms.map(algo => generateTimeSeriesData(algo, days));
    
    if (allData.length === 0) return [];
    
    const mergedData = allData[0].map((_, index) => {
      const point = { date: allData[0][index].date, timestamp: allData[0][index].timestamp };
      allData.forEach((data, algoIndex) => {
        const algo = algorithms[algoIndex];
        point[`${algo.id}_pnl`] = data[index][`${algo.id}_pnl`];
        point[`${algo.id}_drawdown`] = data[index][`${algo.id}_drawdown`];
        point[`${algo.id}_confidence`] = data[index][`${algo.id}_confidence`];
        point[`${algo.id}_winRate`] = data[index][`${algo.id}_winRate`];
      });
      return point;
    });
    
    return mergedData;
  }, [algorithms, period]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getAlgorithmColor = (algorithmId, index) => {
    const colors = ['#2563EB', '#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];
    return colors[index % colors.length];
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 trading-shadow-lg">
          <p className="text-text-primary font-medium mb-2">
            {formatDate(label)}
          </p>
          {payload.map((entry, index) => {
            const algorithmId = entry.dataKey.split('_')[0];
            const metric = entry.dataKey.split('_')[1];
            const algorithm = algorithms.find(algo => algo.id === algorithmId);
            
            if (!algorithm) return null;
            
            return (
              <div key={index} className="flex items-center justify-between space-x-4 mb-1">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-text-secondary text-sm">
                    {algorithm.name} {metric === 'pnl' ? 'P&L' : metric === 'drawdown' ? 'Drawdown' : metric}
                  </span>
                </div>
                <span className="text-text-primary font-medium text-sm">
                  {metric === 'pnl' ? formatCurrency(entry.value) : 
                   metric === 'drawdown' ? `${entry.value.toFixed(2)}%` :
                   `${entry.value.toFixed(1)}${metric === 'confidence' || metric === 'winRate' ? '%' : ''}`}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (chartType === 'cumulative') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#94A3B8"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              stroke="#94A3B8"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {algorithms.map((algorithm, index) => (
              <Area
                key={algorithm.id}
                type="monotone"
                dataKey={`${algorithm.id}_pnl`}
                name={algorithm.name}
                stroke={getAlgorithmColor(algorithm.id, index)}
                fill={`${getAlgorithmColor(algorithm.id, index)}20`}
                strokeWidth={2}
              />
            ))}
            
            {showDrawdown && algorithms.map((algorithm, index) => (
              <Line
                key={`${algorithm.id}_drawdown`}
                type="monotone"
                dataKey={`${algorithm.id}_drawdown`}
                name={`${algorithm.name} Drawdown`}
                stroke={`${getAlgorithmColor(algorithm.id, index)}80`}
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            ))}
            
            <ReferenceLine y={0} stroke="#64748B" strokeDasharray="2 2" />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            stroke="#94A3B8"
            fontSize={12}
          />
          <YAxis 
            stroke="#94A3B8"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {algorithms.map((algorithm, index) => (
            <Line
              key={algorithm.id}
              type="monotone"
              dataKey={`${algorithm.id}_${selectedMetric}`}
              name={`${algorithm.name} ${selectedMetric}`}
              stroke={getAlgorithmColor(algorithm.id, index)}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            Performance Analysis
          </h3>
          <p className="text-text-secondary text-sm">
            {comparisonMode ? `Comparing ${algorithms.length} algorithms` : algorithms[0]?.name} - {period}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-surface-700 rounded-lg p-1">
            <button
              onClick={() => setChartType('cumulative')}
              className={`px-3 py-1.5 text-xs font-medium rounded trading-transition ${
                chartType === 'cumulative' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              Cumulative P&L
            </button>
            <button
              onClick={() => setChartType('metrics')}
              className={`px-3 py-1.5 text-xs font-medium rounded trading-transition ${
                chartType === 'metrics' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              Metrics
            </button>
          </div>
          
          {chartType === 'metrics' && (
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="bg-surface-700 text-text-primary border border-border rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="confidence">Confidence</option>
              <option value="winRate">Win Rate</option>
            </select>
          )}
          
          {chartType === 'cumulative' && (
            <button
              onClick={() => setShowDrawdown(!showDrawdown)}
              className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded trading-transition ${
                showDrawdown
                  ? 'bg-error/20 text-error' :'bg-surface-700 text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name="TrendingDown" size={14} />
              <span>Drawdown</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="relative">
        {renderChart()}
      </div>
      
      {algorithms.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Current P&L:</span>
              <span className="ml-2 font-medium text-text-primary">
                {formatCurrency(algorithms[0].dailyPnL)}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Total Trades:</span>
              <span className="ml-2 font-medium text-text-primary">
                {algorithms[0].totalTrades}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Avg Hold Time:</span>
              <span className="ml-2 font-medium text-text-primary">
                {algorithms[0].avgHoldTime}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Last Signal:</span>
              <span className="ml-2 font-medium text-text-primary">
                {algorithms[0].lastSignal.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceChart;