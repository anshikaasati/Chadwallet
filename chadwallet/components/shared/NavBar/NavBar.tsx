// components/shared/NavBar/NavBar.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const WalletButton = dynamic(() => import("../WalletButton"), {
  ssr: false,
  loading: () => (
    <button className="px-4 py-2 bg-accent text-text-primary font-bold rounded-lg opacity-50 text-sm disabled:opacity-50 border border-transparent focus:outline-none">
      Connecting...
    </button>
  ),
});

export interface NavBarProps {
  rightElement?: React.ReactNode;
}

export function NavBar({ rightElement }: NavBarProps): React.JSX.Element {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-bg-surface border-b border-border">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo/dark.png"
          alt="ChadWallet Logo"
          width={32}
          height={32}
          priority
        />
        <span className="text-xl font-extrabold tracking-wider text-accent hidden sm:inline-block">
          CHADWALLET
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/trade" className="text-sm font-semibold hover:text-accent transition">
          Trade
        </Link>
        {rightElement || <WalletButton />}
      </div>
    </nav>
  );
}
export default NavBar;

