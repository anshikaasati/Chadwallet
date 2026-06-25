// components/landing/MarketingSections.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Users, 
  Coins, 
  MessageSquare, 
  Wallet, 
  ArrowRight,
  TrendingUp,
  Activity,
  ShieldCheck,
  Compass
} from "lucide-react";

// Sliced Phone Mockup Frame Component
interface SlicedPhoneFrameProps {
  imageSrc: string;
  index: number; // 0 to 3
  className?: string;
  showText?: boolean;
  text?: string;
}

export function SlicedPhoneFrame({ 
  imageSrc, 
  index, 
  className = "", 
  showText = false, 
  text = "" 
}: SlicedPhoneFrameProps) {
  const backgroundPosition = `${(index * 100) / 3}% 100%`;
  const backgroundSize = "400% 116.13%";

  return (
    <div 
      className={`relative aspect-[960/1860] bg-no-repeat bg-contain flex-shrink-0 transition-transform duration-500 rounded-[28px] overflow-hidden border border-white/5 shadow-2xl ${className}`}
      style={{
        backgroundImage: `url(${imageSrc})`,
        backgroundPosition,
        backgroundSize,
      }}
    >
      {showText && text && (
        <div className="absolute top-5 left-0 right-0 text-center text-[13px] font-black text-black/80 tracking-tight z-20 pointer-events-none select-none px-4 leading-none">
          {text}
        </div>
      )}
    </div>
  );
}

