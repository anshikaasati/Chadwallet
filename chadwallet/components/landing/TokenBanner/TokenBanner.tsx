// components/landing/TokenBanner/TokenBanner.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Token } from "@/types";
import useTokenBanner from "@/hooks/useTokenBanner";
import TokenLogo from "@/components/shared/TokenLogo";
import PriceChange from "@/components/shared/PriceChange";
import Skeleton from "@/components/ui/Skeleton";

export interface TokenBannerProps {
  direction?: "left" | "right";
  initialTokens?: Token[];
}

export function TokenBanner({
  direction = "left",
  initialTokens,
}: TokenBannerProps): React.JSX.Element | null {
  const { tokens, isLoading, error } = useTokenBanner(initialTokens);

  // If there's an error, fail silently so we don't disrupt the landing page experience
  if (error) {
    return null;
  }

  // Loading state shows a beautiful row of Skeletons
  if (isLoading && tokens.length === 0) {
    return (
      <div className="w-full py-3 bg-bg-surface border-y border-border overflow-hidden">
        <div className="flex gap-6 px-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-32 shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (tokens.length === 0) {
    return null;
  }

  // Duplicate tokens list for seamless infinite looping
  const duplicatedTokens = [...tokens, ...tokens];
  const marqueeClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  const formatPrice = (price: number): string => {
    if (price < 1) {
      return price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      });
    }
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="w-full py-2 bg-bg-surface border-y border-border overflow-hidden select-none">
      <div className={`flex items-center gap-6 whitespace-nowrap pause-on-hover ${marqueeClass}`}>
        {duplicatedTokens.map((token, index) => {
          const uniqueKey = `${token.address}-${index}`;
          return (
            <React.Fragment key={uniqueKey}>
              <Link
                href={`/trade/${token.address}`}
                className="inline-flex items-center gap-3 py-1 px-4 min-h-[44px] hover:bg-bg-primary hover:bg-opacity-50 rounded-md transition-all shrink-0 cursor-pointer"
              >
                <TokenLogo uri={token.logoUri} symbol={token.symbol} size={24} />
                <span className="font-bold text-text-primary text-sm">{token.symbol}</span>
                <span className="text-text-muted text-sm font-medium">
                  {formatPrice(token.price)}
                </span>
                <PriceChange value={token.priceChange24h} showSign={true} />
              </Link>
              <span className="text-border font-bold text-lg select-none">•</span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
export default TokenBanner;
