// hooks/useTokenBanner.ts
import useSWR from "swr";
import { Token } from "@/types";
import { INTERNAL_API, POLL_BANNER_MS } from "@/constants";

export interface UseTokenBannerReturn {
  tokens: Token[];
  isLoading: boolean;
  error: Error | null;
}

export function useTokenBanner(fallbackData?: Token[]): UseTokenBannerReturn {
  const { data, error, isLoading } = useSWR<Token[]>(
    INTERNAL_API.banner,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch banner tokens");
      const json = await res.json();
      return json.data;
    },
    {
      refreshInterval: POLL_BANNER_MS,
      dedupingInterval: POLL_BANNER_MS,
      fallbackData,
    }
  );

  return {
    tokens: data || fallbackData || [],
    isLoading: isLoading && !data && !fallbackData,
    error: error || null,
  };
}
export default useTokenBanner;
