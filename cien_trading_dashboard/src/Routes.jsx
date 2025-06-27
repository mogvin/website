import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import TradingCommandCenter from "pages/trading-command-center";
import PortfolioRiskManagementCenter from "pages/portfolio-risk-management-center";
import MarketIntelligenceSentimentHub from "pages/market-intelligence-sentiment-hub";
import AIAlgorithmPerformanceDashboard from "pages/ai-algorithm-performance-dashboard";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<TradingCommandCenter />} />
          <Route path="/trading-command-center" element={<TradingCommandCenter />} />
          <Route path="/portfolio-risk-management-center" element={<PortfolioRiskManagementCenter />} />
          <Route path="/market-intelligence-sentiment-hub" element={<MarketIntelligenceSentimentHub />} />
          <Route path="/ai-algorithm-performance-dashboard" element={<AIAlgorithmPerformanceDashboard />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;