// components/landing/Footer.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Send, BookOpen, ShieldCheck } from "lucide-react";

export function Footer(): React.JSX.Element {
  return (
    <footer className="w-full bg-[#050816] select-none relative z-10">
      {/* Subtle Top Gradient Line */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-accent-blue opacity-50" />

      <div className="max-w-6xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Brand Column */}
        <div className="md:col-span-4 flex flex-col items-start gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo/dark.png"
              alt="ChadWallet Logo"
              width={30}
              height={30}
              className="relative"
            />
            <span className="text-base font-black tracking-wider text-white">
              CHADWALLET
            </span>
          </Link>
          <p className="text-xs text-text-muted leading-relaxed max-w-sm">
            Solana&apos;s premier high-performance trading wallet. Swap, track, and manage meme coins with lightning speed and institutional security.
          </p>
          
          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:border-accent hover:bg-accent/10 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a
              href="https://telegram.org"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:border-accent-light hover:bg-accent-light/10 transition-all cursor-pointer"
            >
              <Send className="w-4.5 h-4.5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:border-accent-blue hover:bg-accent-blue/10 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33 2.5 0 2.5.33 2.5.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg>
            </a>
          </div>
        </div>

        {/* Links Column 1: Product */}
        <div className="md:col-span-2 flex flex-col gap-3.5">
          <span className="text-xs font-black uppercase text-white tracking-wider">Product</span>
          <Link href="/trade" className="text-xs text-text-muted hover:text-white transition-colors cursor-pointer">
            Live DEX Terminal
          </Link>
          <a href="#" className="text-xs text-text-muted hover:text-white transition-colors cursor-pointer">
            App Download
          </a>
          <a href="#" className="text-xs text-text-muted hover:text-white transition-colors cursor-pointer">
            Banner Marquee
          </a>
        </div>

        {/* Links Column 2: Developers */}
        <div className="md:col-span-2 flex flex-col gap-3.5">
          <span className="text-xs font-black uppercase text-white tracking-wider">Resources</span>
          <a href="#" className="text-xs text-text-muted hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
            <BookOpen className="w-3.5 h-3.5" /> Docs
          </a>
          <a href="#" className="text-xs text-text-muted hover:text-white transition-colors cursor-pointer">
            Jupiter Routing
          </a>
          <a href="#" className="text-xs text-text-muted hover:text-white transition-colors cursor-pointer">
            Privy Auth SDK
          </a>
        </div>

        {/* Links Column 3: Legal */}
        <div className="md:col-span-2 flex flex-col gap-3.5">
          <span className="text-xs font-black uppercase text-white tracking-wider">Security</span>
          <a href="#" className="text-xs text-text-muted hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
            <ShieldCheck className="w-3.5 h-3.5" /> Audits
          </a>
          <a href="#" className="text-xs text-text-muted hover:text-white transition-colors cursor-pointer">
            Privacy Policy
          </a>
          <a href="#" className="text-xs text-text-muted hover:text-white transition-colors cursor-pointer">
            Terms of Use
          </a>
        </div>

        {/* Empty spacing Column */}
        <div className="md:col-span-2 flex flex-col gap-3.5">
          <span className="text-xs font-black uppercase text-white tracking-wider">System</span>
          <div className="inline-flex items-center gap-1.5 text-xs text-buy font-bold bg-buy/10 border border-buy/20 px-2.5 py-1 rounded-lg w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-buy animate-pulse" />
            All Systems Operational
          </div>
        </div>

      </div>

      {/* Copyright area */}
      <div className="border-t border-white/5 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[11px] text-text-dim">
            &copy; {new Date().getFullYear()} ChadWallet. All rights reserved. Built for degens, by degens.
          </span>
          <span className="text-[11px] text-text-dim">
            Trading crypto/meme coins carries extreme capital risk.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
