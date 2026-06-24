// services/birdeye.service.ts
import { Token, TokenStats, OHLCVBar, Holder, Trade } from "@/types";
import { birdeyeApiKey } from "@/lib/config";
import { BIRDEYE_BASE_URL, BIRDEYE_ENDPOINTS } from "@/constants";
import { apiFetch } from "@/services/http.client";
import { BirdEyeError } from "@/lib/errors";
import { formatAddress } from "@/lib/utils";
import {
  BirdEyeResponse,
  BirdEyeTokenListResponse,
  BirdEyeTrendingResponse,
  BirdEyeTokenOverview,
  BirdEyeOHLCVResponse,
  BirdEyeHolderResponse,
  BirdEyeTradesResponse,
} from "@/types/birdeye.types";

const RESOLUTION_MAP: Record<string, string> = {
  "1": "1m",
  "5": "5m",
  "15": "15m",
  "60": "1H",
  "240": "4H",
  "1D": "1D",
  "1W": "1W",
};

export class BirdEyeService {
  private getHeaders(): RequestInit {
    return {
      headers: {
        "X-API-KEY": birdeyeApiKey,
        "x-chain": "solana",
      },
    };
  }

  /**
   * Retrieves tokens for the rotating landing page banner.
   * GET /defi/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=50
   */
  async getBannerTokens(): Promise<Token[]> {
    try {
      const url = `${BIRDEYE_BASE_URL}${BIRDEYE_ENDPOINTS.tokenList}?sort_by=v24hUSD&sort_type=desc&offset=0&limit=50`;
      const response = await apiFetch<BirdEyeResponse<BirdEyeTokenListResponse>>(url, this.getHeaders());
      
      if (!response.success || !response.data?.tokens) {
        throw new BirdEyeError("Failed to fetch banner tokens: Success is false or tokens are missing.");
      }

      return response.data.tokens.map((item) => ({
        address: item.address,
        symbol: item.symbol || "UNKNOWN",
        name: item.name || "Unknown Token",
        logoUri: item.logoURI || null,
        decimals: item.decimals || 0,
        price: item.price || 0,
        priceChange24h: item.v24hChangePercent || 0,
        volume24h: item.v24hUSD || 0,
        marketCap: null,
        liquidity: 0,
        chain: "solana" as const,
      }));
    } catch (err) {
      if (err instanceof BirdEyeError) throw err;
      throw new BirdEyeError(err instanceof Error ? err.message : "Unknown error while fetching banner tokens");
    }
  }

  /**
   * Retrieves the list of trending tokens.
   * GET /defi/token_trending?sort_by=volume24hUSD&sort_type=desc&offset=0&limit=20
   */
  async getTrendingTokens(): Promise<Token[]> {
    try {
      const url = `${BIRDEYE_BASE_URL}${BIRDEYE_ENDPOINTS.tokenTrending}?sort_by=volume24hUSD&sort_type=desc&offset=0&limit=20`;
      const response = await apiFetch<BirdEyeResponse<BirdEyeTrendingResponse>>(url, this.getHeaders());

      if (!response.success || !response.data?.tokens) {
        throw new BirdEyeError("Failed to fetch trending tokens: Success is false or tokens are missing.");
      }

      return response.data.tokens.map((item) => ({
        address: item.address,
        symbol: item.symbol || "UNKNOWN",
        name: item.name || "Unknown Token",
        logoUri: item.logoURI || null,
        decimals: item.decimals || 0,
        price: item.price || 0,
        priceChange24h: item.v24hChangePercent || 0,
        volume24h: item.v24hUSD || 0,
        marketCap: item.mc || null,
        liquidity: item.liquidity || 0,
        chain: "solana" as const,
      }));
    } catch (err) {
      if (err instanceof BirdEyeError) throw err;
      throw new BirdEyeError(err instanceof Error ? err.message : "Unknown error while fetching trending tokens");
    }
  }

  /**
   * Retrieves the overview and statistics for a given token address.
   * GET /defi/token_overview?address={address}
   */
  async getTokenOverview(address: string): Promise<TokenStats> {
    try {
      const url = `${BIRDEYE_BASE_URL}${BIRDEYE_ENDPOINTS.tokenOverview}?address=${address}`;
      const response = await apiFetch<BirdEyeResponse<BirdEyeTokenOverview>>(url, this.getHeaders());

      if (!response.success || !response.data) {
        throw new BirdEyeError(`Failed to fetch overview for token ${address}: Success is false or data is missing.`);
      }

      const item = response.data;
      const priceChange24h = item.priceChange24hPercent !== undefined
        ? item.priceChange24hPercent
        : item.priceChange24h !== undefined
        ? item.priceChange24h
        : item.v24hChangePercent !== undefined
        ? item.v24hChangePercent
        : 0;

      return {
        address: item.address,
        symbol: item.symbol || "UNKNOWN",
        name: item.name || "Unknown Token",
        logoUri: item.logoURI || null,
        decimals: item.decimals || 0,
        price: item.price || 0,
        priceChange24h,
        volume24h: item.v24hUSD || 0,
        marketCap: item.mc || null,
        liquidity: item.liquidity || 0,
        chain: "solana" as const,
        holders: item.holders || 0,
        trades24h: item.trade24h !== undefined ? item.trade24h : item.trades24h !== undefined ? item.trades24h : 0,
        buyVolume24h: item.buyVolume24h || 0,
        sellVolume24h: item.sellVolume24h || 0,
        fdv: item.mc || null,
      };
    } catch (err) {
      if (err instanceof BirdEyeError) throw err;
      throw new BirdEyeError(err instanceof Error ? err.message : `Unknown error while fetching overview for token ${address}`);
    }
  }

