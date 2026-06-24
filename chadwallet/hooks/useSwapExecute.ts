// hooks/useSwapExecute.ts
import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import { QuoteResponse } from "@/types";
import { useWallet } from "@/hooks/useWallet";
import { INTERNAL_API, ALCHEMY_RPC_URL } from "@/constants";
import { toHumanReadable } from "@/lib/utils";

export type SwapExecuteStatus =
  | "idle"
  | "building"
  | "signing"
  | "sending"
  | "confirming"
  | "confirmed"
  | "failed";

export interface UseSwapExecuteReturn {
  executeSwap: (
    quote: QuoteResponse,
    tokenSymbol: string,
    decimals: number,
    side: "buy" | "sell",
    currentPositionBalance: number
  ) => Promise<string>;
  isExecuting: boolean;
  txHash: string | null;
  error: Error | null;
  status: SwapExecuteStatus;
}

export function useSwapExecute(): UseSwapExecuteReturn {
  const { getAccessToken, user } = usePrivy();
  const { signTransaction, publicKey } = useWallet();
  const [isExecuting, setIsExecuting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<SwapExecuteStatus>("idle");

  const executeSwap = async (
    quote: QuoteResponse,
    tokenSymbol: string,
    decimals: number,
    side: "buy" | "sell",
    currentPositionBalance: number
  ): Promise<string> => {
    if (!publicKey) {
      throw new Error("Wallet not connected");
    }
    setIsExecuting(true);
    setError(null);
    setTxHash(null);
    setStatus("building");

    try {
      const token = await getAccessToken();

      // 1. POST /api/swap/transaction with quote + userPublicKey
      const txRes = await fetch(INTERNAL_API.swapExecute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: publicKey,
        }),
      });

      if (!txRes.ok) {
        const errorJson = await txRes.json().catch(() => ({}));
        throw new Error(errorJson?.error?.message || "Failed to compile swap transaction");
      }

      const txJson = await txRes.json();
      const { swapTransaction } = txJson.data;

      // 2. Deserialize base64 transaction safely without Node.js Buffer polyfill
      setStatus("signing");
      const binaryString = window.atob(swapTransaction);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const transaction = VersionedTransaction.deserialize(bytes);

      // 3. Sign transaction using Privy wallet
      const signedTx = await signTransaction(transaction);

      // 4. Send raw transaction to Alchemy RPC
      setStatus("sending");
      const connection = new Connection(ALCHEMY_RPC_URL, "confirmed");
      const signature = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        maxRetries: 3,
      });

      setTxHash(signature);
      setStatus("confirming");

      // 5. Poll RPC status every 2s until confirmed or failed
      let confirmed = false;
      let retries = 0;
      while (!confirmed && retries < 30) {
        const statusRes = await connection.getSignatureStatuses([signature]);
        const signatureStatus = statusRes.value[0];
        if (signatureStatus) {
          if (signatureStatus.err) {
            throw new Error("Solana transaction execution failed on chain.");
          }
          if (
            signatureStatus.confirmationStatus === "confirmed" ||
            signatureStatus.confirmationStatus === "finalized"
          ) {
            confirmed = true;
            break;
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        retries++;
      }

      if (!confirmed) {
        throw new Error("Transaction confirmation timed out. Check signature status on Solscan.");
      }

      setStatus("confirmed");

      // 6. On confirmed: POST /api/user/positions to update position in Supabase
      const tokenAddress = side === "buy" ? quote.outputMint : quote.inputMint;
      const amountTransferred = side === "buy"
        ? toHumanReadable(quote.outAmount, decimals)
        : toHumanReadable(quote.inAmount, decimals);

      const newBalance = side === "buy"
        ? currentPositionBalance + amountTransferred
        : Math.max(0, currentPositionBalance - amountTransferred);

      // POST user position upsert
      await fetch(INTERNAL_API.positions, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user?.id,
          tokenAddress,
          tokenSymbol,
          balance: newBalance,
          avgEntryPrice: null, // nullable, standard fallback
          updatedAt: new Date().toISOString(),
        }),
      });

      setIsExecuting(false);
      return signature;
    } catch (err) {
      const errorInstance = err instanceof Error ? err : new Error("Swap execution failed");
      setError(errorInstance);
      setStatus("failed");
      setIsExecuting(false);
      throw errorInstance;
    }
  };

  return {
    executeSwap,
    isExecuting,
    txHash,
    error,
    status,
  };
}
export default useSwapExecute;
