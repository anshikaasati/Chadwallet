// lib/privy/client.ts
import type { PrivyProviderProps } from "@privy-io/react-auth";

import { NEXT_PUBLIC_PRIVY_APP_ID } from "@/constants";

export const privyAppId = NEXT_PUBLIC_PRIVY_APP_ID;

export const privyConfig: PrivyProviderProps["config"] = {
  appearance: {
    theme: "dark",
    accentColor: "#7c3aed",
    showWalletLoginFirst: false,
  },
  loginMethods: ["google", "apple"],
  embeddedWallets: {
    solana: {
      createOnLogin: "users-without-wallets",
    },
  },
};
