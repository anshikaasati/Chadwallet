// components/landing/HeroSection/MockTradingTerminal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";

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
      ? "text-buy bg-buy/10 scale-105" 
      : priceDirection === "down" 
        ? "text-sell bg-sell/10 scale-105" 
        : "text-text-primary bg-bg-primary";

  return (
    <div className="w-full bg-bg-surface/50 border border-border rounded-2xl p-5 shadow-2xl backdrop-blur-md select-none text-left glow-card">
      
      {/* 1. Mock Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent/20 border border-accent/40 rounded-xl flex items-center justify-center font-bold text-accent">
            C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base">CHAD / SOL</span>
              <span className="text-[10px] px-1.5 py-0.5 font-bold uppercase rounded bg-buy/20 text-buy">
                Active
              </span>
            </div>
            <span className="text-[11px] text-text-muted">ChadWallet Index Token</span>
          </div>
        </div>

        <div className="text-right">
          <div className={`text-lg font-bold px-2 py-0.5 rounded-lg transition-all duration-300 ${priceFlashClass}`}>
            ${price.toFixed(2)}
          </div>
          <span className="text-[10px] text-buy font-bold">+12.4% (24h)</span>
        </div>
      </div>

      {/* 2. Mock Chart */}
      <div className="relative w-full h-[140px] bg-bg-primary/40 border border-border/80 rounded-xl mb-4 p-2 overflow-hidden">
        <div className="absolute top-2 left-3 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-buy animate-pulse" />
          <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Live Simulation</span>
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-20">
          <div className="border-b border-border w-full" />
          <div className="border-b border-border w-full" />
          <div className="border-b border-border w-full" />
        </div>

        {/* SVG Sparkline */}
        <svg className="w-full h-full pt-4" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Gradient area */}
          <path
            d={`M 0,100 L ${priceHistory.map((val, idx) => {
              const x = (idx / (priceHistory.length - 1)) * 100;
              const y = 90 - ((val - minVal) / range) * 80;
              return `${x},${y}`;
            }).join(" L ")} L 100,100 Z`}
            fill="url(#chart-grad)"
          />

          {/* Stroke path */}
          <polyline
            fill="none"
            stroke="#7c3aed"
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
              fill="#7c3aed"
              className="animate-ping"
              style={{ transformOrigin: "center" }}
            />
          )}
        </svg>
      </div>

      {/* 3. Interaction Form & Trades Feed Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Swap Form */}
        <div className="bg-bg-primary/20 border border-border/80 rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            {/* Tab switch */}
            <div className="flex bg-bg-primary/60 border border-border rounded-lg p-0.5 mb-3">
              <button
                type="button"
                onClick={() => setActiveTab("buy")}
                className={`flex-1 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${
                  activeTab === "buy"
                    ? "bg-buy text-white shadow-sm"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sell")}
                className={`flex-1 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${
                  activeTab === "sell"
                    ? "bg-sell text-white shadow-sm"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                Sell
              </button>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-2">
              <div className="bg-bg-primary/60 border border-border rounded-lg p-2.5">
                <span className="text-[10px] text-text-muted font-bold block mb-1">PAY</span>
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="bg-transparent text-sm font-extrabold text-white w-2/3 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-xs font-bold text-text-primary">{activeTab === "buy" ? "SOL" : "CHAD"}</span>
                </div>
              </div>

              <div className="bg-bg-primary/60 border border-border rounded-lg p-2.5">
                <span className="text-[10px] text-text-muted font-bold block mb-1">RECEIVE</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-text-muted">{receiveAmount}</span>
                  <span className="text-xs font-bold text-text-primary">{activeTab === "buy" ? "CHAD" : "SOL"}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => login()}
            className={`w-full py-3 mt-4 text-xs font-black uppercase rounded-lg transition-all shadow-md active:scale-[0.98] ${
              activeTab === "buy"
                ? "bg-buy/90 hover:bg-buy text-white shadow-buy/10 hover:shadow-buy/20"
                : "bg-sell/90 hover:bg-sell text-white shadow-sell/10 hover:shadow-sell/20"
            }`}
          >
            Sign In & Swap
          </button>
        </div>

        {/* Live Trades */}
        <div className="bg-bg-primary/20 border border-border/80 rounded-xl p-3.5 flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-border/50 pb-1.5">
            <span className="text-[10px] text-text-muted font-extrabold uppercase tracking-wider">
              Recent Network Swaps
            </span>
            <span className="text-[9px] text-accent font-bold uppercase">Jupiter Feed</span>
          </div>

          <div className="flex flex-col gap-2.5 flex-1 justify-center">
            {trades.map((trade) => (
              <div key={trade.id} className="flex items-center justify-between text-xs py-1 border-b border-border/20 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-text-muted bg-bg-surface px-1.5 py-0.5 rounded border border-border/50">
                    {trade.wallet}
                  </span>
                  <span className={`font-bold ${trade.type === "buy" ? "text-buy" : "text-sell"}`}>
                    {trade.type === "buy" ? "BUY" : "SELL"}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-text-primary text-[11px]">{trade.amount}</div>
                  <div className="text-[9px] text-text-muted">{trade.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default MockTradingTerminal;
