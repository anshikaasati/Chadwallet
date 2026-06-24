// components/trading/UserPosition/UserPosition.tsx
import React from "react";
import { Position } from "@/types";

export interface UserPositionProps {
  position: Position | null;
  isLoading: boolean;
  error: Error | null;
}

export function UserPosition({
  position,
  isLoading,
  error,
}: UserPositionProps): React.JSX.Element {
  if (isLoading) return <div className="p-4 bg-bg-surface border border-border rounded-lg animate-pulse h-24" />;
  if (error) return <div className="p-4 bg-bg-surface border border-border rounded-lg text-sell">Error loading position</div>;
  if (!position || position.balance <= 0) {
    return (
      <div className="p-4 bg-bg-surface border border-border rounded-lg text-text-muted text-center text-sm">
        No active position for this token.
      </div>
    );
  }

  return (
    <div className="p-4 bg-bg-surface border border-border rounded-lg flex flex-col gap-2">
      <h3 className="font-bold text-sm text-text-muted uppercase">Your Position</h3>
      <div className="flex justify-between items-baseline">
        <span className="text-2xl font-bold font-mono">
          {position.balance.toLocaleString()}
        </span>
        <span className="text-text-muted text-sm">{position.tokenSymbol}</span>
      </div>
      <div className="flex justify-between text-xs text-text-muted">
        <span>Avg Entry:</span>
        <span className="font-mono">
          {position.avgEntryPrice ? `$${position.avgEntryPrice.toFixed(4)}` : "Unknown"}
        </span>
      </div>
    </div>
  );
}
export default UserPosition;
