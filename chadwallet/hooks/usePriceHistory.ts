// hooks/usePriceHistory.ts
import useSWR from "swr";
import { OHLCVBar } from "@/types";
import { INTERNAL_API } from "@/constants";

export interface UsePriceHistoryReturn {
  data: OHLCVBar[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function usePriceHistory(tokenAddress: string): UsePriceHistoryReturn {
  const { data, error, isLoading } = useSWR<OHLCVBar[]>(
    tokenAddress ? INTERNAL_API.priceHistory(tokenAddress) : null,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch price history for ${tokenAddress}`);
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
export default usePriceHistory;
