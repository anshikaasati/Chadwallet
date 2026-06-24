// app/(marketing)/page.tsx
import React from "react";
import { Metadata } from "next";
import HeroSection from "@/components/landing/HeroSection";
import TokenBanner from "@/components/landing/TokenBanner";
import { birdeye } from "@/services";
import { Token } from "@/types";

export const revalidate = 15; // 15s ISR cache

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ChadWallet — Trade Solana Tokens Live",
    description: "The fastest Solana trading interface. Real-time prices, instant swaps.",
    openGraph: {
      title: "ChadWallet — Trade Solana Tokens Live",
      description: "The fastest Solana trading interface. Real-time prices, instant swaps.",
      images: [
        {
          url: "/chadwallet/logo.svg",
          width: 512,
          height: 512,
          alt: "ChadWallet Logo",
        },
      ],
    },
  };
}

async function getInitialBannerTokens(): Promise<Token[]> {

  try {
    const tokens = await birdeye.getBannerTokens();
    return tokens;
  } catch (err) {
    console.error("Failed to pre-fetch banner tokens on server side:", err);
    return [];
  }
}

export default async function LandingPage(): Promise<React.JSX.Element> {
  const initialTokens = await getInitialBannerTokens();

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-bg-primary overflow-hidden justify-between">
      {/* Top sticky banner */}
      <div className="sticky top-0 z-50 w-full">
        <TokenBanner direction="left" initialTokens={initialTokens} />
      </div>

      {/* Hero section floats in the middle */}
      <main className="flex-1 flex flex-col justify-center items-center z-10">
        <HeroSection />
      </main>

      {/* Bottom sticky banner */}
      <div className="sticky bottom-0 z-50 w-full">
        <TokenBanner direction="right" initialTokens={initialTokens} />
      </div>
    </div>
  );
}
