// components/shared/WalletButton/WalletButton.tsx
import React from "react";

export interface WalletButtonProps {
  address: string | null;
  onClick: () => void;
  isLoading?: boolean;
}

export function WalletButton({
  address,
  onClick,
  isLoading = false,
}: WalletButtonProps): React.JSX.Element {
  const abbreviatedAddress = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : "";

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="px-4 py-2 bg-accent text-white font-semibold rounded-md hover:bg-opacity-90 transition text-sm disabled:opacity-50"
    >
      {isLoading
        ? "Connecting..."
        : address
        ? abbreviatedAddress
        : "Connect Wallet"}
    </button>
  );
}
export default WalletButton;
