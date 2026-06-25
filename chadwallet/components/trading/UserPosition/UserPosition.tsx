import React from "react";
import { Position } from "@/types";
import { formatPrice, formatPercent } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { Wallet } from "lucide-react";

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
      <div className="p-5 bg-[#0b1120]/45 border border-white/10 rounded-3xl text-sell font-semibold text-sm shadow-lg backdrop-blur-xl">
        Error loading position: {error.message || "Unknown error"}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-5 bg-[#0b1120]/45 border border-white/10 rounded-3xl shadow-lg backdrop-blur-xl flex flex-col gap-3">
        <Skeleton className="w-24 h-4 rounded" />
        <Skeleton className="w-32 h-6 rounded" />
        <Skeleton className="w-full h-4 rounded" />
      </div>
    );
  }

  if (!position || position.balance <= 0) {
    return (
      <div className="p-6 bg-[#0b1120]/45 border border-white/10 rounded-3xl text-text-muted text-center flex flex-col items-center justify-center gap-3 shadow-lg backdrop-blur-xl">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-text-dim">
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-xs font-black text-white uppercase tracking-wider mb-1">No Active Position</span>
          <span className="block text-[10px] text-text-dim max-w-[200px]">You don&apos;t own any shares of this token yet. Buy above to open a position.</span>
        </div>
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
    <div className="p-5 bg-[#0b1120]/45 border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col gap-3.5 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
        <h3 className="font-extrabold text-[10px] uppercase tracking-wider text-text-muted">Your Position</h3>
        <span className="text-[8px] font-black text-accent uppercase bg-accent/15 px-2.5 py-0.5 rounded-full border border-accent/20">
          Active Holdings
        </span>
      </div>

      <div className="flex justify-between items-center py-1">
        <div>
          <div className="text-[9px] font-black text-text-dim uppercase tracking-wider mb-1">Balance</div>
          <div className="text-xl font-black font-mono text-white flex items-baseline gap-1 leading-none">
            {position.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })}
            <span className="text-[10px] font-extrabold text-text-dim font-sans">{position.tokenSymbol}</span>
          </div>
        </div>

        {price > 0 && (
          <div className="text-right">
            <div className="text-[9px] font-black text-text-dim uppercase tracking-wider mb-1">Value (USD)</div>
            <div className="text-xl font-black font-mono text-white leading-none">
              {formatPrice(valuation)}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-3.5 border-t border-white/5 text-xs items-center">
        <div>
          <span className="block text-[9px] font-black text-text-dim uppercase tracking-wider mb-1">Avg Entry</span>
          <span className="font-mono font-bold text-white">
            {avgEntry > 0 ? formatPrice(avgEntry) : "N/A"}
          </span>
        </div>

        {hasPnl && (
          <div className="text-right">
            <span className="block text-[9px] font-black text-text-dim uppercase tracking-wider mb-1">Unrealized PNL</span>
            <span className={`inline-block font-mono font-black text-[10px] px-2 py-0.5 rounded-full border ${
              isPnlPositive 
                ? "text-buy bg-buy/10 border-buy/20 shadow-[0_0_8px_rgba(20,241,149,0.15)]" 
                : "text-sell bg-sell/10 border-sell/20 shadow-[0_0_8px_rgba(255,92,92,0.15)]"
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

