// hooks/useLiveTrades.ts
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Trade } from "@/types";
import { INTERNAL_API, POLL_LIVE_TRADES_MS } from "@/constants";

export interface UseLiveTradesReturn {
  trades: Trade[];
  isLoading: boolean;
  error: Error | null;
}

export function useLiveTrades(tokenAddress: string): UseLiveTradesReturn {
  const [trades, setTrades] = useState<Trade[]>([]);

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
      onSuccess: (newData) => {
        setTrades((prev) => {
          if (prev.length === 0) return newData.slice(0, 50);
          const newUnique = newData.filter(
            (t) => !prev.some((p) => p.txHash === t.txHash)
          );
          return [...newUnique, ...prev].slice(0, 50);
        });
      },
    }
  );

  useEffect(() => {
    setTrades([]);
  }, [tokenAddress]);

  return {
    trades: trades.length > 0 ? trades : (data || []),
    isLoading: isLoading && !data,
    error: error || null,
  };
}
export default useLiveTrades;
