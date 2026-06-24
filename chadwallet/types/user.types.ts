// types/user.types.ts
import { z } from "zod";

export interface AppUser {
  id: string;                // Privy user ID (primary key in Supabase)
  walletAddress: string | null;
  email: string | null;
  createdAt: string;         // ISO 8601 UTC
}

export const AppUserSchema = z.object({
  id: z.string(),
  walletAddress: z.string().nullable(),
  email: z.string().email().nullable(),
  createdAt: z.string(),
});

export interface Position {
  id?: string;               // primary key in DB, optional on client
  userId: string;
  tokenAddress: string;
  tokenSymbol: string;
  balance: number;           // token balance (human-readable)
  avgEntryPrice: number | null;  // USD
  updatedAt: string;         // ISO 8601 UTC
}

export const PositionSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  tokenAddress: z.string().min(32).max(44),
  tokenSymbol: z.string().min(1),
  balance: z.number().nonnegative(),
  avgEntryPrice: z.number().nullable(),
  updatedAt: z.string(),
});

export interface Watchlist {
  userId: string;
  tokenAddress: string;
  addedAt: string;           // ISO 8601 UTC
}

export const WatchlistSchema = z.object({
  userId: z.string(),
  tokenAddress: z.string().min(32).max(44),
  addedAt: z.string(),
});
