// services/alchemy.service.ts
import { ALCHEMY_RPC_URL } from "@/constants";
import { apiFetch } from "@/services/http.client";
import { AlchemyError } from "@/lib/errors";

interface JsonRpcResponse<T> {
  jsonrpc: string;
  result: T;
  error?: {
    code: number;
    message: string;
  };
  id: number;
}

interface RPCSignatureStatus {
  slot: number;
  confirmations: number | null;
  err: Record<string, unknown> | null;
  confirmationStatus: "processed" | "confirmed" | "finalized" | null;
}

export class AlchemyService {
  /**
   * Retrieves the SOL balance for a public key.
   * Calls getBalance JSON-RPC method.
   */
  async getSolBalance(walletAddress: string): Promise<number> {
    try {
      if (!ALCHEMY_RPC_URL) {
        throw new AlchemyError("Solana RPC node endpoint URL is not configured.");
      }

      const body = {
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [walletAddress],
      };

      const response = await apiFetch<JsonRpcResponse<{ value: number }>>(ALCHEMY_RPC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.error) {
        throw new AlchemyError(`RPC Error: ${response.error.message}`);
      }

      const lamports = response.result?.value;
      if (lamports === undefined) {
        throw new AlchemyError("RPC returned invalid empty result for SOL balance query.");
      }

      // Convert lamports to human-readable SOL (10^9 lamports = 1 SOL)
      return lamports / 1_000_000_000;
    } catch (err) {
      if (err instanceof AlchemyError) throw err;
      throw new AlchemyError(
        err instanceof Error ? err.message : "Failed to query Solana SOL balance."
      );
    }
  }

  /**
   * Confirms the transaction signature and returns its status.
   * Calls getSignatureStatuses JSON-RPC method.
   */
  async confirmTransaction(txHash: string): Promise<"confirmed" | "failed" | "pending"> {
    try {
      if (!ALCHEMY_RPC_URL) {
        throw new AlchemyError("Solana RPC node endpoint URL is not configured.");
      }

      const body = {
        jsonrpc: "2.0",
        id: 1,
        method: "getSignatureStatuses",
        params: [[txHash]],
      };

      const response = await apiFetch<JsonRpcResponse<{ value: Array<RPCSignatureStatus | null> }>>(
        ALCHEMY_RPC_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (response.error) {
        throw new AlchemyError(`RPC Error: ${response.error.message}`);
      }

      const status = response.result?.value?.[0];
      if (!status) {
        return "pending";
      }

      if (status.err) {
        return "failed";
      }

      if (status.confirmationStatus === "confirmed" || status.confirmationStatus === "finalized") {
        return "confirmed";
      }

      return "pending";
    } catch (err) {
      if (err instanceof AlchemyError) throw err;
      throw new AlchemyError(
        err instanceof Error ? err.message : "Failed to retrieve Solana signature status."
      );
    }
  }
}

export const alchemy = new AlchemyService();
export default alchemy;
