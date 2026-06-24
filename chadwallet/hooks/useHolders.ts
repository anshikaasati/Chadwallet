// hooks/useHolders.ts
import useSWR from "swr";
import { Holder } from "@/types";
import { INTERNAL_API, POLL_HOLDER_LIST_MS } from "@/constants";

export interface UseHoldersReturn {
  holders: Holder[];
  isLoading: boolean;
  error: Error | null;
}

export function useHolders(tokenAddress: string): UseHoldersReturn {
  const { data, error, isLoading } = useSWR<Holder[]>(
    tokenAddress ? INTERNAL_API.holders(tokenAddress) : null,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch holders for ${tokenAddress}`);
      const json = await res.json();
      return json.data;
    },
    {
      refreshInterval: POLL_HOLDER_LIST_MS,
      dedupingInterval: POLL_HOLDER_LIST_MS,
    }
  );

  return {
    holders: data || [],
    isLoading: isLoading && !data,
    error: error || null,
  };
}
export default useHolders;
