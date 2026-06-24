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

  return (
    <div className="p-1">
      <h3 className="font-bold text-sm uppercase tracking-wider text-text-muted mb-3 px-2">Trending</h3>
      <div className="flex flex-col gap-2">
        {tokens.map((token) => {
          const isActive = token.address === activeAddress;
          return (
            <button
              key={token.address}
              onClick={() => onSelectToken(token.address)}
              className={`w-full text-left p-2.5 rounded-lg transition-all border flex justify-between items-center gap-3 ${
                isActive
                  ? "bg-accent/15 border-accent text-text-primary"
                  : "bg-bg-surface border-border/60 hover:bg-bg-surface/80 hover:border-border text-text-primary"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <TokenLogo uri={token.logoUri} symbol={token.symbol} size={28} />
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate">{token.symbol}</div>
                  <div className="text-xs text-text-muted truncate max-w-[120px]">{token.name}</div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-semibold text-sm">
                  {formatPrice(token.price)}
                </div>
                <div className={`text-xs font-bold ${token.priceChange24h >= 0 ? "text-buy" : "text-sell"}`}>
                  {formatPercent(token.priceChange24h)}
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

