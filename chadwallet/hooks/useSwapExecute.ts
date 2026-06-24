// hooks/useSwapExecute.ts
import { useState } from "react";
import { QuoteResponse } from "@/types";

export interface UseSwapExecuteReturn {
  executeSwap: (quote: QuoteResponse) => Promise<string>;
  isLoading: boolean;
  error: Error | null;
}

export function useSwapExecute(): UseSwapExecuteReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const executeSwap = async (quote: QuoteResponse): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement transaction assembly API call, signing, sending and confirmation
      console.log("Executing swap with quote:", quote);
      setIsLoading(false);
      return "dummy_tx_signature";
    } catch (err) {
      const errorInstance = err instanceof Error ? err : new Error("Failed to execute swap");
      setError(errorInstance);
      setIsLoading(false);
      throw errorInstance;
    }
  };

  return {
    executeSwap,
    isLoading,
    error,
  };
}
export default useSwapExecute;
