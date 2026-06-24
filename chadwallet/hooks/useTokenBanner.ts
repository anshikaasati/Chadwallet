// hooks/useTokenBanner.ts
import useSWR from "swr";
import { Token } from "@/types";
import { INTERNAL_API, POLL_BANNER_MS } from "@/constants";

export interface UseTokenBannerReturn {
  data: Token[] | undefined;
  isLoading: boolean;
  error: Error | null;
  mutate: () => Promise<Token[] | undefined>;
}

export function useTokenBanner(): UseTokenBannerReturn {
  const { data, error, isLoading, mutate } = useSWR<Token[]>(
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
    }
  );

  return {
    data,
    isLoading,
    error: error || null,
    mutate,
  };
}
export default useTokenBanner;
