// lib/tradingview/datafeed.ts
import { OHLCVBar } from "@/types";
import { POLL_TOKEN_INFO_MS } from "@/constants";

export interface IBasicDataFeed {
  onReady: (callback: (configurationData: Record<string, unknown>) => void) => void;
  searchSymbols: (
    userInput: string,
    exchange: string,
    symbolType: string,
    onResultReadyCallback: (result: unknown[]) => void
  ) => void;
  resolveSymbol: (
    symbolName: string,
    onSymbolResolvedCallback: (symbolInfo: Record<string, unknown>) => void,
    onResolveErrorCallback: (reason: string) => void
  ) => void;
  getBars: (
    symbolInfo: Record<string, unknown>,
    resolution: string,
    periodParams: Record<string, unknown>,
    onHistoryCallback: (bars: unknown[], meta: Record<string, unknown>) => void,
    onErrorCallback: (reason: string) => void
  ) => void;
  subscribeBars: (
    symbolInfo: Record<string, unknown>,
    resolution: string,
    onRealtimeCallback: (bar: unknown) => void,
    subscriberUID: string,
    onResetCacheNeededCallback: () => void
  ) => void;
  unsubscribeBars: (subscriberUID: string) => void;
}

const activeSubscribers = new Map<string, NodeJS.Timeout>();

export function createDatafeed(tokenAddress: string): IBasicDataFeed {
  return {
    onReady: (callback) => {
      setTimeout(() => {
        callback({
          supports_search: false,
          supports_group_request: false,
          supports_marks: false,
          supports_timescale_marks: false,
          supports_time: true,
          exchanges: [],
          symbols_types: [],
          supported_resolutions: ["1", "5", "15", "60", "240", "1D", "1W"],
        });
      }, 0);
    },

    searchSymbols: (_userInput, _exchange, _symbolType, onResultReadyCallback) => {
      onResultReadyCallback([]);
    },

    resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
      if (!symbolName) {
        onResolveErrorCallback("Invalid symbol name");
        return;
      }

      onSymbolResolvedCallback({
        name: symbolName,
        ticker: symbolName,
        description: `${symbolName} Solana Token`,
        type: "crypto",
        session: "24x7",
        timezone: "Etc/UTC",
        minmov: 1,
        pricescale: 1000000, // 6 decimals standard for Solana tokens
        has_intraday: true,
        supported_resolutions: ["1", "5", "15", "60", "240", "1D", "1W"],
      });
    },

    getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
      const from = periodParams.from as number;
      const to = periodParams.to as number;

      if (!from || !to) {
        onErrorCallback("Invalid period parameters (from/to missing)");
        return;
      }

      try {
        const url = `/api/tokens/${tokenAddress}/price?resolution=${resolution}&from=${from}&to=${to}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch bars");
        }
        const json = await res.json();
        const bars: OHLCVBar[] = json.data || [];

        if (bars.length === 0) {
          onHistoryCallback([], { noData: true });
          return;
        }

        const tvBars = bars.map((bar) => ({
          time: bar.time * 1000, // TV expects milliseconds
          open: bar.open,
          high: bar.high,
          low: bar.low,
          close: bar.close,
          volume: bar.volume,
        }));

        onHistoryCallback(tvBars, { noData: false });
      } catch (err) {
        console.error("Error fetching getBars in TV Datafeed:", err);
        onErrorCallback(err instanceof Error ? err.message : "Failed to load price bars");
      }
    },

    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, _onResetCacheNeededCallback) => {
      // Clear existing subscription if exists
      if (activeSubscribers.has(subscriberUID)) {
        clearInterval(activeSubscribers.get(subscriberUID)!);
      }

      const intervalId = setInterval(async () => {
        try {
          const to = Math.floor(Date.now() / 1000);
          const from = to - 300; // last 5 minutes

          const url = `/api/tokens/${tokenAddress}/price?resolution=${resolution}&from=${from}&to=${to}`;
          const res = await fetch(url);
          if (!res.ok) return;

          const json = await res.json();
          const bars: OHLCVBar[] = json.data || [];

          if (bars.length > 0) {
            const lastBar = bars[bars.length - 1];
            onRealtimeCallback({
              time: lastBar.time * 1000,
              open: lastBar.open,
              high: lastBar.high,
              low: lastBar.low,
              close: lastBar.close,
              volume: lastBar.volume,
            });
          }
        } catch (err) {
          console.error("Error in real-time bar update:", err);
        }
      }, POLL_TOKEN_INFO_MS);

      activeSubscribers.set(subscriberUID, intervalId);
    },

    unsubscribeBars: (subscriberUID) => {
      const intervalId = activeSubscribers.get(subscriberUID);
      if (intervalId) {
        clearInterval(intervalId);
        activeSubscribers.delete(subscriberUID);
      }
    },
  };
}
