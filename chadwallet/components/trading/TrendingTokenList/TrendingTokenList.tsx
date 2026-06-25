// components/trading/TrendingTokenList/TrendingTokenList.tsx
"use client";

import React from "react";
import { useSWRConfig } from "swr";
import { Token } from "@/types";
import { TokenLogo } from "@/components/shared/TokenLogo/TokenLogo";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { Button } from "@/components/ui/Button/Button";
import { INTERNAL_API } from "@/constants";
import { formatPrice, formatPercent } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

export interface TrendingTokenListProps {
  tokens: Token[];
  isLoading: boolean;
  error: Error | null;
  activeAddress: string;
  onSelectToken: (address: string) => void;
}

export function TrendingTokenList({
  tokens,
  isLoading,
  error,
  activeAddress,
  onSelectToken,
}: TrendingTokenListProps): React.JSX.Element {
  const { mutate } = useSWRConfig();

  const handleRetry = (): void => {
    mutate(INTERNAL_API.trending);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center border border-border rounded-lg bg-bg-surface h-full">
        <p className="text-sm text-sell font-semibold mb-3">Failed to load trending tokens</p>
        <Button variant="secondary" size="sm" onClick={handleRetry}>
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-1">
        <h3 className="font-bold text-sm uppercase tracking-wider text-text-muted mb-1">Trending</h3>
        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-3 p-2.5 border border-border/50 rounded-lg bg-bg-surface/50">
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-1.5">
              <Skeleton className="w-16 h-3.5 rounded" />
              <Skeleton className="w-24 h-2.5 rounded" />
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <Skeleton className="w-12 h-3 rounded" />
              <Skeleton className="w-8 h-2 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 text-center border border-border rounded-lg bg-bg-surface h-full text-text-muted text-sm">
        No trending tokens found
      </div>
    );
  }

  // Generate a mock sparkline based on token address hash and 24h change
  const getSimulatedSparkline = (address: string, change: number) => {
    // Generate simple stable hash from address string
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
      hash = address.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const points = [];
    const steps = 6;
    const isUp = change >= 0;
    
    for (let i = 0; i < steps; i++) {
      const x = (i / (steps - 1)) * 40;
      // Generate pseudo-random y with range, biased by change sign
      const seed = Math.abs(Math.sin(hash + i));
      const bias = isUp ? (i / steps) * 12 : -(i / steps) * 12;
      const y = 12 - (seed * 8 + bias); // bounded height
      points.push(`${x},${Math.max(2, Math.min(18, y))}`);
    }
    
    return points.join(" ");
  };

  return (
    <div className="p-1">
      <h3 className="font-extrabold text-xs uppercase tracking-wider text-text-muted mb-4 px-2 flex items-center gap-1.5">
        <TrendingUp className="w-4 h-4 text-accent-light" />
        Trending List
      </h3>
      <div className="flex flex-col gap-2.5">
        {tokens.map((token) => {
          const isActive = token.address === activeAddress;
          const isUp = token.priceChange24h >= 0;
          const sparkPoints = getSimulatedSparkline(token.address, token.priceChange24h);
          
          return (
            <button
              key={token.address}
              onClick={() => onSelectToken(token.address)}
              className={`w-full text-left p-3 rounded-2xl transition-all duration-300 border flex justify-between items-center gap-3 relative overflow-hidden group cursor-pointer ${
                isActive
                  ? "bg-accent/10 border-accent/60 text-white shadow-[0_0_15px_rgba(153,69,255,0.15)] pl-4"
                  : "bg-[#0b1120]/30 border-white/5 hover:bg-[#0b1120]/60 hover:border-white/10 hover:translate-x-0.5 text-text-muted"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent" />
              )}
              
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <TokenLogo uri={token.logoUri} symbol={token.symbol} size={28} />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-buy/20 border border-bg-surface flex items-center justify-center">
                    <span className={`w-1 h-1 rounded-full ${isUp ? "bg-buy" : "bg-sell"}`} />
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="font-black text-white text-xs tracking-wide truncate group-hover:text-accent-light transition-colors">{token.symbol}</div>
                  <div className="text-[10px] text-text-dim truncate max-w-[100px] mt-0.5">{token.name}</div>
                </div>
              </div>

              {/* Sparkline in the center-right */}
              <div className="hidden sm:block shrink-0 w-[40px] h-[20px] opacity-75 group-hover:opacity-100 transition-opacity">
                <svg className="w-full h-full" viewBox="0 0 40 20">
                  <polyline
                    fill="none"
                    stroke={isUp ? "#14F195" : "#FF5C5C"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={sparkPoints}
                  />
                </svg>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="font-mono font-bold text-xs text-white">
                  {formatPrice(token.price)}
                </div>
                <div className={`text-[10px] font-black font-mono mt-0.5 ${isUp ? "text-buy" : "text-sell"}`}>
                  {isUp ? "+" : ""}{formatPercent(token.priceChange24h)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TrendingTokenList;

