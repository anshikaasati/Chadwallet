// components/shared/NavBar/NavBar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const WalletButton = dynamic(() => import("../WalletButton"), {
  ssr: false,
  loading: () => (
    <button className="px-4 py-2 bg-accent/40 text-text-primary/70 font-bold rounded-xl text-sm disabled:opacity-50 border border-white/5 animate-pulse">
      Connecting...
    </button>
  ),
});

export interface NavBarProps {
  rightElement?: React.ReactNode;
}

export function NavBar({ rightElement }: NavBarProps): React.JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isTradeActive = pathname?.startsWith("/trade");

  return (
    <motion.nav
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`sticky top-0 z-50 flex justify-between items-center w-full transition-all duration-300 select-none h-20 px-6 sm:px-12 ${
        isScrolled
          ? "bg-bg-primary/80 backdrop-blur-xl border-b border-white/8 shadow-[0_4px_30px_rgba(1,8,22,0.5)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="relative">
          <div className="absolute inset-0 bg-accent rounded-full opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-300" />
          <Image
            src="/logo/dark.png"
            alt="ChadWallet Logo"
            width={34}
            height={34}
            priority
            className="relative transform transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <span className="text-lg font-black tracking-wider bg-gradient-to-r from-accent via-accent-light to-accent-blue bg-clip-text text-transparent transform transition-transform duration-300">
          CHADWALLET
        </span>
      </Link>

      <div className="hidden lg:flex items-center gap-8">
        <a
          href="#features"
          className="text-[14px] font-bold text-text-muted hover:text-white transition-colors cursor-pointer"
        >
          Features
        </a>
        <Link
          href="/trade"
          className={`relative text-[14px] font-bold transition-all hover:text-white cursor-pointer ${
            isTradeActive ? "text-white" : "text-text-muted"
          }`}
        >
          <span>Trade</span>
          {isTradeActive && (
            <motion.div
              layoutId="nav-active"
              className="absolute inset-x-0 -bottom-[30px] h-[2px] bg-accent rounded-full shadow-[0_0_8px_var(--color-accent)]"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </Link>
        <a
          href="#memecoins"
          className="text-[14px] font-bold text-text-muted hover:text-white transition-colors cursor-pointer"
        >
          Memecoins
        </a>
        <a
          href="#kols"
          className="text-[14px] font-bold text-text-muted hover:text-white transition-colors cursor-pointer"
        >
          KOLs
        </a>
        <a
          href="#portfolio"
          className="text-[14px] font-bold text-text-muted hover:text-white transition-colors cursor-pointer"
        >
          Portfolio
        </a>
      </div>

      <div className="flex items-center gap-6">
        <a
          href="#showcase"
          className="hidden sm:inline-block text-[14px] font-bold text-text-muted hover:text-white transition-colors cursor-pointer"
        >
          Download App
        </a>
        {rightElement || <WalletButton />}
      </div>
    </motion.nav>
  );
}

export default NavBar;

