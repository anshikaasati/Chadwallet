// app/(app)/trade/[tokenAddress]/page.tsx
import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { SOL_MINT } from "@/constants";
import TradingPageClient from "./TradingPageClient";

import { birdeye } from "@/services";

// Solana base58 mint address validator
const BASE58_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

interface TradePageProps {
  params: {
    tokenAddress: string;
  };
}

export async function generateMetadata({ params }: TradePageProps): Promise<Metadata> {
  const { tokenAddress } = params;
  const isAddressValid = BASE58_REGEX.test(tokenAddress);
  const displayAddress = isAddressValid ? tokenAddress : SOL_MINT;

  let symbol = "SOL";
  if (isAddressValid) {
    try {
      const info = await birdeye.getTokenOverview(displayAddress);
      if (info && info.symbol) {
        symbol = info.symbol;
      }
    } catch (err) {
      console.error("Failed to fetch token details for generateMetadata:", err);
    }
  }

  return {
    title: `Trade ${symbol} | ChadWallet`,
    description: `Solana DEX terminal. Track price details, live trade activity, and swap assets for ${symbol}.`,
  };
}


export default async function TradePage({ params }: TradePageProps): Promise<React.JSX.Element> {
  const { tokenAddress } = params;

  if (!BASE58_REGEX.test(tokenAddress)) {
    redirect(`/trade/${SOL_MINT}`);
  }

  return <TradingPageClient tokenAddress={tokenAddress} />;
}

