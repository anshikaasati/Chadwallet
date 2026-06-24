// components/trading/UserPosition/UserPosition.tsx
"use client";

import React from "react";
import { Position } from "@/types";
import { formatPrice, formatPercent } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";

export interface UserPositionProps {
  position: Position | null;
  isLoading: boolean;
  error: Error | null;
  currentPrice?: number;
}

export function UserPosition({
  position,
  isLoading,
  error,
  currentPrice,
}: UserPositionProps): React.JSX.Element {
  if (error) {
    return (
      <div className="p-5 bg-bg-surface border border-border rounded-xl text-sell font-semibold text-sm">
        Error loading position: {error.message || "Unknown error"}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-5 bg-bg-surface border border-border rounded-xl shadow-sm flex flex-col gap-3">
        <Skeleton className="w-24 h-4 rounded" />
        <Skeleton className="w-32 h-6 rounded" />
        <Skeleton className="w-full h-4 rounded" />
      </div>
    );
  }

  if (!position || position.balance <= 0) {
    return (
      <div className="p-5 bg-bg-surface border border-border rounded-xl text-text-muted text-center text-xs shadow-sm">
        No active position for this token.
      </div>
    );
  }

  const price = currentPrice || 0;
  const valuation = position.balance * price;
  const avgEntry = position.avgEntryPrice || 0;

  const hasPnl = avgEntry > 0 && price > 0;
  const pnlUsd = hasPnl ? (price - avgEntry) * position.balance : 0;
  const pnlPercent = hasPnl ? ((price - avgEntry) / avgEntry) * 100 : 0;
  const isPnlPositive = pnlUsd >= 0;

  return (
    <div className="p-5 bg-bg-surface/50 border border-border rounded-xl shadow-lg backdrop-blur-md flex flex-col gap-3 relative overflow-hidden">
      {/* Top border ambient glow */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
        <h3 className="font-extrabold text-[10px] uppercase tracking-wider text-text-muted">Your Position</h3>
        <span className="text-[9px] font-bold text-accent uppercase bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
          Active Holdings
        </span>
      </div>

      <div className="flex justify-between items-center py-1">
        <div>
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Balance</div>
          <div className="text-xl font-extrabold font-mono text-text-primary flex items-baseline gap-1">
            {position.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })}
            <span className="text-xs font-semibold text-text-muted font-sans">{position.tokenSymbol}</span>
          </div>
        </div>

        {price > 0 && (
          <div className="text-right">
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Value (USD)</div>
            <div className="text-xl font-extrabold font-mono text-white">
              {formatPrice(valuation)}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40 text-xs items-center">
        <div>
          <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Avg Entry</span>
          <span className="font-mono font-semibold text-text-primary">
            {avgEntry > 0 ? formatPrice(avgEntry) : "N/A"}
          </span>
        </div>

        {hasPnl && (
          <div className="text-right">
            <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Unrealized PNL</span>
            <span className={`inline-block font-mono font-extrabold text-[11px] px-2 py-0.5 rounded-lg border ${
              isPnlPositive 
                ? "text-buy bg-buy/10 border-buy/20 shadow-md shadow-buy/5" 
                : "text-sell bg-sell/10 border-sell/20 shadow-md shadow-sell/5"
            }`}>
              {isPnlPositive ? "▲ +" : "▼ -"}{formatPrice(Math.abs(pnlUsd))} ({formatPercent(pnlPercent)})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserPosition;

