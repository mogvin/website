import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const RiskAlertsPanel = ({ threshold, portfolio }) => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');

  const mockAlerts = [
    {
      id: 1,
      type: 'concentration',
      severity: 'critical',
      title: 'Concentration Risk Breach',
      message: 'AAPL position exceeds 10% portfolio weight limit',
      timestamp: new Date(Date.now() - 300000),
      portfolio: 'Global Equity Fund',
      symbol: 'AAPL',
      currentValue: '12.3%',
      threshold: '10.0%',
      action: 'Reduce position by $2.5M',
      status: 'active'
    },
    {
      id: 2,
      type: 'var',
      severity: 'warning',
      title: 'VaR Threshold Approaching',
      message: 'Portfolio VaR approaching daily limit',
      timestamp: new Date(Date.now() - 600000),
      portfolio: 'Global Equity Fund',
      symbol: 'Portfolio',
      currentValue: '2.34%',
      threshold: '2.50%',
      action: 'Monitor closely',
      status: 'active'
    },
    {
      id: 3,
      type: 'correlation',
      severity: 'medium',
      title: 'High Correlation Alert',
      message: 'Tech sector correlation above 0.85',
      timestamp: new Date(Date.now() - 900000),
      portfolio: 'Tech Growth Portfolio',
      symbol: 'TECH',
      currentValue: '0.87',
      threshold: '0.85',
      action: 'Diversify holdings',
      status: 'acknowledged'
    },
    {
      id: 4,
      type: 'leverage',
      severity: 'critical',
      title: 'Leverage Limit Exceeded',
      message: 'Portfolio leverage exceeds 3.0x limit',
      timestamp: new Date(Date.now() - 1200000),
      portfolio: 'Emerging Markets',
      symbol: 'Portfolio',
      currentValue: '3.2x',
      threshold: '3.0x',
      action: 'Reduce leverage immediately',
      status: 'active'
    },
    {
      id: 5,
      type: 'liquidity',
      severity: 'warning',
      title: 'Liquidity Risk',
      message: 'Low liquidity positions exceed 15% threshold',
      timestamp: new Date(Date.now() - 1800000),
      portfolio: 'Conservative Bond Fund',
      symbol: 'BONDS',
      currentValue: '18.2%',
      threshold: '15.0%',
      action: 'Review illiquid positions',
      status: 'resolved'
    },
    {
      id: 6,
      type: 'drawdown',
      severity: 'medium',
      title: 'Maximum Drawdown Alert',
      message: 'Portfolio drawdown exceeds 5% threshold',
      timestamp: new Date(Date.now() - 2400000),
      portfolio: 'Global Equity Fund',
      symbol: 'Portfolio',
      currentValue: '6.8%',
      threshold: '5.0%',
      action: 'Risk review required',
      status: 'active'
    }
  ];

  useEffect(() => {
    // Filter alerts based on threshold and portfolio
    const filteredAlerts = mockAlerts.filter(alert => {
      if (portfolio !== 'All Portfolios' && alert.portfolio !== portfolio) {
        return false;
      }
      
      if (filter === 'all') return true;
      if (filter === 'active') return alert.status === 'active';
      if (filter === 'critical') return alert.severity === 'critical';
      
      return alert.severity === filter;
    });

    setAlerts(filteredAlerts);
  }, [threshold, portfolio, filter]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-error bg-error-50 border-error-100';
      case 'warning':
        return 'text-warning bg-warning-50 border-warning-100';
      case 'medium':
        return 'text-accent bg-accent-50 border-accent-100';
      default:
        return 'text-text-secondary bg-surface border-border';
    }
  };

  const getSeverityIcon = (type) => {
    switch (type) {
      case 'concentration':
        return 'PieChart';
      case 'var':
        return 'TrendingDown';
      case 'correlation':
        return 'GitBranch';
      case 'leverage':
        return 'BarChart2';
      case 'liquidity':
        return 'Droplets';
      case 'drawdown':
        return 'ArrowDown';
      default:
        return 'AlertTriangle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-error text-white';
      case 'acknowledged':
        return 'bg-warning text-white';
      case 'resolved':
        return 'bg-success text-white';
      default:
        return 'bg-surface-600 text-text-primary';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else {
      return `${hours}h ago`;
    }
  };

  const handleAlertAction = (alertId, action) => {
    console.log(`Alert ${alertId}: ${action}`);
    // Update alert status
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: action === 'acknowledge' ? 'acknowledged' : 'resolved' }
        : alert
    ));
  };

  const filterOptions = [
    { value: 'all', label: 'All Alerts', count: alerts.length },
    { value: 'active', label: 'Active', count: alerts.filter(a => a.status === 'active').length },
    { value: 'critical', label: 'Critical', count: alerts.filter(a => a.severity === 'critical').length },
    { value: 'warning', label: 'Warning', count: alerts.filter(a => a.severity === 'warning').length }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-1">
            Risk Alerts
          </h2>
          <p className="text-sm text-text-secondary">
            Real-time risk monitoring • {threshold} threshold
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="text-text-secondary hover:text-text-primary">
            <Icon name="Settings" size={16} />
          </button>
          <button className="text-text-secondary hover:text-text-primary">
            <Icon name="RefreshCw" size={16} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-4 bg-surface-700 rounded-lg p-1">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`flex-1 text-xs font-medium py-2 px-3 rounded trading-transition ${
              filter === option.value
                ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            {option.label}
            {option.count > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                filter === option.value ? 'bg-primary-700' : 'bg-surface-600'
              }`}>
                {option.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Shield" size={32} className="text-text-tertiary mx-auto mb-2" />
            <p className="text-text-secondary text-sm">No alerts for current filter</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 trading-transition hover:trading-shadow-sm ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon
                    name={getSeverityIcon(alert.type)}
                    size={16}
                    className={alert.severity === 'critical' ? 'text-error' : 
                              alert.severity === 'warning' ? 'text-warning' : 'text-accent'}
                  />
                  <h3 className="text-sm font-medium text-text-primary">
                    {alert.title}
                  </h3>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(alert.status)}`}>
                    {alert.status}
                  </span>
                  <span className="text-xs text-text-tertiary">
                    {formatTimeAgo(alert.timestamp)}
                  </span>
                </div>
              </div>

              <p className="text-sm text-text-secondary mb-3">
                {alert.message}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                <div>
                  <span className="text-text-tertiary">Current:</span>
                  <span className="ml-1 font-medium text-text-primary">
                    {alert.currentValue}
                  </span>
                </div>
                <div>
                  <span className="text-text-tertiary">Threshold:</span>
                  <span className="ml-1 font-medium text-text-primary">
                    {alert.threshold}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-text-tertiary">
                  Action: {alert.action}
                </p>
                
                {alert.status === 'active' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAlertAction(alert.id, 'acknowledge')}
                      className="text-xs bg-surface-700 hover:bg-surface-600 text-text-primary px-2 py-1 rounded trading-transition"
                    >
                      Acknowledge
                    </button>
                    <button
                      onClick={() => handleAlertAction(alert.id, 'resolve')}
                      className="text-xs bg-primary hover:bg-primary-700 text-white px-2 py-1 rounded trading-transition"
                    >
                      Resolve
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-tertiary">
            {alerts.filter(a => a.status === 'active').length} active alerts
          </span>
          <button className="text-primary hover:text-primary-700 font-medium">
            View All Alerts
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskAlertsPanel;