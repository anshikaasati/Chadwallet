// constants/api.constants.ts

export const BIRDEYE_BASE_URL = "https://public-api.birdeye.so";
export const JUPITER_QUOTE_URL = "https://quote-api.jup.ag/v6/quote";
export const JUPITER_SWAP_URL = "https://quote-api.jup.ag/v6/swap";

// Alchemy Solana RPC url (public-safe client-side fallback)
export const ALCHEMY_RPC_URL = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || "";

export const BIRDEYE_ENDPOINTS = {
  tokenOverview: "/defi/token_overview",
  tokenTrending: "/defi/token_trending",
  ohlcv: "/defi/ohlcv",
  tokenHolder: "/defi/v3/token/holder",
  tokenTrades: "/defi/txs/token",
  tokenList: "/defi/tokenlist",
} as const;

export const INTERNAL_API = {
  trending: "/api/tokens/trending",
  banner: "/api/tokens/banner",
  tokenInfo: (address: string): string => `/api/tokens/${address}`,
  priceHistory: (address: string): string => `/api/tokens/${address}/price`,
  holders: (address: string): string => `/api/tokens/${address}/holders`,
  liveTrades: (address: string): string => `/api/tokens/${address}/trades`,
  swapQuote: "/api/swap/quote",
  swapExecute: "/api/swap/transaction",
  positions: "/api/user/positions",
  upsert: "/api/user/upsert",
  health: "/api/health",
} as const;
