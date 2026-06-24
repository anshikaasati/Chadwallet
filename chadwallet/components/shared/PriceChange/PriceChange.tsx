// components/shared/PriceChange/PriceChange.tsx
import React from "react";
import Badge from "@/components/ui/Badge";

import { formatPercent } from "@/lib/utils";

export interface PriceChangeProps {
  value: number;
  className?: string;
}

export function PriceChange({
  value,
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

  const formattedValue = formatPercent(value);

  return (
    <Badge variant={variant} className={className}>
      {formattedValue}
    </Badge>
  );
}
export default PriceChange;
