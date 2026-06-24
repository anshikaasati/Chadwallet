// components/trading/LiveTradesFeed/LiveTradesFeed.tsx
import React from "react";
import { Trade } from "@/types";

export interface LiveTradesFeedProps {
  trades: Trade[];
  isLoading: boolean;
  error: Error | null;
}

export function LiveTradesFeed({
  trades,
  isLoading,
  error,
}: LiveTradesFeedProps): React.JSX.Element {
  if (isLoading) return <div className="p-4 bg-bg-surface border border-border rounded-lg animate-pulse h-40" />;
  if (error) return <div className="p-4 bg-bg-surface border border-border rounded-lg text-sell">Error loading trades</div>;
  if (trades.length === 0) return <div className="p-4 bg-bg-surface border border-border rounded-lg text-text-muted">No live trades</div>;

  return (
    <div className="p-4 bg-bg-surface border border-border rounded-lg">
      <h3 className="font-bold text-lg mb-4 text-text-primary">Live Trades</h3>
      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
        {trades.map((trade) => (
          <div
            key={trade.txHash}
            className="flex justify-between items-center text-sm border-b border-border pb-2"
          >
            <div className="flex gap-2">
              <span className={`font-semibold ${trade.side === "buy" ? "text-buy" : "text-sell"}`}>
                {trade.side.toUpperCase()}
              </span>
              <span className="font-mono text-text-muted">{trade.wallet}</span>
            </div>
            <div className="flex gap-4">
              <span>{trade.amount.toLocaleString()}</span>
              <span className="text-text-muted">${trade.amountUsd.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default LiveTradesFeed;
