// app/(marketing)/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HeroSection, TokenBanner, AppDownloadCTA, SignInButton } from "@/components/landing";
import { Token } from "@/types";

export default function LandingPage(): React.JSX.Element {
  const router = useRouter();

  // Stub data for initial compilation (will pull real SWR data in implementation phase)
  const dummyTokens: Token[] = [
    {
      address: "So11111111111111111111111111111111111111112",
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
    },
    {
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      symbol: "USDC",
      name: "USD Coin",
      logoUri: null,
      decimals: 6,
      price: 1.0,
      priceChange24h: 0.01,
      volume24h: 90000000,
      marketCap: 25000000000,
      liquidity: 50000000,
      chain: "solana",
    },
  ];

  const handleSignIn = () => {
    // TODO: Connect Privy login callback, on success route to trade page
    router.push("/trade/So11111111111111111111111111111111111111112");
  };

  return (
    <div className="w-full max-w-6xl px-4 py-8 flex flex-col gap-12 items-center">
      <TokenBanner tokens={dummyTokens} direction="left" />
      <HeroSection onSignInClick={handleSignIn} />
      <div className="flex flex-col sm:flex-row gap-8 w-full justify-center items-center">
        <SignInButton onClick={handleSignIn} />
        <AppDownloadCTA />
      </div>
      <TokenBanner tokens={dummyTokens} direction="right" />
    </div>
  );
}
