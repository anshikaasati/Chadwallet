// components/landing/MobileShowcase.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Apple, Play } from "lucide-react";
import { APP_STORE_ANDROID, APP_STORE_IOS } from "@/constants";

export function MobileShowcase(): React.JSX.Element {
  const { scrollY } = useScroll();
  const yParallax1 = useTransform(scrollY, [1200, 3000], [0, -50]);
  const yParallax2 = useTransform(scrollY, [1200, 3000], [0, 50]);

  return (
    <section id="download" className="w-full max-w-6xl py-16 sm:py-24 lg:py-32 px-5 sm:px-8 lg:px-6 mx-auto select-none relative z-10 overflow-hidden border-t border-white/5 bg-[#010816]">
      {/* Decorative Orbs */}
      <div className="absolute right-[10%] top-[30%] w-[400px] h-[400px] rounded-full bg-accent/5 opacity-30 blur-[130px] pointer-events-none" />
      <div className="absolute left-[10%] bottom-[10%] w-[300px] h-[300px] rounded-full bg-accent-light/5 opacity-20 blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Side: Mockups & 2 Floating screenshots */}
        <div className="lg:col-span-6 flex justify-center items-center relative min-h-[580px] order-2 lg:order-1">
          
          {/* Floating Screenshot Left */}
          <motion.div
            style={{ y: yParallax1 }}
            className="absolute left-[10px] top-[15%] w-[120px] md:w-[140px] rounded-2xl overflow-hidden border border-white/8 shadow-2xl z-20 hidden sm:block"
          >
            <Image
              src="/app store/discover.png"
              alt="App Screenshot Discover"
              width={140}
              height={294}
              className="object-cover"
            />
          </motion.div>

          {/* Floating Screenshot Right */}
          <motion.div
            style={{ y: yParallax2 }}
            className="absolute right-[20px] bottom-[15%] w-[120px] md:w-[140px] rounded-2xl overflow-hidden border border-white/8 shadow-2xl z-20 hidden sm:block"
          >
            <Image
              src="/app store/portfolio.png"
              alt="App Screenshot Portfolio"
              width={140}
              height={294}
              className="object-cover"
            />
          </motion.div>

          {/* Core CSS iPhone Mockup (Splash Screen) */}
          <div className="relative z-10 w-[265px] h-[540px] border-[9px] border-slate-950 rounded-[42px] bg-black shadow-[0_0_50px_rgba(44,242,122,0.15)] overflow-hidden ring-1 ring-white/10 flex flex-col justify-between">
            {/* iPhone Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4.5 bg-black rounded-full z-30 flex items-center justify-center border border-white/5">
              <div className="w-1.5 h-1.5 bg-slate-900 rounded-full ml-auto mr-2" />
            </div>

            {/* Screen Content - Splash Screen */}
            <div className="w-full h-full relative z-20 overflow-hidden bg-slate-950">
              <Image
                src="/app store/splash.png"
                alt="ChadWallet Splash"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-20" />
            </div>

            {/* Bottom Home Indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/20 rounded-full z-30" />
          </div>

          {/* Background Glow Ring */}
          <div className="absolute w-[320px] h-[320px] rounded-full border border-accent/10 opacity-15 pointer-events-none z-0" />
        </div>

        {/* Right Side: Copy & Download CTAs */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left order-1 lg:order-2">
          
          <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-black text-white tracking-tighter leading-none mb-6">
            Trade From Anywhere
          </h2>

          <p className="text-[18px] text-text-muted leading-relaxed mb-8 max-w-xl">
            Take the ultimate Solana trading terminal with you. Manage positions, track smart money wallets, and launch tokens straight from tweets on your phone.
          </p>

          <span className="text-[14px] text-text-dim font-bold block mb-4 uppercase tracking-wider">
            Available on iOS and Android
          </span>

          {/* Action Download Badges */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
            <motion.a
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={APP_STORE_IOS}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 h-14 bg-black border border-white/8 hover:border-accent rounded-2xl hover:shadow-[0_0_20px_rgba(44,242,122,0.15)] transition-all w-48 text-left cursor-pointer flex-shrink-0"
            >
              <Apple className="w-6 h-6 text-white fill-current" />
              <div className="flex flex-col">
                <span className="text-[9px] text-text-dim font-medium uppercase tracking-wider leading-none mb-1">
                  Download on the
                </span>
                <span className="text-sm font-extrabold text-white leading-none">
                  App Store
                </span>
              </div>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={APP_STORE_ANDROID}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 h-14 bg-black border border-white/8 hover:border-accent rounded-2xl hover:shadow-[0_0_20px_rgba(44,242,122,0.15)] transition-all w-48 text-left cursor-pointer flex-shrink-0"
            >
              <Play className="w-6 h-6 text-white fill-current" />
              <div className="flex flex-col">
                <span className="text-[9px] text-text-dim font-medium uppercase tracking-wider leading-none mb-1">
                  GET IT ON
                </span>
                <span className="text-sm font-extrabold text-white leading-none">
                  Google Play
                </span>
              </div>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MobileShowcase;
