import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from 'components/ui/Header';
import Sidebar from 'components/ui/Sidebar';
import Icon from 'components/AppIcon';
import SentimentMeter from './components/SentimentMeter';
import VolatilityIndex from './components/VolatilityIndex';
import EconomicEventCountdown from './components/EconomicEventCountdown';
import NewsImpactScore from './components/NewsImpactScore';
import PriceChartWithSentiment from './components/PriceChartWithSentiment';
import LiveNewsFeed from './components/LiveNewsFeed';
import SentimentHeatmap from './components/SentimentHeatmap';
import LiveTickerTape from './components/LiveTickerTape';

const MarketIntelligenceHub = () => {
  const [selectedMarket, setSelectedMarket] = useState('US_EQUITY');
  const [sentimentTimeframe, setSentimentTimeframe] = useState('1H');
  const [newsSourceFilter, setNewsSourceFilter] = useState('ALL');
  const [selectedInstruments, setSelectedInstruments] = useState(['SPY', 'QQQ']);
  const [timelinePosition, setTimelinePosition] = useState(100);

  const markets = [
    { id: 'US_EQUITY', name: 'US Equity', icon: 'TrendingUp' },
    { id: 'FOREX', name: 'Forex', icon: 'DollarSign' },
    { id: 'CRYPTO', name: 'Crypto', icon: 'Bitcoin' },
    { id: 'COMMODITIES', name: 'Commodities', icon: 'Zap' },
  ];

  const timeframes = ['15M', '1H', '4H', '1D', '1W'];
  const newsSources = ['ALL', 'REUTERS', 'BLOOMBERG', 'CNBC', 'WSJ', 'SOCIAL'];

  const instruments = [
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: 445.67, change: 2.34, changePercent: 0.53 },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', price: 378.92, change: -1.45, changePercent: -0.38 },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 189.43, change: 3.21, changePercent: 1.72 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -5.67, changePercent: -2.23 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 12.45, changePercent: 1.44 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time data updates
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>Market Intelligence & Sentiment Hub - CIEN Trading</title>
        <meta name="description" content="Real-time market sentiment analysis and intelligence hub for comprehensive trading context" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header />
        
        <main className="ml-60 mt-16 p-6">
          {/* Header Controls */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-text-primary mb-2">Market Intelligence & Sentiment Hub</h1>
                <p className="text-text-secondary">Real-time market sentiment analysis and trading intelligence</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full pulse-ambient"></div>
                <span className="text-xs text-text-secondary">Live Data</span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-surface border border-border rounded-lg p-4">
              {/* Market Selector */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-text-secondary">Market:</label>
                <div className="flex space-x-2">
                  {markets.map((market) => (
                    <button
                      key={market.id}
                      onClick={() => setSelectedMarket(market.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium trading-transition ${
                        selectedMarket === market.id
                          ? 'bg-primary text-white' :'bg-surface-700 text-text-secondary hover:text-text-primary hover:bg-surface-600'
                      }`}
                    >
                      <Icon name={market.icon} size={16} />
                      <span>{market.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeframe & News Source Controls */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-text-secondary">Timeframe:</label>
                  <select
                    value={sentimentTimeframe}
                    onChange={(e) => setSentimentTimeframe(e.target.value)}
                    className="bg-surface-700 text-text-primary border border-border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {timeframes.map((tf) => (
                      <option key={tf} value={tf}>{tf}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-text-secondary">News Source:</label>
                  <select
                    value={newsSourceFilter}
                    onChange={(e) => setNewsSourceFilter(e.target.value)}
                    className="bg-surface-700 text-text-primary border border-border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {newsSources.map((source) => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Dashboard Row */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <SentimentMeter market={selectedMarket} timeframe={sentimentTimeframe} />
            <VolatilityIndex market={selectedMarket} />
            <EconomicEventCountdown />
            <NewsImpactScore newsSource={newsSourceFilter} />
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-16 gap-6 mb-6">
            {/* Price Charts with Sentiment Overlay */}
            <div className="col-span-10">
              <PriceChartWithSentiment 
                instruments={selectedInstruments}
                timeframe={sentimentTimeframe}
                timelinePosition={timelinePosition}
              />
            </div>

            {/* Live News Feed Sidebar */}
            <div className="col-span-6">
              <LiveNewsFeed 
                newsSource={newsSourceFilter}
                market={selectedMarket}
              />
            </div>
          </div>

          {/* Sentiment Heatmap */}
          <div className="mb-6">
            <SentimentHeatmap 
              market={selectedMarket}
              timeframe={sentimentTimeframe}
            />
          </div>

          {/* Interactive Timeline Slider */}
          <div className="bg-surface border border-border rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Sentiment Timeline</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-surface-700 hover:bg-surface-600 rounded-lg trading-transition">
                  <Icon name="Play" size={16} className="text-text-secondary" />
                </button>
                <button className="p-2 bg-surface-700 hover:bg-surface-600 rounded-lg trading-transition">
                  <Icon name="RotateCcw" size={16} className="text-text-secondary" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={timelinePosition}
                onChange={(e) => setTimelinePosition(parseInt(e.target.value))}
                className="w-full h-2 bg-surface-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-text-tertiary mt-2">
                <span>24h ago</span>
                <span>12h ago</span>
                <span>6h ago</span>
                <span>Now</span>
              </div>
            </div>
          </div>

          {/* Live Ticker Tape */}
          <LiveTickerTape instruments={instruments} />
        </main>
      </div>
    </>
  );
};

export default MarketIntelligenceHub;