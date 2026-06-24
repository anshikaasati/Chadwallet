// components/landing/SignInButton/SignInButton.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { Spinner, Button } from "@/components/ui";
import { SOL_MINT } from "@/constants";

export function SignInButton(): React.JSX.Element {
  const { ready, authenticated, login, logout, user, getAccessToken } = usePrivy();
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();



  useEffect(() => {
    let active = true;
    if (ready && authenticated && user && !isSyncing) {
      setIsSyncing(true);
      
      // Redirect immediately to keep the UI highly responsive
      router.push(`/trade/${SOL_MINT}`);

      const syncAndRedirect = async () => {
        try {
          const solanaWallet = user.linkedAccounts.find((acc) => {
            if (acc.type !== "wallet") return false;
            const walletAcc = acc as unknown as Record<string, unknown>;
            return (
              walletAcc.chainType === "solana" ||
              (typeof walletAcc.address === "string" &&
                walletAcc.address.length >= 32 &&
                walletAcc.address.length <= 44)
            );
          });
          const walletAddress = solanaWallet ? (solanaWallet as unknown as { address: string }).address : null;

          const emailAccount = user.linkedAccounts.find((acc) => acc.type === "email");
          const email = emailAccount ? (emailAccount as unknown as { address: string }).address : null;

          // Race getAccessToken with a 3-second timeout to prevent hangs
          const tokenPromise = getAccessToken();
          const timeoutPromise = new Promise<null>((_, reject) =>
            setTimeout(() => reject(new Error("getAccessToken timeout")), 3000)
          );

          const token = await Promise.race([tokenPromise, timeoutPromise]);
          if (token && active) {
            const controller = new AbortController();
            const fetchTimeoutId = setTimeout(() => controller.abort(), 4000);

            try {
              await fetch("/api/user/upsert", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  id: user.id,
                  walletAddress,
                  email,
                  createdAt: new Date(user.createdAt).toISOString(),
                }),
                signal: controller.signal,
              });
            } catch (fetchErr) {
              console.warn("User upsert sync timed out or was aborted:", fetchErr);
            } finally {
              clearTimeout(fetchTimeoutId);
            }
          }
        } catch (err) {
          console.warn("Background user sync timed out or failed:", err);
        }
      };
      syncAndRedirect();
    }
    return () => {
      active = false;
    };
  }, [ready, authenticated, user, getAccessToken, router, isSyncing]);

  if (!ready || isSyncing) {
    return (
      <div className="flex items-center justify-center p-3 h-11">
        <Spinner size="md" />
      </div>
    );
  }

  if (authenticated) {
    const solanaWallet = user?.linkedAccounts.find((acc) => {
      if (acc.type !== "wallet") return false;
      const walletAcc = acc as unknown as Record<string, unknown>;
      return (
        walletAcc.chainType === "solana" ||
        (typeof walletAcc.address === "string" &&
          walletAcc.address.length >= 32 &&
          walletAcc.address.length <= 44)
      );
    });
    const walletAddress = solanaWallet
      ? ((solanaWallet as unknown as { address: string }).address)
      : "";

    const shortAddress = walletAddress
      ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
      : "Connected";

    return (
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => router.push(`/trade/${SOL_MINT}`)}
          className="w-full sm:w-auto font-bold"
        >
          Dashboard ({shortAddress})
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => logout()}
          className="w-full sm:w-auto text-text-muted hover:text-foreground font-semibold"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="primary"
      size="lg"
      onClick={() => login()}
      className="w-full sm:w-auto font-extrabold text-lg py-4 px-8 shadow-lg shadow-accent/20 hover:shadow-accent/35"
    >
      Sign in with Apple / Google
    </Button>
  );
}
export default SignInButton;
