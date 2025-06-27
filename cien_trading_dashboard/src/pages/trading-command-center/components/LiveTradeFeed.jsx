import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const LiveTradeFeed = ({ instrument }) => {
  const [trades, setTrades] = useState([]);
  const [highlightedTrades, setHighlightedTrades] = useState(new Set());

  useEffect(() => {
    // Initialize with mock trades
    const initialTrades = [
      {
        id: 1,
        symbol: instrument,
        side: 'BUY',
        quantity: 100,
        price: 175.43,
        timestamp: new Date(Date.now() - 30000),
        algorithm: 'Momentum Alpha',
        status: 'FILLED'
      },
      {
        id: 2,
        symbol: instrument,
        side: 'SELL',
        quantity: 50,
        price: 175.21,
        timestamp: new Date(Date.now() - 45000),
        algorithm: 'Mean Reversion',
        status: 'FILLED'
      },
      {
        id: 3,
        symbol: instrument,
        side: 'BUY',
        quantity: 200,
        price: 175.18,
        timestamp: new Date(Date.now() - 60000),
        algorithm: 'Arbitrage Bot',
        status: 'FILLED'
      },
      {
        id: 4,
        symbol: instrument,
        side: 'SELL',
        quantity: 75,
        price: 175.35,
        timestamp: new Date(Date.now() - 90000),
        algorithm: 'Momentum Alpha',
        status: 'PARTIAL'
      },
      {
        id: 5,
        symbol: instrument,
        side: 'BUY',
        quantity: 150,
        price: 175.12,
        timestamp: new Date(Date.now() - 120000),
        algorithm: 'Grid Trading',
        status: 'FILLED'
      }
    ];

    setTrades(initialTrades);
  }, [instrument]);

  useEffect(() => {
    const interval = setInterval(() => {
      const shouldAddTrade = Math.random() > 0.7;
      
      if (shouldAddTrade) {
        const newTrade = {
          id: Date.now(),
          symbol: instrument,
          side: Math.random() > 0.5 ? 'BUY' : 'SELL',
          quantity: Math.floor(Math.random() * 500) + 50,
          price: 175 + (Math.random() - 0.5) * 2,
          timestamp: new Date(),
          algorithm: ['Momentum Alpha', 'Mean Reversion', 'Arbitrage Bot', 'Grid Trading'][Math.floor(Math.random() * 4)],
          status: Math.random() > 0.1 ? 'FILLED' : 'PARTIAL'
        };

        setTrades(prev => [newTrade, ...prev.slice(0, 19)]);
        
        // Highlight new trade
        setHighlightedTrades(prev => new Set([...prev, newTrade.id]));
        
        setTimeout(() => {
          setHighlightedTrades(prev => {
            const newSet = new Set(prev);
            newSet.delete(newTrade.id);
            return newSet;
          });
        }, 2000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [instrument]);

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'FILLED':
        return 'text-success';
      case 'PARTIAL':
        return 'text-warning';
      case 'CANCELLED':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'FILLED':
        return 'CheckCircle';
      case 'PARTIAL':
        return 'Clock';
      case 'CANCELLED':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Activity" size={18} className="text-primary" />
          <h3 className="font-semibold text-text-primary">Live Trade Feed</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full pulse-ambient"></div>
          <span className="text-xs text-text-secondary">Live</span>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {trades.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Activity" size={32} className="text-text-tertiary mx-auto mb-2" />
            <p className="text-text-secondary text-sm">No trades yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {trades.map((trade) => (
              <div
                key={trade.id}
                className={`p-3 trading-transition ${
                  highlightedTrades.has(trade.id) 
                    ? 'bg-primary/10 border-l-2 border-l-primary' :'hover:bg-surface-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      trade.side === 'BUY' ?'bg-success/20 text-success' :'bg-error/20 text-error'
                    }`}>
                      {trade.side}
                    </span>
                    <span className="text-sm font-medium text-text-primary">
                      {trade.quantity}
                    </span>
                    <span className="text-xs text-text-secondary">@</span>
                    <span className="text-sm font-medium text-text-primary">
                      ${trade.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Icon 
                      name={getStatusIcon(trade.status)} 
                      size={12} 
                      className={getStatusColor(trade.status)} 
                    />
                    <span className={`text-xs ${getStatusColor(trade.status)}`}>
                      {trade.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span className="truncate">{trade.algorithm}</span>
                  <span className="font-data">{formatTime(trade.timestamp)}</span>
                </div>

                <div className="mt-2 text-xs">
                  <span className="text-text-tertiary">Value: </span>
                  <span className="text-text-primary font-medium">
                    ${(trade.quantity * trade.price).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border bg-surface-700/50">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Total Trades: {trades.length}</span>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Buy: {trades.filter(t => t.side === 'BUY').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-error rounded-full"></div>
              <span>Sell: {trades.filter(t => t.side === 'SELL').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTradeFeed;