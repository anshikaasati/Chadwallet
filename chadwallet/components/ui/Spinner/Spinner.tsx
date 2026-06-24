// components/ui/Spinner/Spinner.tsx
import React from "react";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({
  size = "md",
  className = "",
}: SpinnerProps): React.JSX.Element {
  const sizeMap = {
    sm: 16,
    md: 32,
    lg: 48,
  };

  const px = sizeMap[size];

  return (
    <>
      <svg
        className={`animate-spin ${className}`}
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="status"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="var(--color-accent)"
          strokeWidth="3"
          strokeDasharray="40 100"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </>
  );
}
export default Spinner;
