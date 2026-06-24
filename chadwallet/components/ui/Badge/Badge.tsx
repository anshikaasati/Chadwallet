// components/ui/Badge/Badge.tsx
import React from "react";

export interface BadgeProps {
  variant?: "positive" | "negative" | "neutral";
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "neutral",
  children,
  className = "",
}: BadgeProps): React.JSX.Element {
  const baseStyle = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold select-none";
  const variantStyles = {
    positive: "bg-buy bg-opacity-15 text-buy",
    negative: "bg-sell bg-opacity-15 text-sell",
    neutral: "bg-bg-surface text-text-muted border border-border",
  };

  return (
    <span className={`${baseStyle} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
export default Badge;
