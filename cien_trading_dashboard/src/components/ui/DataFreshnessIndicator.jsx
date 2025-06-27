import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const DataFreshnessIndicator = ({ 
  dataSource = 'Market Data',
  updateInterval = 1000,
  className = '',
  showDetails = false 
}) => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [timeSinceUpdate, setTimeSinceUpdate] = useState(0);
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    const updateTimer = setInterval(() => {
      setLastUpdate(new Date());
      setTimeSinceUpdate(0);
    }, updateInterval);

    return () => clearInterval(updateTimer);
  }, [updateInterval]);

  useEffect(() => {
    const stalenessTimer = setInterval(() => {
      const now = new Date();
      const secondsSinceUpdate = Math.floor((now - lastUpdate) / 1000);
      setTimeSinceUpdate(secondsSinceUpdate);
      setIsStale(secondsSinceUpdate > 30);
    }, 1000);

    return () => clearInterval(stalenessTimer);
  }, [lastUpdate]);

  const getFreshnessColor = () => {
    if (isStale) return 'text-error';
    if (timeSinceUpdate > 15) return 'text-warning';
    return 'text-success';
  };

  const getFreshnessIcon = () => {
    if (isStale) return 'AlertTriangle';
    if (timeSinceUpdate > 15) return 'Clock';
    return 'CheckCircle';
  };

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getTimeSinceText = () => {
    if (timeSinceUpdate < 60) {
      return `${timeSinceUpdate}s ago`;
    } else if (timeSinceUpdate < 3600) {
      return `${Math.floor(timeSinceUpdate / 60)}m ago`;
    } else {
      return `${Math.floor(timeSinceUpdate / 3600)}h ago`;
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        <Icon
          name={getFreshnessIcon()}
          size={14}
          className={`${getFreshnessColor()} ${
            !isStale && timeSinceUpdate < 5 ? 'pulse-ambient' : ''
          }`}
        />
        <span className={`text-xs font-medium ${getFreshnessColor()}`}>
          {isStale ? 'Stale' : 'Live'}
        </span>
      </div>

      <div className="text-xs text-text-secondary font-data">
        {showDetails ? (
          <div className="flex flex-col">
            <span>{formatTimestamp(lastUpdate)}</span>
            <span className="text-text-tertiary">{getTimeSinceText()}</span>
          </div>
        ) : (
          <span>{formatTimestamp(lastUpdate)}</span>
        )}
      </div>

      {showDetails && (
        <div className="text-xs text-text-tertiary">
          <span>{dataSource}</span>
        </div>
      )}
    </div>
  );
};

export default DataFreshnessIndicator;