  /**
   * Retrieves OHLCV price bars for charting.
   * GET /defi/ohlcv?address={address}&type={resolution}&time_from={from}&time_to={to}
   */
  async getOHLCV(
    address: string,
    resolution: string,
    from: number,
    to: number
  ): Promise<OHLCVBar[]> {
    try {
      const apiResolution = RESOLUTION_MAP[resolution] || resolution;
      const url = `${BIRDEYE_BASE_URL}${BIRDEYE_ENDPOINTS.ohlcv}?address=${address}&type=${apiResolution}&time_from=${from}&time_to=${to}`;
      const response = await apiFetch<BirdEyeResponse<BirdEyeOHLCVResponse>>(url, this.getHeaders());

      if (!response.success || !response.data?.items) {
        throw new BirdEyeError(`Failed to fetch OHLCV bars for token ${address}: Success is false or items are missing.`);
      }

      return response.data.items.map((bar) => ({
        time: bar.unixTime, // Unix timestamp in seconds expected by TradingView
        open: bar.o || 0,
        high: bar.h || 0,
        low: bar.l || 0,
        close: bar.c || 0,
        volume: bar.v || 0,
      }));
    } catch (err) {
      if (err instanceof BirdEyeError) throw err;
      throw new BirdEyeError(err instanceof Error ? err.message : `Unknown error while fetching OHLCV bars for token ${address}`);
    }
  }

  /**
   * Retrieves the top holders for a token.
   * GET /v1/token/holder?address={address}&offset=0&limit={limit}
   */
  async getTopHolders(address: string, limit?: number): Promise<Holder[]> {
    try {
      const resolvedLimit = limit ?? 20;
      const overviewUrl = `${BIRDEYE_BASE_URL}${BIRDEYE_ENDPOINTS.tokenOverview}?address=${address}`;
      const url = `${BIRDEYE_BASE_URL}${BIRDEYE_ENDPOINTS.tokenHolder}?address=${address}&offset=0&limit=${resolvedLimit}`;

      const [overviewRes, response] = await Promise.all([
        apiFetch<BirdEyeResponse<BirdEyeTokenOverview>>(overviewUrl, this.getHeaders()).catch(() => null),
        apiFetch<BirdEyeResponse<BirdEyeHolderResponse>>(url, this.getHeaders())
      ]);

      if (!response.success || !response.data?.items) {
        throw new BirdEyeError(`Failed to fetch top holders for token ${address}: Success is false or items are missing.`);
      }

      const items = response.data.items;
      const totalSupply = overviewRes?.data?.totalSupply || overviewRes?.data?.circulatingSupply || 0;
      const totalAmountInBatch = items.reduce((sum, item) => sum + (item.ui_amount || 0), 0);
      const denominator = totalSupply > 0 ? totalSupply : (totalAmountInBatch || 1);

      return items.map((item, idx) => ({
        address: item.owner,
        amount: item.ui_amount || 0,
        percentage: ((item.ui_amount || 0) / denominator) * 100,
        rank: idx + 1,
      }));
    } catch (err) {
      if (err instanceof BirdEyeError) throw err;
      throw new BirdEyeError(err instanceof Error ? err.message : `Unknown error while fetching top holders for token ${address}`);
    }
  }

  /**
   * Retrieves live trades for a token.
   * GET /defi/txs/token?address={address}&offset=0&limit={limit}&tx_type=swap
   */
  async getRecentTrades(address: string, limit?: number): Promise<Trade[]> {
    try {
      const resolvedLimit = limit ?? 20;
      const url = `${BIRDEYE_BASE_URL}${BIRDEYE_ENDPOINTS.tokenTrades}?address=${address}&offset=0&limit=${resolvedLimit}&tx_type=swap`;
      const response = await apiFetch<BirdEyeResponse<BirdEyeTradesResponse>>(url, this.getHeaders());

      if (!response.success || !response.data?.items) {
        throw new BirdEyeError(`Failed to fetch recent trades for token ${address}: Success is false or items are missing.`);
      }

      return response.data.items.map((item) => ({
        txHash: item.txHash,
        side: item.side === "buy" ? ("buy" as const) : ("sell" as const),
        amount: item.amount || 0,
        amountUsd: item.volumeUSD || 0,
        price: item.price || 0,
        wallet: formatAddress(item.owner),
        timestamp: item.blockUnixTime * 1000, // Unix timestamp in milliseconds internally
      }));
    } catch (err) {
      if (err instanceof BirdEyeError) throw err;
      throw new BirdEyeError(err instanceof Error ? err.message : `Unknown error while fetching recent trades for token ${address}`);
    }
  }
}

export const birdeye = new BirdEyeService();
export default birdeye;
