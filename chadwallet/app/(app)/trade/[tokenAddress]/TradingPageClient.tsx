// app/(app)/trade/[tokenAddress]/TradingPageClient.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  useTrendingTokens,
  useTokenInfo,
  useHolders,
  useLiveTrades,
  useUserPosition,
} from "@/hooks";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import {
  TradingLayout,
  TrendingTokenList,
  TokenInfoHeader,
  PriceChart,
  HoldersList,
  LiveTradesFeed,
  UserPosition,
} from "@/components/trading";
import dynamic from "next/dynamic";

const SwapPanel = dynamic(() => import("@/components/trading/SwapPanel/SwapPanel"), {
  ssr: false,
  loading: () => (
    <div className="p-5 bg-bg-surface border border-border rounded-xl shadow-sm flex items-center justify-center h-48">
      <div className="text-text-muted text-sm font-semibold">Loading Swap Panel...</div>
    </div>
  ),
});

interface TradingPageClientProps {
  tokenAddress: string;
}

export function TradingPageClient({ tokenAddress }: TradingPageClientProps): React.JSX.Element {
  const router = useRouter();

  // Fetch SWR hook states
  const {
    tokens: trendingTokens,
    isLoading: isTrendingLoading,
    error: trendingError,
  } = useTrendingTokens();

  const {
    tokenInfo,
    isLoading: isTokenInfoLoading,
    error: tokenInfoError,
  } = useTokenInfo(tokenAddress);

  const {
    holders,
    isLoading: isHoldersLoading,
    error: holdersError,
  } = useHolders(tokenAddress);

  const {
    trades,
    isLoading: isTradesLoading,
    error: tradesError,
  } = useLiveTrades(tokenAddress);

  const {
    position,
    isLoading: isPositionLoading,
    error: positionError,
    mutate: mutatePosition,
  } = useUserPosition(tokenAddress);

  const handleSelectToken = (address: string): void => {
    router.push(`/trade/${address}`);
  };

  const handleSwapSuccess = (): void => {
    // Re-fetch position balance from Supabase database
    mutatePosition();
  };

  return (
    <TradingLayout
      trendingList={
        <TrendingTokenList
          tokens={trendingTokens}
          isLoading={isTrendingLoading}
          error={trendingError}
          activeAddress={tokenAddress}
          onSelectToken={handleSelectToken}
        />
      }
      tokenHeader={
        <TokenInfoHeader
          tokenStats={tokenInfo}
          isLoading={isTokenInfoLoading}
          error={tokenInfoError}
        />
      }
      priceChart={
        <ErrorBoundary>
          <PriceChart tokenAddress={tokenAddress} />
        </ErrorBoundary>
      }
      holdersList={
        <HoldersList
          holders={holders}
          isLoading={isHoldersLoading}
          error={holdersError}
        />
      }
      tradesFeed={
        <LiveTradesFeed
          trades={trades}
          isLoading={isTradesLoading}
          error={tradesError}
        />
      }
      swapPanel={
        <ErrorBoundary>
          <SwapPanel
            tokenAddress={tokenAddress}
            tokenSymbol={tokenInfo?.symbol || "TOKEN"}
            tokenDecimals={tokenInfo?.decimals || 9}
            currentPositionBalance={position?.balance || 0}
            onSwapSuccess={handleSwapSuccess}
          />
        </ErrorBoundary>
      }
      userPosition={
        <UserPosition
          position={position}
          isLoading={isPositionLoading}
          error={positionError}
          currentPrice={tokenInfo?.price}
        />
      }
    />
  );
}

export default TradingPageClient;

