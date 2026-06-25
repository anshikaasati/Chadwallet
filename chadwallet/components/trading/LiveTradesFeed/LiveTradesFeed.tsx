import React from "react";
import { Trade } from "@/types";
import { formatAddress, formatNumberAbbreviated, formatPrice, formatRelativeTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { Button } from "@/components/ui/Button/Button";
import { Activity } from "lucide-react";

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
  if (error) {
    return (
      <div className="p-5 bg-[#0b1120]/45 border border-white/10 rounded-3xl flex flex-col items-center justify-center text-center shadow-lg backdrop-blur-xl">
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
      <div className="p-5 bg-[#0b1120]/45 border border-white/10 rounded-3xl shadow-lg backdrop-blur-xl">
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
      <div className="p-6 bg-[#0b1120]/45 border border-white/10 rounded-3xl text-center text-text-muted text-sm shadow-lg backdrop-blur-xl">
        No recent trades recorded.
      </div>
    );
  }

  return (
    <div className="p-5 bg-[#0b1120]/45 border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes trade-slide-in {
          from {
            background-color: rgba(153, 69, 255, 0.15);
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
        /* Explicit column-hiding helper rules for responsiveness */
        @media (max-width: 767px) {
          .hide-column-mobile {
            display: none !important;
          }
        }
        @media (max-width: 1023px) {
          .hide-column-tablet {
            display: none !important;
          }
        }
      `}} />

      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2.5">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-text-muted flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-accent-light" />
          Live Trade Feed
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-buy animate-pulse" />
          <span className="text-[9px] font-black text-buy uppercase tracking-wider">Real-Time</span>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/5 text-text-dim font-bold text-[9px] uppercase tracking-wider sticky top-0 bg-bg-surface z-10">
              <th className="py-2.5 pl-1">Time</th>
              <th className="py-2.5">Type</th>
              <th className="py-2.5 text-right">Price</th>
              <th className="py-2.5 text-right">Amount</th>
              <th className="py-2.5 text-right hide-column-mobile">Total USD</th>
              <th className="py-2.5 pr-1 text-right hide-column-tablet">Maker</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {trades.map((trade) => {
              const isBuy = trade.side === "buy";
              return (
                <tr
                  key={trade.txHash}
                  className="hover:bg-white/[0.02] transition-colors trade-row-new"
                >
                  <td className="py-2.5 pl-1 font-mono text-text-dim">
                    {formatRelativeTime(trade.timestamp)}
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wide ${
                        isBuy 
                          ? "bg-buy/10 text-buy border border-buy/20 shadow-[0_0_8px_rgba(20,241,149,0.1)]" 
                          : "bg-sell/10 text-sell border border-sell/20 shadow-[0_0_8px_rgba(255,92,92,0.1)]"
                      }`}
                    >
                      {trade.side}
                    </span>
                  </td>
                  <td className={`py-2.5 text-right font-mono font-bold ${isBuy ? "text-buy" : "text-sell"}`}>
                    {formatPrice(trade.price)}
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-white">
                    {formatNumberAbbreviated(trade.amount)}
                  </td>
                  <td className="py-2.5 text-right font-mono font-extrabold text-white hide-column-mobile">
                    {formatPrice(trade.amountUsd)}
                  </td>
                  <td className="py-2.5 pr-1 text-right font-mono hide-column-tablet">
                    <a
                      href={`https://solscan.io/tx/${trade.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-accent-light underline decoration-dotted transition-colors"
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

