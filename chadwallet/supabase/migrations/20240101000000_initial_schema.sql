-- supabase/migrations/20240101000000_initial_schema.sql

-- users (synced from Privy on first login)
create table if not exists users (
  id text primary key,                     -- Privy user ID
  wallet_address text unique,
  email text unique,
  created_at timestamptz not null default now()
);

-- positions (updated after each confirmed swap)
create table if not exists positions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references users(id) on delete cascade,
  token_address text not null,
  token_symbol text not null,
  balance numeric not null default 0,
  avg_entry_price numeric,                 -- USD, nullable
  updated_at timestamptz not null default now(),
  unique (user_id, token_address)
);

-- watchlist (users can pin tokens)
create table if not exists watchlist (
  user_id text not null references users(id) on delete cascade,
  token_address text not null,
  added_at timestamptz not null default now(),
  primary key (user_id, token_address)
);

-- Enable Row Level Security (RLS) on all tables
alter table users enable row level security;
alter table positions enable row level security;
alter table watchlist enable row level security;

-- Users RLS policies
create policy "users_own_data" on users
  using (auth.uid()::text = id);

-- Positions RLS policies
create policy "positions_own_data" on positions
  using (auth.uid()::text = user_id)
  with check (auth.uid()::text = user_id);

-- Watchlist RLS policies
create policy "watchlist_own_data" on watchlist
  using (auth.uid()::text = user_id)
  with check (auth.uid()::text = user_id);

-- Indexes for performance optimization
create index if not exists idx_positions_user_id on positions(user_id);
create index if not exists idx_positions_token_address on positions(token_address);
create index if not exists idx_watchlist_user_id on watchlist(user_id);
