// constants/config.constants.ts

export const POLL_BANNER_MS = 15000;
export const POLL_TOKEN_INFO_MS = 10000;
export const POLL_LIVE_TRADES_MS = 5000;
export const POLL_HOLDER_LIST_MS = 60000;
export const POLL_TRENDING_MS = 30000;
export const DEFAULT_SLIPPAGE_BPS = 50;
export const BANNER_TOKEN_COUNT = 50;

export const APP_STORE_ANDROID = "https://play.google.com/store/apps/details?id=xyz.chadwallet.www";
export const APP_STORE_IOS = "https://apps.apple.com/us/app/chadwallet/id6757367474";

// Client-safe environment variables
export const NEXT_PUBLIC_PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";
export const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const USE_LOCAL_TRADINGVIEW = process.env.NEXT_PUBLIC_USE_LOCAL_TRADINGVIEW === "true";
