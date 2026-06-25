// components/trading/TokenInfoHeader/TokenInfoHeader.tsx
"use client";

import React, { useState } from "react";
import { TokenStats } from "@/types";
import { formatLargeNumber, formatPrice, formatPercent } from "@/lib/utils";
import { TokenLogo } from "@/components/shared/TokenLogo/TokenLogo";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { Button } from "@/components/ui/Button/Button";

export interface TokenInfoHeaderProps {
  tokenStats: TokenStats | null;
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
}

export function TokenInfoHeader({
  tokenStats,
  isLoading,
  error,
  onRetry,
}: TokenInfoHeaderProps): React.JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!tokenStats) return;
    navigator.clipboard.writeText(tokenStats.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (error) {
    return (
      <div className="p-5 bg-bg-surface border border-border rounded-xl text-sell font-semibold flex justify-between items-center gap-4 shadow-sm">
        <span>Error loading token details: {error.message || "Unknown error"}</span>
        {onRetry && (
          <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    );
  }


  if (isLoading) {
    return (
      <div className="p-5 bg-bg-surface border border-border rounded-xl flex items-center justify-between flex-wrap gap-4 h-24">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="w-32 h-5 rounded" />
            <Skeleton className="w-48 h-3 rounded" />
          </div>
        </div>
        <div className="flex gap-6 sm:gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="w-16 h-3 rounded" />
              <Skeleton className="w-20 h-5 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!tokenStats) {
    return (
      <div className="p-5 bg-bg-surface border border-border rounded-xl text-text-muted text-sm">
        No token details available.
      </div>
    );
  }

  const isPositive = tokenStats.priceChange24h >= 0;

  return (
    <div className="p-5 bg-[#0b1120]/45 border border-white/10 rounded-3xl flex items-center justify-between flex-wrap gap-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden">
      {/* Accent gradient top border */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent to-transparent" />
      
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-accent rounded-full opacity-20 blur-md" />
          <TokenLogo uri={tokenStats.logoUri} symbol={tokenStats.symbol} size={42} />
        </div>
        <div className="min-w-0 flex flex-col gap-1">
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2 truncate text-white leading-none">
            {tokenStats.name} 
            <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/5 text-text-muted border border-white/5">
              {tokenStats.symbol}
            </span>
          </h2>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-text-dim hover:text-accent-light font-mono select-none cursor-pointer text-left transition-colors group"
            title="Click to copy mint address"
          >
            <span className="truncate max-w-[120px] sm:max-w-none">
              {tokenStats.address}
            </span>
            {copied ? (
              <span className="text-[8px] text-buy font-black uppercase tracking-wider flex items-center gap-0.5 shrink-0 bg-buy/10 px-1.5 py-0.2 rounded-full border border-buy/25">
                ✓ Copied
              </span>
            ) : (
              <svg className="w-3.5 h-3.5 text-text-dim group-hover:text-accent-light transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full sm:grid-cols-3 md:flex md:flex-wrap items-center md:w-auto mt-4 md:mt-0 pt-4 border-t border-white/5 md:pt-0 md:border-t-0">
        {[
          { label: "Price", value: formatPrice(tokenStats.price), valClass: "text-white" },
          { label: "24h Change", value: formatPercent(tokenStats.priceChange24h), valClass: isPositive ? "text-buy" : "text-sell" },
          { label: "24h Volume", value: `$${formatLargeNumber(tokenStats.volume24h)}`, valClass: "text-white" },
          { label: "Market Cap", value: `$${formatLargeNumber(tokenStats.marketCap || 0)}`, valClass: "text-white" },
          { label: "Liquidity", value: `$${formatLargeNumber(tokenStats.liquidity)}`, valClass: "text-white" },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col min-w-[90px] hover:translate-y-[-1px] transition-transform duration-200">
            <span className="text-[9px] font-black text-text-dim uppercase tracking-wider mb-0.5">{stat.label}</span>
            <span className={`text-sm sm:text-base font-black font-mono leading-none ${stat.valClass}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TokenInfoHeader;

