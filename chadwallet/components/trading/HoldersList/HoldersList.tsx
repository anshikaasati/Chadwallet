// components/trading/HoldersList/HoldersList.tsx
"use client";

import React from "react";
import { Holder } from "@/types";
import { formatAddress, formatNumberAbbreviated, formatPercent } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { Button } from "@/components/ui/Button/Button";

export interface HoldersListProps {
  holders: Holder[];
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
}

export function HoldersList({
  holders,
  isLoading,
  error,
  onRetry,
}: HoldersListProps): React.JSX.Element {
  if (error) {
    return (
      <div className="p-5 bg-bg-surface border border-border rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
        <p className="text-sm text-sell font-semibold mb-3">Failed to load token holders</p>
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
          <Skeleton className="w-24 h-5 rounded" />
          <Skeleton className="w-16 h-3 rounded" />
        </div>
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center py-1">
              <Skeleton className="w-8 h-4 rounded" />
              <Skeleton className="w-28 h-4 rounded" />
              <Skeleton className="w-20 h-4 rounded" />
              <Skeleton className="w-12 h-4 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (holders.length === 0) {
    return (
      <div className="p-6 bg-bg-surface border border-border rounded-xl text-center text-text-muted text-sm shadow-sm">
        No holders found for this token.
      </div>
    );
  }

  const topHolders = holders.slice(0, 20);

  return (
    <div className="p-5 bg-bg-surface/50 border border-border rounded-xl shadow-lg backdrop-blur-md flex flex-col overflow-hidden relative">
      {/* Top border ambient glow */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-2.5">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-text-muted">Top Holders (20)</h3>
        <span className="text-[10px] font-bold text-text-muted px-2 py-0.5 rounded bg-bg-primary border border-border">
          Solana Mainnet
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/60 text-text-muted font-bold text-[10px] uppercase tracking-wider">
              <th className="py-2.5 pl-1">Rank</th>
              <th className="py-2.5">Address</th>
              <th className="py-2.5 text-right">Balance</th>
              <th className="py-2.5 pr-1 text-right">Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {topHolders.map((holder, idx) => (
              <tr key={holder.address} className="hover:bg-bg-primary/40 transition-colors">
                <td className="py-2.5 pl-1 font-semibold text-text-muted">
                  {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                </td>
                <td className="py-2.5 font-mono">
                  <a
                    href={`https://solscan.io/account/${holder.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent underline decoration-dotted transition-colors"
                    title={holder.address}
                  >
                    {formatAddress(holder.address)}
                  </a>
                </td>
                <td className="py-2.5 text-right font-mono font-semibold text-text-primary">
                  {formatNumberAbbreviated(holder.amount)}
                </td>
                <td className="py-2.5 pr-1 text-right font-mono font-bold text-accent">
                  {formatPercent(holder.percentage, false)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HoldersList;

