// components/shared/WalletButton/WalletButton.tsx
"use client";

import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { abbreviateAddress } from "@/lib/utils";
import { useWallet } from "@/hooks";

export function WalletButton(): React.JSX.Element {
  const { ready, authenticated, login, logout } = usePrivy();
  const { publicKey } = useWallet();

  const abbreviatedAddress = publicKey ? abbreviateAddress(publicKey) : "";

  const handleWalletClick = (): void => {
    if (authenticated) {
      logout();
    } else {
      login();
    }
  };

  const isLoading = !ready;

  return (
    <button
      onClick={handleWalletClick}
      disabled={isLoading}
      className="px-4 py-2 bg-accent text-text-primary font-bold rounded-lg hover:bg-opacity-90 transition text-sm disabled:opacity-50 border border-transparent focus:outline-none"
    >
      {isLoading
        ? "Connecting..."
        : authenticated && publicKey
        ? abbreviatedAddress
        : "Connect Wallet"}
    </button>
  );
}

export default WalletButton;

