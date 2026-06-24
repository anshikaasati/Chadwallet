// components/shared/TokenLogo/TokenLogo.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface TokenLogoProps {
  logoUri: string | null;
  symbol: string;
  size?: number;
}

export function TokenLogo({
  logoUri,
  symbol,
  size = 24,
}: TokenLogoProps): React.JSX.Element {
  const [error, setError] = useState(false);

  const fallbackSvg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-muted bg-bg-surface rounded-full p-1 border border-border"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12M8 10h8M8 14h8" />
    </svg>
  );

  if (!logoUri || error) {
    return fallbackSvg;
  }

  return (
    <Image
      src={logoUri}
      alt={`${symbol} logo`}
      width={size}
      height={size}
      className="rounded-full object-cover"
      onError={() => setError(true)}
      unoptimized // SWR/BirdEye logos might be external, unoptimized allows bypass of domain config if needed
    />
  );
}
export default TokenLogo;
