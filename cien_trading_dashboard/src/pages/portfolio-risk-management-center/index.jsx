import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Header from 'components/ui/Header';
import Sidebar from 'components/ui/Sidebar';
import RiskMetricsKPI from './components/RiskMetricsKPI';
import ExposureTreemap from './components/ExposureTreemap';
import RiskAlertsPanel from './components/RiskAlertsPanel';
import CorrelationMatrix from './components/CorrelationMatrix';
import StressTesting from './components/StressTesting';
import ConnectionStatusIndicator from 'components/ui/ConnectionStatusIndicator';
import DataFreshnessIndicator from 'components/ui/DataFreshnessIndicator';

const PortfolioRiskManagementCenter = () => {
  const navigate = useNavigate();
  const [selectedPortfolio, setSelectedPortfolio] = useState('Global Equity Fund');
  const [riskPeriod, setRiskPeriod] = useState('1D');
  const [alertThreshold, setAlertThreshold] = useState('Medium');
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  const portfolios = [
    { id: 1, name: 'Global Equity Fund', aum: 2500000000, riskLevel: 'Medium' },
    { id: 2, name: 'Tech Growth Portfolio', aum: 850000000, riskLevel: 'High' },
    { id: 3, name: 'Conservative Bond Fund', aum: 1200000000, riskLevel: 'Low' },
    { id: 4, name: 'Emerging Markets', aum: 650000000, riskLevel: 'High' },
  ];

  const riskPeriods = ['1D', '1W', '1M', '3M', '1Y'];
  const alertThresholds = ['Low', 'Medium', 'High', 'Critical'];

  useEffect(() => {
    // Simulate WebSocket connection monitoring
    const interval = setInterval(() => {
      const statuses = ['connected', 'connecting', 'disconnected'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setConnectionStatus(randomStatus);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handlePortfolioChange = (portfolioName) => {
    setSelectedPortfolio(portfolioName);
  };

  const handleRiskPeriodChange = (period) => {
    setRiskPeriod(period);
  };

  const handleAlertThresholdChange = (threshold) => {
    setAlertThreshold(threshold);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      
      <main className="ml-60 mt-16 p-6">
        {/* Page Header with Controls */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Portfolio Risk Management Center
              </h1>
              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                <ConnectionStatusIndicator />
                <DataFreshnessIndicator dataSource="Risk Engine" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)}
                className="flex items-center space-x-2 bg-surface-700 hover:bg-surface-600 text-text-primary px-4 py-2 rounded-lg trading-transition"
              >
                <Icon name="Settings" size={16} />
                <span>Configure Alerts</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-primary hover:bg-primary-700 text-white px-4 py-2 rounded-lg trading-transition">
                <Icon name="Download" size={16} />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Global Controls */}
          <div className="flex items-center space-x-6 bg-surface border border-border rounded-lg p-4">
            {/* Portfolio Selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-text-secondary">Portfolio:</label>
              <select
                value={selectedPortfolio}
                onChange={(e) => handlePortfolioChange(e.target.value)}
                className="bg-surface-700 text-text-primary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {portfolios.map((portfolio) => (
                  <option key={portfolio.id} value={portfolio.name}>
                    {portfolio.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Risk Period Toggle */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-text-secondary">Period:</label>
              <div className="flex bg-surface-700 rounded-lg p-1">
                {riskPeriods.map((period) => (
                  <button
                    key={period}
                    onClick={() => handleRiskPeriodChange(period)}
                    className={`px-3 py-1 text-xs font-medium rounded trading-transition ${
                      riskPeriod === period
                        ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Alert Threshold */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-text-secondary">Alert Level:</label>
              <select
                value={alertThreshold}
                onChange={(e) => handleAlertThresholdChange(e.target.value)}
                className="bg-surface-700 text-text-primary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {alertThresholds.map((threshold) => (
                  <option key={threshold} value={threshold}>
                    {threshold}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Configuration Panel */}
          {isConfigPanelOpen && (
            <div className="mt-4 bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Alert Configuration</h3>
                <button
                  onClick={() => setIsConfigPanelOpen(false)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    VaR Threshold (%)
                  </label>
                  <input
                    type="number"
                    defaultValue="2.5"
                    className="w-full bg-surface-700 text-text-primary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Concentration Limit (%)
                  </label>
                  <input
                    type="number"
                    defaultValue="10"
                    className="w-full bg-surface-700 text-text-primary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Leverage Ratio
                  </label>
                  <input
                    type="number"
                    defaultValue="3.0"
                    step="0.1"
                    className="w-full bg-surface-700 text-text-primary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* KPI Strip */}
        <RiskMetricsKPI 
          portfolio={selectedPortfolio}
          period={riskPeriod}
          threshold={alertThreshold}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          {/* Main Visualization Area - Exposure Treemap */}
          <div className="col-span-12 lg:col-span-8">
            <ExposureTreemap 
              portfolio={selectedPortfolio}
              period={riskPeriod}
            />
          </div>

          {/* Right Panel - Risk Alerts */}
          <div className="col-span-12 lg:col-span-4">
            <RiskAlertsPanel 
              threshold={alertThreshold}
              portfolio={selectedPortfolio}
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Correlation Matrix */}
          <CorrelationMatrix portfolio={selectedPortfolio} />
          
          {/* Stress Testing Widget */}
          <StressTesting portfolio={selectedPortfolio} />
        </div>

        {/* Quick Navigation */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-2">
          <button
            onClick={() => handleNavigation('/trading-command-center')}
            className="bg-primary hover:bg-primary-700 text-white p-3 rounded-full trading-shadow-lg trading-transition"
            title="Trading Command Center"
          >
            <Icon name="BarChart3" size={20} />
          </button>
          
          <button
            onClick={() => handleNavigation('/ai-algorithm-performance-dashboard')}
            className="bg-secondary hover:bg-secondary-700 text-white p-3 rounded-full trading-shadow-lg trading-transition"
            title="AI Algorithm Performance"
          >
            <Icon name="Brain" size={20} />
          </button>
          
          <button
            onClick={() => handleNavigation('/market-intelligence-sentiment-hub')}
            className="bg-accent hover:bg-accent-600 text-white p-3 rounded-full trading-shadow-lg trading-transition"
            title="Market Intelligence Hub"
          >
            <Icon name="TrendingUp" size={20} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default PortfolioRiskManagementCenter;