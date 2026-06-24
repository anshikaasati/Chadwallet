// components/shared/PriceChange/PriceChange.tsx
import React from "react";

export interface PriceChangeProps {
  value: number;
  className?: string;
}

export function PriceChange({ value, className = "" }: PriceChangeProps): React.JSX.Element {
  const isPositive = value >= 0;
  const colorClass = isPositive ? "text-buy" : "text-sell";
  const formattedValue = `${isPositive ? "+" : ""}${value.toFixed(2)}%`;

  return (
    <span className={`font-semibold ${colorClass} ${className}`}>
      {formattedValue}
    </span>
  );
}
export default PriceChange;
