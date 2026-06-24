// hooks/useSwapQuote.ts
import { useEffect, useState } from "react";
import useSWR from "swr";
import { usePrivy } from "@privy-io/react-auth";
import { QuoteResponse } from "@/types";
import { INTERNAL_API } from "@/constants";

export interface UseSwapQuoteReturn {
  quote: QuoteResponse | null;
  isLoading: boolean;
  error: Error | null;
}

export function useSwapQuote(
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number
): UseSwapQuoteReturn {
  const { authenticated, getAccessToken } = usePrivy();
  const [debouncedAmount, setDebouncedAmount] = useState(amount);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedAmount(amount);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [amount]);

  const shouldFetch = authenticated && debouncedAmount > 0 && !!inputMint && !!outputMint;

  const { data, error, isLoading } = useSWR<QuoteResponse>(
    shouldFetch ? [INTERNAL_API.swapQuote, inputMint, outputMint, debouncedAmount, slippageBps] : null,
    async () => {
      const token = await getAccessToken();
      const res = await fetch(INTERNAL_API.swapQuote, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          inputMint,
          outputMint,
          amount: debouncedAmount,
          slippageBps,
        }),
      });
      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson?.error?.message || "Failed to retrieve swap quote");
      }
      const json = await res.json();
      return json.data;
    }
  );

  return {
    quote: data || null,
    isLoading: isLoading && !data && debouncedAmount > 0,
    error: error || null,
  };
}
export default useSwapQuote;
