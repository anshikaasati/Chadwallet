// components/trading/TradingLayout/TradingLayout.tsx
"use client";

import React, { useState } from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export interface TradingLayoutProps {
  trendingList: React.ReactNode;
  tokenHeader: React.ReactNode;
  priceChart: React.ReactNode;
  holdersList: React.ReactNode;
  tradesFeed: React.ReactNode;
  swapPanel: React.ReactNode;
  userPosition: React.ReactNode;
}

export function TradingLayout({
  trendingList,
  tokenHeader,
  priceChart,
  holdersList,
  tradesFeed,
  swapPanel,
  userPosition,
}: TradingLayoutProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<"chart" | "swap" | "trades">("chart");

  return (
    <div className="flex flex-col xl:flex-row gap-5 p-4 w-full max-w-[1600px] mx-auto min-h-screen">
      {/* 1. Left Column: Trending list (Desktop >=1280px only) */}
      <div className="hidden xl:block w-[280px] flex-shrink-0 bg-bg-surface border border-border rounded-xl p-4 h-fit sticky top-20">
        <ErrorBoundary>
          {trendingList}
        </ErrorBoundary>
      </div>

      {/* Mobile Tab Navigation Bar (<768px only) */}
      <div className="md:hidden flex bg-bg-surface border border-border rounded-xl p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab("chart")}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
            activeTab === "chart"
              ? "bg-accent text-text-primary shadow-sm"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          Chart
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("swap")}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
            activeTab === "swap"
              ? "bg-accent text-text-primary shadow-sm"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          Swap
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("trades")}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
            activeTab === "trades"
              ? "bg-accent text-text-primary shadow-sm"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          Trades
        </button>
      </div>

      {/* Middle & Right columns wrapper */}
      <div className="flex-1 flex flex-col xl:flex-row gap-5 min-w-0">
        
        {/* 2. Middle Column: Header, Price Chart, Holders List, Trades Feed */}
        <div className={`flex-1 flex flex-col gap-4 min-w-0 ${
          activeTab === "chart" || activeTab === "trades" ? "flex" : "hidden md:flex"
        }`}>
          <ErrorBoundary>
            {/* Header component */}
            <div className={activeTab === "chart" ? "block" : "hidden md:block"}>
              {tokenHeader}
            </div>

            {/* Chart & Holders */}
            <div className={activeTab === "chart" ? "flex flex-col gap-4" : "hidden md:flex md:flex-col md:gap-4"}>
              {priceChart}
              {holdersList}
            </div>

            {/* Trades Feed */}
            <div className={activeTab === "trades" ? "block" : "hidden md:block"}>
              {tradesFeed}
            </div>
          </ErrorBoundary>
        </div>

        {/* 3. Right Column: Swap Panel, User Position */}
        <div className={`w-full xl:w-[320px] flex-shrink-0 flex flex-col gap-4 ${
          activeTab === "swap" ? "flex" : "hidden md:flex"
        }`}>
          <ErrorBoundary>
            {swapPanel}
            {userPosition}
          </ErrorBoundary>
        </div>

      </div>
    </div>
  );
}

export default TradingLayout;


