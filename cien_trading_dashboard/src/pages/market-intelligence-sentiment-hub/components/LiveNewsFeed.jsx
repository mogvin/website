import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const LiveNewsFeed = ({ newsSource, market }) => {
  const [newsItems, setNewsItems] = useState([]);
  const [filter, setFilter] = useState('all');

  const mockNewsData = [
    {
      id: 1,
      headline: `Federal Reserve Signals Potential Rate Cuts Amid Economic Uncertainty`,
      source: 'REUTERS',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      sentiment: 72,
      impact: 'high',
      category: 'monetary_policy',
      summary: `The Federal Reserve indicated today that interest rate cuts may be on the horizon as economic indicators show mixed signals. Chairman Powell emphasized data-dependent approach to future policy decisions.`,
      tickers: ['SPY', 'QQQ', 'TLT'],
      isBreaking: true,
    },
    {
      id: 2,
      headline: `Tech Giants Report Strong Q4 Earnings, AI Investments Drive Growth`,
      source: 'BLOOMBERG',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      sentiment: 85,
      impact: 'medium',
      category: 'earnings',
      summary: `Major technology companies exceeded earnings expectations for Q4, with artificial intelligence investments showing promising returns. Cloud computing and AI services revenue grew 40% year-over-year.`,
      tickers: ['AAPL', 'MSFT', 'GOOGL', 'NVDA'],
      isBreaking: false,
    },
    {
      id: 3,
      headline: `Oil Prices Surge on Middle East Tensions and Supply Concerns`,
      source: 'WSJ',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      sentiment: 45,
      impact: 'high',
      category: 'commodities',
      summary: `Crude oil futures jumped 3.5% following reports of supply disruptions in key shipping lanes. Energy sector stocks rallied on increased geopolitical tensions affecting global supply chains.`,
      tickers: ['XOM', 'CVX', 'COP'],
      isBreaking: false,
    },
    {
      id: 4,
      headline: `Cryptocurrency Market Shows Signs of Recovery After Recent Volatility`,
      source: 'CNBC',
      timestamp: new Date(Date.now() - 35 * 60 * 1000),
      sentiment: 68,
      impact: 'medium',
      category: 'crypto',
      summary: `Bitcoin and major altcoins posted gains as institutional investors show renewed interest. Regulatory clarity and ETF approvals contribute to market stabilization efforts.`,
      tickers: ['BTC', 'ETH'],
      isBreaking: false,
    },
    {
      id: 5,
      headline: `Social Media Buzz: Retail Investors Rally Behind Clean Energy Stocks`,
      source: 'SOCIAL',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      sentiment: 78,
      impact: 'low',
      category: 'social_sentiment',
      summary: `Social media platforms show increased discussion around renewable energy investments. Retail investor sentiment remains bullish on solar and wind energy companies.`,
      tickers: ['ENPH', 'SEDG', 'NEE'],
      isBreaking: false,
    },
  ];

  useEffect(() => {
    let filteredNews = mockNewsData;
    
    if (newsSource !== 'ALL') {
      filteredNews = filteredNews.filter(item => item.source === newsSource);
    }
    
    if (filter !== 'all') {
      filteredNews = filteredNews.filter(item => item.category === filter);
    }
    
    setNewsItems(filteredNews);
  }, [newsSource, filter, market]);

  const getSentimentColor = (sentiment) => {
    if (sentiment >= 70) return 'text-success';
    if (sentiment >= 40) return 'text-warning';
    return 'text-error';
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'bg-error text-white';
      case 'medium': return 'bg-warning text-white';
      case 'low': return 'bg-success text-white';
      default: return 'bg-surface-700 text-text-secondary';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const categories = [
    { id: 'all', name: 'All News', icon: 'Globe' },
    { id: 'monetary_policy', name: 'Monetary Policy', icon: 'Building' },
    { id: 'earnings', name: 'Earnings', icon: 'TrendingUp' },
    { id: 'commodities', name: 'Commodities', icon: 'Zap' },
    { id: 'crypto', name: 'Crypto', icon: 'Bitcoin' },
    { id: 'social_sentiment', name: 'Social', icon: 'MessageCircle' },
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Live News Feed</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full pulse-ambient"></div>
          <span className="text-xs text-text-secondary">Live</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setFilter(category.id)}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs trading-transition ${
              filter === category.id
                ? 'bg-primary text-white' :'bg-surface-700 text-text-secondary hover:text-text-primary hover:bg-surface-600'
            }`}
          >
            <Icon name={category.icon} size={12} />
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* News Items */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {newsItems.map((item) => (
          <div key={item.id} className="border border-border rounded-lg p-3 hover:bg-surface-700 trading-transition">
            {/* News Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {item.isBreaking && (
                  <span className="bg-error text-white text-xs px-2 py-0.5 rounded font-medium pulse-ambient">
                    BREAKING
                  </span>
                )}
                <span className="text-xs text-text-tertiary">{item.source}</span>
                <span className="text-xs text-text-tertiary">•</span>
                <span className="text-xs text-text-tertiary">{getTimeAgo(item.timestamp)}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${getImpactColor(item.impact)}`}>
                {item.impact.toUpperCase()}
              </span>
            </div>

            {/* Headline */}
            <h4 className="text-sm font-medium text-text-primary mb-2 line-clamp-2">
              {item.headline}
            </h4>

            {/* Summary */}
            <p className="text-xs text-text-secondary mb-3 line-clamp-3">
              {item.summary}
            </p>

            {/* Metrics */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Icon name="Brain" size={12} className={getSentimentColor(item.sentiment)} />
                  <span className={`text-xs font-medium ${getSentimentColor(item.sentiment)}`}>
                    {item.sentiment}%
                  </span>
                </div>
                
                {item.tickers.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Icon name="TrendingUp" size={12} className="text-text-tertiary" />
                    <div className="flex space-x-1">
                      {item.tickers.slice(0, 3).map((ticker) => (
                        <span key={ticker} className="text-xs bg-surface-600 text-text-secondary px-1 py-0.5 rounded">
                          {ticker}
                        </span>
                      ))}
                      {item.tickers.length > 3 && (
                        <span className="text-xs text-text-tertiary">+{item.tickers.length - 3}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button className="p-1 text-text-tertiary hover:text-text-primary trading-transition">
                <Icon name="ExternalLink" size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-4 pt-4 border-t border-border">
        <button className="w-full bg-surface-700 hover:bg-surface-600 text-text-primary py-2 rounded-lg text-sm font-medium trading-transition">
          Load More News
        </button>
      </div>
    </div>
  );
};

export default LiveNewsFeed;