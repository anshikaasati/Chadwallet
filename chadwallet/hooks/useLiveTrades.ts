// hooks/useLiveTrades.ts
import useSWR from "swr";
import { Trade } from "@/types";
import { INTERNAL_API, POLL_LIVE_TRADES_MS } from "@/constants";

export interface UseLiveTradesReturn {
  data: Trade[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function useLiveTrades(tokenAddress: string): UseLiveTradesReturn {
  const { data, error, isLoading } = useSWR<Trade[]>(
    tokenAddress ? INTERNAL_API.liveTrades(tokenAddress) : null,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch live trades for ${tokenAddress}`);
      const json = await res.json();
      return json.data;
    },
    {
      refreshInterval: POLL_LIVE_TRADES_MS,
      dedupingInterval: POLL_LIVE_TRADES_MS,
    }
  );

  return {
    data,
    isLoading,
    error: error || null,
  };
}
export default useLiveTrades;
