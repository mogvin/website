import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from 'components/AppIcon';

const AIEnsembleVotes = ({ instrument }) => {
  const [voteData, setVoteData] = useState([]);
  const [confidence, setConfidence] = useState(0);
  const [recommendation, setRecommendation] = useState('HOLD');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const generateVoteData = () => {
      const algorithms = [
        { name: 'Momentum Alpha', vote: 'BUY', confidence: Math.random() * 100 },
        { name: 'Mean Reversion', vote: 'SELL', confidence: Math.random() * 100 },
        { name: 'Arbitrage Bot', vote: 'HOLD', confidence: Math.random() * 100 },
        { name: 'Grid Trading', vote: 'BUY', confidence: Math.random() * 100 },
        { name: 'Sentiment AI', vote: 'BUY', confidence: Math.random() * 100 },
        { name: 'Technical Patterns', vote: 'HOLD', confidence: Math.random() * 100 },
      ];

      const voteCounts = algorithms.reduce((acc, algo) => {
        acc[algo.vote] = (acc[algo.vote] || 0) + 1;
        return acc;
      }, {});

      const pieData = Object.entries(voteCounts).map(([vote, count]) => ({
        name: vote,
        value: count,
        percentage: (count / algorithms.length) * 100
      }));

      const avgConfidence = algorithms.reduce((sum, algo) => sum + algo.confidence, 0) / algorithms.length;
      
      // Determine overall recommendation based on majority vote
      const maxVote = Object.entries(voteCounts).reduce((a, b) => voteCounts[a[0]] > voteCounts[b[0]] ? a : b);
      
      setVoteData(pieData);
      setConfidence(avgConfidence);
      setRecommendation(maxVote[0]);
      setLastUpdate(new Date());
    };

    generateVoteData();
    
    const interval = setInterval(() => {
      generateVoteData();
    }, 5000);

    return () => clearInterval(interval);
  }, [instrument]);

  const getVoteColor = (vote) => {
    switch (vote) {
      case 'BUY':
        return '#10B981';
      case 'SELL':
        return '#EF4444';
      case 'HOLD':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getRecommendationIcon = (rec) => {
    switch (rec) {
      case 'BUY':
        return 'TrendingUp';
      case 'SELL':
        return 'TrendingDown';
      case 'HOLD':
        return 'Minus';
      default:
        return 'Circle';
    }
  };

  const getConfidenceColor = (conf) => {
    if (conf >= 80) return 'text-success';
    if (conf >= 60) return 'text-warning';
    return 'text-error';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-lg p-2 trading-shadow-md">
          <p className="text-text-primary font-medium">{data.name}</p>
          <p className="text-text-secondary text-xs">
            {data.value} votes ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Brain" size={18} className="text-primary" />
          <h3 className="font-semibold text-text-primary">AI Ensemble</h3>
        </div>
        <div className="text-xs text-text-secondary">
          {instrument}
        </div>
      </div>

      {/* Overall Recommendation */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon 
              name={getRecommendationIcon(recommendation)} 
              size={20} 
              className={recommendation === 'BUY' ? 'text-success' : recommendation === 'SELL' ? 'text-error' : 'text-warning'} 
            />
            <span className={`font-semibold ${
              recommendation === 'BUY' ? 'text-success' : 
              recommendation === 'SELL' ? 'text-error' : 'text-warning'
            }`}>
              {recommendation}
            </span>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
              {confidence.toFixed(1)}%
            </div>
            <div className="text-xs text-text-secondary">Confidence</div>
          </div>
        </div>

        <div className="w-full bg-surface-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full trading-transition ${
              confidence >= 80 ? 'bg-success' : 
              confidence >= 60 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
      </div>

      {/* Vote Distribution Chart */}
      <div className="p-4">
        <div className="h-40 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={voteData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {voteData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getVoteColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Vote Legend */}
        <div className="space-y-2">
          {voteData.map((vote, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getVoteColor(vote.name) }}
                ></div>
                <span className="text-text-primary font-medium">{vote.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-text-secondary">{vote.value}</span>
                <span className="text-text-tertiary">({vote.percentage.toFixed(1)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-border bg-surface-700/50">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Last Update: {lastUpdate.toLocaleTimeString()}</span>
          <div className="flex items-center space-x-1">
            <Icon name="Zap" size={10} className="text-success pulse-ambient" />
            <span>Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEnsembleVotes;