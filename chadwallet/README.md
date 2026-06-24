# ChadWallet — Premium Solana DEX & Portfolio Terminal

ChadWallet is a high-performance, premium-grade Solana DEX trading interface and real-time portfolio terminal. Modeled after the vibrant and high-urgency aesthetic of `fomo.family`, it features live token tickers, advanced price charting, and a secure server-assembled swap execution flow.

Built using **Next.js 14 (App Router)**, **TypeScript (Strict)**, and **Tailwind CSS (CSS variables configuration)**, ChadWallet delegates sensitive network calls to Next.js server-side proxies, uses **SWR** for real-time polling, and secures user positions via **Supabase RLS**. Auth is powered by **Privy**, offering seamless Google/Apple social sign-ins alongside instant Web3 Solana embedded wallet generation.

---

## Live Demo
- **Vercel Deployment**: [https://chadwallet-production.vercel.app](https://chadwallet-production.vercel.app)

---

## Architecture

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

### Architectural & Data-Flow Rules
*   **Server-Side API Proxying**: The browser **never calls BirdEye, Alchemy, or Jupiter directly** with API keys. All key-bearing requests proxy through `/app/api/*` route handlers. Keys remain safe in server environment variables.
*   **Client-Side Auth & Server-Side Verification**: Privy is called client-side to generate authenticated Web3 session credentials. The resulting session JWT is forwarded to the API layer, which decodes and validates claims server-side.
*   **Jupiter Transaction Flow**: Swap quotes and transaction payloads are assembled server-side. The serialized base64 transaction bytes are returned to the client browser for secure local wallet signing, then broadcast to the network.
*   **RLS Gated Database Sync**: Supabase tables are updated via a secure server client using service role keys, gated strictly behind custom route authentication. The client only uses anon keys for reading/writing user-owned configurations.

---

## Getting Started

### Prerequisites
*   Node.js 20+
*   pnpm 9+
*   A Supabase project (initialized with our schema migration)
*   A Privy application (privy.io)
*   A BirdEye API key (birdeye.so)
*   An Alchemy API key (alchemy.com)

### Installation
```bash
git clone https://github.com/anshikaasati/Chadwallet.git
cd chadwallet
pnpm install
cp .env.example .env.local
# Fill in .env.local with your keys
pnpm dev
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `BIRDEYE_API_KEY` | ✅ | BirdEye market data API key (server-side) |
| `NEXT_PUBLIC_PRIVY_APP_ID` | ✅ | Privy app ID (publicly visible) |
| `PRIVY_APP_SECRET` | ✅ | Privy secret key (server-side) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key (publicly visible) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server-side) |
| `NEXT_PUBLIC_ALCHEMY_RPC_URL` | ✅ | Alchemy Solana Mainnet RPC connection URL |

See `.env.example` for full reference.

---

## Key Integrations

### Privy Auth
Privy handles Web3 identity management. Users authenticate instantly via Google or Apple OAuth. Upon authentication, Privy generates an embedded Web3 Solana wallet for frictionless trading. Session JWTs are securely forwarded to our Next.js API route proxies to verify claims and upsert user profiles into the Supabase Postgres instance.

### BirdEye Market Data
We consume the BirdEye API server-side to feed real-time pricing information. Key endpoints provide token lists for rotating marquee banners, trending tokens for DEX lists, historical OHLCV candles, holder distributions, and live transaction streams. All data is polled via Client-Side SWR hooks mapping to server proxy API routes.

### Jupiter Swaps
Swap calculations are routed through Jupiter's HTTP APIs. The client queries quotes via a Next.js proxy route, displays routing metrics and price impact, and requests transaction serialization on approval. The client browser deserializes the base64 transaction bytes, signs the transaction locally via the user's Privy embedded wallet, and requests RPC broadcasting.

### TradingView Chart
The TradingView widget displays real-time price trends. We built a custom UDF datafeed adapter (`lib/tradingview/datafeed.ts`) that maps resolution ranges (`1` to `1m`, `D` to `1D`) and fetches price candles through the `/api/tokens/[address]/price` route. The widget constructors are styled to render a dark-mode theme matching ChadWallet branding variables.

### Alchemy RPC
Alchemy provides access to Solana Mainnet. In our execution hook, the signed swap transaction is sent to Alchemy via `sendRawTransaction` and confirmed by polling signature status queries to maintain up-to-date wallet position balances.

---

## Design Decisions

### Why BirdEye over CoinGecko?
Solana memecoins launch rapidly and require sub-second price indexing. CoinGecko has slow indexing cycles and lacks granular on-chain liquidity data for newly launched pools. BirdEye indexes Solana transactions directly from the block level, providing instant price updates, historical OHLCV data, live swap logs, and holder tracking.

### Why server-side API proxying?
Exposing high-tier API keys (such as BirdEye Pro or Alchemy RPC endpoints) on the client side risks rapid key leakage, abuse, and billing spikes. Proxying requests through Next.js route handlers keeps secrets strictly on the server and allows us to enforce rate-limiting, response caching, and data formatting.

### Jupiter: build server-side, sign client-side
To avoid private key exposure, transactions must be signed locally on the user's browser. However, constructing transaction instructions and fetching optimized route calculations is a heavy computation requiring network keys. Our server queries Jupiter's APIs to build the raw transaction and returns the base64 payload. The browser simply deserializes, signs via the Privy SDK/wallet, and broadcasts it.

### TradingView datafeed adapter
TradingView's charting library expects a standardized UDF or JS API datafeed. We wrote a custom adapter (`lib/tradingview/datafeed.ts`) mapping request inputs (`from`, `to`, `resolution`) directly to our internally cached `/api/tokens/[address]/price` route, handling Solana's dynamic pricescale and precision requirements (6 decimals).

### Privy embedded wallet vs external wallet
We chose Privy because it offers the frictionless UX of social authentication (Google, Apple) while instantly generating an embedded Web3 Solana wallet for non-crypto-native users, alongside native support for external browser wallets like Phantom or Solflare. This maximizes user conversion while maintaining complete sovereignty over keys.

---

## What's Built vs What's a Follow-Up

### ✅ Built
*   **Landing Page**: Rotating banners (top + bottom) scrolling in opposite directions using pure CSS marquee animations with `will-change: transform` GPU acceleration.
*   **App Store Constants**: Official links to Android and iOS applications stored as config constants.
*   **Privy Social Sign-in**: Authentic Apple/Google sign-in flows with background sync to database user profiles.
*   **Solana DEX UI Layout**: Mobile-first responsive three-column grid layout containing live trending lists, TV charts, holder directories, live swap feeds, slippage configurations, and balance positions.
*   **Caching Strategy**: Implemented Next.js edge caching and revalidation timers: metadata (60s), OHLCV (15s), trending lists (30s), and user positions (no-store).
*   **Error Handling**: Layout columns and panels isolated using React `ErrorBoundary` wrappers.

### 🔄 Follow-Up / Future Improvements
*   **Dynamic Token Search**: Search input to trade any custom token mint address.
*   **Real-time WebSockets**: Implement web socket connections for real-time tickers instead of polling.
*   **Positions PNL Analytics**: Historical performance graphs showing capital gains over time.

---

## Project Structure

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
│   │   │       ├── page.tsx             # Trading page Server Component
│   │   │       └── TradingPageClient.tsx# Trading page Client Component
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
│   │   ├── Button/                      # Button component
│   │   ├── Badge/                       # Badge component
│   │   ├── Spinner/                     # Spinner loading icon
│   │   ├── Skeleton/                    # Layout skeletons
│   │   ├── Modal/                       # Popup modals
│   │   └── index.ts                     # UI components barrel
│   ├── landing/                         # Domain: landing page
│   │   ├── HeroSection/                 # Landing hero section
│   │   ├── TokenBanner/                 # Rotating marquee banner
│   │   ├── AppDownloadCTA/              # App download links
│   │   ├── SignInButton/                # Social login authentication
│   │   └── index.ts                     # Landing components barrel
│   ├── trading/                         # Domain: trading page
│   │   ├── TradingLayout/               # Three-column layout wrapper
│   │   ├── TrendingTokenList/           # Left column trending list
│   │   ├── TokenInfoHeader/             # Middle top: name, price, stats
│   │   ├── PriceChart/                  # TradingView widget wrapper
│   │   ├── HoldersList/                 # Middle: token holder list
│   │   ├── LiveTradesFeed/              # Middle: real-time trades
│   │   ├── SwapPanel/                   # Right: buy/sell form
│   │   ├── UserPosition/                # Right: user's current position
│   │   └── index.ts                     # Trading components barrel
│   └── shared/                          # Cross-domain shared components
│       ├── NavBar/                      # Navigation header
│       ├── WalletButton/                # Connection shortcut
│       ├── TokenLogo/                   # Logo helper with letter fallback
│       ├── PriceChange/                 # Green/red % badge
│       └── index.ts                     # Shared components barrel
│
├── hooks/                               # Logic only — no JSX
│   ├── useTokenBanner.ts                # Banner token list + SWR polling
│   ├── useTrendingTokens.ts             # Trending list data
│   ├── useTokenInfo.ts                  # Token metadata for trading page
│   ├── usePriceHistory.ts               # OHLCV for TradingView datafeed
│   ├── useHolders.ts                    # Holder list
│   ├── useLiveTrades.ts                 # Polling live trades
│   ├── useSwapQuote.ts                  # Jupiter quote state
│   ├── useSwapExecute.ts                # Swap execution + tx confirmation
│   ├── useUserPosition.ts               # User's position for a token
│   ├── useWallet.ts                     # Privy wallet abstraction
│   └── index.ts                         # Hooks barrel
│
├── services/                            # All external calls — no UI, no state
│   ├── birdeye.service.ts               # BirdEye API client (all endpoints)
│   ├── jupiter.service.ts               # Jupiter quote + transaction
│   ├── alchemy.service.ts               # Alchemy RPC (balance, tx status)
│   ├── privy.service.ts                 # Privy server-side verification
│   ├── supabase.service.ts              # Supabase server client wrapper
│   ├── http.client.ts                   # Fetch wrapper w/ retries + error parsing
│   └── index.ts                         # Services barrel
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
│   └── index.ts                         # Types barrel
│
├── constants/                           # No magic values elsewhere
│   ├── api.constants.ts                 # API base URLs, endpoint paths
│   ├── token.constants.ts               # SOL mint, USDC mint, known token addresses
│   ├── config.constants.ts              # Default slippage, polling intervals, banner speed
│   └── index.ts                         # Constants barrel
│
├── styles/
│   └── tokens.css                       # CSS custom properties (colors, spacing, radii)
│
├── public/
│   ├── logo/
│   │   └── dark.png                     # Brand asset dark themed logo
│   └── chadwallet/                      # Brand assets directory
│       └── logo.svg                     # Vector brand logo asset
│
├── supabase/
│   └── migrations/                      # SQL migration files — versioned, never edited
│       └── 20240101000000_initial_schema.sql
│
├── middleware.ts                         # Next.js middleware: auth gate for /trade/*
├── next.config.mjs                       # Next.js config
├── tailwind.config.ts                    # Tailwind configuration
├── tsconfig.json                         # TypeScript configuration
├── .env.example                          # All env vars documented — never commit .env
├── .env.local                            # gitignored secrets
└── README.md                             # Readme information
```
