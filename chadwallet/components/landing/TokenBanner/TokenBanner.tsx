// components/landing/TokenBanner/TokenBanner.tsx
import React from "react";
import { Token } from "@/types";

export interface TokenBannerProps {
  tokens: Token[];
  direction?: "left" | "right";
  speed?: number;
}

export function TokenBanner({
  tokens,
  ...props
}: TokenBannerProps): React.JSX.Element {
  const direction = props.direction || "left";
  const speed = props.speed || 30;

  return (
    <div className="relative w-full overflow-hidden py-4 bg-bg-surface border-y border-border">
      {/* Dynamic speed and direction logged for configuration */}
      <div 
        className="flex gap-8 items-center whitespace-nowrap animate-marquee"
        data-direction={direction}
        data-speed={speed}
      >
        {tokens.length === 0 ? (
          <div className="text-text-muted px-4">No tokens available...</div>
        ) : (
          tokens.map((token) => (
            <div key={token.address} className="inline-flex items-center gap-2">
              <span className="font-bold text-text-primary">{token.symbol}</span>
              <span className="text-text-muted">${token.price.toFixed(4)}</span>
              <span className={token.priceChange24h >= 0 ? "text-buy" : "text-sell"}>
                {token.priceChange24h >= 0 ? "+" : ""}
                {token.priceChange24h.toFixed(2)}%
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default TokenBanner;
