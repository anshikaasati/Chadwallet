// components/trading/LiveTradesFeed/LiveTradesFeed.tsx
"use client";

import React from "react";
import { Trade } from "@/types";
import { formatAddress, formatNumberAbbreviated, formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { Button } from "@/components/ui/Button/Button";

export interface LiveTradesFeedProps {
  trades: Trade[];
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
}

export function LiveTradesFeed({
  trades,
  isLoading,
  error,
  onRetry,
}: LiveTradesFeedProps): React.JSX.Element {
  const formatTime = (ts: number): string => {
    const d = new Date(ts);
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  if (error) {
    return (
      <div className="p-5 bg-bg-surface border border-border rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
        <p className="text-sm text-sell font-semibold mb-3">Failed to load live trades</p>
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-5 bg-bg-surface border border-border rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="w-28 h-5 rounded" />
          <Skeleton className="w-16 h-3 rounded" />
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center py-0.5">
              <div className="flex gap-2">
                <Skeleton className="w-10 h-4 rounded" />
                <Skeleton className="w-16 h-4 rounded" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="w-20 h-4 rounded" />
                <Skeleton className="w-14 h-4 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="p-6 bg-bg-surface border border-border rounded-xl text-center text-text-muted text-sm shadow-sm">
        No recent trades recorded.
      </div>
    );
  }

  return (
    <div className="p-5 bg-bg-surface border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes trade-slide-in {
          from {
            background-color: var(--color-accent);
            background-opacity: 0.15;
            transform: translateY(-4px);
            opacity: 0;
          }
          to {
            background-color: transparent;
            transform: translateY(0);
            opacity: 1;
          }
        }
        .trade-row-new {
          animation: trade-slide-in 0.4s ease-out forwards;
        }
      `}} />

      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-2.5">
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-text-muted">Live Trade Activity</h3>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-buy animate-pulse" />
          <span className="text-[10px] font-bold text-buy uppercase">Real-Time</span>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[350px] overflow-y-auto pr-1">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/60 text-text-muted font-bold sticky top-0 bg-bg-surface z-10">
              <th className="py-2 pl-1">Time</th>
              <th className="py-2">Type</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Amount</th>
              <th className="py-2 text-right">Total USD</th>
              <th className="py-2 pr-1 text-right">Maker</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {trades.map((trade) => {
              const isBuy = trade.side === "buy";
              return (
                <tr
                  key={trade.txHash}
                  className="hover:bg-bg-primary/40 transition-colors trade-row-new"
                >
                  <td className="py-2.5 pl-1 font-mono text-text-muted">
                    {formatTime(trade.timestamp)}
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded font-extrabold text-[10px] uppercase ${
                        isBuy ? "bg-buy/10 text-buy border border-buy/20" : "bg-sell/10 text-sell border border-sell/20"
                      }`}
                    >
                      {trade.side}
                    </span>
                  </td>
                  <td className={`py-2.5 text-right font-mono font-semibold ${isBuy ? "text-buy" : "text-sell"}`}>
                    {formatPrice(trade.price)}
                  </td>
                  <td className="py-2.5 text-right font-mono font-semibold text-text-primary">
                    {formatNumberAbbreviated(trade.amount)}
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-text-primary">
                    {formatPrice(trade.amountUsd)}
                  </td>
                  <td className="py-2.5 pr-1 text-right font-mono">
                    <a
                      href={`https://solscan.io/tx/${trade.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-accent underline decoration-dotted transition-colors"
                      title={`View tx: ${trade.txHash}`}
                    >
                      {formatAddress(trade.wallet)}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LiveTradesFeed;

