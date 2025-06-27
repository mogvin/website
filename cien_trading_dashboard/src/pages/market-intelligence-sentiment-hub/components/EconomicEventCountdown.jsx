import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const EconomicEventCountdown = () => {
  const [nextEvent, setNextEvent] = useState({
    name: 'Federal Reserve Interest Rate Decision',
    impact: 'high',
    timeRemaining: 2 * 60 * 60 + 45 * 60 + 30, // 2h 45m 30s in seconds
    currency: 'USD',
    forecast: '5.25%',
    previous: '5.00%',
  });

  const [timeLeft, setTimeLeft] = useState(nextEvent.timeRemaining);

  const upcomingEvents = [
    {
      name: 'Federal Reserve Interest Rate Decision',
      impact: 'high',
      timeRemaining: 2 * 60 * 60 + 45 * 60 + 30,
      currency: 'USD',
      forecast: '5.25%',
      previous: '5.00%',
    },
    {
      name: 'Non-Farm Payrolls',
      impact: 'high',
      timeRemaining: 5 * 60 * 60 + 15 * 60,
      currency: 'USD',
      forecast: '180K',
      previous: '175K',
    },
    {
      name: 'ECB Monetary Policy Statement',
      impact: 'medium',
      timeRemaining: 8 * 60 * 60 + 30 * 60,
      currency: 'EUR',
      forecast: '4.50%',
      previous: '4.25%',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
    };
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'Info';
      default: return 'Calendar';
    }
  };

  const time = formatTime(timeLeft);

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary">Next Economic Event</h3>
        <Icon 
          name={getImpactIcon(nextEvent.impact)} 
          size={16} 
          className={getImpactColor(nextEvent.impact)} 
        />
      </div>

      {/* Event Name */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-text-primary mb-1 line-clamp-2">
          {nextEvent.name}
        </h4>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-surface-700 text-text-secondary px-2 py-1 rounded">
            {nextEvent.currency}
          </span>
          <span className={`text-xs font-medium capitalize ${getImpactColor(nextEvent.impact)}`}>
            {nextEvent.impact} Impact
          </span>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-text-primary bg-surface-700 rounded py-2">
            {time.hours}
          </div>
          <div className="text-xs text-text-tertiary mt-1">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-text-primary bg-surface-700 rounded py-2">
            {time.minutes}
          </div>
          <div className="text-xs text-text-tertiary mt-1">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-text-primary bg-surface-700 rounded py-2">
            {time.seconds}
          </div>
          <div className="text-xs text-text-tertiary mt-1">Seconds</div>
        </div>
      </div>

      {/* Forecast vs Previous */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">Forecast</span>
          <span className="text-xs font-medium text-text-primary">{nextEvent.forecast}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">Previous</span>
          <span className="text-xs font-medium text-text-primary">{nextEvent.previous}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-1 bg-surface-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full trading-transition ${
              nextEvent.impact === 'high' ? 'bg-error' :
              nextEvent.impact === 'medium' ? 'bg-warning' : 'bg-success'
            }`}
            style={{ 
              width: `${Math.max(10, 100 - (timeLeft / nextEvent.timeRemaining) * 100)}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EconomicEventCountdown;