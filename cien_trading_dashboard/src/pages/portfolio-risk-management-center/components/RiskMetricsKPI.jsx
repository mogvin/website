import React from 'react';
import Icon from 'components/AppIcon';

const RiskMetricsKPI = ({ portfolio, period, threshold }) => {
  const riskMetrics = [
    {
      id: 1,
      title: 'Value-at-Risk',
      value: '2.34%',
      change: '+0.12%',
      changeType: 'increase',
      threshold: '2.50%',
      status: 'normal',
      icon: 'TrendingDown',
      description: `95% confidence level over ${period} period`,
      details: 'Maximum expected loss under normal market conditions'
    },
    {
      id: 2,
      title: 'Portfolio Beta',
      value: '1.23',
      change: '-0.05',
      changeType: 'decrease',
      threshold: '1.50',
      status: 'normal',
      icon: 'Activity',
      description: 'Relative to market benchmark',
      details: 'Systematic risk exposure compared to market'
    },
    {
      id: 3,
      title: 'Concentration Risk',
      value: '8.7%',
      change: '+1.2%',
      changeType: 'increase',
      threshold: '10.0%',
      status: 'warning',
      icon: 'PieChart',
      description: 'Largest single position exposure',
      details: 'Maximum individual security weight'
    },
    {
      id: 4,
      title: 'Leverage Ratio',
      value: '2.8x',
      change: '+0.1x',
      changeType: 'increase',
      threshold: '3.0x',
      status: 'critical',
      icon: 'BarChart2',
      description: 'Total exposure to capital',
      details: 'Gross exposure divided by net asset value'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'critical':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'normal':
        return 'bg-success-50 border-success-100';
      case 'warning':
        return 'bg-warning-50 border-warning-100';
      case 'critical':
        return 'bg-error-50 border-error-100';
      default:
        return 'bg-surface border-border';
    }
  };

  const getChangeColor = (changeType) => {
    return changeType === 'increase' ? 'text-error' : 'text-success';
  };

  const getChangeIcon = (changeType) => {
    return changeType === 'increase' ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {riskMetrics.map((metric) => (
          <div
            key={metric.id}
            className={`${getStatusBgColor(metric.status)} border rounded-lg p-4 trading-transition hover:trading-shadow-md`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${getStatusBgColor(metric.status)}`}>
                  <Icon
                    name={metric.icon}
                    size={20}
                    className={getStatusColor(metric.status)}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text-secondary">
                    {metric.title}
                  </h3>
                  <p className="text-xs text-text-tertiary">
                    {metric.description}
                  </p>
                </div>
              </div>
              
              {metric.status !== 'normal' && (
                <div className={`w-2 h-2 rounded-full ${
                  metric.status === 'warning' ? 'bg-warning pulse-ambient' : 'bg-error pulse-ambient'
                }`} />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-text-primary">
                  {metric.value}
                </span>
                <div className="flex items-center space-x-1">
                  <Icon
                    name={getChangeIcon(metric.changeType)}
                    size={14}
                    className={getChangeColor(metric.changeType)}
                  />
                  <span className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                    {metric.change}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-text-tertiary">
                  Threshold: {metric.threshold}
                </span>
                <span className={`font-medium ${getStatusColor(metric.status)}`}>
                  {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-surface-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full trading-transition ${
                    metric.status === 'normal' ? 'bg-success' :
                    metric.status === 'warning' ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{
                    width: `${Math.min(
                      (parseFloat(metric.value) / parseFloat(metric.threshold)) * 100,
                      100
                    )}%`
                  }}
                />
              </div>

              <p className="text-xs text-text-tertiary mt-2">
                {metric.details}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Alert */}
      <div className="mt-4 bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Shield" size={20} className="text-primary" />
            <div>
              <h4 className="text-sm font-medium text-text-primary">
                Risk Summary for {portfolio}
              </h4>
              <p className="text-xs text-text-secondary">
                Overall risk level: <span className="font-medium text-warning">Moderate</span> • 
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="text-xs bg-surface-700 hover:bg-surface-600 text-text-primary px-3 py-1.5 rounded trading-transition">
              View Details
            </button>
            <button className="text-xs bg-primary hover:bg-primary-700 text-white px-3 py-1.5 rounded trading-transition">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMetricsKPI;