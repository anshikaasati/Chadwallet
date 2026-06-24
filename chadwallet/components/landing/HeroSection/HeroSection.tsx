// components/landing/HeroSection/HeroSection.tsx
import React from "react";

export interface HeroSectionProps {
  onSignInClick: () => void;
}

export function HeroSection({ onSignInClick }: HeroSectionProps): React.JSX.Element {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-4">
      <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
        SOLANA TRADING FOR <span className="text-accent">CHADS</span>
      </h1>
      <p className="text-xl text-text-muted max-w-2xl mb-8">
        Instantly track, monitor, and trade Solana tokens using the sleekest platform on the web.
      </p>
      <button
        onClick={onSignInClick}
        className="px-8 py-4 bg-accent rounded-lg text-lg font-bold hover:bg-opacity-90 transition"
      >
        Access Dashboard
      </button>
    </section>
  );
}
export default HeroSection;
