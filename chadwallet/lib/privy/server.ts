// lib/privy/server.ts
import { PrivyClient } from "@privy-io/server-auth";
import { privyAppSecret } from "@/lib/config";

import { NEXT_PUBLIC_PRIVY_APP_ID } from "@/constants";

const privyAppId = NEXT_PUBLIC_PRIVY_APP_ID;

if (!privyAppId) {
  throw new Error("Startup Error: Missing public Privy App ID (NEXT_PUBLIC_PRIVY_APP_ID).");
}

export const privyServerClient = new PrivyClient(privyAppId, privyAppSecret);
