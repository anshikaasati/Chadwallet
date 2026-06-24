// app/(app)/layout.tsx
import React from "react";
import NavBar from "@/components/shared/NavBar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-primary text-primary">
      <NavBar />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
