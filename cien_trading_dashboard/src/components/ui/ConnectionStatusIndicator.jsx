import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const ConnectionStatusIndicator = ({ className = '' }) => {
  const [connectionStatus, setConnectionStatus] = useState({
    status: 'connected',
    latency: 12,
    quality: 'excellent',
    lastUpdate: new Date(),
    dataStreams: {
      market: 'active',
      trading: 'active',
      risk: 'active',
      news: 'active',
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(prev => ({
        ...prev,
        latency: Math.floor(Math.random() * 50) + 8,
        lastUpdate: new Date(),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus.status) {
      case 'connected':
        return connectionStatus.latency < 20 ? 'text-success' : 'text-warning';
      case 'connecting':
        return 'text-warning';
      case 'disconnected':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus.status) {
      case 'connected':
        return 'Wifi';
      case 'connecting':
        return 'WifiOff';
      case 'disconnected':
        return 'WifiOff';
      default:
        return 'Wifi';
    }
  };

  const getQualityText = () => {
    if (connectionStatus.latency < 15) return 'Excellent';
    if (connectionStatus.latency < 30) return 'Good';
    if (connectionStatus.latency < 50) return 'Fair';
    return 'Poor';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        <Icon
          name={getStatusIcon()}
          size={16}
          className={`${getStatusColor()} ${
            connectionStatus.status === 'connected' ? 'pulse-ambient' : ''
          }`}
        />
        <span className={`text-xs font-medium ${getStatusColor()}`}>
          {connectionStatus.status === 'connected' ? getQualityText() : 'Offline'}
        </span>
      </div>
      
      {connectionStatus.status === 'connected' && (
        <div className="flex items-center space-x-2 text-xs text-text-secondary">
          <span className="font-data">{connectionStatus.latency}ms</span>
          <div className="flex space-x-1">
            {Object.entries(connectionStatus.dataStreams).map(([stream, status]) => (
              <div
                key={stream}
                className={`w-1.5 h-1.5 rounded-full ${
                  status === 'active' ? 'bg-success pulse-ambient' : 'bg-error'
                }`}
                title={`${stream} stream: ${status}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatusIndicator;