// hooks/useUserPosition.ts
import useSWR from "swr";
import { Position } from "@/types";
import { INTERNAL_API } from "@/constants";

export interface UseUserPositionReturn {
  data: Position | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function useUserPosition(userId: string | null, tokenAddress: string): UseUserPositionReturn {
  const { data, error, isLoading } = useSWR<Position>(
    userId && tokenAddress ? `${INTERNAL_API.positions}?userId=${userId}&tokenAddress=${tokenAddress}` : null,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to retrieve user position");
      }
      const json = await res.json();
      return json.data;
    }
  );

  return {
    data,
    isLoading,
    error: error || null,
  };
}
export default useUserPosition;
