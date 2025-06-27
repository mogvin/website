import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const GlobalSearch = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const mockResults = [
    { type: 'instrument', name: 'AAPL', description: 'Apple Inc.', category: 'Equity' },
    { type: 'instrument', name: 'TSLA', description: 'Tesla Inc.', category: 'Equity' },
    { type: 'portfolio', name: 'Tech Growth', description: 'Technology Growth Portfolio', category: 'Portfolio' },
    { type: 'algorithm', name: 'Momentum Alpha', description: 'Momentum Trading Algorithm', category: 'Algorithm' },
    { type: 'alert', name: 'Risk Threshold', description: 'Portfolio Risk Alert', category: 'Alert' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsExpanded(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const filtered = mockResults.filter(
          item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Search submitted:', searchQuery);
      setIsExpanded(false);
    }
  };

  const handleResultClick = (result) => {
    console.log('Result selected:', result);
    setSearchQuery('');
    setIsExpanded(false);
    setIsFocused(false);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setIsExpanded(true);
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'instrument':
        return 'TrendingUp';
      case 'portfolio':
        return 'Briefcase';
      case 'algorithm':
        return 'Brain';
      case 'alert':
        return 'AlertTriangle';
      default:
        return 'Search';
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <Icon
            name="Search"
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
          />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
            placeholder="Search instruments, portfolios, alerts..."
            className={`w-full bg-surface-700 text-text-primary border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent trading-transition ${
              isFocused ? 'border-primary' : 'border-border'
            }`}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isExpanded && (searchResults.length > 0 || searchQuery.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-lg trading-shadow-lg z-200 max-h-80 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-surface-700 trading-transition"
                >
                  <Icon
                    name={getResultIcon(result.type)}
                    size={16}
                    className="text-text-secondary flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-text-primary font-medium text-sm truncate">
                        {result.name}
                      </span>
                      <span className="text-xs text-text-tertiary bg-surface-600 px-2 py-0.5 rounded">
                        {result.category}
                      </span>
                    </div>
                    <p className="text-text-secondary text-xs mt-0.5 truncate">
                      {result.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery.length > 0 && !isLoading ? (
            <div className="py-8 text-center">
              <Icon name="Search" size={24} className="text-text-tertiary mx-auto mb-2" />
              <p className="text-text-secondary text-sm">No results found for "{searchQuery}"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;