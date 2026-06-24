// components/shared/NavBar/NavBar.tsx
import React from "react";
import Link from "next/link";
import WalletButton from "../WalletButton";

export interface NavBarProps {
  rightElement?: React.ReactNode;
}

export function NavBar({ rightElement }: NavBarProps): React.JSX.Element {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-bg-surface border-b border-border">
      <Link href="/" className="text-xl font-extrabold tracking-wider text-accent">
        CHADWALLET
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

