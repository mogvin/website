import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const AlgorithmSelector = ({
  algorithms,
  selectedAlgorithm,
  onAlgorithmChange,
  comparisonMode,
  selectedAlgorithms,
  onToggleComparison,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentAlgorithm = algorithms.find(algo => algo.id === selectedAlgorithm);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'paused':
        return 'text-warning';
      case 'stopped':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'Play';
      case 'paused':
        return 'Pause';
      case 'stopped':
        return 'Square';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-medium text-text-primary">
          Algorithm Selection
        </label>
        <button
          onClick={onToggleComparison}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded text-xs font-medium trading-transition ${
            comparisonMode
              ? 'bg-primary text-white' :'bg-surface-700 text-text-secondary hover:text-text-primary'
          }`}
        >
          <Icon name="BarChart3" size={14} />
          <span>Compare</span>
        </button>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between p-3 bg-surface-700 hover:bg-surface-600 border border-border rounded-lg trading-transition"
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Icon
                name={getStatusIcon(currentAlgorithm?.status)}
                size={16}
                className={getStatusColor(currentAlgorithm?.status)}
              />
              <div className="text-left">
                <div className="text-text-primary font-medium text-sm">
                  {currentAlgorithm?.name}
                </div>
                <div className="text-text-secondary text-xs">
                  {currentAlgorithm?.description}
                </div>
              </div>
            </div>
          </div>
          <Icon
            name={isDropdownOpen ? 'ChevronUp' : 'ChevronDown'}
            size={16}
            className="text-text-secondary"
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-lg trading-shadow-lg z-50 max-h-64 overflow-y-auto">
            {algorithms.map((algorithm) => (
              <button
                key={algorithm.id}
                onClick={() => {
                  onAlgorithmChange(algorithm.id);
                  if (!comparisonMode) {
                    setIsDropdownOpen(false);
                  }
                }}
                className={`w-full flex items-center justify-between p-3 text-left hover:bg-surface-700 trading-transition border-b border-border last:border-b-0 ${
                  selectedAlgorithm === algorithm.id ? 'bg-surface-700' : ''
                } ${
                  comparisonMode && selectedAlgorithms.includes(algorithm.id)
                    ? 'ring-1 ring-primary' :''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    name={getStatusIcon(algorithm.status)}
                    size={16}
                    className={getStatusColor(algorithm.status)}
                  />
                  <div>
                    <div className="text-text-primary font-medium text-sm">
                      {algorithm.name}
                    </div>
                    <div className="text-text-secondary text-xs">
                      {algorithm.description}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-text-primary text-sm font-medium">
                      {algorithm.confidence}%
                    </div>
                    <div className="text-text-secondary text-xs">
                      Confidence
                    </div>
                  </div>
                  {comparisonMode && selectedAlgorithms.includes(algorithm.id) && (
                    <Icon name="Check" size={16} className="text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {comparisonMode && selectedAlgorithms.length > 1 && (
        <div className="mt-4">
          <div className="text-xs text-text-secondary mb-2">
            Selected for Comparison ({selectedAlgorithms.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedAlgorithms.map((algorithmId) => {
              const algo = algorithms.find(a => a.id === algorithmId);
              return (
                <div
                  key={algorithmId}
                  className="flex items-center space-x-2 px-2 py-1 bg-primary/20 text-primary rounded text-xs"
                >
                  <span>{algo?.name}</span>
                  <button
                    onClick={() => {
                      const newSelected = selectedAlgorithms.filter(id => id !== algorithmId);
                      if (newSelected.length > 0) {
                        onAlgorithmChange(newSelected[0]);
                      }
                    }}
                    className="hover:text-primary-700"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmSelector;