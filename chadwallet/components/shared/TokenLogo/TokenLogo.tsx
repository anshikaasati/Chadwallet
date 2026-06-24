// components/shared/TokenLogo/TokenLogo.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface TokenLogoProps {
  uri: string | null;
  symbol: string;
  size?: number;
}

export function TokenLogo({
  uri,
  symbol,
  size = 32,
}: TokenLogoProps): React.JSX.Element {
  const [error, setError] = useState(false);

  const firstLetter = symbol ? symbol.charAt(0).toUpperCase() : "?";

  const fallback = (
    <div
      style={{
        width: size,
        height: size,
        fontSize: size * 0.45,
      }}
      className="flex items-center justify-center rounded-full font-bold select-none bg-accent bg-opacity-20 text-accent border border-accent border-opacity-35"
    >
      {firstLetter}
    </div>
  );

  if (!uri || error) {
    return fallback;
  }

  return (
    <Image
      src={uri}
      alt={`${symbol} logo`}
      width={size}
      height={size}
      className="rounded-full object-cover"
      onError={() => setError(true)}
      unoptimized
    />
  );
}
export default TokenLogo;
