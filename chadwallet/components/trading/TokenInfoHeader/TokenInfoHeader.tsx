// components/trading/TokenInfoHeader/TokenInfoHeader.tsx
import React from "react";
import { TokenStats } from "@/types";

export interface TokenInfoHeaderProps {
  tokenStats: TokenStats | null;
  isLoading: boolean;
  error: Error | null;
}

export function TokenInfoHeader({
  tokenStats,
  isLoading,
  error,
}: TokenInfoHeaderProps): React.JSX.Element {
  if (isLoading) return <div className="p-4 bg-bg-surface border border-border rounded-lg animate-pulse h-20" />;
  if (error) return <div className="p-4 bg-bg-surface border border-border rounded-lg text-sell">Error loading token info</div>;
  if (!tokenStats) return <div className="p-4 bg-bg-surface border border-border rounded-lg text-text-muted">No token selected</div>;

  return (
    <div className="p-4 bg-bg-surface border border-border rounded-lg flex justify-between items-center flex-wrap gap-4">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {tokenStats.name} <span className="text-text-muted text-sm">{tokenStats.symbol}</span>
        </h2>
        <p className="text-xs text-text-muted font-mono">{tokenStats.address}</p>
      </div>
      <div className="flex gap-6">
        <div>
          <div className="text-xs text-text-muted">Price</div>
          <div className="text-lg font-bold">${tokenStats.price.toFixed(4)}</div>
        </div>
        <div>
          <div className="text-xs text-text-muted">24h Change</div>
          <div className={`text-lg font-bold ${tokenStats.priceChange24h >= 0 ? "text-buy" : "text-sell"}`}>
            {tokenStats.priceChange24h >= 0 ? "+" : ""}
            {tokenStats.priceChange24h.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-xs text-text-muted">Market Cap</div>
          <div className="text-lg font-bold">
            {tokenStats.marketCap ? `$${(tokenStats.marketCap / 1000000).toFixed(2)}M` : "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}
export default TokenInfoHeader;
