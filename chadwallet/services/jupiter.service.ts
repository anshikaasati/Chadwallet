// services/jupiter.service.ts
import {
  QuoteRequest,
  QuoteResponse,
  SwapTransactionRequest,
  SwapTransactionResponse,
} from "@/types";
import { JUPITER_QUOTE_URL, JUPITER_SWAP_URL } from "@/constants";
import { apiFetch } from "@/services/http.client";
import { JupiterError } from "@/lib/errors";

export class JupiterService {
  /**
   * Fetches a swap route quote from Jupiter.
   * Calls Jupiter v6 GET quote endpoint.
   */
  async getQuote(req: QuoteRequest): Promise<QuoteResponse> {
    try {
      const url = new URL(JUPITER_QUOTE_URL);
      url.searchParams.append("inputMint", req.inputMint);
      url.searchParams.append("outputMint", req.outputMint);
      url.searchParams.append("amount", req.amount.toString());
      url.searchParams.append("slippageBps", req.slippageBps.toString());

      const data = await apiFetch<QuoteResponse>(url.toString());

      if (!data || !data.routePlan || data.routePlan.length === 0) {
        throw new JupiterError("NO_ROUTE_FOUND", "No swap routes found for the selected tokens.", 422);
      }

      return {
        inputMint: data.inputMint,
        outputMint: data.outputMint,
        inAmount: data.inAmount,
        outAmount: data.outAmount,
        priceImpactPct: data.priceImpactPct,
        routePlan: data.routePlan,
        otherAmountThreshold: data.otherAmountThreshold,
        swapMode: data.swapMode,
      };
    } catch (err) {
      if (err instanceof JupiterError) throw err;
      throw new JupiterError(
        err instanceof Error ? err.message : "Failed to retrieve swap route quote from Jupiter."
      );
    }
  }

  /**
   * Assembles a serialized Solana transaction for signing and broadcasting.
   * Calls Jupiter v6 POST swap transaction endpoint.
   */
  async buildTransaction(req: SwapTransactionRequest): Promise<SwapTransactionResponse> {
    try {
      const body = {
        quoteResponse: req.quoteResponse,
        userPublicKey: req.userPublicKey,
        wrapAndUnwrapSol: req.wrapAndUnwrapSol ?? true,
      };

      const response = await apiFetch<SwapTransactionResponse>(JUPITER_SWAP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response || !response.swapTransaction) {
        throw new JupiterError("Jupiter API did not return a valid serialized transaction.");
      }

      return {
        swapTransaction: response.swapTransaction,
        lastValidBlockHeight: response.lastValidBlockHeight,
        prioritizationFeeLamports: response.prioritizationFeeLamports,
      };
    } catch (err) {
      if (err instanceof JupiterError) throw err;
      throw new JupiterError(
        err instanceof Error ? err.message : "Failed to assemble swap transaction using Jupiter."
      );
    }
  }
}

export const jupiter = new JupiterService();
export default jupiter;
