// app/(marketing)/layout.tsx
import React from "react";
import NavBar from "@/components/shared/NavBar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-primary text-primary">
      <NavBar />
      <main className="flex-1 flex flex-col justify-center items-center">
        {children}
      </main>
    </div>
  );
}
