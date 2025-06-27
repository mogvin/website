import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Header from 'components/ui/Header';
import Sidebar from 'components/ui/Sidebar';
import AlgorithmSelector from './components/AlgorithmSelector';
import PerformanceMetrics from './components/PerformanceMetrics';
import PerformanceChart from './components/PerformanceChart';
import AlgorithmRanking from './components/AlgorithmRanking';
import CorrelationHeatmap from './components/CorrelationHeatmap';
import WaterfallChart from './components/WaterfallChart';
import DataFreshnessIndicator from 'components/ui/DataFreshnessIndicator';

const AIAlgorithmPerformanceDashboard = () => {
  const navigate = useNavigate();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('momentum-alpha');
  const [performancePeriod, setPerformancePeriod] = useState('1M');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState(['momentum-alpha']);
  const [bookmarkedConfigs, setBookmarkedConfigs] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const algorithms = [
    {
      id: 'momentum-alpha',
      name: 'Momentum Alpha',
      description: 'High-frequency momentum trading strategy',
      status: 'active',
      confidence: 87.5,
      winRate: 68.2,
      sharpeRatio: 2.34,
      maxDrawdown: -8.7,
      dailyPnL: 12450.75,
      totalTrades: 1247,
      avgHoldTime: '4.2h',
      lastSignal: new Date(Date.now() - 300000),
    },
    {
      id: 'mean-reversion',
      name: 'Mean Reversion Pro',
      description: 'Statistical arbitrage and mean reversion',
      status: 'active',
      confidence: 82.1,
      winRate: 71.8,
      sharpeRatio: 1.89,
      maxDrawdown: -12.3,
      dailyPnL: 8920.50,
      totalTrades: 892,
      avgHoldTime: '8.7h',
      lastSignal: new Date(Date.now() - 180000),
    },
    {
      id: 'ml-ensemble',
      name: 'ML Ensemble',
      description: 'Machine learning ensemble predictor',
      status: 'active',
      confidence: 91.3,
      winRate: 74.5,
      sharpeRatio: 2.67,
      maxDrawdown: -6.2,
      dailyPnL: 15780.25,
      totalTrades: 567,
      avgHoldTime: '12.4h',
      lastSignal: new Date(Date.now() - 120000),
    },
    {
      id: 'volatility-breakout',
      name: 'Volatility Breakout',
      description: 'Volatility-based breakout strategy',
      status: 'paused',
      confidence: 76.8,
      winRate: 63.4,
      sharpeRatio: 1.45,
      maxDrawdown: -15.8,
      dailyPnL: -2340.75,
      totalTrades: 234,
      avgHoldTime: '6.8h',
      lastSignal: new Date(Date.now() - 3600000),
    },
  ];

  const periodOptions = [
    { value: '1D', label: '1 Day' },
    { value: '1W', label: '1 Week' },
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' },
    { value: 'YTD', label: 'Year to Date' },
    { value: 'ALL', label: 'All Time' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleAlgorithmChange = (algorithmId) => {
    setSelectedAlgorithm(algorithmId);
    if (comparisonMode && !selectedAlgorithms.includes(algorithmId)) {
      setSelectedAlgorithms([...selectedAlgorithms, algorithmId]);
    } else if (!comparisonMode) {
      setSelectedAlgorithms([algorithmId]);
    }
  };

  const handlePeriodChange = (period) => {
    setPerformancePeriod(period);
  };

  const toggleComparisonMode = () => {
    setComparisonMode(!comparisonMode);
    if (!comparisonMode) {
      setSelectedAlgorithms([selectedAlgorithm]);
    }
  };

  const saveConfiguration = () => {
    const config = {
      id: Date.now(),
      name: `Analysis ${bookmarkedConfigs.length + 1}`,
      algorithms: selectedAlgorithms,
      period: performancePeriod,
      comparisonMode,
      timestamp: new Date(),
    };
    setBookmarkedConfigs([...bookmarkedConfigs, config]);
  };

  const loadConfiguration = (config) => {
    setSelectedAlgorithms(config.algorithms);
    setSelectedAlgorithm(config.algorithms[0]);
    setPerformancePeriod(config.period);
    setComparisonMode(config.comparisonMode);
  };

  const exportToPDF = () => {
    console.log('Exporting to PDF...');
  };

  const exportToPowerPoint = () => {
    console.log('Exporting to PowerPoint...');
  };

  const currentAlgorithm = algorithms.find(algo => algo.id === selectedAlgorithm);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="ml-60 pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                AI Algorithm Performance Dashboard
              </h1>
              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                <span>Real-time algorithm monitoring and optimization</span>
                <DataFreshnessIndicator 
                  dataSource="Algorithm APIs"
                  updateInterval={60000}
                  showDetails={true}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={saveConfiguration}
                className="flex items-center space-x-2 px-4 py-2 bg-surface-700 hover:bg-surface-600 text-text-primary rounded-lg trading-transition"
              >
                <Icon name="Bookmark" size={16} />
                <span>Save Config</span>
              </button>
              
              <div className="flex items-center space-x-1 bg-surface-700 rounded-lg p-1">
                <button
                  onClick={exportToPDF}
                  className="flex items-center space-x-1 px-3 py-1.5 hover:bg-surface-600 text-text-secondary hover:text-text-primary rounded trading-transition"
                >
                  <Icon name="FileText" size={14} />
                  <span className="text-xs">PDF</span>
                </button>
                <button
                  onClick={exportToPowerPoint}
                  className="flex items-center space-x-1 px-3 py-1.5 hover:bg-surface-600 text-text-secondary hover:text-text-primary rounded trading-transition"
                >
                  <Icon name="Presentation" size={14} />
                  <span className="text-xs">PPT</span>
                </button>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            <div className="lg:col-span-4">
              <AlgorithmSelector
                algorithms={algorithms}
                selectedAlgorithm={selectedAlgorithm}
                onAlgorithmChange={handleAlgorithmChange}
                comparisonMode={comparisonMode}
                selectedAlgorithms={selectedAlgorithms}
                onToggleComparison={toggleComparisonMode}
              />
            </div>
            
            <div className="lg:col-span-4">
              <div className="bg-surface border border-border rounded-lg p-4">
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Performance Period
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {periodOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handlePeriodChange(option.value)}
                      className={`px-3 py-2 text-xs font-medium rounded trading-transition ${
                        performancePeriod === option.value
                          ? 'bg-primary text-white' :'bg-surface-700 text-text-secondary hover:text-text-primary hover:bg-surface-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-4">
              <div className="bg-surface border border-border rounded-lg p-4">
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Saved Configurations
                </label>
                {bookmarkedConfigs.length > 0 ? (
                  <div className="space-y-2 max-h-20 overflow-y-auto">
                    {bookmarkedConfigs.slice(-3).map((config) => (
                      <button
                        key={config.id}
                        onClick={() => loadConfiguration(config)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-surface-700 hover:bg-surface-600 rounded text-xs trading-transition"
                      >
                        <span className="text-text-primary">{config.name}</span>
                        <span className="text-text-tertiary">
                          {config.timestamp.toLocaleDateString()}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-tertiary text-xs">No saved configurations</p>
                )}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <PerformanceMetrics
            algorithm={currentAlgorithm}
            comparisonMode={comparisonMode}
            selectedAlgorithms={selectedAlgorithms.map(id => algorithms.find(algo => algo.id === id))}
            period={performancePeriod}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* Performance Chart */}
            <div className="lg:col-span-8">
              <PerformanceChart
                algorithms={selectedAlgorithms.map(id => algorithms.find(algo => algo.id === id))}
                period={performancePeriod}
                comparisonMode={comparisonMode}
              />
            </div>
            
            {/* Algorithm Ranking */}
            <div className="lg:col-span-4">
              <AlgorithmRanking
                algorithms={algorithms}
                selectedAlgorithm={selectedAlgorithm}
                onAlgorithmSelect={handleAlgorithmChange}
              />
            </div>
          </div>

          {/* Correlation Heatmap */}
          <div className="mb-6">
            <CorrelationHeatmap
              algorithms={algorithms}
              selectedAlgorithms={selectedAlgorithms}
            />
          </div>

          {/* Waterfall Chart */}
          <WaterfallChart
            algorithm={currentAlgorithm}
            period={performancePeriod}
          />
        </div>
      </main>
    </div>
  );
};

export default AIAlgorithmPerformanceDashboard;