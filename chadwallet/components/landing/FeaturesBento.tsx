// components/landing/FeaturesBento.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Zap, LineChart, Users, Coins, Wallet, TrendingUp } from "lucide-react";

interface BentoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  colSpan?: string;
}

function BentoCard({
  title,
  description,
  icon,
  imageSrc,
  imageAlt,
  colSpan = "col-span-1",
}: BentoCardProps) {
  const isWide = colSpan.includes("lg:col-span-8");

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-[24px] border border-white/5 bg-white/[0.02] p-6 flex flex-col justify-between group shadow-xl min-h-[280px] ${colSpan}`}
    >
      {/* Background Gradient Glow */}
      <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-accent/5 opacity-40 blur-[50px] group-hover:bg-accent-light/10 transition-all duration-500" />

      {/* Header */}
      <div className="z-10 mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-accent/40 group-hover:bg-accent-dim transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-black text-white mb-2 tracking-tight group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-xs text-text-muted leading-relaxed">
          {description}
        </p>
      </div>

      {/* Realistic Mini iPhone Mockup Shell */}
      <div className="relative mt-auto w-full h-[180px] overflow-hidden flex justify-center items-start pt-3">
        {isWide ? (
          // Two overlapping mini phone mockups for wide cards
          <div className="relative flex justify-center gap-6 w-full max-w-[320px]">
            <motion.div 
              whileHover={{ y: -4, rotate: -3 }}
              className="relative w-[115px] h-[220px] border-t-[5px] border-x-[5px] border-slate-950 rounded-t-[20px] overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.5)] bg-slate-950 ring-1 ring-white/10 flex-shrink-0"
            >
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-black rounded-full z-20" />
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="150px"
              />
            </motion.div>

            <motion.div 
              whileHover={{ y: -4, rotate: 3 }}
              className="relative w-[115px] h-[220px] border-t-[5px] border-x-[5px] border-slate-950 rounded-t-[20px] overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.5)] bg-slate-950 ring-1 ring-white/10 mt-2 flex-shrink-0"
            >
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-black rounded-full z-20" />
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="150px"
              />
            </motion.div>
          </div>
        ) : (
          // Centered single mockup for standard cards
          <div className="relative w-[130px] h-[240px] border-t-[6px] border-x-[6px] border-slate-950 rounded-t-[22px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-slate-950 ring-1 ring-white/10">
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-2 bg-black rounded-full z-20" />
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="150px"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function FeaturesBento(): React.JSX.Element {
  return (
    <section id="features-bento" className="w-full max-w-6xl py-16 sm:py-24 lg:py-32 px-5 sm:px-8 lg:px-6 mx-auto select-none relative z-10">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent-dim border border-accent/15 text-xs font-bold text-accent mb-6 uppercase tracking-wider">
          <LineChart className="w-3.5 h-3.5" />
          Product Specs
        </div>
        <h2 className="text-[32px] md:text-[44px] lg:text-[56px] font-black text-white mb-4 tracking-tighter leading-[1.05]">
          Everything you need to win.
        </h2>
        <p className="text-sm sm:text-base text-text-muted max-w-xl mx-auto leading-relaxed">
          ChadWallet pairs raw execution speed with institutional grade data layers, fully wrapped in a mobile-native experience.
        </p>
      </div>

      {/* Bento Grid (Desktop: 12-cols, Tablet: 2-cols, Mobile: 1-col) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 w-full">
        {/* Card 1: Instant Trading */}
        <BentoCard
          colSpan="col-span-1 sm:col-span-2 lg:col-span-8"
          title="Instant Trading"
          description="Execute instant swaps across Solana DEXs with smart routing, custom slippage protection, and MEV shield."
          icon={<Zap className="w-4 h-4 text-accent" />}
          imageSrc="/app store/token.png"
          imageAlt="Instant Trading Screenshot"
        />

        {/* Card 2: Trending Tokens */}
        <BentoCard
          colSpan="col-span-1 sm:col-span-1 lg:col-span-4"
          title="Trending Tokens"
          description="Monitor your balances, open positions, average entry prices, and historic performance in real-time."
          icon={<LineChart className="w-4 h-4 text-accent-light" />}
          imageSrc="/app store/portfolio.png"
          imageAlt="Trending Tokens Screenshot"
        />

        {/* Card 3: Smart Money */}
        <BentoCard
          colSpan="col-span-1 sm:col-span-1 lg:col-span-4"
          title="Smart Money"
          description="Inspect top traders' portfolios, performance scores, historic profit shares, and duplicate their moves."
          icon={<Users className="w-4 h-4 text-accent-blue" />}
          imageSrc="/app store/kol.png"
          imageAlt="Smart Money Screenshot"
        />

        {/* Card 4: Memecoin Launches */}
        <BentoCard
          colSpan="col-span-1 sm:col-span-2 lg:col-span-8"
          title="Memecoin Launches"
          description="Create and fund new Solana tokens directly from tweets. Configure metadata and secure smart launches in seconds."
          icon={<Coins className="w-4 h-4 text-accent" />}
          imageSrc="/app store/launch.png"
          imageAlt="Memecoin Launches Screenshot"
        />

        {/* Card 5: Portfolio Management */}
        <BentoCard
          colSpan="col-span-1 sm:col-span-1 lg:col-span-6"
          title="Portfolio Management"
          description="Send, receive, deposit, and withdraw assets easily with multi-wallet support and full security."
          icon={<Wallet className="w-4 h-4 text-accent-light" />}
          imageSrc="/app store/deposit.png"
          imageAlt="Portfolio Management Screenshot"
        />

        {/* Card 6: Market Intelligence */}
        <BentoCard
          colSpan="col-span-1 sm:col-span-1 lg:col-span-6"
          title="Market Intelligence"
          description="Stay ahead with real-time Twitter sentiment analysis, smart wallet buy tracking, and holder analysis."
          icon={<TrendingUp className="w-4 h-4 text-accent-blue" />}
          imageSrc="/app store/discover.png"
          imageAlt="Market Intelligence Screenshot"
        />
      </div>
    </section>
  );
}

export default FeaturesBento;
