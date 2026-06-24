---
name: chadwallet-standards
description: >
  Engineering standards, architecture principles, file-structure conventions, data contracts,
  and best practices for the ChadWallet founding-engineer assignment:
  a FOMO-style landing page + Solana trading UI with real-time token data.
  Stack: Next.js 14 (App Router) + TypeScript + Tailwind (frontend/fullstack),
  Supabase (DB + auth fallback), Privy (Web3 auth), BirdEye API (market data),
  Jupiter SDK (swaps), Alchemy RPC (Solana), TradingView Charting Library (charts),
  Cloudflare (CDN/edge), Vercel (hosting).
  Consult this file before creating any file, route, component, API call, hook,
  schema change, or styling decision. When judgment and this document conflict,
  this document wins.
---

# ChadWallet — Engineering Standards

> **This document is the single source of truth.** Attach it to every prompt.
> Read the relevant section before writing any logic, designing a schema, defining a
> data shape, or making any architectural choice. This is not a suggestion — it is
> the standard. When this document is silent, apply the principles in Section 1.
> When judgment conflicts with this document, this document wins.

**Stack (locked)**
Frontend/Fullstack: Next.js 14 (App Router) + TypeScript (strict) + Tailwind CSS ·
Auth: Privy (Apple/Google OAuth + wallet auth) ·
DB: Supabase (Postgres + Row Level Security) ·
Market Data: BirdEye API ·
Swaps: Jupiter SDK (`@jup-ag/core`) ·
RPC: Alchemy (Solana Mainnet) ·
Charts: TradingView Charting Library ·
Hosting: Vercel · CDN: Cloudflare ·
Package Manager: pnpm

This stack is locked. Do not introduce a new framework, auth library, swap protocol, or ORM
without documenting the decision in the README design-decisions section and noting it here.

---

## 1. Core Principles

These principles govern every decision across all layers. Re-read them before any architectural call.

### 1.1 Single Responsibility
Every file, module, function, component, hook, and server action has exactly one reason to change.
A component that fetches data AND transforms it AND renders it violates this.
A route handler that validates input, runs business logic, AND queries Supabase violates this.
When you find yourself writing "and" to describe what something does — split it.

### 1.2 DRY — Don't Repeat Yourself
Any type, API endpoint string, token address, or config value that appears more than once belongs
in one shared place. Token data shapes, BirdEye response types, Jupiter swap params, and
Privy config are each defined **once** and referenced everywhere.
A duplicated type is a contract drift waiting to happen.

### 1.3 KISS — Keep It Simple
The simplest design that satisfies the requirement wins. Do not add a message queue,
a WebSocket server, or a caching layer unless a requirement calls for it.
The landing page must be fully functional before the trading page is started.
Features are additive — they never complicate the core path.

### 1.4 Open / Closed
Modules are open for extension, closed for modification.
Adding a new token banner, a new chart indicator, or a new wallet action means **extending** —
adding a new handler, a new adapter, a new data source — never editing the working token feed
or the working swap flow.

### 1.5 Dependency Inversion
High-level modules never depend on low-level details directly.
The trading UI does not know which RPC node backs the balance query — it depends on a service
abstraction. The swap flow does not know the HTTP shape of BirdEye — it depends on a typed
`TokenService`. Both sides depend on shared contracts (Section 4), not on each other's internals.

### 1.6 Real Data First
The JD explicitly states: *"power the app with real data."* No mock data, no hardcoded token
lists, no fake price charts. Every piece of market data, every token in the banner, every price
in the chart comes from a live API: BirdEye for prices/holders/trades, Alchemy for on-chain
balances, Jupiter for swap quotes. Mock data is only acceptable in unit tests.

---

## 2. System Architecture

