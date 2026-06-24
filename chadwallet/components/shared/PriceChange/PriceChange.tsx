// components/shared/PriceChange/PriceChange.tsx
import React from "react";
import Badge from "@/components/ui/Badge";

export interface PriceChangeProps {
  value: number;
  showSign?: boolean;
  className?: string;
}

export function PriceChange({
  value,
  showSign = true,
  className = "",
}: PriceChangeProps): React.JSX.Element {
  const isPositive = value > 0;
  const isNegative = value < 0;
  
  let variant: "positive" | "negative" | "neutral" = "neutral";
  if (isPositive) {
    variant = "positive";
  } else if (isNegative) {
    variant = "negative";
  }

  const absoluteValue = Math.abs(value).toFixed(2);
  const sign = isPositive && showSign ? "+" : isNegative ? "-" : "";
  const formattedValue = `${sign}${absoluteValue}%`;

  return (
    <Badge variant={variant} className={className}>
      {formattedValue}
    </Badge>
  );
}
export default PriceChange;
