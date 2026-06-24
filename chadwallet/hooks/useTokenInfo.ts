// hooks/useTokenInfo.ts
import useSWR from "swr";
import { TokenStats } from "@/types";
import { INTERNAL_API, POLL_TOKEN_INFO_MS } from "@/constants";

export interface UseTokenInfoReturn {
  tokenInfo: TokenStats | null;
  isLoading: boolean;
  error: Error | null;
}

export function useTokenInfo(tokenAddress: string): UseTokenInfoReturn {
  const { data, error, isLoading } = useSWR<TokenStats>(
    tokenAddress ? INTERNAL_API.tokenInfo(tokenAddress) : null,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch token info for ${tokenAddress}`);
      const json = await res.json();
      return json.data;
    },
    {
      refreshInterval: POLL_TOKEN_INFO_MS || undefined,
      dedupingInterval: 10_000,
    }
  );

  return {
    tokenInfo: data || null,
    isLoading: isLoading && !data,
    error: error || null,
  };
}
export default useTokenInfo;
