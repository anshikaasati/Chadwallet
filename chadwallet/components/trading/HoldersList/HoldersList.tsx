// components/trading/HoldersList/HoldersList.tsx
import React from "react";
import { Holder } from "@/types";

export interface HoldersListProps {
  holders: Holder[];
  isLoading: boolean;
  error: Error | null;
}

export function HoldersList({
  holders,
  isLoading,
  error,
}: HoldersListProps): React.JSX.Element {
  if (isLoading) return <div className="p-4 bg-bg-surface border border-border rounded-lg animate-pulse h-40" />;
  if (error) return <div className="p-4 bg-bg-surface border border-border rounded-lg text-sell">Error loading holders</div>;
  if (holders.length === 0) return <div className="p-4 bg-bg-surface border border-border rounded-lg text-text-muted">No holders found</div>;

  return (
    <div className="p-4 bg-bg-surface border border-border rounded-lg">
      <h3 className="font-bold text-lg mb-4 text-text-primary">Top Holders</h3>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-text-muted">
            <th className="py-2">Rank</th>
            <th className="py-2">Address</th>
            <th className="py-2 text-right">Amount</th>
            <th className="py-2 text-right">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {holders.map((holder) => (
            <tr key={holder.address} className="border-b border-border hover:bg-bg-primary">
              <td className="py-2">#{holder.rank}</td>
              <td className="py-2 font-mono">{holder.address}</td>
              <td className="py-2 text-right font-mono">{holder.amount.toLocaleString()}</td>
              <td className="py-2 text-right font-mono">{holder.percentage.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default HoldersList;