// 1. Buy & Sell Trending Tokens (Interactive Journey)
export function BuySellSection() {
  const [activeStep, setActiveStep] = useState<number>(0);
  
  const steps = [
    { title: "01 Discover", desc: "Discover trending tokens in real time on the hotlist." },
    { title: "02 Analyze", desc: "Track live price actions, volume profiles, and liquidity pools." },
    { title: "03 Buy", desc: "Execute trades with optimal slippage routing in one click." },
    { title: "04 Manage Position", desc: "Monitor entry prices and manage open holdings live." }
  ];

  return (
    <section id="features" className="w-full py-32 bg-[#010816] border-t border-white/5 relative">
      {/* Progress Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-b from-accent to-transparent" />
      
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left: Content & Step Indicators */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
          <span className="text-[14px] font-extrabold text-accent uppercase tracking-wider mb-6 block">
            Core Trading
          </span>
          <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-black text-white tracking-tighter mb-6 leading-[1.05]">
            Buy & Sell Trending Tokens
          </h2>
          <p className="text-[18px] text-text-muted leading-relaxed mb-10 max-w-lg">
            Discover tokens. Analyze charts. Track positions. Execute trades instantly. Follow the exact journey from momentum alerts to position execution.
          </p>

          {/* Interactive Steps List */}
          <div className="flex flex-col gap-4 w-full text-left">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-300 w-full cursor-pointer flex gap-4 items-start ${
                    isActive 
                      ? "border-accent/30 bg-accent-dim/30 shadow-[0_0_20px_rgba(44,242,122,0.05)]" 
                      : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[12px] flex-shrink-0 mt-0.5 border ${
                    isActive 
                      ? "bg-accent border-accent text-black" 
                      : "bg-white/5 border-white/10 text-text-muted"
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className={`text-[16px] font-black leading-none mb-1 transition-colors ${
                      isActive ? "text-accent" : "text-white"
                    }`}>
                      {step.title}
                    </h4>
                    <p className="text-[13px] text-text-dim leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Journey Sliced Phone Frame */}
        <div className="lg:col-span-6 w-full flex justify-center items-center">
          <div className="relative w-full max-w-[320px] aspect-[960/1860]">
            {/* Ambient Back Glow */}
            <div className="absolute inset-0 bg-accent/5 blur-[80px] pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="relative z-10 w-full h-full"
              >
                <SlicedPhoneFrame 
                  imageSrc="/flow/buy-sell-4.png" 
                  index={activeStep} 
                  showText={true}
                  text="Buy & sell trending tokens"
                  className="w-full h-full shadow-[0_30px_60px_rgba(0,0,0,0.8)] hover:scale-105 duration-300" 
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}

// 2. Follow KOL Traders (Smart Money Progression Flow)
export function KolSection() {
  const screenshots = [
    { label: "Feed", desc: "Discover active whales" },
    { label: "Trader Profile", desc: "View trading style" },
    { label: "PnL Analytics", desc: "Audit historic net profit" },
    { label: "Trade Detail", desc: "Mirror transactions logs" }
  ];

  return (
    <section id="kols" className="w-full py-32 bg-[#030B1D] border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[14px] font-extrabold text-accent uppercase tracking-wider mb-6 inline-block">
            Social Intelligence
          </span>
          <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-black text-white tracking-tighter mb-4 leading-[1.05]">
            Follow Smart Money
          </h2>
          <p className="text-[18px] text-text-muted max-w-xl mx-auto leading-relaxed">
            Track the wallets and traders moving the market. Follow the logical flow from discovery to precise transaction audits.
          </p>
        </div>

        {/* progression Flex list with Visual Flow Arrows */}
        <div className="flex flex-row lg:flex-row items-center justify-start lg:justify-between gap-6 lg:gap-3 w-full overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory scrollbar-none pb-6 lg:pb-0 px-4 lg:px-0">
          {screenshots.map((screen, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center group w-[220px] lg:w-auto shrink-0 snap-center">
                {/* Sliced Phone mockup */}
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="mb-6 relative w-full flex justify-center"
                >
                  <SlicedPhoneFrame imageSrc="/flow/kol-4.png" index={idx} className="w-[170px] sm:w-[185px] lg:w-[215px] shadow-[0_20px_40px_rgba(0,0,0,0.7)]" />
                </motion.div>
                
                {/* Text tag */}
                <h4 className="text-[16px] font-black text-white mb-1 leading-none text-center">{screen.label}</h4>
                <span className="text-[12px] text-text-dim text-center">{screen.desc}</span>
              </div>

              {/* Flow Arrow (Hidden after the last item and on mobile screen sizes) */}
              {idx < 3 && (
                <div className="hidden lg:flex items-center justify-center text-accent/30 font-black text-[22px] shrink-0 py-4">
                  <ArrowRight className="w-5 h-5 text-accent animate-pulse" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

      </div>
    </section>
  );
}

// 3. Launch a Memecoin from a Tweet (Full Width Timeline Flow)
export function MemecoinLaunchSection() {
  const steps = [
    { title: "Tweet", desc: "Discover a viral meme trigger tweet on X." },
    { title: "Generate Token", desc: "Auto-generate metadata tags, images, and description." },
    { title: "Fund Launch", desc: "Configure allocation pool and fund launch liquidity." },
    { title: "Start Trading", desc: "Coin instantly launches live on DEXs for public swaps." }
  ];

  return (
    <section id="memecoins" className="w-full py-32 bg-[#010816] border-t border-white/5 relative overflow-hidden">
      {/* Background decoration grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-[14px] font-extrabold text-accent uppercase tracking-wider mb-6 inline-block">
            Viral Deployments
          </span>
          <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-black text-white tracking-tighter mb-4 leading-[1.05]">
            Launch a Memecoin From a Tweet
          </h2>
          <p className="text-[18px] text-text-muted max-w-xl mx-auto leading-relaxed">
            Turn social attention into tradable assets in minutes. The complete automated timeline from Twitter discovery to live trading terminal.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="flex flex-row lg:grid lg:grid-cols-4 gap-6 lg:gap-8 relative items-start overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory scrollbar-none pb-6 lg:pb-0 px-4 lg:px-0">
          
          {/* Horizontal timeline connect bar on desktop */}
          <div className="absolute top-[236px] left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-accent/20 via-accent/60 to-accent/20 pointer-events-none hidden lg:block z-0" />

          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center relative z-10 group w-[220px] lg:w-auto shrink-0 snap-center">
              {/* Phone mockup frame */}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="mb-6 relative z-10 w-full flex justify-center"
              >
                <SlicedPhoneFrame imageSrc="/flow/launch-4.png" index={idx} className="w-[170px] sm:w-[180px] lg:w-[210px] shadow-[0_20px_40px_rgba(0,0,0,0.7)]" />
              </motion.div>

              {/* Step indicator */}
              <div className="w-9 h-9 rounded-full bg-[#030B1D] border-2 border-accent text-accent font-black text-[13px] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(44,242,122,0.2)] group-hover:scale-110 transition-transform duration-300">
                {idx + 1}
              </div>

              {/* Title & Desc */}
              <h3 className="text-[18px] font-black text-white mb-2 leading-none">{step.title}</h3>
              <p className="text-[13px] text-text-dim leading-relaxed max-w-[210px]">{step.desc}</p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

// 4. Catch Early Trends on X (Radar / Intelligence Layer)
export function TwitterTrendsSection() {
  const points = [
    { title: "Intelligence Layer", desc: "Live NLP parses keywords, hashtags, and social sentiment indexes." },
    { title: "Market Signals", desc: "Bypasses the noise to detect high-velocity transaction triggers." },
    { title: "Trend Detection", desc: "Identifies early coin deployment spikes and social momentum curves." },
    { title: "Social Alpha", desc: "Tracks influencers, alpha accounts, and project creator updates." }
  ];

  return (
    <section className="w-full py-32 bg-[#030B1D] border-t border-white/5 relative overflow-hidden">
      
      {/* Animated Radar/Grid Backdrop */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-20 z-0">
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="80" stroke="var(--color-accent)" strokeWidth="0.5" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="55" stroke="var(--color-accent)" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="30" stroke="var(--color-accent)" strokeWidth="0.5" strokeDasharray="1 2" />
          <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(44, 242, 122, 0.15)" strokeWidth="0.5" />
          <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(44, 242, 122, 0.15)" strokeWidth="0.5" />
          {/* Pulsing indicator */}
          <motion.circle 
            cx="100" 
            cy="100" 
            r="10" 
            fill="var(--color-accent)" 
            opacity="0.2"
            animate={{ scale: [1, 4, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        
        {/* Left Content */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
          <span className="text-[14px] font-extrabold text-accent uppercase tracking-wider mb-6 block">
            Intelligence Layer
          </span>
          <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-black text-white tracking-tighter mb-6 leading-[1.05]">
            Catch Early Trends On X
          </h2>
          <p className="text-[18px] text-text-muted leading-relaxed mb-10 max-w-lg">
            Stay ahead of key social movements. Monitor social channels to capture alpha metrics, whale buy profiles, and launch correlations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left">
            {points.map((pt, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:border-accent/20 transition-all duration-300"
              >
                <h4 className="text-[16px] font-black text-white mb-2 leading-none flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {pt.title}
                </h4>
                <p className="text-[13px] text-text-dim leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right screenshots layered depth layout */}
        <div className="lg:col-span-6 flex justify-center items-center relative min-h-[500px]">
          
          <div className="relative w-full max-w-[420px] h-[480px] flex items-center justify-center">
            {/* Phone 1 (Back Left) */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 top-10 z-10 w-[125px] sm:w-[155px] md:w-[180px] opacity-40 select-none pointer-events-none hidden sm:block"
            >
              <SlicedPhoneFrame imageSrc="/flow/memecoin-4.png" index={1} className="w-full" />
            </motion.div>

            {/* Phone 2 (Back Right) */}
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute right-0 bottom-10 z-10 w-[125px] sm:w-[155px] md:w-[180px] opacity-40 select-none pointer-events-none hidden sm:block"
            >
              <SlicedPhoneFrame imageSrc="/flow/memecoin-4.png" index={2} className="w-full" />
            </motion.div>

            {/* Phone 3 (Center Front) */}
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute z-20 w-[150px] sm:w-[180px] md:w-[210px] shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
            >
              <SlicedPhoneFrame imageSrc="/flow/memecoin-4.png" index={0} className="w-full" />
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}

// 5. Manage Your Assets Section (Central primary visual with orbiting screenshots)
export function AssetsSection() {
  const operations = [
    { title: "Send Assets", desc: "Verify and send tokens instantly to any Solana wallet address." },
    { title: "Receive Assets", icon: "Receive", desc: "Display secure QR codes or copy address strings to request tokens." },
    { title: "Deposit / Withdraw", desc: "Bridge liquidity from other chains or withdraw instantly." }
  ];

  return (
    <section id="portfolio" className="w-full py-32 bg-[#010816] border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left: Central portfolio phone with orbiting screenshots */}
        <div className="lg:col-span-7 flex justify-center items-center relative min-h-[520px]">
          
          <div className="relative w-full max-w-[420px] h-[480px] flex items-center justify-center">
            
            {/* Orbiting Phone Left (Send) */}
            <motion.div 
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[-20px] sm:left-[-40px] top-[12%] z-10 w-[100px] sm:w-[130px] md:w-[155px] opacity-40 shadow-xl border border-white/5 rounded-[24px] overflow-hidden hidden sm:block"
            >
              <SlicedPhoneFrame imageSrc="/flow/portfolio-4.png" index={1} className="w-full" />
            </motion.div>

            {/* Orbiting Phone Right (Receive/Deposit) */}
            <motion.div 
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute right-[-20px] sm:right-[-40px] bottom-[12%] z-10 w-[100px] sm:w-[130px] md:w-[155px] opacity-40 shadow-xl border border-white/5 rounded-[24px] overflow-hidden hidden sm:block"
            >
              <SlicedPhoneFrame imageSrc="/flow/portfolio-4.png" index={2} className="w-full" />
            </motion.div>

            {/* Primary Visual Phone: Portfolio index 0 (Center) */}
            <SlicedPhoneFrame 
              imageSrc="/flow/portfolio-4.png" 
              index={0} 
              className="w-[155px] sm:w-[190px] md:w-[220px] scale-110 z-20 shadow-[0_30px_70px_rgba(0,0,0,0.85)]" 
            />

          </div>

        </div>

        {/* Right Content */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
          <span className="text-[14px] font-extrabold text-accent uppercase tracking-wider mb-6 block">
            Portfolio Security
          </span>
          <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-black text-white tracking-tighter mb-6 leading-[1.05]">
            Everything In One Wallet
          </h2>
          <p className="text-[18px] text-text-muted leading-relaxed mb-10 max-w-lg">
            Send. Receive. Deposit. Withdraw. Manage your portfolio from one place. Audit token splits and historic balances inside a clean, high-density asset dashboard.
          </p>

          <div className="flex flex-col gap-4 w-full">
            {operations.map((op, idx) => (
              <div 
                key={idx} 
                className="flex gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.01] text-left hover:bg-white/[0.03] transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-accent font-black text-[12px]">
                  0{idx + 1}
                </div>
                <div>
                  <h4 className="text-[16px] font-black text-white mb-1.5 leading-none">
                    {op.title}
                  </h4>
                  <p className="text-[13px] text-text-dim leading-relaxed">
                    {op.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

// 6. See ChadWallet In Action (Autoplay walkthrough video with synced clickable chips)
export function VideoShowcaseSection() {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const chips = [
    { label: "0:05 Discover Tokens", start: 0, end: 8, seekTo: 5 },
    { label: "0:12 Follow KOLs", start: 8, end: 15, seekTo: 12 },
    { label: "0:20 Launch Coin", start: 15, end: 24, seekTo: 20 },
    { label: "0:28 Trade", start: 24, end: 32, seekTo: 28 },
    { label: "0:35 Portfolio", start: 32, end: 100, seekTo: 35 }
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const handleChipClick = (seekSeconds: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = seekSeconds;
      video.play().catch(() => {});
    }
  };

  return (
    <section className="w-full py-32 bg-[#030B1D] border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[14px] font-extrabold text-accent uppercase tracking-wider mb-6 inline-block">
            Product Walkthrough
          </span>
          <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-black text-white tracking-tighter mb-4 leading-[1.05]">
            See ChadWallet In Action
          </h2>
          <p className="text-[18px] text-text-muted max-w-xl mx-auto leading-relaxed">
            Watch how traders discover, launch and trade faster. Click on chips below to jump directly to product features.
          </p>
        </div>

        {/* Large iPhone Mockup playing `/chadwallet.mp4` */}
        <div className="relative w-[285px] h-[580px] border-[10px] border-slate-950 rounded-[44px] bg-black shadow-[0_30px_70px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/10 flex flex-col justify-between mb-12">
          {/* Notch */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-center border border-white/5">
            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full ml-auto mr-2" />
          </div>

          {/* Screen Content - Walkthrough Video */}
          <div className="w-full h-full relative z-20 overflow-hidden bg-slate-950">
            <video
              ref={videoRef}
              src="/chadwallet.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-20" />
          </div>

          {/* Bottom Home Indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/20 rounded-full z-30" />
        </div>

        {/* Synchronized clickable Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 max-w-2xl">
          {chips.map((chip, idx) => {
            const isActive = currentTime >= chip.start && currentTime < chip.end;
            return (
              <button
                key={idx}
                onClick={() => handleChipClick(chip.seekTo)}
                className={`px-5 py-3 rounded-full text-[14px] font-black tracking-wide border transition-all cursor-pointer ${
                  isActive 
                    ? "bg-accent border-accent text-black shadow-[0_0_15px_rgba(44,242,122,0.25)] scale-105" 
                    : "bg-white/[0.02] border-white/5 text-text-muted hover:text-white hover:border-white/15"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
