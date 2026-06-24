// types/birdeye.types.ts

export interface BirdEyeResponse<T> {
  success: boolean;
  data: T;
}

export interface BirdEyeTokenOverview {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  price: number;
  history30mPrice?: number;
  history3hPrice?: number;
  history12hPrice?: number;
  history24hPrice?: number;
  priceChange24h?: number; // percent
  v24hUSD?: number;
  v24h?: number;
  mc?: number;
  liquidity?: number;
  logoURI?: string;
  holders?: number;
  trades24h?: number;
  buyVolume24h?: number;
  sellVolume24h?: number;
  trade24h?: number;
  tradeHistory24h?: number;
  uniqueWallet24h?: number;
  uniqueWalletHistory24h?: number;
}

export interface BirdEyeTrendingToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  liquidity: number;
  mc: number;
  price: number;
  logoURI: string | null;
  v24hUSD: number;
  v24hChangePercent: number;
}

export interface BirdEyeTrendingResponse {
  updateUnixTime: number;
  updateTime: string;
  tokens: BirdEyeTrendingToken[];
}

export interface BirdEyeOHLCVBar {
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
  unixTime: number;
}

export interface BirdEyeOHLCVResponse {
  items: BirdEyeOHLCVBar[];
}

export interface BirdEyeHolder {
  owner: string;
  amount: number;
  uiAmount: number;
  percentage: number;
  rank: number;
}

export interface BirdEyeHolderResponse {
  items: BirdEyeHolder[];
}

export interface BirdEyeTrade {
  txHash: string;
  blockUnixTime: number;
  side: "buy" | "sell";
  source: string;
  volumeUSD: number;
  amount: number;
  price: number;
  owner: string;
}

export interface BirdEyeTradesResponse {
  items: BirdEyeTrade[];
}

export interface BirdEyeTokenListItem {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  price: number;
  logoURI: string | null;
  v24hUSD: number;
  v24hChangePercent: number;
}

export interface BirdEyeTokenListResponse {
  tokens: BirdEyeTokenListItem[];
}
