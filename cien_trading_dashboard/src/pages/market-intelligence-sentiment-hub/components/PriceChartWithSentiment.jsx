import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from 'components/AppIcon';

const PriceChartWithSentiment = ({ instruments, timeframe, timelinePosition }) => {
  const [selectedInstrument, setSelectedInstrument] = useState(instruments[0] || 'SPY');
  const [chartData, setChartData] = useState([]);
  const [showSentimentOverlay, setShowSentimentOverlay] = useState(true);
  const [showEvents, setShowEvents] = useState(true);

  const generateMockData = (symbol) => {
    const basePrice = symbol === 'SPY' ? 445 : symbol === 'QQQ' ? 378 : 189;
    const data = [];
    
    for (let i = 0; i < 100; i++) {
      const time = new Date(Date.now() - (99 - i) * 15 * 60 * 1000);
      const price = basePrice + Math.sin(i * 0.1) * 10 + Math.random() * 5 - 2.5;
      const sentiment = 50 + Math.sin(i * 0.15) * 30 + Math.random() * 10 - 5;
      
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: time.getTime(),
        price: price.toFixed(2),
        sentiment: Math.max(0, Math.min(100, sentiment)).toFixed(1),
        volume: Math.floor(Math.random() * 1000000) + 500000,
        isEvent: Math.random() > 0.95,
      });
    }
    
    return data;
  };

  useEffect(() => {
    setChartData(generateMockData(selectedInstrument));
  }, [selectedInstrument, timeframe]);

  // Calculate timeline reference data outside of JSX
  const getTimelineReferenceData = () => {
    if (!chartData?.length || 
        timelinePosition == null || 
        timelinePosition < 0 || 
        timelinePosition > 100) {
      return null;
    }
    
    const dataIndex = Math.floor((timelinePosition / 100) * (chartData.length - 1));
    const selectedDataPoint = chartData[dataIndex];
    
    if (!selectedDataPoint?.time) {
      return null;
    }
    
    return {
      xValue: selectedDataPoint.time,
      label: "Timeline"
    };
  };

  const timelineRef = getTimelineReferenceData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-lg p-3 trading-shadow-md">
          <p className="text-text-primary font-medium mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-text-secondary text-sm">Price:</span>
              <span className="text-text-primary font-medium">${data.price}</span>
            </div>
            {showSentimentOverlay && (
              <div className="flex items-center justify-between space-x-4">
                <span className="text-text-secondary text-sm">Sentiment:</span>
                <span className="text-accent font-medium">{data.sentiment}%</span>
              </div>
            )}
            <div className="flex items-center justify-between space-x-4">
              <span className="text-text-secondary text-sm">Volume:</span>
              <span className="text-text-primary font-medium">{(data.volume / 1000).toFixed(0)}K</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const EventMarker = ({ cx, cy, payload }) => {
    if (payload.isEvent) {
      return (
        <g>
          <circle cx={cx} cy={cy} r="4" fill="var(--color-warning)" stroke="var(--color-background)" strokeWidth="2" />
          <circle cx={cx} cy={cy} r="8" fill="none" stroke="var(--color-warning)" strokeWidth="1" opacity="0.5" />
        </g>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-text-primary">Price Chart with Sentiment</h3>
          <select
            value={selectedInstrument}
            onChange={(e) => setSelectedInstrument(e.target.value)}
            className="bg-surface-700 text-text-primary border border-border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {instruments.map((instrument) => (
              <option key={instrument} value={instrument}>{instrument}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSentimentOverlay(!showSentimentOverlay)}
            className={`flex items-center space-x-1 px-3 py-1 rounded text-sm trading-transition ${
              showSentimentOverlay 
                ? 'bg-accent text-white' :'bg-surface-700 text-text-secondary hover:text-text-primary'
            }`}
          >
            <Icon name="Brain" size={14} />
            <span>Sentiment</span>
          </button>
          
          <button
            onClick={() => setShowEvents(!showEvents)}
            className={`flex items-center space-x-1 px-3 py-1 rounded text-sm trading-transition ${
              showEvents 
                ? 'bg-warning text-white' :'bg-surface-700 text-text-secondary hover:text-text-primary'
            }`}
          >
            <Icon name="Calendar" size={14} />
            <span>Events</span>
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              yAxisId="price"
              orientation="left"
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            {showSentimentOverlay && (
              <YAxis 
                yAxisId="sentiment"
                orientation="right"
                stroke="var(--color-accent)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            
            {/* Timeline Position Indicator */}
            {timelineRef && (
              <ReferenceLine 
                x={timelineRef.xValue}
                stroke="var(--color-primary)"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ 
                  value: timelineRef.label, 
                  position: "top",
                  style: { 
                    fill: "var(--color-primary)",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }
                }}
              />
            )}
            
            {/* Price Line */}
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="price"
              stroke="var(--color-text-primary)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'var(--color-primary)' }}
            />
            
            {/* Sentiment Overlay */}
            {showSentimentOverlay && (
              <Line
                yAxisId="sentiment"
                type="monotone"
                dataKey="sentiment"
                stroke="var(--color-accent)"
                strokeWidth={1.5}
                strokeOpacity={0.7}
                dot={false}
                strokeDasharray="3 3"
              />
            )}
            
            {/* Event Markers */}
            {showEvents && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="price"
                stroke="transparent"
                dot={<EventMarker />}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-text-primary"></div>
          <span className="text-xs text-text-secondary">Price</span>
        </div>
        
        {showSentimentOverlay && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-accent" style={{ backgroundImage: 'repeating-linear-gradient(to right, var(--color-accent) 0, var(--color-accent) 3px, transparent 3px, transparent 6px)' }}></div>
            <span className="text-xs text-text-secondary">Sentiment</span>
          </div>
        )}
        
        {showEvents && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-xs text-text-secondary">Market Events</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-primary" style={{ backgroundImage: 'repeating-linear-gradient(to right, var(--color-primary) 0, var(--color-primary) 5px, transparent 5px, transparent 10px)' }}></div>
          <span className="text-xs text-text-secondary">Timeline Position</span>
        </div>
      </div>
    </div>
  );
};

export default PriceChartWithSentiment;