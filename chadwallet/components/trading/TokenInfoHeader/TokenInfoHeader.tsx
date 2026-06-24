// components/trading/TokenInfoHeader/TokenInfoHeader.tsx
"use client";

import React from "react";
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
    <div className="p-5 bg-bg-surface border border-border rounded-xl flex items-center justify-between flex-wrap gap-5 shadow-sm">
      <div className="flex items-center gap-3.5 min-w-0">
        <TokenLogo uri={tokenStats.logoUri} symbol={tokenStats.symbol} size={40} />
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2 truncate">
            {tokenStats.name} 
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-bg-primary text-text-muted border border-border">
              {tokenStats.symbol}
            </span>
          </h2>
          <p className="text-xs text-text-muted font-mono truncate select-all" title="Click to copy address">
            {tokenStats.address}
          </p>
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

