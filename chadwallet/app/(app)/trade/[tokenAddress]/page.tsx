// app/(app)/trade/[tokenAddress]/page.tsx
"use client";

import React from "react";
import {
  TradingLayout,
  TrendingTokenList,
  TokenInfoHeader,
  PriceChart,
  HoldersList,
  LiveTradesFeed,
  SwapPanel,
  UserPosition,
} from "@/components/trading";
import { TokenStats } from "@/types";

interface TradePageProps {
  params: {
    tokenAddress: string;
  };
}

export default function TradePage({ params }: TradePageProps): React.JSX.Element {
  const { tokenAddress } = params;

  // Stub data for rendering compilation check
  const dummyStats: TokenStats = {
    address: tokenAddress,
    symbol: "SOL",
    name: "Solana",
    logoUri: null,
    decimals: 9,
    price: 150.0,
    priceChange24h: 5.25,
    volume24h: 120000000,
    marketCap: 70000000000,
    liquidity: 15000000,
    chain: "solana",
    holders: 100000,
    trades24h: 50000,
    buyVolume24h: 550000.0,
    sellVolume24h: 450000.0,
    fdv: 80000000000.0,
  };

  const handleSelectToken = (address: string) => {
    console.log("Token selected:", address);
    // Future: router.push(`/trade/${address}`)
  };

  return (
    <TradingLayout
      leftColumn={
        <TrendingTokenList
          tokens={[]}
          isLoading={false}
          error={null}
          onSelectToken={handleSelectToken}
        />
      }
      middleColumn={
        <div className="flex flex-col gap-4">
          <TokenInfoHeader tokenStats={dummyStats} isLoading={false} error={null} />
          <PriceChart tokenAddress={tokenAddress} />
          <HoldersList holders={[]} isLoading={false} error={null} />
          <LiveTradesFeed trades={[]} isLoading={false} error={null} />
        </div>
      }
      rightColumn={
        <div className="flex flex-col gap-4">
          <SwapPanel tokenAddress={tokenAddress} tokenSymbol="SOL" />
          <UserPosition position={null} isLoading={false} error={null} />
        </div>
      }
    />
  );
}
