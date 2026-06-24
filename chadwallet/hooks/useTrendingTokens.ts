// hooks/useTrendingTokens.ts
import useSWR from "swr";
import { Token } from "@/types";
import { INTERNAL_API, POLL_TRENDING_MS } from "@/constants";

export interface UseTrendingTokensReturn {
  data: Token[] | undefined;
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
      refreshInterval: POLL_TRENDING_MS,
      dedupingInterval: POLL_TRENDING_MS,
    }
  );

  return {
    data,
    isLoading,
    error: error || null,
  };
}
export default useTrendingTokens;
