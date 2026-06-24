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
    <div className="p-5 bg-bg-surface/50 border border-border rounded-xl flex items-center justify-between flex-wrap gap-5 shadow-lg shadow-accent/[0.01] backdrop-blur-md relative overflow-hidden">
      {/* Top micro border-accent glow */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-accent rounded-full opacity-10 blur-sm" />
          <TokenLogo uri={tokenStats.logoUri} symbol={tokenStats.symbol} size={40} />
        </div>
        <div className="min-w-0 flex flex-col gap-0.5">
          <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2 truncate text-white leading-tight">
            {tokenStats.name} 
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-bg-primary text-text-muted border border-border">
              {tokenStats.symbol}
            </span>
          </h2>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent-light font-mono select-none cursor-pointer text-left transition-colors group"
            title="Click to copy mint address"
          >
            <span className="truncate max-w-[140px] sm:max-w-none">
              {tokenStats.address}
            </span>
            {copied ? (
              <span className="text-[9px] text-buy font-bold flex items-center gap-0.5 shrink-0 bg-buy/15 px-1 py-0.2 rounded border border-buy/20">
                ✓ Copied
              </span>
            ) : (
              <svg className="w-3.5 h-3.5 text-text-muted/50 group-hover:text-accent-light transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Price</span>
          <span className="text-lg font-extrabold text-text-primary">
            {formatPrice(tokenStats.price)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">24h Change</span>
          <span className={`text-lg font-extrabold ${isPositive ? "text-buy" : "text-sell"}`}>
            {formatPercent(tokenStats.priceChange24h)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">24h Volume</span>
          <span className="text-lg font-extrabold text-text-primary">
            ${formatLargeNumber(tokenStats.volume24h)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Market Cap</span>
          <span className="text-lg font-extrabold text-text-primary">
            ${formatLargeNumber(tokenStats.marketCap || 0)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Liquidity</span>
          <span className="text-lg font-extrabold text-text-primary">
            ${formatLargeNumber(tokenStats.liquidity)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TokenInfoHeader;

