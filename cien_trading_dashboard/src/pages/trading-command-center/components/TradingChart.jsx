import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from 'components/AppIcon';

const TradingChart = ({ instrument, timeframe, instruments }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [crosshairData, setCrosshairData] = useState(null);
  const [selectedIndicators, setSelectedIndicators] = useState(['EMA20', 'EMA50']);

  useEffect(() => {
    setIsLoading(true);
    
    // Generate mock candlestick data
    const generateData = () => {
      const data = [];
      const basePrice = instruments.find(i => i.symbol === instrument)?.price || 100;
      let currentPrice = basePrice;
      
      for (let i = 0; i < 100; i++) {
        const timestamp = new Date(Date.now() - (100 - i) * 60000 * (timeframe === '1M' ? 1 : timeframe === '5M' ? 5 : timeframe === '15M' ? 15 : timeframe === '1H' ? 60 : timeframe === '4H' ? 240 : 1440));
        
        const volatility = 0.02;
        const change = (Math.random() - 0.5) * volatility * currentPrice;
        currentPrice += change;
        
        const high = currentPrice + Math.random() * 0.01 * currentPrice;
        const low = currentPrice - Math.random() * 0.01 * currentPrice;
        const volume = Math.floor(Math.random() * 1000000) + 100000;
        
        // Calculate EMAs
        const ema20 = currentPrice * (1 + (Math.random() - 0.5) * 0.005);
        const ema50 = currentPrice * (1 + (Math.random() - 0.5) * 0.003);
        
        data.push({
          timestamp: timestamp.getTime(),
          time: timestamp.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          price: currentPrice,
          high,
          low,
          volume,
          ema20,
          ema50,
        });
      }
      
      return data;
    };

    setTimeout(() => {
      setChartData(generateData());
      setIsLoading(false);
    }, 500);
  }, [instrument, timeframe, instruments]);

  useEffect(() => {
    if (chartData.length === 0) return;

    const interval = setInterval(() => {
      setChartData(prevData => {
        const newData = [...prevData];
        const lastPoint = newData[newData.length - 1];
        const change = (Math.random() - 0.5) * 0.01 * lastPoint.price;
        
        newData[newData.length - 1] = {
          ...lastPoint,
          price: lastPoint.price + change,
          high: Math.max(lastPoint.high, lastPoint.price + change),
          low: Math.min(lastPoint.low, lastPoint.price + change),
        };
        
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [chartData]);

  const indicators = [
    { key: 'EMA20', label: 'EMA 20', color: '#3B82F6' },
    { key: 'EMA50', label: 'EMA 50', color: '#8B5CF6' },
    { key: 'Volume', label: 'Volume', color: '#06B6D4' },
  ];

  const toggleIndicator = (indicator) => {
    setSelectedIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-lg p-3 trading-shadow-md">
          <p className="text-text-secondary text-xs mb-2">{data.time}</p>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-xs">Price:</span>
              <span className="text-text-primary font-medium">${data.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-xs">High:</span>
              <span className="text-success font-medium">${data.high.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-xs">Low:</span>
              <span className="text-error font-medium">${data.low.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-xs">Volume:</span>
              <span className="text-text-primary font-medium">{data.volume.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-surface-700 rounded w-1/4 mb-4"></div>
          <div className="h-80 bg-surface-700 rounded"></div>
        </div>
      </div>
    );
  }

  const currentPrice = chartData[chartData.length - 1]?.price || 0;
  const previousPrice = chartData[chartData.length - 2]?.price || 0;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = (priceChange / previousPrice) * 100;

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-text-primary">
            {instrument} Price Chart
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-text-primary">
              ${currentPrice.toFixed(2)}
            </span>
            <span className={`text-sm font-medium ${priceChange >= 0 ? 'text-success' : 'text-error'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {indicators.map((indicator) => (
            <button
              key={indicator.key}
              onClick={() => toggleIndicator(indicator.key)}
              className={`px-3 py-1 text-xs rounded-full border trading-transition ${
                selectedIndicators.includes(indicator.key)
                  ? 'bg-primary text-white border-primary' :'text-text-secondary border-border hover:border-primary'
              }`}
            >
              {indicator.label}
            </button>
          ))}
          
          <button className="p-2 text-text-secondary hover:text-text-primary trading-transition">
            <Icon name="Settings" size={16} />
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} onMouseMove={(e) => setCrosshairData(e)}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3B82F6' }}
            />
            
            {selectedIndicators.includes('EMA20') && (
              <Line
                type="monotone"
                dataKey="ema20"
                stroke="#10B981"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
            
            {selectedIndicators.includes('EMA50') && (
              <Line
                type="monotone"
                dataKey="ema50"
                stroke="#8B5CF6"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
            
            <ReferenceLine y={currentPrice} stroke="#F59E0B" strokeDasharray="2 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-text-secondary">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-0.5 bg-primary"></div>
            <span>Price</span>
          </div>
          {selectedIndicators.includes('EMA20') && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-0.5 bg-success" style={{ borderTop: '1px dashed' }}></div>
              <span>EMA 20</span>
            </div>
          )}
          {selectedIndicators.includes('EMA50') && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-0.5 bg-secondary" style={{ borderTop: '1px dashed' }}></div>
              <span>EMA 50</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={12} className="text-success pulse-ambient" />
          <span>Live Data</span>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;