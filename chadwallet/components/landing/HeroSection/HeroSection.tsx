// components/landing/HeroSection/HeroSection.tsx
"use client";

import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Smartphone, ShieldCheck, Zap, Coins } from "lucide-react";
import { SOL_MINT } from "@/constants";

export function HeroSection(): React.JSX.Element {
  const { authenticated, login } = usePrivy();
  const router = useRouter();

  // Scroll parallax hook for floating background screenshots
  const { scrollY } = useScroll();
  const yParallax1 = useTransform(scrollY, [0, 600], [0, -60]);
  const yParallax2 = useTransform(scrollY, [0, 600], [0, 40]);
  const yParallax3 = useTransform(scrollY, [0, 600], [0, -80]);
  const yParallax4 = useTransform(scrollY, [0, 600], [0, 50]);

  const handleStartTrading = () => {
    if (authenticated) {
      router.push(`/trade/${SOL_MINT}`);
    } else {
      login();
    }
  };

  const handleScrollToShowcase = () => {
    const el = document.getElementById("showcase");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative flex items-center justify-center min-h-[calc(100vh-80px)] w-full py-16 px-6 sm:px-12 overflow-hidden bg-[#010816] select-none">
      {/* Background Neon Green Subtle Glow Orb */}
      <div className="absolute top-[20%] right-[-10%] w-[550px] h-[550px] rounded-full bg-accent/5 opacity-30 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-accent-light/5 opacity-20 blur-[120px] pointer-events-none z-0" />

      {/* Main Grid Content */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center z-10 relative">
        
        {/* Left Column: Typography and CTAs */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-[14px] font-extrabold text-accent uppercase tracking-wider mb-6"
          >
            Built for Solana Traders
          </motion.div>

          {/* Headline (80px target sizing) */}
          <h1 className="text-[44px] sm:text-[64px] lg:text-[80px] font-black text-white mb-6 tracking-tighter leading-[0.95] max-w-2xl">
            Trade Faster Than The Market.
          </h1>

          {/* Subheadline List (18px target sizing) */}
          <div className="flex flex-col gap-4 mb-10 text-[16px] md:text-[18px] text-text-muted font-bold max-w-xl">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
              <span>Buy trending tokens.</span>
            </div>
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
              <span>Follow smart money.</span>
            </div>
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
              <span>Launch memecoins.</span>
            </div>
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
              <span>Manage everything from one wallet.</span>
            </div>
          </div>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center lg:justify-start mb-12">
            <button
              onClick={handleStartTrading}
              className="px-8 py-4 bg-accent hover:bg-accent-light text-black font-black rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/15 hover:shadow-accent/25 flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer text-[16px] uppercase tracking-wide"
            >
              <span>Start Trading</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
            
            <button
              onClick={handleScrollToShowcase}
              className="px-8 py-4 bg-white/[0.03] border border-white/8 hover:border-white/20 hover:bg-white/[0.06] text-white font-extrabold rounded-xl transition-all w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer text-[16px]"
            >
              <span>Download App</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 pt-6 border-t border-white/5 w-full">
            <div className="flex items-center gap-2 text-[14px] font-black text-text-dim uppercase tracking-wider">
              <Zap className="w-4 h-4 text-accent" />
              Real-Time Data
            </div>
            <div className="flex items-center gap-2 text-[14px] font-black text-text-dim uppercase tracking-wider">
              <Coins className="w-4 h-4 text-accent-light" />
              Solana Native
            </div>
            <div className="flex items-center gap-2 text-[14px] font-black text-text-dim uppercase tracking-wider">
              <Smartphone className="w-4 h-4 text-accent" />
              Mobile First
            </div>
          </div>
        </div>

        {/* Right Column: Walkthrough Video Phone + Parallax Floating screenshots */}
        <div className="lg:col-span-5 w-full flex justify-center items-center relative min-h-[500px] md:min-h-[620px]">
          
          {/* Floating Screenshot 1 (Top Left) */}
          <motion.div
            style={{ y: yParallax1 }}
            className="absolute left-[-20px] top-[10%] w-[110px] md:w-[130px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl z-10 opacity-30 select-none pointer-events-none hidden md:block"
          >
            <Image
              src="/app store/discover.png"
              alt="Discover Preview"
              width={130}
              height={274}
              className="object-cover"
            />
          </motion.div>

          {/* Floating Screenshot 2 (Bottom Left) */}
          <motion.div
            style={{ y: yParallax2 }}
            className="absolute left-0 bottom-[10%] w-[110px] md:w-[130px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl z-10 opacity-25 select-none pointer-events-none hidden md:block"
          >
            <Image
              src="/app store/kol.png"
              alt="KOL Preview"
              width={130}
              height={274}
              className="object-cover"
            />
          </motion.div>

          {/* Floating Screenshot 3 (Top Right) */}
          <motion.div
            style={{ y: yParallax3 }}
            className="absolute right-[-10px] top-[15%] w-[110px] md:w-[130px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl z-10 opacity-25 select-none pointer-events-none hidden md:block"
          >
            <Image
              src="/app store/launch.png"
              alt="Launch Preview"
              width={130}
              height={274}
              className="object-cover"
            />
          </motion.div>

          {/* Floating Screenshot 4 (Bottom Right) */}
          <motion.div
            style={{ y: yParallax4 }}
            className="absolute right-0 bottom-[15%] w-[110px] md:w-[130px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl z-10 opacity-35 select-none pointer-events-none hidden md:block"
          >
            <Image
              src="/app store/portfolio.png"
              alt="Portfolio Preview"
              width={130}
              height={274}
              className="object-cover"
            />
          </motion.div>

          {/* Center Ultra-realistic iPhone Mockup with walkthrough video */}
          <div className="relative z-20 w-[255px] h-[520px] border-[9px] border-slate-950 rounded-[42px] bg-black shadow-[0_30px_60px_rgba(0,0,0,0.85)] overflow-hidden ring-1 ring-white/10 flex flex-col justify-between">
            {/* Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4.5 bg-black rounded-full z-30 flex items-center justify-center border border-white/5">
              <div className="w-1 h-1 bg-slate-900 rounded-full ml-auto mr-2" />
            </div>

            {/* Screen Content - Walkthrough Video */}
            <div className="w-full h-full relative z-20 overflow-hidden bg-slate-950">
              <video
                src="/chadwallet.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-20" />
            </div>

            {/* Bottom Home Indicator */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/20 rounded-full z-30" />
          </div>

          {/* Background Glow Ring */}
          <div className="absolute w-[310px] h-[310px] rounded-full border border-accent/10 opacity-15 pointer-events-none z-0" />
        </div>

      </div>
    </section>
  );
}

export default HeroSection;
