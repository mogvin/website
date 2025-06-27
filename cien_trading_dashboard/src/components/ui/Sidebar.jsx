import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    status: 'connected',
    latency: 12,
    lastUpdate: new Date(),
  });
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Trading Command Center',
      path: '/trading-command-center',
      icon: 'BarChart3',
      tooltip: 'Real-time trading operations hub',
    },
    {
      label: 'AI Algorithm Performance',
      path: '/ai-algorithm-performance-dashboard',
      icon: 'Brain',
      tooltip: 'AI trading system monitoring',
    },
    {
      label: 'Portfolio Risk Management',
      path: '/portfolio-risk-management-center',
      icon: 'Shield',
      tooltip: 'Portfolio risk and compliance',
    },
    {
      label: 'Market Intelligence Hub',
      path: '/market-intelligence-sentiment-hub',
      icon: 'TrendingUp',
      tooltip: 'Market sentiment and news analysis',
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus.status) {
      case 'connected':
        return 'text-success';
      case 'connecting':
        return 'text-warning';
      case 'disconnected':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getConnectionStatusIcon = () => {
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

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-surface border-r border-border z-100 trading-transition ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              {/* CIEN Logo */}
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-text-primary font-semibold text-lg">CIEN</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1.5 text-text-secondary hover:text-text-primary trading-transition"
          >
            <Icon name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={18} />
          </button>
        </div>

        {/* Connection Status */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon
              name={getConnectionStatusIcon()}
              size={16}
              className={`${getConnectionStatusColor()} ${
                connectionStatus.status === 'connected' ? 'pulse-ambient' : ''
              }`}
            />
            {!isCollapsed && (
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${getConnectionStatusColor()}`}>
                    {connectionStatus.status.charAt(0).toUpperCase() + connectionStatus.status.slice(1)}
                  </span>
                  {connectionStatus.status === 'connected' && (
                    <span className="text-xs text-text-secondary">
                      {connectionStatus.latency}ms
                    </span>
                  )}
                </div>
                <div className="text-xs text-text-tertiary mt-0.5">
                  {connectionStatus.lastUpdate.toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left trading-transition group ${
                      isActive
                        ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-surface-700'
                    }`}
                    title={isCollapsed ? item.tooltip : ''}
                  >
                    <Icon
                      name={item.icon}
                      size={20}
                      className={`flex-shrink-0 ${
                        isActive ? 'text-white' : 'text-current'
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="font-medium text-sm truncate">
                        {item.label}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Data Freshness Indicator */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-tertiary">Last Update</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full pulse-ambient"></div>
                <span className="text-text-secondary font-data">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;