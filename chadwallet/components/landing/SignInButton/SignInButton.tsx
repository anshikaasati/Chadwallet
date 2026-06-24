// components/landing/SignInButton/SignInButton.tsx
import React from "react";

export interface SignInButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

export function SignInButton({
  onClick,
  isLoading = false,
}: SignInButtonProps): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="px-6 py-3 bg-accent text-white font-bold rounded-md hover:bg-opacity-95 disabled:opacity-50 transition"
    >
      {isLoading ? "Signing in..." : "Sign In with Privy"}
    </button>
  );
}
export default SignInButton;
