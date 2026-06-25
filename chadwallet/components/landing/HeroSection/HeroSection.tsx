// components/landing/HeroSection/HeroSection.tsx
import React from "react";
import Image from "next/image";
import SignInButton from "@/components/landing/SignInButton";
import AppDownloadCTA from "@/components/landing/AppDownloadCTA";
import MockTradingTerminal from "./MockTradingTerminal";

export function HeroSection(): React.JSX.Element {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-120px)] w-full py-16 px-6 select-none overflow-hidden grid-bg">
      {/* Background Radial Glow */}
      <div className="absolute top-[30%] left-[50%] w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full bg-accent opacity-[0.06] blur-[120px] pointer-events-none z-0 animate-pulse-glow" />
      <div className="absolute top-[70%] left-[20%] w-[350px] h-[350px] rounded-full bg-buy opacity-[0.03] blur-[100px] pointer-events-none z-0" />

      {/* Main Grid Content */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center z-10 relative">
        
        {/* Left Column: Typography and CTAs */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Version/Beta Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-dim border border-accent/20 text-xs font-bold text-accent-light mb-6">
            <span className="w-2 h-2 rounded-full bg-buy animate-pulse" />
            ChadWallet DEX Terminal v1.0.0
          </div>

          {/* Typography */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.08] max-w-2xl">
            Trade Solana Tokens.{" "}
            <span className="bg-gradient-to-r from-accent via-accent-light to-fuchsia-400 bg-clip-text text-transparent">
              Live.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-text-muted max-w-xl mb-8 leading-relaxed font-medium">
            The ultimate high-performance trading wallet. Execute split-second swaps via Jupiter Routing, track real-time analytics, and secure your assets with Privy-powered social keys.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center lg:items-start gap-8 w-full">
            <div className="w-full sm:w-auto">
              <SignInButton />
            </div>
            
            <div className="border-t border-border/50 pt-6 w-full max-w-md flex flex-col items-center lg:items-start">
              <AppDownloadCTA />
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Mock Terminal */}
        <div className="hidden lg:flex lg:col-span-5 w-full justify-center items-center animate-float">
          <div className="w-full max-w-[460px] lg:max-w-none">
            <MockTradingTerminal />
          </div>
        </div>

      </div>
    </section>
  );
}

export default HeroSection;
