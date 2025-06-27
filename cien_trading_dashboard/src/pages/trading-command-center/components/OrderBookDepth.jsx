import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const OrderBookDepth = ({ instrument }) => {
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [spread, setSpread] = useState(0);
  const [midPrice, setMidPrice] = useState(0);

  useEffect(() => {
    const generateOrderBook = () => {
      const basePrice = 175.43;
      const bids = [];
      const asks = [];

      // Generate bids (buy orders) - prices decrease as we go down
      for (let i = 0; i < 10; i++) {
        const price = basePrice - (i * 0.01) - Math.random() * 0.005;
        const size = Math.floor(Math.random() * 1000) + 100;
        bids.push({
          price: price,
          size: size,
          total: size * (i + 1),
          orders: Math.floor(Math.random() * 5) + 1
        });
      }

      // Generate asks (sell orders) - prices increase as we go up
      for (let i = 0; i < 10; i++) {
        const price = basePrice + (i * 0.01) + Math.random() * 0.005;
        const size = Math.floor(Math.random() * 1000) + 100;
        asks.push({
          price: price,
          size: size,
          total: size * (i + 1),
          orders: Math.floor(Math.random() * 5) + 1
        });
      }

      const bestBid = bids[0]?.price || 0;
      const bestAsk = asks[0]?.price || 0;
      const calculatedSpread = bestAsk - bestBid;
      const calculatedMidPrice = (bestBid + bestAsk) / 2;

      setOrderBook({ bids, asks });
      setSpread(calculatedSpread);
      setMidPrice(calculatedMidPrice);
    };

    generateOrderBook();
    
    const interval = setInterval(() => {
      generateOrderBook();
    }, 2000);

    return () => clearInterval(interval);
  }, [instrument]);

  const getDepthPercentage = (size, maxSize) => {
    return (size / maxSize) * 100;
  };

  const maxBidSize = Math.max(...orderBook.bids.map(b => b.size));
  const maxAskSize = Math.max(...orderBook.asks.map(a => a.size));
  const maxSize = Math.max(maxBidSize, maxAskSize);

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="BookOpen" size={18} className="text-primary" />
          <h3 className="font-semibold text-text-primary">Order Book</h3>
        </div>
        <div className="text-xs text-text-secondary">
          {instrument}
        </div>
      </div>

      {/* Spread Info */}
      <div className="p-3 bg-surface-700/50 border-b border-border">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-text-secondary">Spread: </span>
            <span className="text-text-primary font-medium">${spread.toFixed(3)}</span>
          </div>
          <div>
            <span className="text-text-secondary">Mid: </span>
            <span className="text-text-primary font-medium">${midPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {/* Asks (Sell Orders) */}
        <div className="p-2">
          <div className="text-xs text-text-secondary mb-2 flex justify-between">
            <span>Price</span>
            <span>Size</span>
            <span>Total</span>
          </div>
          
          {orderBook.asks.slice().reverse().map((ask, index) => (
            <div
              key={`ask-${index}`}
              className="relative flex justify-between items-center py-1 text-xs hover:bg-surface-700 trading-transition"
            >
              <div
                className="absolute right-0 top-0 bottom-0 bg-error/10"
                style={{ width: `${getDepthPercentage(ask.size, maxSize)}%` }}
              ></div>
              <span className="text-error font-medium relative z-10">
                ${ask.price.toFixed(2)}
              </span>
              <span className="text-text-primary relative z-10">
                {ask.size.toLocaleString()}
              </span>
              <span className="text-text-secondary relative z-10">
                {ask.total.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Spread Indicator */}
        <div className="px-2 py-1 bg-surface-700 border-y border-border">
          <div className="text-center text-xs text-text-secondary">
            Spread: ${spread.toFixed(3)} ({((spread / midPrice) * 100).toFixed(3)}%)
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="p-2">
          {orderBook.bids.map((bid, index) => (
            <div
              key={`bid-${index}`}
              className="relative flex justify-between items-center py-1 text-xs hover:bg-surface-700 trading-transition"
            >
              <div
                className="absolute right-0 top-0 bottom-0 bg-success/10"
                style={{ width: `${getDepthPercentage(bid.size, maxSize)}%` }}
              ></div>
              <span className="text-success font-medium relative z-10">
                ${bid.price.toFixed(2)}
              </span>
              <span className="text-text-primary relative z-10">
                {bid.size.toLocaleString()}
              </span>
              <span className="text-text-secondary relative z-10">
                {bid.total.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-border bg-surface-700/50">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Bids: {orderBook.bids.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-error rounded-full"></div>
              <span>Asks: {orderBook.asks.length}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Zap" size={10} className="text-success pulse-ambient" />
            <span>Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBookDepth;