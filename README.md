# ChadWallet — Live Solana DEX & Portfolio Terminal

ChadWallet is a high-performance, premium-grade Solana DEX trading terminal and portfolio viewer. Designed to bring users a state-of-the-art Web3 interface with zero latency, it integrates live market tickers, advanced TradingView charting, real-time swap routing via Jupiter Protocol, and seamless Google/Apple authentication through Privy. The client-side application is built using Next.js 14 (App Router), React, and custom CSS design tokens for a beautiful, responsive dark-themed trading layout, while the server layer handles secure data proxying and user position synchronization with Supabase.

---

## 1. System Architecture

ChadWallet is structured into three logical layers to separate concerns, secure private credentials, and guarantee strict directional data flow.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                          │
│   Landing Page  ·  Trading Page  ·  Token Banners  ·  Swap UI   │
│   Privy Auth  ·  TradingView Chart  ·  Jupiter Swap Form         │
│└───────────────────────────┬─────────────────────────────────────┘
│                            │ fetch / SWR / real-time polling
│                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js App Router (Vercel)                    │
│   /app/api/* Route Handlers  ·  Server Actions  ·  RSC pages    │
│   BirdEye proxy  ·  Supabase server client  ·  Privy webhook     │
│└──────────┬─────────────────────────────┬────────────────────────┘
│           │                             │
│           ▼                             ▼
┌─────────────────────┐     ┌────────────────────────────────────┐
│   Supabase (Postgres) │     │   External APIs (3rd party)       │
│   users · positions  │     │   BirdEye · Alchemy · Jupiter      │
│   watchlists         │     │   Privy · TradingView              │
└─────────────────────┘     └────────────────────────────────────┘
```

### Architectural & Data-Flow Rules
- **Server-Side API Proxying**: The client browser **never calls BirdEye, Alchemy, or Jupiter directly** with API keys. All key-bearing requests proxy through `/app/api/*` route handlers. Keys remain safe in server environment variables.
- **Client-Side Auth & Server-Side Verification**: Privy is called client-side to generate authenticated Web3 session credentials. The resulting session JWT is forwarded to the API layer, which decodes and validates claims server-side.
- **Jupiter Transaction Flow**: Swap quotes and transaction payloads are assembled server-side. The serialized base64 transaction bytes are returned to the client browser for secure local wallet signing, then broadcast to the network.
- **RLS Gated Database Sync**: Supabase tables are updated via a secure server client using service role keys, gated strictly behind custom route authentication. The client only uses anon keys for reading/writing user-owned configurations.

---

## 2. Live Deployment URL

The live platform is deployed to production at:
- **Vercel Deployment**: [https://chadwallet-production.vercel.app](https://chadwallet-production.vercel.app) *(Placeholder)*

---

## 3. Getting Started & Running Locally

Follow these commands to install dependencies, configure secrets, and launch the dev server.

### Prerequisites
- Install **Node.js** (v18 or higher recommended)
- Install **pnpm** (v8 or higher)

### Setup Instructions
1. **Clone the Repository & Navigate to the Project Folder**:
   ```bash
   cd chadwallet
   ```
2. **Install Dependencies**:
   ```bash
   pnpm install
   ```
3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and configure all required secrets.
4. **Setup the Supabase Database**:
   Apply the SQL migration script located in `supabase/migrations/20240101000000_initial_schema.sql` directly into your Supabase project's SQL editor to initialize tables, row-level security (RLS) policies, and performance indexes.
5. **Launch the Development Server**:
   ```bash
   pnpm dev
   ```
6. **Access the Interface**:
   Open [http://localhost:3000](http://localhost:3000) (or the port specified by the dev server output) in your browser.

---

## 4. Environment Variables Reference

Refer to [chadwallet/.env.example](file:///c:/Users/asati/OneDrive/Desktop/Chadwallet/chadwallet/.env.example) for key formats.

| Variable Name | Description | Status | Scope |
| :--- | :--- | :--- | :--- |
| `BIRDEYE_API_KEY` | BirdEye Pro Market Data API Key | **Required** | Server-only (Proxy Calls) |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy Application Identifier for Web3 Auth | **Required** | Shared (Client/Server) |
| `PRIVY_APP_SECRET` | Privy Private Application Secret | **Required** | Server-only (Auth Verification) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL of the Supabase backend project | **Required** | Shared (Client/Server) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Public Anonymous API Key | **Required** | Shared (Client/Server) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Private Service Role Key for User Sync | **Required** | Server-only (Admin Access) |
| `NEXT_PUBLIC_ALCHEMY_RPC_URL` | Alchemy Solana Mainnet RPC Connection URL | **Required** | Shared (Client/Server) |

---

## 5. Key Integrations

- **Privy Auth**: Integrates Google and Apple OAuth logins, generating a secure Web3 embedded wallet or connecting external wallets (e.g., Phantom). Synchronizes user data on-the-fly with the Supabase database.
- **BirdEye Data**: Connects to the BirdEye DeFi API to retrieve real-time token list marquees, trending token tables, token meta overview stats, holders metrics, and recent trade logs.
- **Jupiter Swaps**: Uses Jupiter Protocol v6 to request dynamic swap routing quotes and assemble raw base64 transaction payloads. Handles slippage, trade size, and provides price impact guardrails.
- **TradingView Chart**: Customizes the advanced TradingView Charting Widget using a UDF (Universal Data Feed) adapter that parses history bars and connects polling subscriptions to the local API proxy.

---

## 6. Engineering Design Decisions

### Why BirdEye over CoinGecko for Solana Token Data
Solana memecoins launch rapidly and require sub-second price indexing. CoinGecko has slow indexing cycles and lacks granular on-chain liquidity data for newly launched pools. BirdEye indexes Solana transactions directly from the block level, providing instant price updates, historical OHLCV data, live swap logs, and holder tracking.

### Why Server-Side API Proxying instead of Direct Client Calls
Exposing high-tier API keys (such as BirdEye Pro or Alchemy RPC endpoints) on the client side risks rapid key leakage, abuse, and billing spikes. Proxying requests through Next.js route handlers keeps secrets strictly on the server and allows us to enforce rate-limiting, response caching, and data formatting.

### Jupiter Swap Flow: Build Server-Side, Sign Client-Side
To avoid private key exposure, transactions must be signed locally on the user's browser. However, constructing transaction instructions and fetching optimized route calculations is a heavy computation requiring network keys. Our server queries Jupiter's APIs to build the raw transaction and returns the base64 payload. The browser simply deserializes, signs via the Privy SDK/wallet, and broadcasts it.

### TradingView Datafeed Adapter Approach
TradingView's charting library expects a standardized UDF or JS API datafeed. We wrote a custom adapter (`lib/tradingview/datafeed.ts`) mapping request inputs (`from`, `to`, `resolution`) directly to our internally cached `/api/tokens/[address]/price` route, handling Solana's dynamic pricescale and precision requirements (6 decimals).

### Privy Embedded Wallet vs. External Wallet Choice
We chose Privy because it offers the frictionless UX of social authentication (Google, Apple) while instantly generating an embedded Web3 Solana wallet for non-crypto-native users, alongside native support for external browser wallets like Phantom or Solflare. This maximizes user conversion while maintaining complete sovereignty over keys.

---

## 7. Feature Completeness Status

### Complete
- **Landing Page**: Top & bottom infinite marquees with automatic pause-on-hover; hero section; social authentication.
- **Market Data Services**: BirdEye integration API, trending token sidebars, holders list, live trade activity table.
- **Swap Panel**: Dynamic input routing, custom slippage tolerance setups, price impact warning cards, and transaction progress trackers.
- **Portfolio Viewer**: Real-time position tracking, absolute unrealized P&L in USD, and percent change indicators.
- **Robust Error Handling**: Isolation of layout columns and panels using custom React `ErrorBoundary` fallback components.
- **Production Optimizations**: Strict Mode enabled; Whitelisted image CDNs in `next.config.mjs`.

### Follow-Up / Out of Scope
- **Advanced Portfolio Analytics**: Historical portfolio balance charts and realized tax logs.
- **Limit Orders & DCA**: Server-side cron jobs to trigger automated swaps on Jupiter based on target prices.
- **Token Search & Filters**: Multi-chain search queries and volume filter sliders.
