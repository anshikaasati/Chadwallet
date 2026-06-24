// components/trading/PriceChart/PriceChart.tsx
import React from "react";

export interface PriceChartProps {
  tokenAddress: string;
}

export function PriceChart({ tokenAddress }: PriceChartProps): React.JSX.Element {
  return (
    <div className="w-full h-[400px] bg-bg-surface border border-border rounded-lg flex items-center justify-center">
      {/* TODO: Integrate TradingView Chart Widget here */}
      <span className="text-text-muted">TradingView Chart Stub for {tokenAddress}</span>
    </div>
  );
}
export default PriceChart;
