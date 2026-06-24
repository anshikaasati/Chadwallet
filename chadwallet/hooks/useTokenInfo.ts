// hooks/useTokenInfo.ts
import useSWR from "swr";
import { TokenStats } from "@/types";
import { INTERNAL_API, POLL_TOKEN_INFO_MS } from "@/constants";

export interface UseTokenInfoReturn {
  data: TokenStats | undefined;
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
      refreshInterval: POLL_TOKEN_INFO_MS,
      dedupingInterval: POLL_TOKEN_INFO_MS,
    }
  );

  return {
    data,
    isLoading,
    error: error || null,
  };
}
export default useTokenInfo;
