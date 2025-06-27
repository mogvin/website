import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const NewsImpactScore = ({ newsSource }) => {
  const [impactData, setImpactData] = useState({
    score: 7.8,
    trend: 'increasing',
    change: 1.2,
    level: 'high',
    topStories: 3,
    totalStories: 47,
  });

  const mockImpactData = {
    ALL: { score: 7.8, trend: 'increasing', change: 1.2, level: 'high', topStories: 3, totalStories: 47 },
    REUTERS: { score: 8.2, trend: 'stable', change: 0.1, level: 'high', topStories: 2, totalStories: 12 },
    BLOOMBERG: { score: 7.5, trend: 'decreasing', change: -0.8, level: 'medium', topStories: 1, totalStories: 8 },
    CNBC: { score: 6.9, trend: 'increasing', change: 2.1, level: 'medium', topStories: 2, totalStories: 15 },
    WSJ: { score: 8.0, trend: 'stable', change: 0.3, level: 'high', topStories: 1, totalStories: 6 },
    SOCIAL: { score: 5.4, trend: 'increasing', change: 3.2, level: 'low', topStories: 5, totalStories: 89 },
  };

  useEffect(() => {
    setImpactData(mockImpactData[newsSource] || mockImpactData.ALL);
  }, [newsSource]);

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-error';
    if (score >= 6) return 'text-warning';
    return 'text-success';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return 'TrendingUp';
      case 'decreasing': return 'TrendingDown';
      case 'stable': return 'Minus';
      default: return 'Activity';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing': return 'text-error';
      case 'decreasing': return 'text-success';
      case 'stable': return 'text-warning';
      default: return 'text-text-secondary';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'high': return 'bg-error';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-surface-700';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary">News Impact Score</h3>
        <div className="flex items-center space-x-1">
          <Icon 
            name={getTrendIcon(impactData.trend)} 
            size={14} 
            className={getTrendColor(impactData.trend)} 
          />
          <span className={`text-xs font-medium ${getTrendColor(impactData.trend)}`}>
            {impactData.change > 0 ? '+' : ''}{impactData.change.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Impact Score Display */}
      <div className="text-center mb-4">
        <div className={`text-3xl font-bold mb-1 ${getScoreColor(impactData.score)}`}>
          {impactData.score.toFixed(1)}
        </div>
        <div className="text-xs text-text-tertiary">out of 10</div>
      </div>

      {/* Impact Level Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-secondary">Impact Level</span>
          <span className={`text-xs font-medium capitalize ${
            impactData.level === 'high' ? 'text-error' :
            impactData.level === 'medium' ? 'text-warning' : 'text-success'
          }`}>
            {impactData.level}
          </span>
        </div>
        
        <div className="relative h-2 bg-surface-700 rounded-full overflow-hidden">
          <div 
            className={`absolute left-0 top-0 h-full rounded-full trading-transition ${getLevelColor(impactData.level)}`}
            style={{ 
              width: `${(impactData.score / 10) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Story Statistics */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={12} className="text-error" />
            <span className="text-xs text-text-secondary">High Impact</span>
          </div>
          <span className="text-xs font-medium text-text-primary">{impactData.topStories}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={12} className="text-text-secondary" />
            <span className="text-xs text-text-secondary">Total Stories</span>
          </div>
          <span className="text-xs font-medium text-text-primary">{impactData.totalStories}</span>
        </div>
      </div>

      {/* Source Indicator */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-tertiary">Source</span>
          <span className="text-xs font-medium text-text-primary bg-surface-700 px-2 py-1 rounded">
            {newsSource}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewsImpactScore;