// app/(marketing)/page.tsx
import React from "react";
import { Metadata } from "next";
import HeroSection from "@/components/landing/HeroSection";
import TokenBanner from "@/components/landing/TokenBanner";
import MobileShowcase from "@/components/landing/MobileShowcase";
import Footer from "@/components/landing/Footer";
import NavBar from "@/components/shared/NavBar";
import { 
  BuySellSection, 
  KolSection, 
  MemecoinLaunchSection, 
  TwitterTrendsSection, 
  AssetsSection,
  VideoShowcaseSection
} from "@/components/landing/MarketingSections";
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
          url: "/logo/dark.png",
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
    <div className="relative flex flex-col min-h-screen w-full bg-bg-primary overflow-x-hidden justify-between">
      {/* Top sticky banner */}
      <div className="sticky top-0 z-50 w-full bg-bg-primary">
        <TokenBanner direction="left" initialTokens={initialTokens} />
      </div>

      {/* Premium Navigation Header */}
      <NavBar />

      {/* Landing Page Content Sections */}
      <main className="flex-1 flex flex-col items-center z-10 w-full">
        {/* Hero Section */}
        <HeroSection />

        {/* Section 1: Buy & Sell Trending Tokens */}
        <BuySellSection />

        {/* Section 2: Follow KOL Traders */}
        <KolSection />

        {/* Section 3: Launch a Memecoin from a Tweet */}
        <MemecoinLaunchSection />

        {/* Section 4: Catch Early Trends on X */}
        <TwitterTrendsSection />

        {/* Section 5: Manage Your Assets */}
        <AssetsSection />

        {/* Video Showcase Section */}
        <VideoShowcaseSection />
        
        {/* Mobile Video Showcase (Download App section near footer) */}
        <MobileShowcase />
      </main>

      {/* Bottom sticky banner */}
      <div className="w-full">
        <TokenBanner direction="right" initialTokens={initialTokens} />
      </div>

      {/* Premium Footer */}
      <Footer />
    </div>
  );
}
