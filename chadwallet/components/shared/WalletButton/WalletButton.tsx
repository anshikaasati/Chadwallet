// components/shared/WalletButton/WalletButton.tsx
"use client";

import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { abbreviateAddress } from "@/lib/utils";
import { useWallet } from "@/hooks";
import { Wallet } from "lucide-react";

export function WalletButton(): React.JSX.Element {
  const { ready, authenticated, login, logout } = usePrivy();
  const { publicKey } = useWallet();

  const abbreviatedAddress = publicKey ? abbreviateAddress(publicKey) : "";
  const isLoading = !ready;

  const handleWalletClick = (): void => {
    if (authenticated) {
      if (confirm("Do you want to disconnect your wallet?")) {
        logout();
      }
    } else {
      login();
    }
  };

  return (
    <div className="relative">
      {isLoading ? (
        <button
          disabled
          className="relative px-5 py-2.5 bg-bg-surface border border-white/5 rounded-xl text-sm font-extrabold text-text-muted/50 animate-pulse flex items-center gap-2"
        >
          <div className="w-3.5 h-3.5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <span>Connecting...</span>
        </button>
      ) : authenticated && publicKey ? (
        <button
          onClick={handleWalletClick}
          className="relative px-4 py-2 bg-bg-surface border border-accent/20 hover:border-accent/50 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2.5 cursor-pointer shadow-[0_0_15px_rgba(44,242,122,0.05)] hover:shadow-[0_0_15px_rgba(44,242,122,0.15)]"
        >
          {/* User Avatar with status dot */}
          <div className="relative w-5 h-5 rounded-full bg-gradient-to-tr from-accent to-accent-light flex-shrink-0 flex items-center justify-center text-[10px] font-black text-black shadow-inner">
            {abbreviatedAddress.charAt(0)}
            {/* Pulsing online status indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-buy border border-bg-surface shadow-[0_0_6px_var(--color-buy)]">
              <span className="absolute inset-0 w-full h-full rounded-full bg-buy animate-ping opacity-75" />
            </span>
          </div>
          <span className="font-mono text-text-primary tracking-wide">{abbreviatedAddress}</span>
        </button>
      ) : (
        <button
          onClick={handleWalletClick}
          className="relative px-3 py-2 sm:px-5 sm:py-2.5 bg-accent hover:bg-accent-light text-black font-extrabold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-accent/10 hover:shadow-accent/20 flex items-center gap-1.5 sm:gap-2 cursor-pointer text-xs sm:text-sm"
        >
          <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black flex-shrink-0" />
          <span className="hidden sm:inline">Connect Wallet</span>
          <span className="inline sm:hidden">Connect</span>
        </button>
      )}
    </div>
  );
}

export default WalletButton;

