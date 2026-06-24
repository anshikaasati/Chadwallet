// hooks/useTrendingTokens.ts
import useSWR from "swr";
import { Token } from "@/types";
import { INTERNAL_API, POLL_TRENDING_MS } from "@/constants";

export interface UseTrendingTokensReturn {
  tokens: Token[];
  isLoading: boolean;
  error: Error | null;
}

export function useTrendingTokens(): UseTrendingTokensReturn {
  const { data, error, isLoading } = useSWR<Token[]>(
    INTERNAL_API.trending,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch trending tokens");
      const json = await res.json();
      return json.data;
    },
    {
      refreshInterval: POLL_TRENDING_MS || undefined,
      dedupingInterval: 30_000,
    }
  );

  return {
    tokens: data || [],
    isLoading: isLoading && !data,
    error: error || null,
  };
}
export default useTrendingTokens;
