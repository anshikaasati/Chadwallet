// hooks/useUserPosition.ts
import useSWR from "swr";
import { usePrivy } from "@privy-io/react-auth";
import { Position } from "@/types";
import { INTERNAL_API } from "@/constants";

export interface UseUserPositionReturn {
  position: Position | null;
  isLoading: boolean;
  error: Error | null;
  mutate: () => Promise<Position | null>;
}

export function useUserPosition(tokenAddress: string): UseUserPositionReturn {
  const { authenticated, getAccessToken } = usePrivy();

  const { data, error, isLoading, mutate } = useSWR<Position[]>(
    authenticated ? INTERNAL_API.positions : null,
    async (url: string) => {
      const token = await getAccessToken();
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to retrieve user positions");
      }
      const json = await res.json();
      return json.data;
    }
  );

  const position = data?.find((p) => p.tokenAddress === tokenAddress) || null;

  return {
    position,
    isLoading: isLoading && !data,
    error: error || null,
    mutate: async () => {
      const updated = await mutate();
      return updated?.find((p) => p.tokenAddress === tokenAddress) || null;
    },
  };
}
export default useUserPosition;