### 2.1 The Three Layers
The system is three logical layers. Data flows in defined directions only.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                          │
│   Landing Page  ·  Trading Page  ·  Token Banners  ·  Swap UI   │
│   Privy Auth  ·  TradingView Chart  ·  Jupiter Swap Form         │
└───────────────────────────┬─────────────────────────────────────┘
                            │ fetch / SWR / real-time polling
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js App Router (Vercel)                    │
│   /app/api/* Route Handlers  ·  Server Actions  ·  RSC pages    │
│   BirdEye proxy  ·  Supabase server client  ·  Privy webhook     │
└──────────┬─────────────────────────────┬────────────────────────┘
           │                             │
           ▼                             ▼
┌─────────────────────┐     ┌────────────────────────────────────┐
│   Supabase (Postgres) │     │   External APIs (3rd party)       │
│   users · positions  │     │   BirdEye · Alchemy · Jupiter      │
│   watchlists         │     │   Privy · TradingView              │
└─────────────────────┘     └────────────────────────────────────┘
```

Permanent rules of flow:
- The browser **never calls BirdEye, Alchemy, or Jupiter directly** from client components with API keys.
  All key-bearing calls go through `/app/api/*` route handlers (server-side proxy). Keys stay server-side.
- The browser calls Privy's SDK client-side for auth; session tokens are then validated server-side.
- Jupiter swap transactions are **built server-side** (quote + transaction assembly via `/api/swap/*`),
  signed client-side by the user's wallet, and sent to Alchemy RPC.
- Supabase is accessed via the **server client** (with service role key) from route handlers only.
  The browser uses Supabase's anon client only for data the user owns (RLS-enforced).

### 2.2 Page Architecture
Two primary pages:

**Landing Page** (`/`) — The FOMO hook. Modeled after `fomo.family`.
- Rotating token banners (top + bottom) with live price/volume data from BirdEye
- ChadWallet branding, app store download links (Android + iOS)
- Privy sign-in (Apple / Google)
- Tapping a token in the banner navigates to `/trade/[tokenAddress]`

**Trading Page** (`/trade/[tokenAddress]`) — Full Solana DEX UI.
- Left: Trending tokens list (BirdEye trending endpoint)
- Middle: Token info header + TradingView price chart + holders list + live trades feed
- Right: Buy & sell form (Jupiter swap) + user's current position

### 2.3 Auth Flow
```
User clicks "Sign in with Apple/Google"
  → Privy SDK opens OAuth modal
  → Privy issues session (JWT + embedded wallet or linked wallet)
  → On success: Privy user object available client-side
  → Server actions use Privy server client to verify session
  → User record upserted in Supabase `users` table (Privy user ID as PK)
```

### 2.4 Swap Flow
```
User enters amount + clicks Buy/Sell
  → Client POSTs to /api/swap/quote with { inputMint, outputMint, amount, slippage }
  → Route handler calls Jupiter Quote API → returns quote
  → Client displays quote to user
  → User confirms → Client POSTs to /api/swap/transaction
  → Route handler calls Jupiter Transaction API → returns serialized transaction
  → Client deserializes, signs with Privy embedded wallet, sends to Alchemy RPC
  → Tx hash returned → client polls for confirmation
```

---

## 3. Repository Structure

Single Next.js monorepo. One `vercel deploy` ships everything.

```
chadwallet/
│
├── app/                                 # Next.js 14 App Router root
│   ├── (marketing)/                     # Route group: no auth required
│   │   ├── page.tsx                     # Landing page (/)
│   │   └── layout.tsx                   # Marketing layout (no sidebar)
│   ├── (app)/                           # Route group: auth required
│   │   ├── trade/
│   │   │   └── [tokenAddress]/
│   │   │       └── page.tsx             # Trading page
│   │   └── layout.tsx                   # App layout (with sidebar / nav)
│   ├── api/                             # Server-side route handlers only
│   │   ├── tokens/
│   │   │   ├── trending/route.ts        # GET — BirdEye trending tokens
│   │   │   ├── banner/route.ts          # GET — tokens for rotating banner
│   │   │   └── [address]/
│   │   │       ├── route.ts             # GET — token metadata + stats
│   │   │       ├── price/route.ts       # GET — OHLCV for TradingView
│   │   │       ├── holders/route.ts     # GET — holder list
│   │   │       └── trades/route.ts      # GET — live trades (polling)
│   │   ├── swap/
│   │   │   ├── quote/route.ts           # POST — Jupiter quote
│   │   │   └── transaction/route.ts     # POST — Jupiter transaction assembly
│   │   ├── user/
│   │   │   ├── positions/route.ts       # GET/POST — user's token positions
│   │   │   └── upsert/route.ts          # POST — Privy webhook / session sync
│   │   └── health/route.ts              # GET — sanity check
│   ├── layout.tsx                       # Root layout (Privy provider, fonts)
│   └── globals.css                      # Tailwind base + CSS token vars
│
├── components/                          # All React components
│   ├── ui/                              # Primitive, stateless, unstyled atoms
│   │   ├── Button/
│   │   ├── Badge/
│   │   ├── Spinner/
│   │   ├── Skeleton/
│   │   ├── Modal/
│   │   └── index.ts
│   ├── landing/                         # Domain: landing page
│   │   ├── HeroSection/
│   │   ├── TokenBanner/                 # Rotating marquee banner
│   │   ├── AppDownloadCTA/
│   │   ├── SignInButton/
│   │   └── index.ts
│   ├── trading/                         # Domain: trading page
│   │   ├── TradingLayout/               # Three-column layout wrapper
│   │   ├── TrendingTokenList/           # Left column
│   │   ├── TokenInfoHeader/             # Middle top: name, price, stats
│   │   ├── PriceChart/                  # TradingView widget wrapper
│   │   ├── HoldersList/                 # Middle: token holder list
│   │   ├── LiveTradesFeed/              # Middle: real-time trades
│   │   ├── SwapPanel/                   # Right: buy/sell form
│   │   ├── UserPosition/                # Right: user's current position
│   │   └── index.ts
│   └── shared/                          # Cross-domain shared components
│       ├── NavBar/
│       ├── WalletButton/
│       ├── TokenLogo/
│       ├── PriceChange/                 # Green/red % badge
│       └── index.ts
│
├── hooks/                               # Logic only — no JSX
│   ├── useTokenBanner.ts                # Banner token list + rotation
│   ├── useTrendingTokens.ts             # Trending list data
│   ├── useTokenInfo.ts                  # Token metadata for trading page
│   ├── usePriceHistory.ts               # OHLCV for TradingView datafeed
│   ├── useHolders.ts                    # Holder list
│   ├── useLiveTrades.ts                 # Polling live trades
│   ├── useSwapQuote.ts                  # Jupiter quote state
│   ├── useSwapExecute.ts                # Swap execution + tx confirmation
│   ├── useUserPosition.ts               # User's position for a token
│   ├── useWallet.ts                     # Privy wallet abstraction
│   └── index.ts
│
├── services/                            # All external calls — no UI, no state
│   ├── birdeye.service.ts               # BirdEye API client (all endpoints)
│   ├── jupiter.service.ts               # Jupiter quote + transaction
│   ├── alchemy.service.ts               # Alchemy RPC (balance, tx status)
│   ├── privy.service.ts                 # Privy server-side verification
│   ├── supabase.service.ts              # Supabase server client wrapper
│   ├── http.client.ts                   # Fetch wrapper w/ retries + error parsing
│   └── index.ts
│
├── lib/                                 # Shared utilities and config
│   ├── config.ts                        # All env reads — only file that touches process.env
│   ├── supabase/
│   │   ├── client.ts                    # Browser (anon) Supabase client
│   │   ├── server.ts                    # Server (service role) Supabase client
│   │   └── middleware.ts                # Session refresh middleware
│   ├── privy/
│   │   ├── client.ts                    # PrivyProvider config
│   │   └── server.ts                    # PrivyClient for server verification
│   ├── tradingview/
│   │   └── datafeed.ts                  # TradingView UDF datafeed adapter
│   └── utils.ts                         # Pure helper functions (formatting, etc.)
│
├── types/                               # All TypeScript types — single source of truth
│   ├── token.types.ts                   # Token, TokenPrice, OHLCV, Holder, Trade
│   ├── swap.types.ts                    # QuoteRequest, QuoteResponse, SwapTx
│   ├── user.types.ts                    # User, Position, Watchlist
│   ├── birdeye.types.ts                 # Raw BirdEye API response shapes
│   ├── jupiter.types.ts                 # Raw Jupiter API response shapes
│   └── index.ts
│
├── constants/                           # No magic values elsewhere
│   ├── api.constants.ts                 # API base URLs, endpoint paths
│   ├── token.constants.ts               # SOL mint, USDC mint, known token addresses
│   ├── config.constants.ts              # Default slippage, polling intervals, banner speed
│   └── index.ts
│
├── styles/
│   └── tokens.css                       # CSS custom properties (colors, spacing, radii)
│
├── public/
│   └── chadwallet/                      # Brand assets from the drive link
│       ├── logo.svg
│       ├── logo-dark.svg
│       └── ...
│
├── supabase/
│   └── migrations/                      # SQL migration files — versioned, never edited
│
├── middleware.ts                         # Next.js middleware: auth gate for /trade/*
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.example                          # All env vars documented — never commit .env
├── .env.local                            # gitignored
└── README.md
```

### 3.1 New File / New Folder Rule
Before creating any file, answer: (1) Does a file already own this concern? Extend it.
(2) Which layer does it belong to — component, hook, service, or route handler?
(3) What single responsibility does it own?
Never create `helpers/`, `misc/`, `utils/` as a dumping ground.
Shared logic goes to a named, single-purpose file in `lib/` or `services/`.

### 3.2 Barrel Exports & Import Direction
Every externally-consumed directory has an `index.ts` exposing its public API.
Import direction: `page → component → hook → service → lib/config`.
No component imports from a sibling domain's internals.
`trading/SwapPanel` must not import from `landing/TokenBanner` — shared elements go to `shared/` or `ui/`.

---

## 4. Data Contracts — The Canonical Token Shape

### 4.1 Single Source of Truth
All types live in `types/`. Every service, hook, component, and route handler imports from there.
A field is never added, renamed, or retyped in one place without updating `types/` and all consumers
in the same commit. This rule has no exceptions.

### 4.2 Token (core)
```typescript
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
```

### 4.3 Swap Types
```typescript
// types/swap.types.ts

export interface QuoteRequest {
  inputMint: string;         // Solana mint address
  outputMint: string;
  amount: number;            // in lamports / base units (NOT human-readable)
  slippageBps: number;       // basis points, e.g. 50 = 0.5%
}

export interface QuoteResponse {
  inputMint: string;
  outputMint: string;
  inAmount: string;          // raw — from Jupiter (preserve as string)
  outAmount: string;         // raw — from Jupiter
  priceImpactPct: number;
  routePlan: RoutePlanStep[];
  otherAmountThreshold: string;
  swapMode: "ExactIn" | "ExactOut";
}

export interface RoutePlanStep {
  swapInfo: {
    ammKey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
  };
  percent: number;
}

export interface SwapTransactionRequest {
  quoteResponse: QuoteResponse;
  userPublicKey: string;
  wrapAndUnwrapSol?: boolean;
}

export interface SwapTransactionResponse {
  swapTransaction: string;   // base64-encoded serialized transaction
  lastValidBlockHeight: number;
  prioritizationFeeLamports: number;
}
```

### 4.4 User / Position Types
```typescript
// types/user.types.ts

export interface AppUser {
  id: string;                // Privy user ID (primary key in Supabase)
  walletAddress: string | null;
  email: string | null;
  createdAt: string;         // ISO 8601 UTC
}

export interface Position {
  userId: string;
  tokenAddress: string;
  tokenSymbol: string;
  balance: number;           // token balance (human-readable)
  avgEntryPrice: number | null;  // USD
  updatedAt: string;         // ISO 8601 UTC
}
```

---

## 5. API Route Handler Standards (Next.js App Router)

### 5.1 Layer Separation Is Absolute
```
Route Handler → Service → External API / Supabase
```
Route handlers parse/validate requests and call one service method.
Services own all business logic and external API calls.
No route handler contains raw fetch calls to BirdEye or Jupiter.
No service imports Next.js types (`NextRequest`, `NextResponse`).

### 5.2 Every Route Handler Structure
```typescript
// app/api/tokens/trending/route.ts
import { NextRequest, NextResponse } from "next/server";
import { TrendingTokensSchema } from "@/types";
import { birdeye } from "@/services/birdeye.service";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const tokens = await birdeye.getTrendingTokens();
    return NextResponse.json({ data: tokens });
  } catch (err) {
    return handleApiError(err);   // always the central error handler
  }
}
```
Every route: typed params, try/catch, central error handler, `NextResponse.json()` only.

### 5.3 Request Validation
Every POST/PUT body is validated with Zod before the service runs.
No `await req.json()` result reaching a service without type narrowing.
Schemas live in `types/` colocated with the type they validate.

### 5.4 API Key Security (critical)
- **BirdEye API key**: server-side only. Never in client components. Proxied via `/api/tokens/*`.
- **Alchemy RPC URL**: server-side for sensitive calls; the public HTTP endpoint may be used client-side for read-only RPC if no key is embedded.
- **Supabase service role key**: server-side only. The browser uses the anon key only.
- **Jupiter**: no key required — but transaction assembly is still server-side.
- **Privy**: app ID is public (client SDK); secret is server-side only.

### 5.5 Error Envelope
Every error response has one shape:
```json
{ "error": { "code": "TOKEN_NOT_FOUND", "message": "..." } }
```
A central `handleApiError` function maps typed errors to HTTP status + envelope.
Raw exceptions never reach the client. `code` is a stable screaming-snake string the frontend can switch on.

### 5.6 No Secrets In Route Handlers
All env reads happen in `lib/config.ts` only. A route handler imports from `config`, never reads `process.env` directly.

---

## 6. BirdEye Integration Standards

### 6.1 Base URL & Auth
```
Base URL: https://public-api.birdeye.so
Header:   X-API-KEY: <BIRDEYE_API_KEY>
Header:   x-chain: solana
```
All calls go through `services/birdeye.service.ts`. No component or hook calls BirdEye directly.

### 6.2 Endpoints Used
| Purpose | Endpoint |
|---|---|
| Token metadata + price | `GET /defi/token_overview?address={mint}` |
| Trending tokens | `GET /defi/token_trending?sort_by=volume24hUSD&sort_type=desc&offset=0&limit=20` |
| OHLCV (price chart) | `GET /defi/ohlcv?address={mint}&type={resolution}&time_from={}&time_to={}` |
| Top holders | `GET /v1/token/holder?address={mint}&offset=0&limit=20` |
| Token trades | `GET /defi/txs/token?address={mint}&offset=0&limit=20&tx_type=swap` |
| Token list (banner) | `GET /defi/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=50` |

### 6.3 Response Mapping
Every BirdEye response is mapped to the canonical types from `types/token.types.ts` in
`services/birdeye.service.ts`. No raw BirdEye response shape ever reaches a component.
The `birdeye.types.ts` file documents the raw shapes for reference, but they stop at the service boundary.

### 6.4 Polling Strategy
- Token banner: poll every **15 seconds** (price freshness without hammering the API)
- Live trades feed: poll every **5 seconds**
- Token info header: poll every **10 seconds**
- Holder list: poll every **60 seconds** (slow-changing)
- Trending list: poll every **30 seconds**
All intervals are constants in `constants/config.constants.ts`. No hardcoded numbers in components or hooks.

### 6.5 BirdEye Rate Limits
Free tier: 100 requests/min. With multiple polling hooks active, total req/s must be calculated.
If the app has more than 6 concurrent polling hooks, implement request deduplication via SWR's
`dedupingInterval`. Never fire the same endpoint more than once per polling window from the same client session.

---

## 7. Jupiter Swap Integration Standards

### 7.1 SDK Choice
Use Jupiter's HTTP API directly (not the JS SDK) for server-side route handlers:
- Quote API: `https://quote-api.jup.ag/v6/quote`
- Transaction API: `https://quote-api.jup.ag/v6/swap`

The JS SDK (`@jup-ag/core`) is used client-side only for parsing/displaying route info if needed.

### 7.2 Quote → Sign → Send Flow (locked)
```
1. Client submits trade intent (amount, side, slippage)
2. POST /api/swap/quote → server calls Jupiter Quote API → returns QuoteResponse
3. Client displays: outAmount, priceImpact, route
4. User confirms
5. POST /api/swap/transaction → server calls Jupiter Swap API → returns serialized tx
6. Client deserializes with @solana/web3.js VersionedTransaction.deserialize()
7. Privy embedded wallet signs the transaction
8. Client sends signed tx to Alchemy RPC via sendRawTransaction
9. Client polls for confirmation via getSignatureStatus
10. Position updated in Supabase
```
Steps 6–9 happen client-side in `hooks/useSwapExecute.ts`.
Steps 2–5 server-side in route handlers.

### 7.3 Slippage
Default slippage: **50 bps (0.5%)**. This is a constant in `constants/config.constants.ts`.
The SwapPanel exposes a slippage settings UI (25 / 50 / 100 / custom bps).
Never hardcode slippage in a service or route handler.

### 7.4 Amount Handling
Always convert human-readable amounts to base units (lamports / smallest denomination)
before passing to Jupiter. Always convert Jupiter's output amounts back to human-readable
before displaying. The conversion lives in `lib/utils.ts` (`toBaseUnits`, `toHumanReadable`).

### 7.5 Error States in Swap
- Quote failure: display "No route found" — do not block the UI
- Transaction failure: display tx hash + "Transaction failed, funds not moved"
- Network timeout: "Network error, please retry"
All swap errors surface in `useSwapExecute`'s `error` state. Never swallow a swap error silently.

---

## 8. Privy Auth Integration Standards

### 8.1 Provider Setup
`PrivyProvider` wraps the root layout. Config: Apple + Google login methods enabled.
The app ID is an env var (`NEXT_PUBLIC_PRIVY_APP_ID` — safe to be public, it's not a secret).
The app secret (`PRIVY_APP_SECRET`) is server-side only, used in `lib/privy/server.ts`.

### 8.2 Auth State
```typescript
// Always use the Privy hook for auth state
import { usePrivy } from "@privy-io/react-auth";

const { ready, authenticated, user, login, logout } = usePrivy();
```
`ready` must be `true` before rendering any auth-dependent UI. Show a spinner until `ready`.
Never infer auth state from cookie presence or URL params.

### 8.3 Wallet Access
Privy provides an embedded Solana wallet. Access it via:
```typescript
import { useSolanaWallets } from "@privy-io/react-auth/solana";
const { wallets } = useSolanaWallets();
const wallet = wallets[0]; // first connected Solana wallet
```
`hooks/useWallet.ts` wraps this and exposes `{ wallet, publicKey, signTransaction, connected }`.
No component accesses Privy wallet internals directly — always through `useWallet`.

### 8.4 Protected Routes
`middleware.ts` uses Privy's server-side verification to gate `/trade/*`.
Unauthenticated users on `/trade/*` are redirected to `/` (landing page with sign-in prompt).

### 8.5 User Sync to Supabase
On first auth (Privy `onSuccess` callback), `POST /api/user/upsert` is called with the Privy user ID.
The route handler verifies the Privy JWT server-side, then upserts into Supabase `users` table.
This is the only place a user record is created. Idempotent — safe to call on every login.

---

## 9. TradingView Charting Library Standards

### 9.1 The Datafeed Adapter (critical)
TradingView requires a UDF (Universal Data Feed) datafeed object. It lives in `lib/tradingview/datafeed.ts`.
This adapter translates TradingView's requests into calls to `/api/tokens/[address]/price`.

```typescript
// lib/tradingview/datafeed.ts
export const createDatafeed = (tokenAddress: string): IBasicDataFeed => ({
  onReady: (callback) => { ... },
  searchSymbols: (...) => { ... },
  resolveSymbol: (...) => { ... },
  getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
    // calls /api/tokens/[address]/price with from/to/resolution
    // maps OHLCVBar[] to TradingView Bar[]
  },
  subscribeBars: (...) => { ... },   // polling-based "real-time"
  unsubscribeBars: (...) => { ... },
});
```

### 9.2 Resolution Mapping
TradingView resolutions map to BirdEye `type` parameter:
```
"1"   → "1m"
"5"   → "5m"
"15"  → "15m"
"60"  → "1H"
"240" → "4H"
"1D"  → "1D"
"1W"  → "1W"
```
This mapping lives in `lib/tradingview/datafeed.ts` as a constant — never scattered across hooks.

### 9.3 The Chart Component
`components/trading/PriceChart/` renders the TradingView widget.
It receives `tokenAddress` as a prop. It creates the datafeed, initializes the chart widget,
and cleans up on unmount. No chart logic in the trading page component itself.

### 9.4 Chart Theme
The chart uses a **dark theme** matching ChadWallet's color palette.
Override colors via the `overrides` option in `widget` constructor using CSS token values.
No hardcoded hex in the chart config.

---

## 10. Token Banner Standards

### 10.1 Behavior
Two infinite-scroll marquee banners: one scrolling left (top), one scrolling right (bottom).
Each banner displays 20–50 tokens from BirdEye's token list endpoint.
Banners display: logo, symbol, price, 24h change (green if positive, red if negative).
Banners are CSS-animation-driven (pure CSS `@keyframes` marquee) — no JS scroll manipulation.

### 10.2 Tap Behavior
Clicking/tapping a token in the banner navigates to `/trade/[tokenAddress]`.
On mobile, the tap target is at least 44px tall.
The banner must be interactive — not just decorative.

### 10.3 Data Freshness
Token list for the banner is fetched server-side at page render (RSC or `generateStaticParams`
with 15s revalidation) so the landing page loads with data even before JS hydrates.
Then `useTokenBanner` re-fetches client-side every 15 seconds to keep prices live.

### 10.4 Performance
The banner images (token logos) use `next/image` with `width={24}` and `height={24}`.
The marquee animation uses `will-change: transform` to GPU-accelerate.
Total banner tokens: 50 (25 visible at once; duplicated for seamless loop).

---

## 11. Frontend Component Standards (React + TypeScript)

### 11.1 Component, Hook, Service Boundaries
One component = one folder (`ComponentName.tsx`, `ComponentName.module.css` if needed, `index.ts`).
Components render and handle user events only. They never call `fetch`, access `process.env`,
or contain business logic. Data fetching lives in hooks; hooks call services (client-side)
or are server components that call services directly (server-side).

A hook returns `{ data, isLoading, error, ...callbacks }`. Never JSX.

### 11.2 Loading, Error, Empty States
Every async surface has explicit loading, error, and empty states.
- Loading: `<Skeleton />` component (matches final layout — no jarring shifts)
- Error: actionable error message + retry button
- Empty: contextual empty state (e.g. "No holders found for this token")
No spinner-forever. No silent failure. No component that renders nothing while loading.

### 11.3 Server Components vs Client Components
Use Server Components (RSC) by default. Add `"use client"` only when the component needs:
- Browser APIs (window, document)
- React state or effects
- Event handlers
- Privy hooks or wallet access

The trading page top level can be RSC; individual interactive panels (SwapPanel, LiveTradesFeed)
are client components. Never mark a component `"use client"` just because it feels easier.

### 11.4 Responsive Design
The app is mobile-first. The trading page three-column layout:
- Desktop (≥1280px): left (280px) + middle (flex-1) + right (320px)
- Tablet (≥768px): middle + right stacked; trending list hidden or accessible via tab
- Mobile (<768px): single column; tab navigation between Chart / Swap / Trades

Breakpoints are Tailwind's defaults (`sm`, `md`, `lg`, `xl`). No custom breakpoints unless documented here.

### 11.5 Strict TypeScript
`strict: true` in `tsconfig.json`. Zero `any` — use `unknown` and narrow.
All props are typed interfaces, not inline objects.
Shared types come from `types/` only. No re-declaring shapes in component files.

---

## 12. Supabase & Database Standards

### 12.1 Schema
```sql
-- users (synced from Privy on first login)
users (
  id            text primary key,         -- Privy user ID
  wallet_address text unique,
  email         text unique,
  created_at    timestamptz not null default now()
)

-- positions (updated after each confirmed swap)
positions (
  id            uuid primary key default gen_random_uuid(),
  user_id       text not null references users(id),
  token_address text not null,
  token_symbol  text not null,
  balance       numeric not null default 0,
  avg_entry_price numeric,                -- USD, nullable (unknown for initial sync)
  updated_at    timestamptz not null default now(),
  unique (user_id, token_address)
)

-- watchlist (optional; users can pin tokens)
watchlist (
  user_id       text not null references users(id),
  token_address text not null,
  added_at      timestamptz not null default now(),
  primary key (user_id, token_address)
)
```
Real-time price, volume, and OHLCV data are **never stored in Supabase** — they come from BirdEye live.
Supabase stores only user-owned, slowly-changing data.

### 12.2 Row Level Security (mandatory)
RLS must be enabled on all tables.
```sql
-- Only users can read/write their own data
create policy "users_own_data" on positions
  using (auth.uid()::text = user_id);
```
No table is accessible by the anon key without a policy explicitly allowing it.
Server-side route handlers use the service role key (bypasses RLS) only when the operation
is already authenticated and verified at the route level.

### 12.3 Migrations Only
Schema changes are versioned SQL files in `supabase/migrations/`.
Never run `ALTER TABLE` manually in the Supabase dashboard and forget to record it.
Migration filename format: `YYYYMMDDHHMMSS_descriptive_name.sql`.

### 12.4 Conventions
- Tables: `snake_case` plural
- Columns: `snake_case`
- PKs: `uuid` (generated) or Privy user ID (`text`) for `users`
- Timestamps: `timestamptz`, always UTC, never naive `timestamp`
- FKs: `referenced_table_singular_id` (e.g. `user_id`)

---

## 13. Styling & Design Standards

### 13.1 ChadWallet Brand
Assets are in `public/chadwallet/` (sourced from the Google Drive folder in the JD).
The brand uses a dark-mode-first palette.
Primary color and accent pulled from the official ChadWallet assets.
Never guess brand colors — use the provided assets.

### 13.2 CSS Token Variables
All colors, spacing, radii, shadows, font sizes live as CSS variables in `app/globals.css`:
```css
:root {
  --color-bg-primary: #0a0a0f;
  --color-bg-surface: #12121a;
  --color-accent: #7c3aed;          /* from brand */
  --color-buy: #22c55e;
  --color-sell: #ef4444;
  --color-text-primary: #f8fafc;
  --color-text-muted: #94a3b8;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
}
```
No hex codes in component files. No arbitrary Tailwind values like `text-[#7c3aed]`.
Use Tailwind's `theme.extend` in `tailwind.config.ts` to expose CSS variables as Tailwind classes.

### 13.3 FOMO Family Visual Reference
The landing page is inspired by `fomo.family`. Key visual principles:
- High contrast dark background
- Bold, energetic typography (large token prices, animated changes)
- Token logos prominent
- Urgency / FOMO signaling (volume, trade count, % change prominently displayed)
- Smooth, GPU-accelerated animations (no jank)
- The page should feel alive — prices moving, banners scrolling, numbers updating

### 13.4 No Arbitrary Values
Tailwind arbitrary values (`w-[372px]`, `top-[13px]`) are banned.
If a value is needed that doesn't exist in the design system, add it as a CSS variable and
extend Tailwind's theme to reference it. Every pixel decision is intentional and documented.

### 13.5 Font
Use `next/font` for font loading (zero layout shift). Font choice: match brand assets or use
`Inter` (clean, readable for financial data) as the default if the brand doesn't specify.

---

## 14. Constants, Environment & Secrets

### 14.1 No Magic Values
No raw URL, port, token address, polling interval, slippage value, API path, or chain ID
in a logic file. Each lives in `constants/` and is imported by name.

```typescript
// constants/api.constants.ts
export const BIRDEYE_BASE_URL = "https://public-api.birdeye.so";
export const JUPITER_QUOTE_URL = "https://quote-api.jup.ag/v6/quote";
export const JUPITER_SWAP_URL  = "https://quote-api.jup.ag/v6/swap";
export const ALCHEMY_RPC_URL   = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL!; // public
```

```typescript
// constants/token.constants.ts
export const SOL_MINT   = "So11111111111111111111111111111111111111112";
export const USDC_MINT  = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
```

### 14.2 Centralized Config
`lib/config.ts` is the **only** file that reads `process.env` (for server-side secrets).
Route handlers and services import from `config`. Zero direct `process.env` reads elsewhere.
Client-safe env vars (`NEXT_PUBLIC_*`) are read in `constants/` directly.

### 14.3 .env.example (mandatory)
Every environment variable has an entry in `.env.example` with a placeholder value and a one-line comment.
`.env.local` is gitignored. `.env.example` is committed and is the complete map of the config surface.

```bash
# .env.example

# BirdEye — market data API (https://birdeye.so/data-api)
BIRDEYE_API_KEY=your_birdeye_api_key_here

# Privy — Web3 auth (https://privy.io)
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
PRIVY_APP_SECRET=your_privy_app_secret_here

# Supabase — database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Alchemy — Solana RPC (https://www.alchemy.com/rpc-api)
NEXT_PUBLIC_ALCHEMY_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/your_key_here
```

---

## 15. Error Handling Standards

- **Route handlers**: typed error classes → central `handleApiError` → one error envelope (Section 5.5).
  No silent catches; a catch either handles, rethrows, or returns an error response.
- **Services**: throw typed errors (e.g. `BirdEyeError`, `JupiterError`). Never swallow.
- **Hooks**: expose `error: Error | null` in their return value. Components render error states.
- **Swap errors**: always surface to the user. A failed swap must display the failure reason
  and the tx hash if available. Never show "Trade successful" for a failed transaction.
- A "silent wrong answer" (e.g. swallowing a failed price fetch and showing $0) is worse than
  a visible error and is forbidden.

---

## 16. Performance Standards

### 16.1 Next.js Caching Strategy
- Token metadata (slow-changing): `fetch` with `{ next: { revalidate: 60 } }` — 60s ISR
- OHLCV data: `{ next: { revalidate: 15 } }` — 15s ISR
- User positions: no cache (`{ cache: "no-store" }`) — always fresh
- Trending tokens: `{ next: { revalidate: 30 } }` — 30s ISR

### 16.2 Image Optimization
All token logos use `next/image`. If a logo fails to load, show a fallback generic token icon.
Never use raw `<img>` tags for token logos.

### 16.3 Bundle Size
Do not import entire libraries when only one function is needed.
`import { VersionedTransaction } from "@solana/web3.js"` — not the whole package default import.
Check bundle size with `next build` + `@next/bundle-analyzer` if it exceeds expectations.

### 16.4 SWR for Client-Side Data Fetching
Use `swr` for all client-side data fetching in hooks. Benefits: deduplication, revalidation,
stale-while-revalidate, focus revalidation.
```typescript
import useSWR from "swr";
const { data, error, isLoading } = useSWR(
  `/api/tokens/${tokenAddress}`,
  fetcher,
  { refreshInterval: POLL_TOKEN_INFO_MS }
);
```
No manual `useEffect` + `useState` for data fetching. Always SWR.

---

## 17. Mobile & App Store Standards

### 17.1 App Download Links
The landing page must link to the real app store URLs from the JD:
- Android: `https://play.google.com/store/apps/details?id=xyz.chadwallet.www`
- iPhone: `https://apps.apple.com/us/app/chadwallet/id6757367474`

These are constants in `constants/config.constants.ts`. Never hardcoded in components.

### 17.2 Mobile Responsiveness
The landing page must be fully usable on mobile (tested at 375px width).
The trading page degrades gracefully on mobile (see Section 11.4).
Touch targets: minimum 44×44px per Apple HIG.

---

## 18. Branching & Commits

### 18.1 Branch Naming
```
<type>/<scope>-<short-description>
```
- **type**: `feat` · `fix` · `chore` · `docs` · `refactor` · `perf`
- **scope**: `landing` · `trading` · `auth` · `swap` · `chart` · `banner` · `api` · `db` · `infra`

Examples:
```
feat/landing-token-banner-marquee
feat/trading-tradingview-datafeed
feat/auth-privy-apple-google
feat/swap-jupiter-quote-execute
fix/banner-loop-seamless-css
perf/chart-datafeed-caching
```

### 18.2 Commit Messages
Every commit: `type(scope): imperative description`
```
feat(banner): add infinite-scroll marquee with birdeye token list
feat(chart): wire tradingview datafeed to birdeye ohlcv endpoint
fix(swap): handle jupiter no-route-found error gracefully
feat(auth): add privy apple and google login to landing page
chore(db): add positions migration with user_id rls policy
```
One commit = one logical change. The app builds and runs at every commit.

---

## 19. Pre-Change Checklist

Run before creating any file, writing any logic, or calling any task done.

**API & Security**
- Does this route handler expose any API key to the client?
- Is every BirdEye/Alchemy/Jupiter call server-side only?
- Is every Supabase service-role call behind route-level auth verification?
- Is input to every POST handler validated with Zod?

**Architecture & Boundaries**
- Does this belong to exactly one layer (component / hook / service / route handler)?
- Does the component call `fetch` or access `process.env` directly? (It must not.)
- Does the hook contain JSX or event handlers tied to DOM structure? (It must not.)
- Does the service import `NextRequest` or `NextResponse`? (It must not.)

**Data Contracts**
- Are all types imported from `types/` only?
- Are all API base URLs and polling intervals imported from `constants/` only?
- Are token amounts converted to/from base units correctly (Section 7.4)?
- Are all timestamps handled as numbers (Unix ms) internally and formatted only at render time?

**UI Standards**
- Does every async surface have loading, error, and empty states?
- Are all colors and spacing from CSS token variables or Tailwind theme extensions?
- Are all token logos using `next/image` with a fallback?
- Is every mobile touch target ≥ 44px?

**Config & Secrets**
- Is every new env var in `.env.example` with a comment (same commit)?
- Zero `process.env` reads outside `lib/config.ts` and `constants/`?

**TypeScript**
- Zero `any`? Explicit return types on all exported functions?
- All props typed as named interfaces?

**Commits**
- Conventional Commit format? One logical unit? `next build` passes at this commit?

---

## 20. README & Documentation Requirements

The README is evaluated. It must include:

- **What it is** — one paragraph: ChadWallet trading UI, the stack, the approach.
- **Architecture** — the layer diagram (Section 2.1) and data-flow rules.
- **Live URLs** — Vercel deployment URL.
- **How to run locally** — exact commands: `pnpm install`, env setup, `pnpm dev`.
- **Environment variables** — reference `.env.example`; note which are required vs optional.
- **Key integrations** — one paragraph each on: Privy auth, BirdEye data, Jupiter swaps, TradingView chart.
- **Design decisions** — the key choices and tradeoffs:
  - Why BirdEye over CoinGecko for Solana token data
  - Why server-side API proxying instead of direct client calls
  - Jupiter swap flow (build server-side, sign client-side)
  - TradingView datafeed adapter approach
  - Privy embedded wallet vs external wallet choice
- **What's complete vs follow-up** — be explicit about what was built and what remains (e.g. "Trading page is a follow-up").

---

*This document defines the complete standard for this project.*
*Where the assignment explicitly allows a decision, engineering judgment takes precedence and the rationale is recorded in the README design-decisions section.*
*When judgment and this document conflict — this document wins.*
