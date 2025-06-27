import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const StressTesting = ({ portfolio }) => {
  const [selectedScenario, setSelectedScenario] = useState('market_crash');
  const [customScenario, setCustomScenario] = useState({
    marketShock: -20,
    volatilitySpike: 50,
    correlationIncrease: 30,
    liquidityDrop: 40
  });
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);

  const predefinedScenarios = [
    {
      id: 'market_crash',
      name: '2008 Financial Crisis',
      description: 'Severe market downturn with high correlation',
      parameters: {
        marketShock: -35,
        volatilitySpike: 80,
        correlationIncrease: 60,
        liquidityDrop: 70
      },
      historicalExample: 'Oct 2008'
    },
    {
      id: 'covid_shock',
      name: 'COVID-19 Pandemic',
      description: 'Rapid market decline with recovery',
      parameters: {
        marketShock: -25,
        volatilitySpike: 120,
        correlationIncrease: 45,
        liquidityDrop: 30
      },
      historicalExample: 'Mar 2020'
    },
    {
      id: 'tech_bubble',
      name: 'Tech Bubble Burst',
      description: 'Sector-specific severe correction',
      parameters: {
        marketShock: -15,
        volatilitySpike: 60,
        correlationIncrease: 25,
        liquidityDrop: 20
      },
      historicalExample: 'Mar 2000'
    },
    {
      id: 'interest_rate_shock',
      name: 'Interest Rate Shock',
      description: 'Rapid monetary policy change',
      parameters: {
        marketShock: -12,
        volatilitySpike: 40,
        correlationIncrease: 35,
        liquidityDrop: 25
      },
      historicalExample: 'Feb 2022'
    },
    {
      id: 'custom',
      name: 'Custom Scenario',
      description: 'User-defined stress parameters',
      parameters: customScenario,
      historicalExample: 'Custom'
    }
  ];

  const mockResults = {
    portfolioImpact: {
      totalPnL: -12500000,
      percentageChange: -8.3,
      worstPosition: { symbol: 'TSLA', impact: -2800000 },
      bestPosition: { symbol: 'JNJ', impact: 150000 }
    },
    riskMetrics: {
      newVaR: 4.2,
      stressVaR: 6.8,
      expectedShortfall: 9.1,
      maxDrawdown: 15.3
    },
    sectorImpact: [
      { sector: 'Technology', impact: -15.2, exposure: 28.5 },
      { sector: 'Financial Services', impact: -12.8, exposure: 16.7 },
      { sector: 'Healthcare', impact: -3.1, exposure: 18.3 },
      { sector: 'Consumer Discretionary', impact: -18.9, exposure: 14.2 },
      { sector: 'Energy', impact: -8.7, exposure: 12.8 },
      { sector: 'Other', impact: -2.4, exposure: 9.5 }
    ],
    timeToRecover: 18,
    liquidityNeeds: 8500000
  };

  const handleScenarioChange = (scenarioId) => {
    setSelectedScenario(scenarioId);
    setResults(null);
  };

  const handleCustomParameterChange = (parameter, value) => {
    setCustomScenario(prev => ({
      ...prev,
      [parameter]: value
    }));
  };

  const runStressTest = async () => {
    setIsRunning(true);
    setResults(null);
    
    // Simulate API call
    setTimeout(() => {
      setResults(mockResults);
      setIsRunning(false);
    }, 2000);
  };

  const getCurrentScenario = () => {
    return predefinedScenarios.find(s => s.id === selectedScenario);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getImpactColor = (impact) => {
    if (impact < -10) return 'text-error';
    if (impact < -5) return 'text-warning';
    if (impact < 0) return 'text-accent';
    return 'text-success';
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-1">
            Stress Testing
          </h2>
          <p className="text-sm text-text-secondary">
            Scenario analysis • {portfolio}
          </p>
        </div>
        
        <button
          onClick={runStressTest}
          disabled={isRunning}
          className="flex items-center space-x-2 bg-primary hover:bg-primary-700 disabled:bg-surface-600 text-white px-4 py-2 rounded-lg trading-transition"
        >
          {isRunning ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Running...</span>
            </>
          ) : (
            <>
              <Icon name="Play" size={16} />
              <span>Run Test</span>
            </>
          )}
        </button>
      </div>

      {/* Scenario Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-text-primary mb-3">Select Scenario</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {predefinedScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`border rounded-lg p-3 cursor-pointer trading-transition ${
                selectedScenario === scenario.id
                  ? 'border-primary bg-primary-50' :'border-border hover:border-primary-500'
              }`}
              onClick={() => handleScenarioChange(scenario.id)}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-text-primary">
                  {scenario.name}
                </h4>
                <span className="text-xs text-text-tertiary">
                  {scenario.historicalExample}
                </span>
              </div>
              <p className="text-xs text-text-secondary mb-2">
                {scenario.description}
              </p>
              <div className="flex items-center space-x-3 text-xs">
                <span className="text-text-tertiary">
                  Market: {scenario.parameters.marketShock}%
                </span>
                <span className="text-text-tertiary">
                  Vol: +{scenario.parameters.volatilitySpike}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Scenario Parameters */}
      {selectedScenario === 'custom' && (
        <div className="mb-6 bg-surface-700 border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-text-primary mb-3">Custom Parameters</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Market Shock (%)
              </label>
              <input
                type="range"
                min="-50"
                max="0"
                value={customScenario.marketShock}
                onChange={(e) => handleCustomParameterChange('marketShock', parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-text-primary">{customScenario.marketShock}%</span>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Volatility Spike (%)
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={customScenario.volatilitySpike}
                onChange={(e) => handleCustomParameterChange('volatilitySpike', parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-text-primary">+{customScenario.volatilitySpike}%</span>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Correlation Increase (%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={customScenario.correlationIncrease}
                onChange={(e) => handleCustomParameterChange('correlationIncrease', parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-text-primary">+{customScenario.correlationIncrease}%</span>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Liquidity Drop (%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={customScenario.liquidityDrop}
                onChange={(e) => handleCustomParameterChange('liquidityDrop', parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-text-primary">-{customScenario.liquidityDrop}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-medium text-text-primary mb-3">Stress Test Results</h3>
            
            {/* Portfolio Impact Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-surface-700 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name="TrendingDown" size={16} className="text-error" />
                  <span className="text-xs font-medium text-text-secondary">Total P&L</span>
                </div>
                <div className="text-lg font-bold text-error">
                  {formatCurrency(results.portfolioImpact.totalPnL)}
                </div>
                <div className="text-xs text-text-tertiary">
                  {results.portfolioImpact.percentageChange}%
                </div>
              </div>
              
              <div className="bg-surface-700 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name="AlertTriangle" size={16} className="text-warning" />
                  <span className="text-xs font-medium text-text-secondary">Stress VaR</span>
                </div>
                <div className="text-lg font-bold text-text-primary">
                  {results.riskMetrics.stressVaR}%
                </div>
                <div className="text-xs text-text-tertiary">
                  vs {results.riskMetrics.newVaR}% normal
                </div>
              </div>
              
              <div className="bg-surface-700 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name="ArrowDown" size={16} className="text-error" />
                  <span className="text-xs font-medium text-text-secondary">Max Drawdown</span>
                </div>
                <div className="text-lg font-bold text-text-primary">
                  {results.riskMetrics.maxDrawdown}%
                </div>
                <div className="text-xs text-text-tertiary">
                  Peak to trough
                </div>
              </div>
              
              <div className="bg-surface-700 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name="Clock" size={16} className="text-accent" />
                  <span className="text-xs font-medium text-text-secondary">Recovery Time</span>
                </div>
                <div className="text-lg font-bold text-text-primary">
                  {results.timeToRecover}
                </div>
                <div className="text-xs text-text-tertiary">
                  months (est.)
                </div>
              </div>
            </div>

            {/* Sector Impact */}
            <div className="bg-surface-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-text-primary mb-3">Sector Impact Analysis</h4>
              <div className="space-y-2">
                {results.sectorImpact.map((sector) => (
                  <div key={sector.sector} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-text-primary w-32">{sector.sector}</span>
                      <div className="w-24 bg-surface-600 rounded-full h-2">
                        <div
                          className="h-2 bg-error rounded-full"
                          style={{ width: `${Math.abs(sector.impact) * 5}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-text-tertiary w-16">
                        {sector.exposure}% exp.
                      </span>
                      <span className={`text-sm font-medium w-16 text-right ${getImpactColor(sector.impact)}`}>
                        {sector.impact}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StressTesting;