// components/landing/HeroSection/HeroSection.tsx
import React from "react";
import Image from "next/image";
import SignInButton from "@/components/landing/SignInButton";
import AppDownloadCTA from "@/components/landing/AppDownloadCTA";

export function HeroSection(): React.JSX.Element {
  return (
    <section className="relative flex flex-col items-center justify-center text-center min-h-[calc(100vh-112px)] py-12 px-4 select-none overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-accent opacity-[0.07] blur-[100px] pointer-events-none z-0" />

      {/* Logo container with ambient backdrop glow */}
      <div className="relative mb-6 z-10">
        <div className="absolute inset-0 bg-accent rounded-full opacity-[0.12] blur-md filter scale-105 pointer-events-none" />
        <Image
          src="/chadwallet/logo.svg"
          alt="ChadWallet Logo"
          width={120}
          height={120}
          className="relative drop-shadow-[0_0_15px_rgba(124,58,237,0.35)] transition-all duration-300"
          priority
        />
      </div>

      {/* Typography */}
      <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight leading-tight max-w-4xl z-10">
        Trade Solana Tokens. <span className="text-accent">Live.</span>
      </h1>
      <p className="text-base md:text-lg text-text-muted max-w-2xl mb-10 z-10 leading-relaxed font-medium">
        Instantly track, monitor, and execute Solana swaps with real-time analytics and Privy-powered security.
      </p>

      {/* Interaction Blocks */}
      <div className="flex flex-col gap-8 items-center justify-center w-full z-10">
        <SignInButton />
        <AppDownloadCTA />
      </div>
    </section>
  );
}
export default HeroSection;
