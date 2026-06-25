// components/trading/TradingLayout/TradingLayout.tsx
"use client";

import React, { useState } from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { motion } from "framer-motion";

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
    <div className="flex flex-col xl:flex-row gap-6 p-4 md:p-6 w-full max-w-[1680px] mx-auto min-h-screen relative z-10 select-none">
      {/* 1. Left Column: Trending list (Desktop >=1280px only) */}
      <div className="hidden xl:block w-[290px] flex-shrink-0 bg-[#0b1120]/45 border border-white/10 rounded-3xl p-5 h-fit sticky top-[88px] backdrop-blur-xl shadow-2xl">
        <ErrorBoundary>
          {trendingList}
        </ErrorBoundary>
      </div>

      {/* Mobile Tab Navigation Bar (<768px only) */}
      <div className="md:hidden flex bg-[#0b1120]/80 border border-white/10 rounded-2xl p-1 shadow-lg backdrop-blur-md sticky top-[72px] z-30">
        {(["chart", "swap", "trades"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`relative flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center`}
          >
            <span className={activeTab === tab ? "text-white" : "text-text-muted hover:text-white"}>
              {tab}
            </span>
            {activeTab === tab && (
              <motion.div
                layoutId="trading-mobile-tab"
                className="absolute inset-0 bg-accent rounded-xl z-[-1] shadow-md shadow-accent/25"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Middle & Right columns wrapper */}
      <div className="flex-1 flex flex-col xl:flex-row gap-6 min-w-0">
        
        {/* 2. Middle Column: Header, Price Chart, Holders List, Trades Feed */}
        <div className={`flex-1 flex flex-col gap-5 min-w-0 ${
          activeTab === "chart" || activeTab === "trades" ? "flex" : "hidden md:flex"
        }`}>
          <ErrorBoundary>
            {/* Header component */}
            <div className={activeTab === "chart" ? "block" : "hidden md:block"}>
              {tokenHeader}
            </div>

            {/* Chart & Holders */}
            <div className={activeTab === "chart" ? "flex flex-col gap-5" : "hidden md:flex md:flex-col md:gap-5"}>
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
        <div className={`w-full xl:w-[340px] md:max-w-md md:mx-auto xl:max-w-none xl:mx-0 flex-shrink-0 flex flex-col gap-5 ${
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


