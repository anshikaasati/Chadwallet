// hooks/usePriceHistory.ts
import useSWR from "swr";
import { OHLCVBar } from "@/types";
import { INTERNAL_API } from "@/constants";

export interface UsePriceHistoryReturn {
  bars: OHLCVBar[];
  isLoading: boolean;
  error: Error | null;
}

export function usePriceHistory(tokenAddress: string, resolution: string): UsePriceHistoryReturn {
  const to = Math.floor(Date.now() / 1000);
  const from = to - 30 * 24 * 60 * 60; // 30 days ago in seconds

  const { data, error, isLoading } = useSWR<OHLCVBar[]>(
    tokenAddress && resolution
      ? [INTERNAL_API.priceHistory(tokenAddress), resolution, from, to]
      : null,
    async () => {
      const url = `${INTERNAL_API.priceHistory(tokenAddress)}?resolution=${resolution}&from=${from}&to=${to}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch price history for ${tokenAddress}`);
      const json = await res.json();
      return json.data;
    }
  );

  return {
    bars: data || [],
    isLoading: isLoading && !data,
    error: error || null,
  };
}
export default usePriceHistory;
