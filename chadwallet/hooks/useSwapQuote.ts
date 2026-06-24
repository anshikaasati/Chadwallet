// hooks/useSwapQuote.ts
import useSWR from "swr";
import { QuoteRequest, QuoteResponse } from "@/types";
import { INTERNAL_API } from "@/constants";

export interface UseSwapQuoteReturn {
  data: QuoteResponse | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function useSwapQuote(req: QuoteRequest | null): UseSwapQuoteReturn {
  const { data, error, isLoading } = useSWR<QuoteResponse>(
    req ? [INTERNAL_API.swapQuote, req.inputMint, req.outputMint, req.amount, req.slippageBps] : null,
    async () => {
      if (!req) throw new Error("Request parameters missing");
      const res = await fetch(INTERNAL_API.swapQuote, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });
      if (!res.ok) {
        throw new Error("Failed to retrieve swap quote");
      }
      const json = await res.json();
      return json.data;
    }
  );

  return {
    data,
    isLoading,
    error: error || null,
  };
}
export default useSwapQuote;
