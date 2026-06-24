// app/(marketing)/layout.tsx
import React from "react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-foreground">
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>
    </div>
  );
}
