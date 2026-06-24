// types/token.types.ts

export interface Token {
  address: string;           // Solana mint address (base58)
  symbol: string;
  name: string;
  logoUri: string | null;
  decimals: number;
  price: number;             // USD
  priceChange24h: number;    // percentage, e.g. 12.5 = +12.5%
  volume24h: number;         // USD
  marketCap: number | null;  // USD
  liquidity: number;         // USD
  chain: "solana";           // always "solana" for this app
}

export interface TokenStats extends Token {
  holders: number;
  trades24h: number;
  buyVolume24h: number;
  sellVolume24h: number;
  fdv: number | null;        // fully diluted valuation, USD
}

export interface OHLCVBar {
  time: number;              // Unix timestamp (seconds) — TradingView expects this
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Holder {
  address: string;           // wallet address
  amount: number;            // token amount (human-readable, post-decimals)
  percentage: number;        // % of supply
  rank: number;
}

export interface Trade {
  txHash: string;
  side: "buy" | "sell";
  amount: number;            // token amount
  amountUsd: number;
  price: number;             // USD at time of trade
  wallet: string;            // abbreviated e.g. "Abc...xyz"
  timestamp: number;         // Unix ms
}
