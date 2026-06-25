// components/landing/HeroSection/MockTradingTerminal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, UserCheck, Activity } from "lucide-react";

interface MockTrade {
  id: string;
  wallet: string;
  type: "buy" | "sell";
  amount: string;
  token: string;
  time: string;
}

const TOKENS = ["SOL", "CHAD", "JUP", "BONK", "WIF"];
const WALLETS = ["G4x9...", "Ery7...", "9KzQ...", "Chad...", "ApeX...", "Dgen...", "HODL..."];

export function MockTradingTerminal(): React.JSX.Element {
  const { login } = usePrivy();
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [payAmount, setPayAmount] = useState<string>("1.5");
  const [price, setPrice] = useState<number>(146.24);
  const [priceDirection, setPriceDirection] = useState<"up" | "down" | "flat">("flat");
  const [priceHistory, setPriceHistory] = useState<number[]>([142.1, 143.5, 141.8, 144.2, 143.9, 145.1, 146.24]);
  const [trades, setTrades] = useState<MockTrade[]>([
    { id: "1", wallet: "G4x9...", type: "buy", amount: "12.4 SOL", token: "SOL", time: "Just now" },
    { id: "2", wallet: "Ery7...", type: "sell", amount: "5,200 CHAD", token: "CHAD", time: "2s ago" },
    { id: "3", wallet: "9KzQ...", type: "buy", amount: "840 JUP", token: "JUP", time: "5s ago" },
  ]);

  // Simulate price ticks
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.45) * 0.9; // Bias slightly upward
      const newPrice = Math.round((price + delta) * 100) / 100;
      setPriceDirection(newPrice > price ? "up" : "down");
      setPrice(newPrice);
      
      setPriceHistory((prev) => {
        const next = [...prev.slice(1), newPrice];
        return next;
      });

      // Clear direction flash after 1 second
      const timeout = setTimeout(() => setPriceDirection("flat"), 1000);
      return () => clearTimeout(timeout);
    }, 3000);

    return () => clearInterval(interval);
  }, [price]);

  // Simulate incoming live trades
  useEffect(() => {
    const interval = setInterval(() => {
      const randWallet = WALLETS[Math.floor(Math.random() * WALLETS.length)];
      const randType = Math.random() > 0.4 ? ("buy" as const) : ("sell" as const);
      const randToken = TOKENS[Math.floor(Math.random() * TOKENS.length)];
      const amountVal = randType === "buy"
        ? `${Math.round(Math.random() * 25 + 1)} ${randToken}`
        : `${Math.round(Math.random() * 8000 + 100).toLocaleString()} ${randToken}`;

      const newTrade: MockTrade = {
        id: Math.random().toString(),
        wallet: randWallet,
        type: randType,
        amount: amountVal,
        token: randToken,
        time: "Just now",
      };

      setTrades((prev) => {
        // Increment time for older ones
        const updated = prev.map((t) => {
          if (t.time === "Just now") return { ...t, time: "2s ago" };
          if (t.time === "2s ago") return { ...t, time: "5s ago" };
          return { ...t, time: "8s ago" };
        });
        return [newTrade, ...updated.slice(0, 3)];
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Calculate coordinates for the SVG chart path
  const minVal = Math.min(...priceHistory);
  const maxVal = Math.max(...priceHistory);
  const range = maxVal - minVal || 1;

  const chartPoints = priceHistory.map((val, idx) => {
    const x = (idx / (priceHistory.length - 1)) * 100; // percent width
    const y = 90 - ((val - minVal) / range) * 80; // percent height (inverted, with padding)
    return `${x},${y}`;
  }).join(" ");

  const receiveAmount = activeTab === "buy"
    ? (parseFloat(payAmount || "0") * 1450).toFixed(2)
    : (parseFloat(payAmount || "0") / 1450).toFixed(6);

  const priceFlashClass = 
    priceDirection === "up" 
      ? "text-buy bg-buy/10 shadow-[0_0_12px_rgba(20,241,149,0.2)]" 
      : priceDirection === "down" 
        ? "text-sell bg-sell/10 shadow-[0_0_12px_rgba(255,92,92,0.2)]" 
        : "text-text-primary bg-white/5";

  return (
    <div className="w-full bg-bg-surface/30 border border-white/10 rounded-3xl p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl select-none text-left relative overflow-hidden glow-card">
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      {/* 1. Mock Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-accent to-accent-blue rounded-xl flex items-center justify-center font-black text-white text-base shadow-[0_4px_12px_rgba(153,69,255,0.3)]">
            C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base">CHAD / SOL</span>
              <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded-full bg-buy/15 text-buy border border-buy/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-buy animate-pulse" />
                Active
              </span>
            </div>
            <span className="text-[10px] text-text-muted">ChadWallet Index Token</span>
          </div>
        </div>

        <div className="text-right">
          <div className={`text-base font-bold px-2 py-0.5 rounded-lg transition-all duration-300 ${priceFlashClass}`}>
            ${price.toFixed(2)}
          </div>
          <span className="text-[10px] text-buy font-extrabold flex items-center justify-end gap-0.5 mt-0.5">
            <TrendingUp className="w-3 h-3" />
            +12.4% (24h)
          </span>
        </div>
      </div>

      {/* 2. Mock Chart */}
      <div className="relative w-full h-[140px] bg-black/40 border border-white/5 rounded-2xl mb-4 p-2 overflow-hidden">
        <div className="absolute top-2 left-3 flex items-center gap-1.5 z-10">
          <Activity className="w-3.5 h-3.5 text-accent-light" />
          <span className="text-[9px] text-text-muted font-black uppercase tracking-wider">Live Simulation</span>
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-[0.03]">
          <div className="border-b border-white w-full" />
          <div className="border-b border-white w-full" />
          <div className="border-b border-white w-full" />
        </div>

        {/* SVG Sparkline */}
        <svg className="w-full h-full pt-4" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mock-chart-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9945FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#9945FF" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Gradient area */}
          <path
            d={`M 0,100 L ${priceHistory.map((val, idx) => {
              const x = (idx / (priceHistory.length - 1)) * 100;
              const y = 90 - ((val - minVal) / range) * 80;
              return `${x},${y}`;
            }).join(" L ")} L 100,100 Z`}
            fill="url(#mock-chart-grad)"
          />

          {/* Stroke path */}
          <polyline
            fill="none"
            stroke="#9945FF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={chartPoints}
          />

          {/* Pulsing indicator on the last point */}
          {priceHistory.length > 0 && (
            <circle
              cx="100"
              cy={90 - ((priceHistory[priceHistory.length - 1] - minVal) / range) * 80}
              r="2.5"
              fill="#14F195"
              className="animate-ping"
              style={{ transformOrigin: "center" }}
            />
          )}
        </svg>
      </div>

      {/* 3. Interaction Form & Trades Feed Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Swap Form */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between">
          <div>
            {/* Tab switch with Framer Motion Slider */}
            <div className="flex bg-black/60 border border-white/10 rounded-xl p-0.5 mb-3 relative">
              <button
                type="button"
                onClick={() => setActiveTab("buy")}
                className="relative flex-1 py-1.5 text-[11px] font-extrabold uppercase rounded-lg transition-colors z-10 cursor-pointer text-center"
              >
                <span className={activeTab === "buy" ? "text-white" : "text-text-muted hover:text-white"}>Buy</span>
                {activeTab === "buy" && (
                  <motion.div
                    layoutId="mock-tab"
                    className="absolute inset-0 bg-buy rounded-lg z-[-1] shadow-md shadow-buy/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sell")}
                className="relative flex-1 py-1.5 text-[11px] font-extrabold uppercase rounded-lg transition-colors z-10 cursor-pointer text-center"
              >
                <span className={activeTab === "sell" ? "text-white" : "text-text-muted hover:text-white"}>Sell</span>
                {activeTab === "sell" && (
                  <motion.div
                    layoutId="mock-tab"
                    className="absolute inset-0 bg-sell rounded-lg z-[-1] shadow-md shadow-sell/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-2">
              <div className="bg-black/40 border border-white/5 rounded-xl p-2.5">
                <span className="text-[9px] text-text-muted font-bold block mb-1">PAY</span>
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="bg-transparent text-sm font-extrabold text-white w-2/3 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-xs font-bold text-white">{activeTab === "buy" ? "SOL" : "CHAD"}</span>
                </div>
              </div>

              <div className="bg-black/40 border border-white/5 rounded-xl p-2.5">
                <span className="text-[9px] text-text-muted font-bold block mb-1">RECEIVE</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-text-muted truncate max-w-[120px]">{receiveAmount}</span>
                  <span className="text-xs font-bold text-white">{activeTab === "buy" ? "CHAD" : "SOL"}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => login()}
            className={`w-full py-3.5 mt-4 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "buy"
                ? "bg-buy text-white hover:bg-opacity-90 shadow-buy/10"
                : "bg-sell text-white hover:bg-opacity-90 shadow-sell/10"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Sign In & Swap
          </button>
        </div>

        {/* Live Trades */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5 flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-1.5">
            <span className="text-[9px] text-text-muted font-black uppercase tracking-wider">
              Network Swaps
            </span>
            <span className="text-[8px] text-accent font-black uppercase tracking-widest bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20">
              Jupiter Feed
            </span>
          </div>

          <div className="flex flex-col gap-2.5 flex-1 justify-center">
            <AnimatePresence initial={false}>
              {trades.map((trade) => (
                <motion.div
                  key={trade.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-between text-xs py-1 border-b border-white/[0.03] last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-text-muted bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                      {trade.wallet}
                    </span>
                    <span className={`font-black text-[9px] ${trade.type === "buy" ? "text-buy" : "text-sell"}`}>
                      {trade.type === "buy" ? "BUY" : "SELL"}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-white text-[11px]">{trade.amount}</div>
                    <div className="text-[8px] text-text-dim mt-0.5">{trade.time}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MockTradingTerminal;
