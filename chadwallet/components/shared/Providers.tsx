"use client";

import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { privyAppId, privyConfig } from "@/lib/privy/client";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps): React.JSX.Element {
  return (
    <PrivyProvider appId={privyAppId} config={privyConfig}>
      {children}
    </PrivyProvider>
  );
}
export default Providers;
