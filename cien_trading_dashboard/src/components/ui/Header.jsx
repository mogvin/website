import React, { useState } from 'react';
import Icon from '../AppIcon';

const Header = () => {
  const [selectedCompany, setSelectedCompany] = useState('CIEN Trading');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const companies = [
    { id: 1, name: 'CIEN Trading', abbreviation: 'CIEN' },
    { id: 2, name: 'Alpha Capital', abbreviation: 'ALPH' },
    { id: 3, name: 'Beta Investments', abbreviation: 'BETA' },
    { id: 4, name: 'Gamma Securities', abbreviation: 'GAMM' },
  ];

  const handleCompanyChange = (companyName) => {
    setSelectedCompany(companyName);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-surface border-b border-border h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section - Company Selector */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={selectedCompany}
              onChange={(e) => handleCompanyChange(e.target.value)}
              className="appearance-none bg-surface-700 text-text-primary border border-border rounded-lg px-4 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent trading-transition"
            >
              {companies.map((company) => (
                <option key={company.id} value={company.name}>
                  {company.name}
                </option>
              ))}
            </select>
            <Icon
              name="ChevronDown"
              size={16}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none"
            />
          </div>
        </div>

        {/* Center Section - Global Search */}
        <div className="flex-1 max-w-md mx-8">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <Icon
                name="Search"
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search instruments, portfolios, alerts..."
                className={`w-full bg-surface-700 text-text-primary border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent trading-transition ${
                  isSearchFocused ? 'border-primary' : 'border-border'
                }`}
              />
            </div>
          </form>
        </div>

        {/* Right Section - User Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-text-secondary hover:text-text-primary trading-transition">
            <Icon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Settings */}
          <button className="p-2 text-text-secondary hover:text-text-primary trading-transition">
            <Icon name="Settings" size={20} />
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
            <span className="text-text-primary text-sm font-medium hidden md:block">
              John Doe
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;