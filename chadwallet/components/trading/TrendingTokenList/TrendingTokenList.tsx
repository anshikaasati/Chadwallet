// components/trading/TrendingTokenList/TrendingTokenList.tsx
import React from "react";
import { Token } from "@/types";

export interface TrendingTokenListProps {
  tokens: Token[];
  isLoading: boolean;
  error: Error | null;
  onSelectToken: (_address: string) => void;
}

export function TrendingTokenList({
  tokens,
  isLoading,
  error,
  onSelectToken,
}: TrendingTokenListProps): React.JSX.Element {
  if (isLoading) return <div>Loading trending...</div>;
  if (error) return <div>Error loading trending</div>;
  if (tokens.length === 0) return <div>No trending tokens</div>;

  return (
    <div>
      <h3 className="font-bold text-lg mb-4 text-text-primary">Trending</h3>
      <div className="flex flex-col gap-2">
        {tokens.map((token) => (
          <button
            key={token.address}
            onClick={() => onSelectToken(token.address)}
            className="w-full text-left p-2 rounded-md hover:bg-bg-primary transition border border-transparent hover:border-border flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{token.symbol}</div>
              <div className="text-xs text-text-muted">{token.name}</div>
            </div>
            <div className="text-right">
              <div>${token.price.toFixed(4)}</div>
              <div className={token.priceChange24h >= 0 ? "text-buy text-xs" : "text-sell text-xs"}>
                {token.priceChange24h >= 0 ? "+" : ""}
                {token.priceChange24h.toFixed(2)}%
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
export default TrendingTokenList;
