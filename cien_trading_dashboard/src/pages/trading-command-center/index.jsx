import React, { useState, useEffect } from 'react';
import Header from 'components/ui/Header';
import Sidebar from 'components/ui/Sidebar';
import KPICards from './components/KPICards';
import TradingChart from './components/TradingChart';
import LiveTradeFeed from './components/LiveTradeFeed';
import OrderBookDepth from './components/OrderBookDepth';
import AIEnsembleVotes from './components/AIEnsembleVotes';
import InstrumentExposureTable from './components/InstrumentExposureTable';
import ConnectionStatusIndicator from 'components/ui/ConnectionStatusIndicator';
import DataFreshnessIndicator from 'components/ui/DataFreshnessIndicator';

const TradingCommandCenter = () => {
  const [selectedInstrument, setSelectedInstrument] = useState('AAPL');
  const [timeframe, setTimeframe] = useState('1H');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trades');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const instruments = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.34, changePercent: 1.35 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.87, change: -5.67, changePercent: -2.23 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.92, change: 4.21, changePercent: 1.12 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.56, change: 1.89, changePercent: 1.34 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.78, change: -2.11, changePercent: -1.43 },
  ];

  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="ml-60 pt-16 p-6">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-surface rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 h-96 bg-surface rounded-lg"></div>
              <div className="h-96 bg-surface rounded-lg"></div>
            </div>
            <div className="h-64 bg-surface rounded-lg"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="ml-60 pt-16 p-6 space-y-6">
        {/* Top Status Bar */}
        <div className="flex items-center justify-between bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-semibold text-text-primary">Trading Command Center</h1>
            <ConnectionStatusIndicator />
            <DataFreshnessIndicator dataSource="Market Data" updateInterval={1000} />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedInstrument}
              onChange={(e) => setSelectedInstrument(e.target.value)}
              className="bg-surface-700 text-text-primary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {instruments.map((instrument) => (
                <option key={instrument.symbol} value={instrument.symbol}>
                  {instrument.symbol} - {instrument.name}
                </option>
              ))}
            </select>
            
            <div className="flex bg-surface-700 rounded-lg p-1">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-sm rounded trading-transition ${
                    timeframe === tf
                      ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <KPICards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Trading Chart - 8 columns */}
          <div className="col-span-8">
            <TradingChart 
              instrument={selectedInstrument} 
              timeframe={timeframe}
              instruments={instruments}
            />
          </div>

          {/* Right Sidebar - 4 columns */}
          <div className="col-span-4 space-y-6">
            {/* Mobile Tab Navigation */}
            <div className="lg:hidden">
              <div className="flex bg-surface-700 rounded-lg p-1 mb-4">
                <button
                  onClick={() => setActiveTab('trades')}
                  className={`flex-1 px-3 py-2 text-sm rounded trading-transition ${
                    activeTab === 'trades' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Trades
                </button>
                <button
                  onClick={() => setActiveTab('orderbook')}
                  className={`flex-1 px-3 py-2 text-sm rounded trading-transition ${
                    activeTab === 'orderbook' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Order Book
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`flex-1 px-3 py-2 text-sm rounded trading-transition ${
                    activeTab === 'ai' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  AI Votes
                </button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block space-y-6">
              <LiveTradeFeed instrument={selectedInstrument} />
              <OrderBookDepth instrument={selectedInstrument} />
              <AIEnsembleVotes instrument={selectedInstrument} />
            </div>

            {/* Mobile Tabbed Content */}
            <div className="lg:hidden">
              {activeTab === 'trades' && <LiveTradeFeed instrument={selectedInstrument} />}
              {activeTab === 'orderbook' && <OrderBookDepth instrument={selectedInstrument} />}
              {activeTab === 'ai' && <AIEnsembleVotes instrument={selectedInstrument} />}
            </div>
          </div>
        </div>

        {/* Instrument Exposure Table */}
        <InstrumentExposureTable instruments={instruments} />
      </main>
    </div>
  );
};

export default TradingCommandCenter;